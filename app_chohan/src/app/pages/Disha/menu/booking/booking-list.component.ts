import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MasterService } from '../../../../../services/master.service';
import { BookingService } from '../../../../../services/booking.service';
import { AlertService } from '../../../../../services/alert.service';
import { firstValueFrom } from 'rxjs';

// PrimeNG Imports
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { TagModule } from 'primeng/tag';
import { MenuModule } from 'primeng/menu';
import { RippleModule } from 'primeng/ripple';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { SkeletonModule } from 'primeng/skeleton';
import { MenuItem } from 'primeng/api';

// Child Component
import { BookingDetailComponent } from './booking-detail.component';

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    DatePickerModule,
    TagModule,
    MenuModule,
    RippleModule,
    DialogModule,
    TooltipModule,
    SkeletonModule,
    BookingDetailComponent
  ],
  templateUrl: './booking-list.component.html'
})
export class BookingListComponent implements OnInit {
  bookingList: any[] = [];
  parties: any[] = [];
  totalItems = 0;
  loading = false;
  page = 1;
  limit = 20;
  fabOpen = false;
  filterOpen = false;

  
  filters: any = {
    search: '',
    partyId: null,
    bookingDate: null,
    allotmentStatus: null
  };

  allotmentOptions = [
    { label: 'FULL ALLOTTED', value: 'Alloted' },
    { label: 'NOT ALLOTTED', value: 'Pending' },
    { label: 'PARTIAL ALLOTTED', value: 'Partial' }
  ];

  constructor(
    private masterService: MasterService,
    private bookingService: BookingService,
    private alertService: AlertService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadParties();
    this.loadBookings(true);
  }

  async loadParties() {
    try {
      const resp = await firstValueFrom(this.masterService.getPartyPaginated({ page: 1, count: 1000, status: true }));
      this.parties = resp.data || [];
    } catch (error) {
      console.error('Error loading parties', error);
    }
  }

  async loadBookings(reset: boolean = false) {
    if (this.loading && !reset) return;
    
    if (reset) {
      this.page = 1;
      this.bookingList = [];
    }

    this.loading = true;

    const params: any = {
      page: this.page,
      limit: this.limit
    };

    if (this.filters.search) {
      params.search = this.filters.search;
    }
    
    if (this.filters.partyId && this.filters.partyId !== 'null') {
      params.partyId = Number(this.filters.partyId);
    }
    
    if (this.filters.allotmentStatus && this.filters.allotmentStatus !== 'null') {
      params.allotmentStatus = this.filters.allotmentStatus;
    }

    if (this.filters.bookingDate) {
      const d = new Date(this.filters.bookingDate);
      params.bookingDate = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
    }

    try {
      const resp = await firstValueFrom(this.bookingService.getBookingEntryList(params));
      const newData = resp.data || [];
      if (reset) {
        this.bookingList = newData;
      } else {
        this.bookingList = [...this.bookingList, ...newData];
      }
      this.totalItems = resp.count || 0;
    } catch (error) {
      this.alertService.error('Failed to load bookings');
    } finally {
      this.loading = false;
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    if (this.loading) return;
    
    const scrollPosition = window.innerHeight + window.scrollY;
    // For standard scrolling body
    const documentHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
    
    if (scrollPosition >= documentHeight - 150) {
      if (this.bookingList.length < this.totalItems) {
        this.page++;
        this.loadBookings();
      }
    }
  }

  hasActiveFilters(): boolean {
    return !!(this.filters.partyId || this.filters.bookingDate || this.filters.allotmentStatus);
  }

  clearFilters() {
    this.filters = { search: '', partyId: null, bookingDate: null, allotmentStatus: null };
    this.filterOpen = false;
    this.loadBookings(true);
  }

  onSearch(event: any) {
    this.filters.search = event.target.value;
    this.loadBookings(true);
  }

  createBooking() {
    this.router.navigate(['/pages/bookingEntry']); // Adjust as per routing
  }

  getActionMenuItems(booking: any): MenuItem[] {
    return [
      {
        label: 'Edit Booking',
        icon: 'pi pi-pencil',
        disabled: !!booking.UsedInInvoice,
        command: () => this.editBooking(booking)
      },
      {
        label: 'Bus Allotment',
        icon: 'pi pi-car',
        disabled: !!booking.UsedInInvoice,
        command: () => this.openAllotment(booking)
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        disabled: !!booking.UsedInInvoice,
        command: () => this.deleteBooking(booking)
      }
    ];
  }

  editBooking(booking: any) {
    this.router.navigate(['/pages/editBooking', booking.BookingNo]);
  }

  openAllotment(booking: any) {
    // Implement allotment logic
  }

  async deleteBooking(booking: any) {
    // Implement delete logic with confirmation
  }
}
