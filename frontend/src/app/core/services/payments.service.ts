import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class PaymentsService {
  private http = inject(HttpClient);
  createOrder(amountPaise: number){
    return this.http.post<{orderId:string, amount:number, currency:string, keyId:string}>(
      '/api/payments/order', { amount: amountPaise }
    );
  }
}
