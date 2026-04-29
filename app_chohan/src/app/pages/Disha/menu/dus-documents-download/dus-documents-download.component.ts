import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AutoCompleteModule } from 'primeng/autocomplete';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { SkeletonModule } from 'primeng/skeleton';

import { lastValueFrom } from 'rxjs';
import { BusDocumentService } from '../../../../../services/bus-document.service';
import { GlobalStorageService } from '../../../../../services/global-storage.service';

import { jsPDF } from 'jspdf';
import { Capacitor, CapacitorHttp } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Browser } from '@capacitor/browser';
import { FileOpener } from '@capawesome-team/capacitor-file-opener';

@Component({
  selector: 'app-dus-documents-download',
  standalone: true, // ✅ REQUIRED
  imports: [
    CommonModule, 
    FormsModule, 
    AutoCompleteModule, 
    CardModule, 
    DividerModule, 
    ButtonModule, 
    TooltipModule,
    SkeletonModule
  ],
  templateUrl: './dus-documents-download.component.html',
  styleUrls: ['./dus-documents-download.component.scss'] // ✅ FIXED
})
export class DusDocumentsDownloadComponent implements OnInit {

  busList: any[] = [];
  filteredBuses: any[] = [];
  selectedBus: any;
  documents: any[] = [];
  loading: boolean = false;

  constructor(
    private busDocumentService: BusDocumentService,
    private storage: GlobalStorageService
  ) {}

  async ngOnInit(): Promise<void> {
    const res: any = await lastValueFrom(
      this.busDocumentService.getAllBusNumber()
    );
    this.busList = res?.data || [];
  }

  filterBus(event: any) {
    const query = event.query.toLowerCase();
    this.filteredBuses = this.busList.filter(bus =>
      bus.busNo.toLowerCase().includes(query)
    );
  }

  async onBusSelect(event: any) {
    this.loading = true;
    this.documents = [];
    try {
      const res: any = await lastValueFrom(
        this.busDocumentService.getBusDocumentById(event.value.id)
      );
      this.documents = res?.data || [];
    } catch (err) {
      console.error('Error fetching documents:', err);
    } finally {
      this.loading = false;
    }
  }

  /* ================= DOWNLOAD & OPEN (WEB + ANDROID) ================= */
  async downloadDocument(doc: any) {
    if (!doc?.ID || !doc.DocumentPath) return;

    const extension = doc.DocumentPath.split('.').pop().toLowerCase();
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'heic'].includes(extension);
    const isPdf = extension === 'pdf';
    
    // Final filename will always be PDF for images, or original for others
    const baseFileName = `${doc.doctype || 'document'}-${doc.ID}`.replace(/\s+/g, '_');
    const url = `https://api.chohantoursandtravels.com/v1/busdocuments/file/${doc.ID}`;

    try {
      if (isPdf && !Capacitor.isNativePlatform()) {
        // Simple direct open for PDF on Web
        window.open(url, '_blank');
        return;
      }

      /* 1. Fetch File as Blob/ArrayBuffer */
      let finalBlob: Blob;
      let finalFileName = `${baseFileName}.${extension}`;
      const token = this.storage.get<string>('token');
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      if (Capacitor.isNativePlatform()) {
        // Native platforms handle binary data via Base64 in CapacitorHttp
        const response: any = await CapacitorHttp.get({
          url,
          responseType: 'arraybuffer',
          headers
        });
        
        if (response.status !== 200) {
          throw new Error(`Download failed (Status: ${response.status})`);
        }

        // On Native, response.data is a Base64 string when using arraybuffer
        const base64Content = response.data;
        if (!base64Content) throw new Error('Empty response data');

        const binaryString = window.atob(base64Content);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        const rawBlob = new Blob([bytes.buffer], { type: isPdf ? 'application/pdf' : `image/${extension === 'jpg' ? 'jpeg' : extension}` });

        // If it's an image, we'll convert it to PDF
        if (isImage) {
          finalBlob = await this.imageToPdfBlob(rawBlob);
          finalFileName = `${baseFileName}.pdf`;
        } else {
          finalBlob = rawBlob;
          if (isPdf) finalFileName = `${baseFileName}.pdf`;
        }
      } else {
        // Web Platform
        const response = await fetch(url, { headers });
        if (!response.ok) throw new Error(`Download error (Status: ${response.status})`);
        const originalBlob = await response.blob();
        
        if (isImage) {
          finalBlob = await this.imageToPdfBlob(originalBlob);
          finalFileName = `${baseFileName}.pdf`;
        } else {
          finalBlob = originalBlob;
          if (isPdf) finalFileName = `${baseFileName}.pdf`;
        }
      }

      /* 3. Logic for Saving/Opening */
      if (!Capacitor.isNativePlatform()) {
        const downloadUrl = window.URL.createObjectURL(finalBlob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = finalFileName;
        a.click();
        window.URL.revokeObjectURL(downloadUrl);
      } else {
        // MOBILE (Android/iOS)
        const base64Data = await this.blobToBase64(finalBlob);
        
        try {
          // Attempt to save to Documents/ChohanTravels for persistent access
          const savedFile = await Filesystem.writeFile({
            path: `ChohanTravels/${finalFileName}`,
            data: base64Data,
            directory: Directory.Documents,
            recursive: true
          });

          // Open the file with external app
          await FileOpener.openFile({
            path: savedFile.uri,
            mimeType: 'application/pdf' // All our downloads are converted to PDF or are original PDF
          });
        } catch (err) {
          console.error('File operation failed:', err);
          
          // Fallback to Cache directory if Documents is restricted
          const fallbackFile = await Filesystem.writeFile({
            path: finalFileName,
            data: base64Data,
            directory: Directory.Cache
          });

          await FileOpener.openFile({
            path: fallbackFile.uri,
            mimeType: 'application/pdf'
          });
        }
      }
    } catch (error) {
      console.error('Document processing failed:', error);
      alert('Failed to process document. Please try again.');
    }
  }

  /* Helper to convert image blob to PDF blob */
  private async imageToPdfBlob(imageBlob: Blob): Promise<Blob> {
    const imgDataUrl = await this.blobToDataURL(imageBlob);
    
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const pdf = new jsPDF({
          orientation: img.width > img.height ? 'l' : 'p',
          unit: 'mm',
          format: 'a4'
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 10;
        const maxWidth = pageWidth - (margin * 2);
        const maxHeight = pageHeight - (margin * 2);

        let imgWidth = img.width;
        let imgHeight = img.height;
        const ratio = imgWidth / imgHeight;

        if (imgWidth > maxWidth) {
          imgWidth = maxWidth;
          imgHeight = imgWidth / ratio;
        }

        if (imgHeight > maxHeight) {
          imgHeight = maxHeight;
          imgWidth = imgHeight * ratio;
        }

        const x = (pageWidth - imgWidth) / 2;
        const y = (pageHeight - imgHeight) / 2;

        const format = imageBlob.type.split('/')[1].toUpperCase() as any;
        pdf.addImage(imgDataUrl, format, x, y, imgWidth, imgHeight);
        
        const pdfOutput = pdf.output('arraybuffer');
        resolve(new Blob([pdfOutput], { type: 'application/pdf' }));
      };
      img.onerror = () => reject(new Error('Failed to load image for PDF conversion'));
      img.src = imgDataUrl;
    });
  }

  /* Helper for base64 conversion */
  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  private blobToDataURL(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(blob);
    });
  }
}
