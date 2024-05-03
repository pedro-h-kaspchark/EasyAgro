import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FarmDetailsPage } from './farm-details.page';

describe('FarmDetailsPage', () => {
  let component: FarmDetailsPage;
  let fixture: ComponentFixture<FarmDetailsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(FarmDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
