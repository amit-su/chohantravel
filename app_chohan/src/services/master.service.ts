import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MasterService {
  constructor(private apiService: ApiService) {}

  // Party methods
  getPartyPaginated(params: any): Observable<any> {
    return this.apiService.get('party', params);
  }

  addParty(data: any): Observable<any> {
    return this.apiService.post('party', data);
  }

  updateParty(id: number, data: any): Observable<any> {
    return this.apiService.put(`party/${id}`, data);
  }

  deleteParty(id: number): Observable<any> {
    return this.apiService.delete(`party/${id}`);
  }

  // Bus Category methods
  getAllBusCategory(params: any): Observable<any> {
    return this.apiService.get('busCategory', params);
  }
}
