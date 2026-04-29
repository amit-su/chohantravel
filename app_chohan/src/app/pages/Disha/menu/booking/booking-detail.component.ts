import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../../../../services/booking.service';
import { firstValueFrom } from 'rxjs';

// PrimeNG Imports
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-booking-detail',
  standalone: true,
  imports: [CommonModule, TableModule, TagModule],
  templateUrl: './booking-detail.component.html'
})
export class BookingDetailComponent implements OnInit {
  @Input() bookingNo!: string;
  details: any[] = [];
  loading = true;

  constructor(private bookingService: BookingService) {}

  async ngOnInit() {
    if (this.bookingNo) {
      this.loadDetails();
    }
  }

  async loadDetails() {
    this.loading = true;
    try {
      const resp = await firstValueFrom(this.bookingService.getBookingEntryById(parseInt(this.bookingNo)));
      if (resp && resp.data) {
        let bookingData = Array.isArray(resp.data) ? resp.data[0] : resp.data;
        if (!bookingData) bookingData = resp.data;

        if (bookingData && typeof bookingData.LocalBookingList === 'string') {
          try {
            this.details = JSON.parse(bookingData.LocalBookingList);
          } catch (e) {
            console.error('Failed to parse LocalBookingList:', e);
            this.details = [];
          }
        } else if (bookingData && Array.isArray(bookingData.LocalBookingList)) {
          this.details = bookingData.LocalBookingList;
        } else {
          this.details = Array.isArray(resp.data) ? resp.data : [];
        }
      }
    } catch (error) {
      console.error('Error loading booking details', error);
    } finally {
      this.loading = false;
    }
  }
}
