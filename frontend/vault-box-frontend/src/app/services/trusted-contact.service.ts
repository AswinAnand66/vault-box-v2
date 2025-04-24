import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface TrustedContact {
  _id?: string;
  name: string;
  email: string;
  unlockDelay: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface EmergencyAccessRequest {
  email: string;
  verificationCode: string;
}

@Injectable({
  providedIn: 'root'
})
export class TrustedContactService {
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders() {
    const token = this.authService.getToken();
    return {
      'Authorization': `Bearer ${token}`
    };
  }

  setContact(contact: TrustedContact): Observable<TrustedContact> {
    return this.http.post<TrustedContact>(
      `${environment.apiUrl}/trusted-contact`,
      contact,
      { headers: this.getHeaders() }
    );
  }

  getCurrentContact(): Observable<TrustedContact> {
    return this.http.get<TrustedContact>(
      `${environment.apiUrl}/trusted-contact`,
      { headers: this.getHeaders() }
    );
  }

  requestEmergencyAccess(): Observable<void> {
    return this.http.post<void>(
      `${environment.apiUrl}/trusted-contact/request-access`,
      {},
      { headers: this.getHeaders() }
    );
  }

  getEmergencyAccess(request: EmergencyAccessRequest): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/trusted-contact/emergency-access`,
      request
    );
  }
} 