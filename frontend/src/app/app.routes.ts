import { Routes } from '@angular/router';
import { MarketingLandingComponent } from './pages/landing/marketing-landing.component';
import { UserDashboardComponent } from './pages/landing/user-dashboard.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { SignupComponent } from './pages/auth/signup/signup.component';
import { DevLoginComponent } from './pages/auth/dev-login.component';
import { CartComponent } from './pages/cart/cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { UserProfileComponent } from './pages/profile/enhanced-profile.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { RestaurantsComponent } from './pages/restaurants/restaurants.component';
import { SearchComponent } from './pages/search/search.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { OrderTrackComponent } from './pages/orders/order-track.component';
import { WalletComponent } from './pages/wallet/wallet.component';
import { MenuComponent } from './pages/menu/menu.component';
import { OwnerMenuComponent } from './pages/owner/owner-menu.component';
import { OwnerOrdersComponent } from './pages/owner/owner-orders.component';
import { AgentOrdersComponent } from './pages/agent/agent-orders.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard.component';
import { AdminHomeComponent } from './pages/admin/admin-home.component';
import { adminGuard } from './core/guards/admin.guard';
import { PagePlaceholderComponent } from './shared/page-placeholder/page-placeholder.component';
import { ownerGuard } from './core/guards/owner.guard';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: MarketingLandingComponent },
  
  // Static/Footer Pages
  { path: 'about', loadComponent: () => import('./pages/static/about.component').then(m => m.AboutComponent) },
  { path: 'contact', loadComponent: () => import('./pages/static/contact.component').then(m => m.ContactComponent) },
  { path: 'terms', loadComponent: () => import('./pages/static/terms.component').then(m => m.TermsComponent) },
  { path: 'help', loadComponent: () => import('./pages/static/help.component').then(m => m.HelpComponent) },
  { path: 'careers', component: PagePlaceholderComponent, data: { title: 'Careers' } },
  { path: 'press', component: PagePlaceholderComponent, data: { title: 'Press' } },
  { path: 'blog', component: PagePlaceholderComponent, data: { title: 'Blog' } },
  { path: 'safety', component: PagePlaceholderComponent, data: { title: 'Safety' } },
  { path: 'partner', component: PagePlaceholderComponent, data: { title: 'Partner With Us' } },
  { path: 'restaurant-dashboard', redirectTo: '/owner/dashboard', pathMatch: 'full' },
  { path: 'tools', component: PagePlaceholderComponent, data: { title: 'Apps & Tools' } },
  
  // Auth Pages (No auth required)
  { path: 'dev-login', component: DevLoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },

  // Customer/User Routes - All under /user
  { path: 'user/dashboard', component: UserDashboardComponent, canActivate: [authGuard] },
  { path: 'user/restaurants', component: RestaurantsComponent, canActivate: [authGuard] },
  { path: 'user/menu', component: MenuComponent, canActivate: [authGuard] },
  { path: 'user/cart', component: CartComponent, canActivate: [authGuard] },
  { path: 'user/checkout', component: CheckoutComponent, canActivate: [authGuard] },
  { path: 'user/orders', component: OrdersComponent, canActivate: [authGuard] },
  { path: 'user/orders/track', component: OrderTrackComponent, canActivate: [authGuard] },
  { path: 'user/order-success', loadComponent: () => import('./pages/orders/order-success.component').then(m => m.OrderSuccessComponent), canActivate: [authGuard] },
  { path: 'user/profile', component: UserProfileComponent, canActivate: [authGuard] },
  { path: 'user/wallet', component: WalletComponent, canActivate: [authGuard] },
  { path: 'user/search', component: SearchComponent, canActivate: [authGuard] },
  { path: 'user/reviews', component: PagePlaceholderComponent, data: { title: 'Reviews' }, canActivate: [authGuard] },

  // Legacy redirects for old URLs
  { path: 'restaurants', redirectTo: '/user/restaurants', pathMatch: 'full' },
  { path: 'menu', redirectTo: '/user/menu', pathMatch: 'full' },
  { path: 'cart', redirectTo: '/user/cart', pathMatch: 'full' },
  { path: 'checkout', redirectTo: '/user/checkout', pathMatch: 'full' },
  { path: 'orders', redirectTo: '/user/orders', pathMatch: 'full' },
  { path: 'profile', redirectTo: '/user/profile', pathMatch: 'full' },
  { path: 'wallet', redirectTo: '/user/wallet', pathMatch: 'full' },
  { path: 'search', redirectTo: '/user/search', pathMatch: 'full' },

  // Owner Routes - All under /owner
  { path: 'owner/dashboard', loadComponent: () => import('./pages/owner/owner-dashboard.component').then(m => m.OwnerDashboardComponent), canActivate: [ownerGuard] },
  { path: 'owner/profile', loadComponent: () => import('./pages/owner/owner-profile.component').then(m => m.OwnerProfileComponent), canActivate: [ownerGuard] },
  { path: 'owner/restaurants', loadComponent: () => import('./pages/owner/owner-restaurants.component').then(m => m.OwnerRestaurantsComponent), canActivate: [ownerGuard] },
  { path: 'owner/menu', component: OwnerMenuComponent, canActivate: [ownerGuard] },
  { path: 'owner/orders', component: OwnerOrdersComponent, canActivate: [ownerGuard] },
  { path: 'owner/settings', loadComponent: () => import('./pages/owner/owner-settings.component').then(m => m.OwnerSettingsComponent), canActivate: [ownerGuard] },

  // Agent/Delivery Routes - All under /agent
  { path: 'agent/dashboard', loadComponent: () => import('./pages/agent/agent-overview.component').then(m => m.AgentOverviewComponent) },
  { path: 'agent/orders', component: AgentOrdersComponent },
  { path: 'agent/availability', loadComponent: () => import('./pages/agent/agent-availability.component').then(m => m.AgentAvailabilityComponent) },
  { path: 'agent/earnings', loadComponent: () => import('./pages/agent/agent-earnings.component').then(m => m.AgentEarningsComponent) },
  { path: 'agent/profile', loadComponent: () => import('./pages/agent/agent-profile.component').then(m => m.AgentProfileComponent) },

  // Admin
  { path: 'admin', redirectTo: '/admin/dashboard', pathMatch: 'full' },
  { path: 'admin/dashboard', component: AdminHomeComponent, canActivate: [adminGuard] },
  { path: 'admin/profile', loadComponent: () => import('./pages/admin/admin-profile.component').then(m => m.AdminProfileComponent), canActivate: [adminGuard] },
  { path: 'admin/menu-approvals', loadComponent: () => import('./pages/admin/admin-menu-approvals.component').then(m => m.AdminMenuApprovalsComponent), canActivate: [adminGuard] },
  { path: 'admin/users', loadComponent: () => import('./pages/admin/admin-users.component').then(m => m.AdminUsersComponent), canActivate: [adminGuard] },
  { path: 'admin/restaurants', loadComponent: () => import('./pages/admin/admin-restaurants.component').then(m => m.AdminRestaurantsComponent), canActivate: [adminGuard] },
  // Removed: admin/orders and admin/payments routes
  { path: 'admin/reports', component: PagePlaceholderComponent, data: { title: 'Reports & Analytics' }, canActivate: [adminGuard] },
  { path: 'admin/settings', component: PagePlaceholderComponent, data: { title: 'Settings / Logout' }, canActivate: [adminGuard] },
];
