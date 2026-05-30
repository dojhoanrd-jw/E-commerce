import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@core/services/api.service';

export interface Address {
  id: number;
  label?: string | null;
  recipient: string;
  line1: string;
  city: string;
  state?: string | null;
  zip?: string | null;
  country: string;
  phone?: string | null;
}

export type AddressPayload = Omit<Address, 'id'>;

@Injectable({ providedIn: 'root' })
export class AddressService {
  private readonly api = inject(ApiService);

  getMine(): Observable<Address[]> {
    return this.api.get<Address[]>('address');
  }

  create(payload: AddressPayload): Observable<Address> {
    return this.api.post<Address>('address', payload);
  }

  update(id: number, payload: AddressPayload): Observable<void> {
    return this.api.put<void>(`address/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`address/${id}`);
  }
}
