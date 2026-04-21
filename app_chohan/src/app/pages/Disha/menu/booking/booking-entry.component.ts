import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MasterService } from '../../../../../services/master.service';
import { BookingService } from '../../../../../services/booking.service';
import { AlertService } from '../../../../../services/alert.service';
import { firstValueFrom } from 'rxjs';

// PrimeNG Imports
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';
import { SkeletonModule } from 'primeng/skeleton';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-booking-entry',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SelectModule,
    DatePickerModule,
    InputTextModule,
    TextareaModule,
    InputNumberModule,
    ButtonModule,
    TableModule,
    DialogModule,
    RippleModule,
    TagModule,
    TooltipModule,
    SkeletonModule,
    DropdownModule
  ],
  templateUrl: './booking-entry.component.html'
})
export class BookingEntryComponent implements OnInit {
  bookingForm: FormGroup;
  tripForm: FormGroup;

  parties: any[] = [];
  busCategories: any[] = [];
  bookingArray: any[] = [];

  loading = false;
  initialLoading = false;
  displayTripDialog = false;
  editingTripIndex: number | null = null;
  tripAmount = 0;
  currentStep = 1;
  isUpdateMode = false;

  yesNoOptions = ['Yes', 'No'];
  rateTypeOptions = [
    { label: 'Fixed Rate Package', value: 'FR' },
    { label: 'Time & Mileage (KM/HR)', value: 'KMPH' }
  ];

