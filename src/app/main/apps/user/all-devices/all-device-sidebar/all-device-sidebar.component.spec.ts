import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllDeviceSidebarComponent } from './all-device-sidebar.component';

describe('AllDeviceSidebarComponent', () => {
  let component: AllDeviceSidebarComponent;
  let fixture: ComponentFixture<AllDeviceSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllDeviceSidebarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllDeviceSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
