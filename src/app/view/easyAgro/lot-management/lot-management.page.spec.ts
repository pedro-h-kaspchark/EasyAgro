import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LotManagementPage } from './lot-management.page';

describe('LotManagementPage', () => {
  let component: LotManagementPage;
  let fixture: ComponentFixture<LotManagementPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LotManagementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
