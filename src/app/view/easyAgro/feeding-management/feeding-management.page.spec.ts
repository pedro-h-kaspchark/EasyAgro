import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeedingManagementPage } from './feeding-management.page';

describe('FeedingManagementPage', () => {
  let component: FeedingManagementPage;
  let fixture: ComponentFixture<FeedingManagementPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(FeedingManagementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
