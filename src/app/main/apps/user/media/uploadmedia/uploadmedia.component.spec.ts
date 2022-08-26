import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadmediaComponent } from './uploadmedia.component';

describe('UploadmediaComponent', () => {
  let component: UploadmediaComponent;
  let fixture: ComponentFixture<UploadmediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadmediaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadmediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
