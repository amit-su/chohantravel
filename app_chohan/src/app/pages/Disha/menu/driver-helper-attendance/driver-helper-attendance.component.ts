import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import dayjs from 'dayjs';

// PrimeNG Imports (Modern Modules)
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ProgressBarModule } from 'primeng/progressbar';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { SkeletonModule } from 'primeng/skeleton';

import { DriverHelperAttendenceService } from '../../../../../services/driverHelperAttendence.service';
import { AlertService } from '../../../../../services/alert.service';
import { LoginService } from '../../../../../services/login.service';

@Component({
    selector: 'app-driver-helper-attendance',
    standalone: true,
    imports: [
        CommonModule,
        InputTextModule,
        ButtonModule,
        ReactiveFormsModule,
        FormsModule,
        DropdownModule,
        CalendarModule,
        ProgressSpinnerModule,
        ProgressBarModule,
        RippleModule,
        TooltipModule,
        DialogModule,
        SkeletonModule
    ],
    templateUrl: './driver-helper-attendance.component.html',
    styleUrl: './driver-helper-attendance.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DriverHelperAttendanceComponent implements OnInit {
    attendanceForm: FormGroup;
    DriverOrHelper = 'Helper';
    sitename: any[] = [];
    siteNameByUser: any[] = [];
    userId = Number(localStorage.getItem('userId'));
    selectedMonth = dayjs();
    siteId = 0;
    tableData: any[] = [];
    originalData: any[] = [];

    // UI State for the modern design
    searchTerm = '';
    filterOpen = false;
    loading = false;
    savingAll = false;
    canSave = false;

    columns: string[] = [];
    isAllSites: boolean = false;
    isMobile = window.innerWidth < 768;
    today = new Date();
    selectedDateColumn = dayjs().format('DD');
    peopleList: any[] = [];
    attendanceList: any[] = [];
    selectedValues: { [id: number]: string } = {};

    driverHelperOptions = [
        { label: 'Driver', value: 'driver' },
        { label: 'Helper', value: 'helper' }
    ];

    constructor(
        private fb: FormBuilder,
        private alertService: AlertService,
        private attendanceService: DriverHelperAttendenceService,
        private loginService: LoginService,
        private cdr: ChangeDetectorRef
    ) {
        this.attendanceForm = this.fb.group({
            driverHelper: ['helper'],
            month: [new Date()],
            site: [null],
            selectedDate: [this.today],
            search: ['']
        });
    }

    trackById(index: number, item: any): number {
        return item.id;
    }

    async ngOnInit() {
        this.canSave = this.loginService.hasPermission('create-driverHelperAttendance') || this.loginService.hasPermission('update-driverHelperAttendance');
        this.loading = true;
        await this.fetchSites();

        if (this.userId == 1) {
            const result = await firstValueFrom(this.attendanceService.getAllSites({}));
            this.siteNameByUser = result.data;
        } else {
            const result = await firstValueFrom(this.attendanceService.getAllSitesById({}, this.userId));
            this.siteNameByUser = result.data;

            if (this.siteNameByUser && this.siteNameByUser.length > 0) {
                this.attendanceForm.get('site')?.setValue(this.siteNameByUser[0].siteID);
                this.siteId = this.siteNameByUser[0].siteID;
            }
        }
        await this.loadData();
    }

    async fetchSites() {
        try {
            let result;
            if (this.isAllSites || this.userId === 1) {
                result = await firstValueFrom(this.attendanceService.getAllSites({}));
            } else {
                result = await firstValueFrom(this.attendanceService.getAllSitesById({}, this.userId));
            }
            this.sitename = result.data || [];
            this.cdr.markForCheck();
        } catch (err) {
            this.alertService.error('Site fetch failed');
        }
    }

    toggleSites() {
        this.isAllSites = !this.isAllSites;
        this.fetchSites();
    }

    async loadData() {
        this.loading = true;
        this.cdr.markForCheck();
        const siteId = this.attendanceForm.get('site')?.value || 0;
        const type = this.DriverOrHelper;

        try {
            const selectedDate = this.attendanceForm.get('selectedDate')?.value || new Date();
            const selectedMonth = dayjs(selectedDate).startOf('month');
            const month = selectedMonth.format('MM/YYYY');
            this.selectedMonth = selectedMonth;

            const [people, attendanceList] = await Promise.all([
                firstValueFrom(this.attendanceService.getHelpers(siteId, type)),
                firstValueFrom(this.attendanceService.getAttendanceList('1', '5000', type, siteId, month))
            ]);

            this.peopleList = people.data || [];
            this.attendanceList = attendanceList?.data || [];
            this.generateTableData(this.peopleList, this.attendanceList);
        } catch (err) {
            this.alertService.error('Data load failed');
        } finally {
            this.loading = false;
            this.cdr.markForCheck();
        }
    }

    generateTableData(peopleList: any[], attendanceList: any[]) {
        const daysInMonth = this.selectedMonth.daysInMonth();
        this.columns = Array.from({ length: daysInMonth }, (_, i) => this.selectedMonth.date(i + 1).format('DD'));

        const seenIds = new Set<number>();
        this.tableData = [];
        this.selectedValues = {};

        for (const person of peopleList) {
            if (seenIds.has(person.id)) continue;
            seenIds.add(person.id);

            const row: any = { id: person.id, name: person.name };
            this.columns.forEach((day) => (row[`attendance_${day}`] = []));

            const attendanceRecord = attendanceList.find((a) => a.employeeID === person.id);

            if (attendanceRecord?.AttendanceStatus) {
                try {
                    const parsed = JSON.parse(attendanceRecord.AttendanceStatus);
                    const sitesByDay: { [day: string]: any[] } = {};

                    parsed.forEach((entry: any) => {
                        if (entry?.date && entry?.status) {
                            const dateKey = entry.date;
                            const siteIDs = entry.status;
                            const attendanceId = entry.id || 0;

                            if (!sitesByDay[dateKey]) sitesByDay[dateKey] = [];

                            siteIDs.split(',').forEach((siteId: string) => {
                                if (siteId.trim()) {
                                    sitesByDay[dateKey].push({
                                        siteId: siteId.trim(),
                                        id: attendanceId
                                    });
                                }
                            });
                        }
                    });

                    for (const day in sitesByDay) {
                        row[`attendance_${day}`] = sitesByDay[day];
                    }
                } catch (err) {
                    console.error('Invalid AttendanceStatus format:', err);
                }
            }
            this.tableData.push(row);
        }

        this.originalData = JSON.parse(JSON.stringify(this.tableData));
        this.cdr.markForCheck();
    }

    handleSiteChange(siteId: number) {
        this.siteId = siteId;
        this.loadData();
    }

    handleDriverHelperChange(type: string) {
        this.DriverOrHelper = type;
        this.loadData();
    }

    handleDateChange(date: Date) {
        this.selectedDateColumn = dayjs(date).format('DD');
        this.loadData();
    }

    addToAttendance(recordId: number, date: string, value: string) {
        if (!value) return;
        this.tableData = this.tableData.map((row) => {
            if (row.id === recordId) {
                const current = row[`attendance_${date}`] || [];
                return { ...row, [`attendance_${date}`]: [...current, { siteId: value, id: 0 }] };
            }
            return row;
        });
        this.selectedValues[recordId] = '';
        this.cdr.markForCheck();
    }

    removeAttendance(recordId: number, date: string, index: number) {
        this.tableData = this.tableData.map((row) => {
            if (row.id === recordId) {
                const updated = [...row[`attendance_${date}`]];
                updated.splice(index, 1);
                return { ...row, [`attendance_${date}`]: updated };
            }
            return row;
        });
        this.cdr.markForCheck();
    }

    getSiteLabel(val: any): string {
        const siteId = typeof val === 'object' ? val.siteId : val;
        const match = this.shortSiteOptions.find((opt) => opt.value === siteId?.toString());
        return match ? match.label : siteId;
    }

    async saveAll() {
        if (!window.confirm('Save all changes?')) return;

        this.savingAll = true;
        this.loading = true;
        this.cdr.markForCheck();

        const recordsToSync: any[] = [];
        let requiresSave = false;

        const currentSelectedDate = this.attendanceForm.get('selectedDate')?.value;
        const currentDayjsMonth = dayjs(currentSelectedDate).startOf('month');
        const daysInMonth = currentDayjsMonth.daysInMonth();

        for (const record of this.tableData) {
            const originalRecord = this.originalData.find((r) => r.id === record.id) || {};
            for (let i = 1; i <= daysInMonth; i++) {
                const dayOfMonth = currentDayjsMonth.date(i);
                const date = dayOfMonth.format('DD');
                const fullDate = dayOfMonth.format('YYYY-MM-DD');
                const field = `attendance_${date}`;

                const currentValue: any[] = record[field] || [];
                const originalValue: any[] = originalRecord[field] || [];

                const currentSiteIds = JSON.stringify(currentValue.map((r) => r.siteId || r));
                const originalSiteIds = JSON.stringify(originalValue.map((r) => r.siteId || r));

                if (currentSiteIds !== originalSiteIds) {
                    requiresSave = true;
                    
                    if (currentValue.length > 0) {
                        // 1. If there's at least one record, pass ONLY the present records. 
                        // The backend will automatically handle the diff/cleanup.
                        currentValue.forEach((siteRecord: any) => {
                            const siteIdVal = siteRecord.siteId || siteRecord.siteID || siteRecord;
                            const siteId = parseInt(siteIdVal, 10);
                            const siteObj = this.siteNameByUser.find((s: any) => s.siteID === siteId);
                            const khurakiAmt = this.DriverOrHelper.toLowerCase() === 'driver' ? (siteObj?.DriverKhurakiAmt ?? 0) : (siteObj?.HelperKhurakiAmt ?? 0);
                            
                            recordsToSync.push({
                                id: siteRecord.id || 0,
                                DutyDate: fullDate,
                                DriverID: this.DriverOrHelper.toLowerCase() === 'driver' ? record.id : null,
                                HelperID: this.DriverOrHelper.toLowerCase() === 'helper' ? record.id : null,
                                SiteID: siteId,
                                KhurakiAmt: khurakiAmt,
                                Interface: 'App'
                            });
                        });
                    } else {
                        // 2. If it's completely empty, pass a single reset record with SiteID 0 and id 0 to wipe it.
                        recordsToSync.push({
                            id: 0,
                            DutyDate: fullDate,
                            DriverID: this.DriverOrHelper.toLowerCase() === 'driver' ? record.id : null,
                            HelperID: this.DriverOrHelper.toLowerCase() === 'helper' ? record.id : null,
                            SiteID: 0,
                            KhurakiAmt: 0,
                            Interface: 'App'
                        });
                    }
                }
            }
        }

        if (!requiresSave) {
            this.savingAll = false;
            this.loading = false;
            this.cdr.markForCheck();
            return;
        }

        try {
            const res = await firstValueFrom(this.attendanceService.saveAttendance({ attendance: recordsToSync }));
            if (res?.status === 1) {
                this.alertService.success('Attendance saved successfully');
                await this.loadData();
            } else {
                this.alertService.warning(res?.message || 'Something went wrong');
            }
        } catch (error) {
            this.alertService.error('Failed to save attendance');
        } finally {
            this.loading = false;
            this.savingAll = false;
            this.cdr.markForCheck();
        }
    }

    get shortSiteOptions() {
        return this.sitename.map((site) => ({ label: site.siteShortName, value: site.siteID.toString() }));
    }

    onSearchTermChange() {
        this.cdr.markForCheck();
    }

    get filteredTableData() {
        const search = this.searchTerm.toLowerCase().trim();
        if (!search) return this.tableData;
        return this.tableData.filter((row) =>
            row.name?.toLowerCase().includes(search) ||
            row.id?.toString().includes(search)
        );
    }
}
