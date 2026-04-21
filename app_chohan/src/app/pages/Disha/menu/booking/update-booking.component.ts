import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MasterService } from '../../../../../services/master.service';
import { BookingService } from '../../../../../services/booking.service';
import { AlertService } from '../../../../../services/alert.service';
import { firstValueFrom } from 'rxjs';

// PrimeNG Imports
import { SkeletonModule } from 'primeng/skeleton';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-update-booking',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SelectModule,
    DatePickerModule,
    InputTextModule,
    TextareaModule,
    InputNumberModule,
    ButtonModule,
    TableModule,
    DialogModule,
    TagModule,
    TooltipModule,
    SkeletonModule,
    DropdownModule
  ],
  templateUrl: './booking-entry.component.html' // Reuse the same template
})
export class UpdateBookingComponent implements OnInit {
  bookingForm: FormGroup;
  tripForm: FormGroup;

  parties: any[] = [];
  busCategories: any[] = [];
  bookingArray: any[] = [];

  loading = false;
  initialLoading = true;
  displayTripDialog = false;
  editingTripIndex: number | null = null;
  tripAmount = 0;
  bookingNo: string | null = null;
  currentStep = 1;
  isUpdateMode = true;

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
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) {
    this.bookingForm = this.fb.group({
      PartyID: [null, Validators.required],
      BookingNo: [''],
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
      ID: [0], // For existing trips
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
    this.bookingNo = this.route.snapshot.paramMap.get('id');
    await this.loadInitialData();
    if (this.bookingNo) {
      await this.loadBookingData();
    }
  }

  async loadInitialData() {
    try {
      const partyResp: any = await firstValueFrom(this.masterService.getPartyPaginated({ page: 1, count: 1000, status: true }));
      this.parties = Array.isArray(partyResp?.data) ? partyResp.data : (Array.isArray(partyResp) ? partyResp : []);

      const busCatResp: any = await firstValueFrom(this.masterService.getAllBusCategory({ page: 1, count: 1000, status: true }));
      this.busCategories = Array.isArray(busCatResp?.data) ? busCatResp.data : (Array.isArray(busCatResp) ? busCatResp : []);
    } catch (error) {
      this.alertService.error('Failed to load metadata');
    }
  }

  async loadBookingData() {
    this.initialLoading = true;
    try {
      const resp = await firstValueFrom(this.bookingService.getBookingEntryById(parseInt(this.bookingNo!)));
      if (resp && resp.data && resp.data.length > 0) {
        const entry = resp.data[0];

        // Populate Form
        this.bookingForm.patchValue({
          PartyID: parseInt(entry.PartyID),
          BookingNo: entry.BookingNo,
          bookingDate: this.parseDateYMD(entry.BookingDate),
          ContactPersonName: entry.ContactPersonName,
          ContactPersonNo: entry.ContactPersonNo,
          address: entry.ReportAddr,
          includeGST: entry.GSTInclude === 1 || entry.GSTInclude === "Yes" ? "Yes" : "No",
          email: entry.Email,
          paymentTerms: entry.PaymentTerms,
          PermitReq: entry.PermitReq,
          includeParking: entry.ParkingInclude === "Yes" || entry.ParkingInclude === 1 ? "Yes" : "No",
          includeTollTax: entry.TollTaxInclude === "Yes" || entry.TollTaxInclude === 1 ? "Yes" : "No"
        });

        // Populate Trips
        if (entry.LocalBookingList) {
          try {
            this.bookingArray = typeof entry.LocalBookingList === 'string' ? JSON.parse(entry.LocalBookingList) : entry.LocalBookingList;
          } catch (e) {
            console.error('Failed to parse trip list');
          }
        }
      }
    } catch (error) {
      this.alertService.error('Failed to load booking data');
    } finally {
      this.initialLoading = false;
    }
  }

  // Same helper methods as BookingEntryComponent...
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
      ID: 0,
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

    const formData = { ...trip };

    // Ensure the busType form control is a string to match the busCategories options strictly
    formData.busType = (trip.busType || trip.BusTypeID) ? String(trip.busType || trip.BusTypeID) : null;

    formData.ReportDate = this.parseDate(trip.ReportDate);
    formData.tripEndDate = this.parseDate(trip.tripEndDate);
    formData.reportTime = this.parseTime(trip.reportTime);
    formData.ReturnTime = this.parseTime(trip.ReturnTime);

    this.tripForm.patchValue(formData);
    this.tripAmount = trip.Amt;
    this.displayTripDialog = true;
    this.cd.detectChanges();
  }

  async removeTripDetail(index: number) {
    const trip = this.bookingArray[index];

    if (trip.ID) {
      const confirmed = await this.alertService.confirm('This trip will be permanently removed from the records. Do you want to proceed?', 'Delete Trip?');
      if (confirmed) {
        try {
          await firstValueFrom(this.bookingService.deleteTripDetail(trip.ID));
          this.alertService.success('Trip deleted successfully');
          this._removeLocal(index);
        } catch (error) {
          console.error('Delete error:', error);
          this.alertService.error('Failed to delete trip. It might be linked to other records.');
        }
      }
    } else {
      this._removeLocal(index);
    }
  }

  private _removeLocal(index: number) {
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
    if (isNaN(d.getTime())) return date.toString(); // Already formatted or invalid
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

  parseDateYMD(dateStr: string): Date {
    if (!dateStr) return new Date();
    return new Date(dateStr);
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
    this.loading = true;
    try {
      const headValues = this.bookingForm.value;
      const data: any = {};
      Object.keys(headValues).forEach(key => {
        data[key] = typeof headValues[key] === 'string' ? headValues[key].toUpperCase() : headValues[key];
      });

      const d = new Date(headValues.bookingDate);
      data.BookingDate = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
      data.BookingNo = this.bookingNo;

      data.localBookingList = JSON.stringify(this.bookingArray.map(trip => {
        const t = { ...trip };
        const rd = this.parseDate(trip.ReportDate);
        const ed = this.parseDate(trip.tripEndDate);
        t.ReportDate = `${rd.getFullYear()}-${(rd.getMonth() + 1).toString().padStart(2, '0')}-${rd.getDate().toString().padStart(2, '0')}`;
        t.tripEndDate = `${ed.getFullYear()}-${(ed.getMonth() + 1).toString().padStart(2, '0')}-${ed.getDate().toString().padStart(2, '0')}`;

        t.BusTypeID = String(trip.busType || trip.BusTypeID || '');
        t.busType = String(trip.busType || trip.BusTypeID || '');
        t.ID = trip.ID || 0;

        return t;
      }));

      const resp = await firstValueFrom(this.bookingService.updateBookingEntry(parseInt(this.bookingNo!), data));
      if (resp.message === 'success' || resp.status === 1) {
        this.alertService.success('Booking updated successfully');
        this.router.navigate(['/pages/bookingList']);
      }
    } catch (error) {
      this.alertService.error('Failed to update booking');
    } finally {
      this.loading = false;
    }
  }

  goBack() {
    this.router.navigate(['/pages/bookingList']);
  }
}
