import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import * as CryptoJS from 'crypto-js';

export interface VaultEntry {
  _id?: string;
  title: string;
  content: string;
  category: string;
  isPrivate: boolean;
  autoDeleteDate?: Date;
  unlockAfterDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class VaultService {
  private apiUrl = `${environment.apiUrl}/vault`;

  constructor(private http: HttpClient) {}

  getEntries(): Observable<VaultEntry[]> {
    return this.http.get<VaultEntry[]>(this.apiUrl);
  }

  getEntryContent(id: string): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/${id}/content`);
  }

  createEntry(entry: Omit<VaultEntry, '_id'>): Observable<VaultEntry> {
    return this.http.post<VaultEntry>(this.apiUrl, entry);
  }

  updateEntry(id: string, entry: Partial<VaultEntry>): Observable<VaultEntry> {
    return this.http.put<VaultEntry>(`${this.apiUrl}/${id}`, entry);
  }

  deleteEntry(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  encryptContent(content: string, password: string): string {
    return CryptoJS.AES.encrypt(content, password).toString();
  }

  decryptContent(encryptedContent: string, password: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedContent, password);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  addEntry(entry: Partial<VaultEntry>): Observable<VaultEntry> {
    return this.http.post<VaultEntry>(`${environment.apiUrl}/vault`, entry);
  }
} 