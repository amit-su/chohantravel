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
        // Backend returns an array of details for this bookingNo
        this.details = resp.data || [];
        
        // Parse LocalBookingList if it exists and details is empty or we want to double check
        // Usually, the backend /bookingEntry/:id returns the JOINED results or the parsed list.
        // Looking at the React code, it seems to expect an array of trips.
      }
    } catch (error) {
      console.error('Error loading booking details', error);
    } finally {
      this.loading = false;
    }
  }
}