  constructor(
    private fb: FormBuilder,
    private masterService: MasterService,
    private bookingService: BookingService,
    private alertService: AlertService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {
    this.bookingForm = this.fb.group({
      PartyID: [null, Validators.required],
      BookingNo: ['Auto Generated'],
      bookingDate: [new Date(), Validators.required],
      ContactPersonName: [''],
      ContactPersonNo: [''],
      address: [''],
      includeGST: ['No'],
      PermitReq: ['No'],
      includeParking: ['No'],
      includeTollTax: ['No'],
      email: [''],
      paymentTerms: ['', Validators.required]
    });

    this.tripForm = this.fb.group({
      busType: [null, Validators.required],
      sittingCapacity: [null, Validators.required],
      tripDescription: ['', Validators.required],
      ReportDate: [new Date(), Validators.required],
      tripEndDate: [new Date(), Validators.required],
      reportTime: [new Date(), Validators.required],
      ReturnTime: [new Date()],
      rateType: ['FR', Validators.required],
      busQty: [1, [Validators.required, Validators.min(1)]],
      rate: [0],
      Amt: [0],
      hours: [0],
      kms: [0],
      extraHourRate: [0],
      extraKMRate: [0]
    });
  }

  async ngOnInit() {
    this.loadInitialData();
  }

  async loadInitialData() {
    try {
      const partyResp = await firstValueFrom(this.masterService.getPartyPaginated({ page: 1, count: 1000, status: true }));
      this.parties = Array.isArray(partyResp?.data) ? partyResp.data : (Array.isArray(partyResp) ? partyResp : []);

      const busCatResp = await firstValueFrom(this.masterService.getAllBusCategory({ page: 1, count: 1000, status: true }));
      this.busCategories = Array.isArray(busCatResp?.data) ? busCatResp.data : (Array.isArray(busCatResp) ? busCatResp : []);
      console.log(this.busCategories);
    } catch (error) {
      this.alertService.error('Failed to load initial data');
    }
  }

  onPartySelect(partyId: number) {
    const selectedParty = this.parties.find(p => p.id === partyId);
    if (selectedParty) {
      this.bookingForm.patchValue({
        ContactPersonName: selectedParty.cpName,
        ContactPersonNo: selectedParty.cpNumber,
        address: selectedParty.partyAddr
      });
    }
  }

  addTripDetail() {
    this.editingTripIndex = null;
    this.tripForm.reset({
      ReportDate: new Date(),
      tripEndDate: new Date(),
      reportTime: new Date(),
      ReturnTime: new Date(),
      rateType: 'FR',
      busQty: 1,
      rate: 0,
      Amt: 0
    });
    this.tripAmount = 0;
    this.displayTripDialog = true;
  }

  editTripDetail(index: number) {
    this.editingTripIndex = index;
    const trip = this.bookingArray[index];

    // Map data back to form (handle dates)
    const formData = { ...trip };
    formData.ReportDate = this.parseDate(trip.ReportDate);
    formData.tripEndDate = this.parseDate(trip.tripEndDate);
    formData.reportTime = this.parseTime(trip.reportTime);
    formData.ReturnTime = this.parseTime(trip.ReturnTime);

    this.tripForm.patchValue(formData);
    this.tripAmount = trip.Amt;
    this.displayTripDialog = true;
    this.cd.detectChanges();
  }

  removeTripDetail(index: number) {
    this.bookingArray.splice(index, 1);
    this.bookingArray = [...this.bookingArray]; // Force change detection
    this.cd.detectChanges();
  }

  onRateTypeChange(value: string) {
    if (value === 'FR') {
      this.tripForm.get('hours')?.setValue(0);
      this.tripForm.get('kms')?.setValue(0);
    } else {
      this.tripForm.get('rate')?.setValue(0);
      this.tripForm.get('Amt')?.setValue(0);
      this.tripAmount = 0;
    }
  }

  calculateAmount() {
    const rate = this.tripForm.get('rate')?.value || 0;
    const qty = this.tripForm.get('busQty')?.value || 0;
    this.tripAmount = rate * qty;
    this.tripForm.get('Amt')?.setValue(this.tripAmount);
  }

  saveTripDetail() {
    if (this.tripForm.invalid) {
      this.alertService.error('Please fill all required trip details');
      return;
    }

    const values = this.tripForm.value;
    const selectedBusCat = this.busCategories.find(c => c.id === values.busType);

    const formattedTrip = {
      ...values,
      busCategory: selectedBusCat ? selectedBusCat.buscategory : '',
      ReportDate: this.formatDate(values.ReportDate),
      tripEndDate: this.formatDate(values.tripEndDate),
      reportTime: this.formatTime(values.reportTime),
      ReturnTime: this.formatTime(values.ReturnTime),
      Amt: this.tripAmount
    };

    if (this.editingTripIndex !== null) {
      this.bookingArray[this.editingTripIndex] = formattedTrip;
    } else {
      this.bookingArray.push(formattedTrip);
    }
    
    this.bookingArray = [...this.bookingArray]; // Force change detection
    this.displayTripDialog = false;
    this.cd.detectChanges();
  }

  formatDate(date: any): string {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return String(date);
    return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getFullYear()}`;
  }

  parseDate(dateStr: any): Date {
    if (!dateStr || dateStr instanceof Date) return dateStr;
    const dateStrTyped = String(dateStr);
    if (dateStrTyped.includes('-')) {
      const parts = dateStrTyped.split('-');
      if (parts[2]?.length === 4) { // DD-MM-YYYY
        return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
      } else if (parts[0]?.length === 4) { // YYYY-MM-DD
        return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      }
    }
    return new Date(dateStrTyped);
  }

  formatTime(date: any): string {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return String(date);
    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
  }

  parseTime(timeStr: any): Date {
    if (!timeStr || timeStr instanceof Date) return timeStr;
    const timeStrTyped = String(timeStr);
    const [time, ampm] = timeStrTyped.split(' ');
    const [hours, minutes] = (time || '00:00').split(':');
    let hh = parseInt(hours || '0');
    if (ampm === 'pm' && hh < 12) hh += 12;
    if (ampm === 'am' && hh === 12) hh = 0;
    const d = new Date();
    d.setHours(hh, parseInt(minutes || '0'), 0);
    return d;
  }

  async onSubmit() {
    if (this.bookingForm.invalid) {
      this.alertService.error('Please fill all required party details');
      return;
    }

    if (this.bookingArray.length === 0) {
      this.alertService.error('Please add at least one trip detail');
      return;
    }

    this.loading = true;
    try {
      const headValues = this.bookingForm.value;

      // Transform keys to uppercase as expected by backend (based on React code)
      const data: any = {};
      Object.keys(headValues).forEach(key => {
        data[key] = typeof headValues[key] === 'string' ? headValues[key].toUpperCase() : headValues[key];
      });

      // Format Date
      data.BookingDate = this.formatDate(headValues.bookingDate).split('-').reverse().join('-'); // YYYY-MM-DD
      data.BookingNo = Math.floor(Math.random() * 9007165) + 1; // Match React's risky random No

      // JSON stringified list
      data.localBookingList = JSON.stringify(this.bookingArray.map(trip => {
        const t = { ...trip };
        // Backend might need YYYY-MM-DD for trip dates too
        t.ReportDate = trip.ReportDate.split('-').reverse().join('-');
        t.tripEndDate = trip.tripEndDate.split('-').reverse().join('-');
        
        // Ensure properties expected by backend are present
        t.BusTypeID = String(trip.busType);
        t.busType = String(trip.busType);
        t.ID = trip.ID || 0;
        
        return t;
      }));

      const resp = await firstValueFrom(this.bookingService.addNewBooking(data));
      if (resp.message === 'success' || resp.status === 1) {
        this.alertService.success('Booking created successfully');
        this.router.navigate(['/pages/bookingList']); // Adjust route as needed
      }
    } catch (error) {
      this.alertService.error('Failed to create booking');
    } finally {
      this.loading = false;
    }
  }

  goBack() {
    this.router.navigate(['/pages/bookingList']);
  }
}
