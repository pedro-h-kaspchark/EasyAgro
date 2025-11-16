import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VaccineManagementVisualizerPage } from './vaccine-management-visualizer.page';

describe('VaccineManagementVisualizerPage', () => {
  let component: VaccineManagementVisualizerPage;
  let fixture: ComponentFixture<VaccineManagementVisualizerPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(VaccineManagementVisualizerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
