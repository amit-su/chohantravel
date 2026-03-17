import { payload } from './../../interfaces/payload.interface';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BusDocumentService {
  constructor(private apiService: ApiService) { }

  getAllBusNumber(){
    return this.apiService.get('/bus?page=1&count=10000&status=true');
  }

  getBusDocumentById(payload: any){
    console.log(payload);
  return this.apiService.get(`/busdocuments/${payload}`);
  }
  

}
