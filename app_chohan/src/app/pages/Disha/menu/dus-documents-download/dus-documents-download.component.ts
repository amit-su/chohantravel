import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AutoCompleteModule } from 'primeng/autocomplete';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

import { lastValueFrom } from 'rxjs';
import { BusDocumentService } from '../../../../../services/bus-document.service';

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
    TooltipModule
  ],
  templateUrl: './dus-documents-download.component.html',
  styleUrls: ['./dus-documents-download.component.scss'] // ✅ FIXED
})
export class DusDocumentsDownloadComponent implements OnInit {

  busList: any[] = [];
  filteredBuses: any[] = [];
  selectedBus: any;
  documents: any[] = [];

  constructor(private busDocumentService: BusDocumentService) {}

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
    const res: any = await lastValueFrom(
      this.busDocumentService.getBusDocumentById(event.value.id)
    );
    this.documents = res?.data || [];
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

      /* 1. Fetch File as Blob */
      let originalBlob: Blob;
      if (Capacitor.isNativePlatform()) {
        const response: any = await CapacitorHttp.get({
          url,
          responseType: 'arraybuffer'
        });
        originalBlob = new Blob([response.data]);
      } else {
        const response = await fetch(url);
        originalBlob = await response.blob();
      }

      let finalBlob: Blob = originalBlob;
      let finalFileName = `${baseFileName}.${extension}`;

      /* 2. Convert Image to PDF */
      if (isImage) {
        const imgDataUrl = await this.blobToDataURL(originalBlob);
        
        // Use a promise to ensure image is loaded before PDF creation
        const img = new Image();
        const loadPromise = new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = () => reject(new Error('Image failed to load'));
        });
        img.src = imgDataUrl;
        await loadPromise;

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

        pdf.addImage(imgDataUrl, 'JPEG', x, y, imgWidth, imgHeight);
        
        // Create the blob with explicit type
        const pdfOutput = pdf.output('arraybuffer');
        finalBlob = new Blob([pdfOutput], { type: 'application/pdf' });
        finalFileName = `${baseFileName}.pdf`;
      } else if (isPdf) {
        finalBlob = new Blob([originalBlob], { type: 'application/pdf' });
        finalFileName = `${baseFileName}.pdf`;
      }

      /* 3. Logic for Opening/Saving */
      if (!Capacitor.isNativePlatform()) {
        const downloadUrl = window.URL.createObjectURL(finalBlob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = finalFileName;
        a.click();
        window.URL.revokeObjectURL(downloadUrl);
      } else {
        // MOBILE (Android/iOS)
        const reader = new FileReader();
        reader.onloadend = async () => {
          const dataUrl = reader.result as string;
          const base64Data = dataUrl.split(',')[1];
          
          try {
            // Save to Documents directory (more accessible)
            const savedFile = await Filesystem.writeFile({
              path: finalFileName,
              data: base64Data,
              directory: Directory.Cache
            });

            // Open the file with external app
            await FileOpener.openFile({
              path: savedFile.uri,
              mimeType: isPdf || isImage ? 'application/pdf' : undefined
            });
          } catch (err) {
            console.error('Mobile save/open error:', err);
            alert('Could not open the file. Please ensure you have a PDF viewer installed.');
          }
        };
        reader.readAsDataURL(finalBlob);
      }
    } catch (error) {
      console.error('Operation failed:', error);
      alert('Failed to process document');
    }
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
