import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { Empty } from './empty/empty';

import { MenuComponent } from './Disha/menu/menu.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth/auth.guard';

import { Access } from './auth/access';
import { AccessComponent } from './Disha/access/access.component';

import { HomeComponent } from './home/home.component';
import { DriverHelperAttendanceComponent } from './Disha/menu/driver-helper-attendance/driver-helper-attendance.component';
import { BusDocumentService } from '../../services/bus-document.service';
import { DusDocumentsDownloadComponent } from './Disha/menu/dus-documents-download/dus-documents-download.component';
import { BookingEntryComponent } from './Disha/menu/booking/booking-entry.component';
import { BookingListComponent } from './Disha/menu/booking/booking-list.component';
import { UpdateBookingComponent } from './Disha/menu/booking/update-booking.component';
import { KhorakiDetailsComponent } from './Disha/menu/khoraki-details/khoraki-details.component';
export default [
    { path: 'documentation', component: Documentation },
    { path: 'scan', component: MenuComponent },
    { path: 'login', component: LoginComponent },
    { path: 'home', component: HomeComponent },
    { path: 'DriverHelperAttendencee', component: DriverHelperAttendanceComponent },
    { path: 'bus-document', component: DusDocumentsDownloadComponent},
    { path: 'bookingEntry', component: BookingEntryComponent},
    { path: 'bookingList', component: BookingListComponent},
    { path: 'editBooking/:id', component: UpdateBookingComponent},
    { path: 'khorakiDetails', component: KhorakiDetailsComponent },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
