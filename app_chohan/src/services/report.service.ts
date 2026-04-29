import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  constructor(private apiService: ApiService) {}

  getDriverHelperAttendanceReport(payload: any): Observable<any> {
    return this.apiService.post('report/driver-helper-attendance', payload);
  }
}
