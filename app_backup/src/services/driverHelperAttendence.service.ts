import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root'
})
export class DriverHelperAttendenceService {
    constructor(private apiService: ApiService) {}

    getAllSites(payload: any): Observable<any> {
        return this.apiService.get('/site', payload);
    }

    getAllSitesById(payload: any, userID: any): Observable<any> {
        return this.apiService.get(`/site/${userID}`, payload);
    }

    getHelpers(siteId: number, type: string, status: boolean = true, page: number = 1, count: number = 10000): Observable<any> {
        const queryParams = { siteId, status, page, count };
        return this.apiService.get(`/${type}`, queryParams);
    }

    getAttendanceList(page: string = '1', count: string = '20', status: string, siteId: '0', selectedMonth: string): Observable<any> {
        const queryParams = { page, count, status, selectedMonth, siteId };
        return this.apiService.get('/driverHelperAttendance', queryParams);
    }

    /**
     * Save attendance for a specific record.
     * @param recordId Employee/Helper/Driver ID
     * @param payload {
     *   month: string (e.g. "07/2025"),
     *   type: string ("Driver" or "Helper"),
     *   attendance: [{ date: string, status: string }]
     * }
     */
    saveAttendance(payload: any): Observable<any> {
        return this.apiService.post(`/driverHelperAttendance/create`, payload);
        // Adjust endpoint if needed
    }
}
