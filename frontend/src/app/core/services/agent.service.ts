import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap, switchMap } from 'rxjs/operators';

export interface AgentStats {
  todayDeliveries: number;
  activeOrders: number;
  todayEarnings: number;
  totalDeliveries: number;
  totalEarnings?: number;
  averagePerDelivery?: number;
  rating?: number;
  isAvailable: boolean;
  agentName: string;
}

export interface AgentOrder {
  id: number;
  orderNumber: string;
  status: string;
  restaurantName: string;
  restaurantAddress: string;
  restaurantPhone: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  items: any[];
  totalAmount: number;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class AgentService {
  // Shared state using signals
  private statsSignal = signal<AgentStats>({
    todayDeliveries: 0,
    activeOrders: 0,
    todayEarnings: 0,
    totalDeliveries: 0,
    totalEarnings: 0,
    averagePerDelivery: 0,
    rating: 4.5,
    isAvailable: false,
    agentName: 'Agent'
  });

  // Public readonly signal
  stats = this.statsSignal.asReadonly();

  // Computed values
  isOnline = computed(() => this.stats().isAvailable);

  constructor(private http: HttpClient) {
    // Don't load stats automatically - let components call refreshStats() when needed
  }

  /**
   * Refresh agent statistics from assigned orders only (simple local computation)
   */
  refreshStats(): Observable<AgentStats> {
    // Fetch both available and assigned orders to compute stats
    return this.http.get<any[]>('/api/orders/agent/my').pipe(
      map(assignedOrders => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayMs = today.getTime();

        // Today's delivered orders
        const todayDelivered = assignedOrders.filter(o => {
          const orderDate = new Date(o.createdAt);
          return orderDate.getTime() >= todayMs && o.status === 'DELIVERED';
        });

        // Active orders (ACCEPTED or OUT_FOR_DELIVERY)
        const activeOrders = assignedOrders.filter(o =>
          ['ACCEPTED', 'OUT_FOR_DELIVERY'].includes(o.status)
        );

        // All delivered orders
        const allDelivered = assignedOrders.filter(o => o.status === 'DELIVERED');

        const stats: AgentStats = {
          todayDeliveries: todayDelivered.length,
          activeOrders: activeOrders.length,
          todayEarnings: todayDelivered.reduce((sum, o) => sum + (o.total || o.totalAmount || 0), 0),
          totalDeliveries: allDelivered.length,
          totalEarnings: allDelivered.reduce((sum, o) => sum + (o.total || o.totalAmount || 0), 0),
          averagePerDelivery: allDelivered.length > 0
            ? allDelivered.reduce((sum, o) => sum + (o.total || o.totalAmount || 0), 0) / allDelivered.length
            : 0,
          rating: 4.7,
          isAvailable: this.stats().isAvailable, // Preserve current status
          agentName: 'Agent'
        };

        console.log('✅ Agent stats computed from assigned orders:', stats);
        this.statsSignal.set(stats);
        return stats;
      }),
      catchError(err => {
        console.warn('⚠️ Failed to fetch assigned orders for stats:', err);
        // Return minimal stats on error
        const defaultStats: AgentStats = {
          todayDeliveries: 0,
          activeOrders: 0,
          todayEarnings: 0,
          totalDeliveries: 0,
          totalEarnings: 0,
          averagePerDelivery: 0,
          rating: 4.5,
          isAvailable: this.stats().isAvailable,
          agentName: 'Agent'
        };
        this.statsSignal.set(defaultStats);
        return of(defaultStats);
      })
    );
  }

  /**
   * Toggle agent availability (Online/Offline)
   */
  toggleAvailability(newStatus: boolean): Observable<any> {
    // Optimistic update
    const previousStats = this.stats();
    this.statsSignal.update((stats: AgentStats) => ({ ...stats, isAvailable: newStatus }));

    return this.http.post<{ success: boolean; isAvailable: boolean; message: string }>(
      '/api/agent/availability',
      { isAvailable: newStatus }
    ).pipe(
      tap(response => {
        console.log('✅ Availability updated:', response);
        this.statsSignal.update((stats: AgentStats) => ({ ...stats, isAvailable: response.isAvailable }));
      }),
      catchError(err => {
        console.warn('⚠️ Failed to update availability:', err);
        // Keep optimistic update even if backend fails (for demo)
        // In production, you'd revert: this.statsSignal.set(previousStats);
        return of({ success: false, isAvailable: newStatus, message: 'Updated locally (backend unavailable)' });
      })
    );
  }

  /**
   * Get available orders for agents to accept/reject (PLACED and unassigned)
   */
  getAvailableOrders(): Observable<AgentOrder[]> {
    return this.http.get<any[]>('/api/orders/agent/available').pipe(
      tap(orders => console.log('✅ Available orders loaded:', orders?.length || 0)),
      map(orders => orders.map(o => this.mapToAgentOrder(o))),
      catchError(err => {
        console.error('❌ Failed to load available orders:', err);
        return of([]);
      })
    );
  }

