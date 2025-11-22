import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CouponValidation {
  code: string;
  description?: string;
  discount: number; // decimal
}

@Injectable({ providedIn: 'root' })
export class CouponsService {
  constructor(private http: HttpClient) {}
  validate(code: string, amount: number): Observable<CouponValidation> {
    return this.http.get<CouponValidation>(`/api/coupons/validate`, { params: { code, amount } as any });
  }
}
