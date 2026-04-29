import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalStorageService } from './global-storage.service';
import apiUrl from '../environments/environments';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private apiUrl = apiUrl.apiUrl;

    private buildUrl(url: string): string {
        return `${this.apiUrl}/${url.replace(/^\/+/, '')}`;
    }

    constructor(
        private http: HttpClient,
        private storage: GlobalStorageService
    ) {}

    // Helper: get headers with Authorization
    private getHeaders(): HttpHeaders {
        const token = this.storage.get('token');
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        if (token) {
            headers = headers.set('Authorization', `Bearer ${token}`);
        }

        return headers;
    }

    // Generic GET request
    get<T>(url: string, params: any = {}): Observable<T> {
        return this.http.get<T>(this.buildUrl(url), {
            headers: this.getHeaders(),
            params
        });
    }

    // Generic POST request
    post<T>(url: string, data: any): Observable<T> {
        return this.http.post<T>(this.buildUrl(url), data, {
            headers: this.getHeaders()
        });
    }

    // Generic PUT request
    put<T>(url: string, data: any): Observable<T> {
        return this.http.put<T>(this.buildUrl(url), data, {
            headers: this.getHeaders()
        });
    }

    // Generic PATCH request
    patch<T>(url: string, data: any): Observable<T> {
        return this.http.patch<T>(this.buildUrl(url), data, {
            headers: this.getHeaders()
        });
    }

    // Generic DELETE request
    delete<T>(url: string, body: any = {}): Observable<T> {
        return this.http.delete<T>(this.buildUrl(url), {
            headers: this.getHeaders(),
            body: body
        });
    }
}
