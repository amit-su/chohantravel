import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { GlobalStorageService } from './global-storage.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    constructor(
        private apiService: ApiService,
        private storage: GlobalStorageService
    ) {}

    // Login function
    login(data: any): Observable<any> {
        return this.apiService.post('/user/login', data);
    }

    // Store the token after successful login
    storeToken(response: any): void {
        if (response && response.body && response.body.token) {
            this.storage.set('token', response.body.token);
        }
    }

    // Fetch token from storage
    getToken(): string | null {
        return this.storage.get('token') ?? null;
    }

    // Decode token and check permission
    hasPermission(permission: string): boolean {
        const token = this.getToken();
        if (!token) return false;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            // Assuming permissions are stored in a 'permissions' array
            // If the user is an admin or superadmin, they might have specific roles that skip this, 
            // adjust as needed based on exact payload structure.
            if (payload && Array.isArray(payload.permissions)) {
                return payload.permissions.includes(permission);
            }
            if (payload && Array.isArray(payload.role?.permissions)) {
                return payload.role.permissions.map((p: any) => p.name || p).includes(permission);
            }
            return false;
        } catch (e) {
            return false;
        }
    }

    // Clear token (Logout function)
    logout(): void {
        this.storage.destroy();
    }
    verify(): Observable<any> {
        return this.apiService.get('/verify').pipe(
            catchError((error) => {
                this.logout();
                return of(error);
            })
        );
    }
}
