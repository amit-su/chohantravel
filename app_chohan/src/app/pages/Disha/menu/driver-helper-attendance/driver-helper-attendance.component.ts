import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DriverHelperAttendenceService } from '../../../../../services/driverHelperAttendence.service';
import dayjs from 'dayjs';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { AlertService } from '../../../../../services/alert.service';
import { ProgressBarModule } from 'primeng/progressbar';

@Component({
    selector: 'app-driver-helper-attendance',
    standalone: true,
    imports: [CommonModule, InputTextModule, ButtonModule, ReactiveFormsModule, FormsModule, DropdownModule, CalendarModule, ProgressSpinnerModule, ProgressBarModule],
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
    searchTerm = '';
    loading = false;
    savingAll = false;
    columns: string[] = [];
    isAllSites: boolean = false; // default: load my sites
    isMobile = window.innerWidth < 768;
    today = new Date();
    startOfMonth = dayjs().startOf('month').toDate();
    endOfMonth = dayjs().endOf('month').toDate();
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
        this.loading = true;
        await this.fetchSites();
        this.attendanceForm.get('search')?.valueChanges.subscribe((value) => {
            this.searchTerm = value.toLowerCase();
            this.cdr.markForCheck();
        });
        if (this.userId == 1) {
            const result = await firstValueFrom(this.attendanceService.getAllSites({}));
            this.siteNameByUser = result.data;
        } else {
            const result = await firstValueFrom(this.attendanceService.getAllSitesById({}, this.userId));
            this.siteNameByUser = result.data;
            if (this.userId === 1) {
                const result = await firstValueFrom(this.attendanceService.getAllSites({}));
                this.siteNameByUser = result.data;
            } else {
                const result = await firstValueFrom(this.attendanceService.getAllSitesById({}, this.userId));
                this.siteNameByUser = result.data;
            }

            // ✅ Set default first site if available
            if (this.siteNameByUser && this.siteNameByUser.length > 0) {
                this.attendanceForm.get('site')?.setValue(this.siteNameByUser[0].siteID);

                // Optional: trigger your change handler
                this.handleSiteChange(this.siteNameByUser[0].siteID);
            }
        }
        const userID = localStorage.getItem('userId') || 0;
        if (userID == '1') {
            await this.loadData();
        }
    }

    async fetchSites() {
        try {
            let result;

            if (this.isAllSites || this.userId === 1) {
                // Load all sites
                result = await firstValueFrom(this.attendanceService.getAllSites({}));
            } else {
                // Load my sites
                result = await firstValueFrom(this.attendanceService.getAllSitesById({}, this.userId));
            }

            this.sitename = result.data || [];
        } catch (err) {
            this.alertService.error('Site fetch failed');
        }
    }

    // Toggle button click
    toggleSites() {
        this.isAllSites = !this.isAllSites; // flip state
        this.fetchSites(); // reload sites
    }
    async loadData() {
        this.loading = true;
        const siteId = this.attendanceForm.get('site')?.value || 0;
        const type = this.DriverOrHelper;

        try {
            // ✅ Always derive month from selectedDate
            const selectedDate = this.attendanceForm.get('selectedDate')?.value || new Date();
            const selectedMonth = dayjs(selectedDate).startOf('month');
            const month = selectedMonth.format('MM/YYYY');
            console.log('API month parameter:', month);

            const [people, attendanceList] = await Promise.all([firstValueFrom(this.attendanceService.getHelpers(siteId, type)), firstValueFrom(this.attendanceService.getAttendanceList('1', '2000', type, siteId, month))]);

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

    /**
     * Combines people and attendance data, aggregating multiple site assignments per day.
     */
    // Inside DriverHelperAttendanceComponent.ts
    // Inside DriverHelperAttendanceComponent.ts

    // ... (existing code)

    /**
     * Combines people and attendance data, collecting ALL site assignments per day,
     * including duplicates, as requested.
     */
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

                    // 1. Temporary map to aggregate sites for the same day using an ARRAY.
                    // NOTE: This captures duplicates as requested (e.g., ['4', '4', '4']).
                    const sitesByDay: { [day: string]: any[] } = {}; // Changed to any[] to support siteId and id objects

                    parsed.forEach((entry: any) => {
                        if (entry?.date && entry?.status) {
                            const dateKey = entry.date;
                            const siteIDs = entry.status;
                            const attendanceId = entry.id || 0;

                            if (!sitesByDay[dateKey]) {
                                sitesByDay[dateKey] = [];
                            }

                            // Split the status string and PUSH each site ID to the array.
                            // Since it's an array, duplicates will be preserved.
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

                    // 2. Assign aggregated sites back to the row
                    for (const day in sitesByDay) {
                        // Assign the array, preserving duplicates.
                        row[`attendance_${day}`] = sitesByDay[day];
                    }
                } catch (err) {
                    console.error('Invalid AttendanceStatus format:', attendanceRecord.AttendanceStatus, err);
                }
            }

            this.tableData.push(row);
        }

        this.originalData = JSON.parse(JSON.stringify(this.tableData));
        this.cdr.markForCheck();
    }
    // ...

    handleSiteChange(siteId: number) {
        this.siteId = siteId;
        this.loadData();
    }

    handleDriverHelperChange(type: string) {
        this.DriverOrHelper = type;
        this.loadData();
    }

    handleMonthChange(month: any) {
        this.selectedMonth = dayjs(month);
        this.loadData();
    }

    handleDateChange(date: Date) {
        this.selectedDateColumn = dayjs(date).format('DD');
        this.generateTableData(this.peopleList, this.attendanceList);
        this.loadData();
    }

    addToAttendance(recordId: number, date: string, value: string) {
        console.log('Adding to attendance:', { recordId, date, value });
        this.tableData = this.tableData.map((row) => {
            if (row.id === recordId) {
                const current = row[`attendance_${date}`] || [];
                return { ...row, [`attendance_${date}`]: [...current, { siteId: value, id: 0 }] };
            }
            return row;
        });

        // Reset dropdown so same option can be picked again
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

    async saveSingle(recordId: number) {
        const record = this.tableData.find((r) => r.id === recordId);
        const original = this.originalData.find((r) => r.id === recordId);
        const changes: any[] = [];

        const field = `attendance_${this.selectedDateColumn}`;
        const currentValue = (record?.[field] || []).map((r: any) => r.siteId || r).join(',');
        const originalValue = (original?.[field] || []).map((r: any) => r.siteId || r).join(',');

        if (currentValue !== originalValue) {
            changes.push({ date: this.selectedDateColumn, status: currentValue });
        }

        if (changes.length === 0) return;

        const payload = {
            id: recordId,
            month: this.selectedMonth.format('MM/YYYY'),
            type: this.DriverOrHelper,
            attendance: changes
        };

        try {
            // const res = await firstValueFrom(this.attendanceService.saveAttendance(recordId, payload));
            // if (res?.status === 1 && res?.message === 'Success') {
            //     this.alertService.success('Attendance saved successfully');
            //     this.originalData = JSON.parse(JSON.stringify(this.tableData));
            // } else {
            //     this.alertService.warning(res?.message || 'Something went wrong');
            // }
        } catch {
            this.alertService.error('Failed to save attendance');
        }
        this.cdr.markForCheck();
    }

    async saveAll() {
        if (!window.confirm('Are you sure you want to save all changes?')) return;

        this.savingAll = true;
        this.loading = true;

        const recordsToSync: any[] = [];
        let requiresSave = false;

        // --- FIX 1: Get the current selected month from the form control ---
        // Use the month from the selectedDate form control, which is bound to the Calendar
        const currentSelectedDate = this.attendanceForm.get('selectedDate')?.value;
        const currentDayjsMonth = dayjs(currentSelectedDate).startOf('month');

        const DriverOrHelper = this.DriverOrHelper;
        // --- FIX 2: Use the dayjs object from the selected date to get the days in that month ---
        const daysInMonth = currentDayjsMonth.daysInMonth();
        // --------------------------------------------------------------------------------------

        for (const record of this.tableData) {
            const originalRecord = this.originalData.find((r) => r.id === record.id) || {};
            // console.log('Processing record:', record.id);
            for (let i = 1; i <= daysInMonth; i++) {
                // Re-create the date format logic using the correct dayjs object
                const dayOfMonth = currentDayjsMonth.date(i); // This gets the correct date in the selected month
                const date = dayOfMonth.format('DD');
                const fullDate = dayOfMonth.format('YYYY-MM-DD'); // This is the final correct duty date

                const field = `attendance_${date}`;

                const currentValue: any[] = record[field] || [];
                const originalValue: any[] = originalRecord[field] || [];

                // Convert site IDs for comparison
                const currentSiteIds = JSON.stringify(currentValue.map((r) => r.siteId || r));
                const originalSiteIds = JSON.stringify(originalValue.map((r) => r.siteId || r));
                if (currentSiteIds !== originalSiteIds) {
                    requiresSave = true;
                    if (currentValue.length > 0) {
                        currentValue.forEach((siteRecord: any) => {
                            // Normalize Site ID
                            const siteId = parseInt(siteRecord.siteId || siteRecord.siteID || siteRecord, 10);

                            // 🔑 Get full site object to get Khuraki amount
                            const siteObj = this.siteNameByUser.find((s: any) => s.siteID === siteId);

                            const khurakiAmt = DriverOrHelper.toLowerCase() === 'driver' ? (siteObj?.DriverKhurakiAmt ?? 0) : (siteObj?.HelperKhurakiAmt ?? 0);
                            console.log("siteRecord", siteRecord);
                            recordsToSync.push({
                                id: siteRecord.id || 0,
                                DutyDate: fullDate,
                                DriverID: DriverOrHelper.toLowerCase() === 'driver' ? record.id : null,
                                HelperID: DriverOrHelper.toLowerCase() === 'helper' ? record.id : null,
                                SiteID: siteId,
                                KhurakiAmt: khurakiAmt,
                                Interface: 'App'
                            });
                        });
                    } else {
                        // Case B: currentValue is EMPTY (signal to delete)
                        // Get unique record IDs from originalValue to signal deletion
                        const originalIds = [...new Set(originalValue.map((v: any) => v.id))];
                        console.log("originalIds", originalIds);
                        originalIds.forEach((oldId: any) => {
                            recordsToSync.push({
                                id: oldId || 0,
                                DutyDate: fullDate,
                                DriverID: DriverOrHelper.toLowerCase() === 'driver' ? record.id : null,
                                HelperID: DriverOrHelper.toLowerCase() === 'helper' ? record.id : null,
                                SiteID: 0,
                                KhurakiAmt: 0,
                                Interface: 'App'
                            });
                        });
                    }
                }
            }
        }

        if (!requiresSave) {
            // this.alertService.info('No changes to save across all records.');
            this.savingAll = false;
            this.loading = false;
            this.cdr.markForCheck();
            return;
        }

        // 2. API Call with the new payload structure
        try {
            const payload = { attendance: recordsToSync };

            const res = await firstValueFrom(this.attendanceService.saveAttendance(payload));

            if (res?.status === 1) {
                const message = res.message || '';

                // Extract numbers from message
                const regex = /(\d+)\s*records inserted|(\d+)\s*existing records deleted/gi;
                let inserted = 0;
                let deleted = 0;

                let match;
                while ((match = regex.exec(message)) !== null) {
                    if (match[1]) inserted += parseInt(match[1], 10);
                    if (match[2]) deleted += parseInt(match[2], 10);
                }

                // Calculate net changes
                let netInserted = 0;
                let netDeleted = 0;

                if (inserted > deleted) {
                    netInserted = inserted - deleted;
                } else if (deleted > inserted) {
                    netDeleted = deleted - inserted;
                }

                // Construct message
                const parts = [];
                if (netInserted > 0) parts.push(`${netInserted} record${netInserted > 1 ? 's' : ''} inserted`);
                if (netDeleted > 0) parts.push(`${netDeleted} record${netDeleted > 1 ? 's' : ''} deleted`);

                const finalMsg = parts.length > 0 ? parts.join(', ') : 'Change has been saved successfully';
                this.alertService.success(finalMsg);
            } else {
                this.alertService.warning(res?.message || 'Something went wrong during bulk save.');
            }

            await this.loadData();
        } catch (error) {
            console.error('Error saving all attendance:', error);
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

    get filteredTableData() {
        return this.tableData.filter((row) => row.name?.toLowerCase().includes(this.searchTerm));
    }
}
