import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import dayjs from 'dayjs';

import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { RippleModule } from 'primeng/ripple';
import { SelectButtonModule } from 'primeng/selectbutton';

import { ReportService } from '../../../../../services/report.service';
import { DriverHelperAttendenceService } from '../../../../../services/driverHelperAttendence.service';
import { AlertService } from '../../../../../services/alert.service';

@Component({
    selector: 'app-khoraki-details',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        DropdownModule,
        CalendarModule,
        ButtonModule,
        CardModule,
        SkeletonModule,
        InputTextModule,
        TagModule,
        DividerModule,
        RippleModule,
        SelectButtonModule
    ],
    templateUrl: './khoraki-details.component.html',
    styleUrl: './khoraki-details.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class KhorakiDetailsComponent implements OnInit {
    selectedDate: Date = new Date();
    selectedEmpType: string = 'Driver';
    selectedSiteId: number = 0;
    searchTerm: string = '';
    reportData: any[] = [];
    sites: any[] = []; // Filtered site list for the dropdown
    allSites: any[] = []; // Master site list for name resolution
    loading: boolean = false;
    userId: number = Number(localStorage.getItem('userId'));

    empTypeOptions = [
        { label: 'Driver', value: 'Driver' },
        { label: 'Helper', value: 'Helper' }
    ];

    viewOptions = [
        { label: 'Date Wise', value: 'date' },
        { label: 'Site Wise', value: 'site' }
    ];

    constructor(
        private reportService: ReportService,
        private attendanceService: DriverHelperAttendenceService,
        private alertService: AlertService,
        private cdr: ChangeDetectorRef
    ) {}

    async ngOnInit() {
        this.loading = true;
        await this.fetchSites();
        await this.fetchReport();
    }

    async fetchSites() {
        try {
            // ALWAYS fetch master list for resolution
            const masterRes = await firstValueFrom(this.attendanceService.getAllSites({}));
            this.allSites = masterRes.data || [];

            if (this.userId === 1) {
                this.sites = [{ siteID: 0, siteName: 'All Sites', siteShortName: 'All' }, ...this.allSites];
            } else {
                const res = await firstValueFrom(this.attendanceService.getAllSitesById({}, this.userId));
                this.sites = res.data || [];
                if (this.sites.length > 0) {
                    this.selectedSiteId = this.sites[0].siteID;
                }
            }
            this.cdr.markForCheck();
        } catch (err) {
            console.error('Failed to fetch sites', err);
        }
    }

    getSiteShortName(siteID: any): string {
        const site = this.allSites.find(s => s.siteID === siteID || s.siteID.toString() === siteID.toString());
        return site ? site.siteShortName : siteID;
    }

    public getFormattedDaySites(day: any): string {
        if (!day.records) return '';
        const names = day.records.map((r: any) => {
            const site = this.allSites.find(s => s.siteID.toString() === r.status.toString() || s.siteShortName === r.status.toString());
            if (site) return site.siteShortName;
            
            const statusMap: any = { 'P': 'P', 'A': 'A', '28': 'A', 'L': 'L', '29': 'L', '4': 'P' };
            const s = r.status.toString().toUpperCase();
            return statusMap[s] || r.status;
        });
        return Array.from(new Set(names)).join(', ');
    }

    private parseAttendance(statusStr: string) {
        try {
            return statusStr ? JSON.parse(statusStr) : [];
        } catch (e) {
            return [];
        }
    }

    private parseSiteSummary(jsonString: string): any[] {
        if (!jsonString) return [];
        try {
            return JSON.parse(jsonString);
        } catch (err) {
            console.error('Failed to parse site summary', err);
            return [];
        }
    }

    public isSite(status: any): boolean {
        if (!status) return false;
        return this.allSites.some(s => s.siteID.toString() === status.toString() || s.siteShortName === status.toString());
    }

    private generateFullMonthGrid(attendanceJson: string, date: Date) {
        const daysInMonth = dayjs(date).daysInMonth();
        const attendance = this.parseAttendance(attendanceJson);
        
        // Group by day to handle multiple duties
        const attendanceMap = new Map<string, any[]>();
        attendance.forEach((item: any) => {
            const dayNum = parseInt(item.date).toString();
            const existing = attendanceMap.get(dayNum) || [];
            existing.push(item);
            attendanceMap.set(dayNum, existing);
        });

        const grid = [];
        for (let i = 1; i <= daysInMonth; i++) {
            const dayStr = i < 10 ? '0' + i : i.toString();
            const records = attendanceMap.get(i.toString()) || [];
            
            // Priority for style: if any record is a site duty, use green style
            const siteRecord = records.find(r => this.isSite(r.status));
            const mainStatus = siteRecord ? siteRecord.status : (records.length > 0 ? records[0].status : null);

            grid.push({
                day: dayStr,
                status: mainStatus,
                count: records.length,
                records: records
            });
        }
        return grid;
    }

    getDayStyle(status: string) {
        if (!status) return { 'background-color': '#fcfcfc', 'color': '#cbd5e1', 'border-color': '#f1f5f9' };
        
        const s = status.toString().toUpperCase();
        const yellow = ['P', '4']; // Present is P or 4
        const red = ['A', 'L', '28', '29']; // Absent and Leave
        
        // Priority 1: Standard Attendance Statuses
        if (yellow.includes(s)) {
            return { 'background-color': '#fffbeb', 'color': '#ca8a04', 'border-color': '#fef08a' };
        }
        if (red.includes(s)) {
            return { 'background-color': '#fef2f2', 'color': '#b91c1c', 'border-color': '#fecaca' };
        }

        // Priority 2: Check if it's a Site (Green)
        if (this.isSite(status)) {
            return { 'background-color': '#f0fdf4', 'color': '#15803d', 'border-color': '#bbf7d0' };
        }
        
        // Default Gray for others (Holidays/Unknown)
        return { 'background-color': '#f1f5f9', 'color': '#64748b', 'border-color': '#e2e8f0' };
    }

    getDotColor(status: string): string {
        const style = this.getDayStyle(status);
        return style['color'] || '#f43f5e';
    }

    onDayClick(day: any, item: any) {
        if (!day.records || day.records.length === 0) {
            item.selectedDayInfo = `Day ${day.day}: No Record`;
            this.cdr.markForCheck();
            return;
        }

        const infoParts = day.records.map((r: any) => {
            const site = this.allSites.find(s => s.siteID.toString() === r.status.toString() || s.siteShortName === r.status.toString());
            if (site) return site.siteName;
            
            const statusMap: any = { 'P': 'Present', 'A': 'Absent', '28': 'Absent', 'L': 'Leave', '29': 'Leave', '4': 'Present' };
            const s = r.status.toString().toUpperCase();
            return statusMap[s] || r.status;
        });

        // Unique and join
        const uniqueInfos = Array.from(new Set(infoParts));
        item.selectedDayInfo = `Day ${day.day}: ${uniqueInfos.join(' & ')}`;
        this.cdr.markForCheck();
    }

    async fetchReport() {
        this.loading = true;
        this.cdr.markForCheck();

        const month = dayjs(this.selectedDate).format('MM');
        const year = dayjs(this.selectedDate).format('YYYY');

        const payload = {
            month: month,
            year: year,
            empType: this.selectedEmpType,
            companyId: 0,
            siteId: this.selectedSiteId
        };

        try {
            const res: any = await firstValueFrom(this.reportService.getDriverHelperAttendanceReport(payload));
            if (res && (res.status === 1 || res.status === '1')) {
                let rawData = res.data;
                if (rawData && !Array.isArray(rawData) && Array.isArray(rawData.data)) {
                    rawData = rawData.data;
                }

                if (Array.isArray(rawData)) {
                    this.reportData = rawData.map((item: any) => ({
                        ...item,
                        TotalKhorakiAmt: item.TotalKhorakiAmt ?? 0,
                        fullMonthAttendance: this.generateFullMonthGrid(item.AttendanceStatus, this.selectedDate),
                        parsedSiteSummary: this.parseSiteSummary(item.SiteWiseCount),
                        selectedDayInfo: null,
                        viewMode: 'date'
                    }));
                } else {
                    this.reportData = [];
                }
            } else {
                this.reportData = [];
                this.alertService.warning(res?.message || 'No records found');
            }
        } catch (err: any) {
            console.error('Khoraki Critical Error:', err);
            this.alertService.error('Report Error: ' + (err.message || 'Unknown Error'));
            this.reportData = [];
        } finally {
            this.loading = false;
            this.cdr.markForCheck();
        }
    }

    get filteredData() {
        if (!this.reportData) return [];
        if (!this.searchTerm || !this.searchTerm.trim()) return this.reportData;
        
        const search = this.searchTerm.toLowerCase().trim();
        return this.reportData.filter(item => {
            const name = (item.EmployeeName || item.employeeName || '').toString().toLowerCase();
            const id = (item.employeeID || item.EmployeeID || '').toString().toLowerCase();
            return name.includes(search) || id.includes(search);
        });
    }

    get totalReportAmount() {
        return this.reportData.reduce((acc, item) => acc + (item.TotalKhorakiAmt || 0), 0);
    }
}