  /**
   * Get assigned orders for the agent (ACCEPTED, PREPARING, OUT_FOR_DELIVERY)
   */
  getAssignedOrders(): Observable<AgentOrder[]> {
    return this.http.get<any[]>('/api/orders/agent/my').pipe(
      tap(orders => console.log('✅ Assigned orders loaded:', orders?.length || 0)),
      map(orders => orders.map(o => this.mapToAgentOrder(o))),
      catchError(err => {
        console.warn('⚠️ Failed to load assigned orders:', err);
        return of([]);
      })
    );
  }

  /**
   * Map backend order to AgentOrder format
   */
  private mapToAgentOrder(apiOrder: any): AgentOrder {
    const items = apiOrder.items || apiOrder.orderItems || [];
    return {
      id: apiOrder.id,
      orderNumber: `ORD-${apiOrder.id}`,
      status: apiOrder.status || 'PLACED',
      restaurantName: apiOrder.restaurantName || apiOrder.restaurant?.name || 'Restaurant',
      restaurantAddress: apiOrder.restaurantAddress || apiOrder.restaurant?.address || 'Address not provided',
      restaurantPhone: apiOrder.restaurantPhone || apiOrder.restaurant?.phone || '+91 00000 00000',
      customerName: apiOrder.customerName || apiOrder.deliveryAddress?.name || apiOrder.user?.name || 'Customer',
      customerAddress: apiOrder.deliveryAddress || apiOrder.address || 'Address not provided',
      customerPhone: apiOrder.customerPhone || apiOrder.deliveryAddress?.phone || apiOrder.user?.phone || '+91 00000 00000',
      items: items.map((i: any) => ({
        name: i.name || i.menuItemName || i.itemName || 'Item',
        quantity: i.quantity || i.qty || 1,
        price: i.price || i.unitPrice || 0
      })),
      totalAmount: apiOrder.total || apiOrder.totalAmount || 0,
      createdAt: apiOrder.createdAt || new Date().toISOString()
    };
  }

  /**
   * Accept an order
   */
  acceptOrder(orderId: number): Observable<any> {
    // Accept, then update status to DELIVERED and return the final update
    return this.http.patch(`/api/orders/${orderId}/accept`, {}).pipe(
      tap(() => console.log(`✅ Order ${orderId} accepted`)),
      switchMap(() => this.http.patch(`/api/orders/${orderId}/status?status=DELIVERED`, {})),
      tap(() => {
        console.log(`✅ Order ${orderId} marked DELIVERED`);
        this.refreshStats();
      }),
      catchError(err => {
        console.error('❌ Failed to accept/deliver order:', err);
        return of({ success: false, message: 'Failed to accept/deliver order' });
      })
    );
  }

  /**
   * Reject an order
   */
  rejectOrder(orderId: number): Observable<any> {
    return this.http.patch(`/api/orders/${orderId}/reject`, {}).pipe(
      tap(() => {
        console.log(`✅ Order ${orderId} rejected`);
        this.refreshStats();
      }),
      catchError(err => {
        console.error('❌ Failed to reject order:', err);
        return of({ success: false, message: 'Failed to reject order' });
      })
    );
  }

  /**
   * Directly mark order delivered (simple flow)
   */
  deliverOrder(orderId: number): Observable<any> {
    return this.http.patch(`/api/orders/${orderId}/deliver`, {}).pipe(
      tap(() => {
        console.log(`✅ Order ${orderId} marked DELIVERED`);
        this.refreshStats();
      }),
      catchError(err => {
        console.error('❌ Failed to mark delivered:', err);
        this.refreshStats();
        return of({ success: false, message: 'Failed to deliver' });
      })
    );
  }

  /**
   * Get earnings data
   */
  getEarnings(): Observable<any> {
    return this.http.get('/api/agent/earnings/summary').pipe(
      tap(data => console.log('✅ Earnings data loaded:', data)),
      catchError(err => {
        console.warn('Backend not available - showing default earnings:', err);
        // Return minimal earnings structure
        return of({
          today: { deliveries: 0, earnings: 0, averagePerDelivery: 0 },
          thisWeek: { deliveries: 0, earnings: 0, averagePerDelivery: 0 },
          thisMonth: { deliveries: 0, earnings: 0, averagePerDelivery: 0 },
          allTime: { deliveries: 0, earnings: 0, averagePerDelivery: 0 }
        });
      })
    );
  }
  
  /**
   * Get agent transaction history
   */
  getTransactions(): Observable<any[]> {
    return this.http.get<any[]>('/api/agent/earnings/transactions').pipe(
      tap(data => console.log('✅ Transactions loaded:', data?.length || 0)),
      catchError(err => {
        console.warn('❌ Failed to load transactions:', err);
        // Return empty array instead of mock data
        return of([]);
      })
    );
  }
}
