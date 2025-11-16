import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VaccineManagementPage } from './vaccine-management.page';

describe('VaccineManagementPage', () => {
  let component: VaccineManagementPage;
  let fixture: ComponentFixture<VaccineManagementPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(VaccineManagementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
