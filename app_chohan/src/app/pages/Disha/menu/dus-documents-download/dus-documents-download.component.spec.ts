import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DusDocumentsDownloadComponent } from './dus-documents-download.component';

describe('DusDocumentsDownloadComponent', () => {
  let component: DusDocumentsDownloadComponent;
  let fixture: ComponentFixture<DusDocumentsDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DusDocumentsDownloadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DusDocumentsDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
