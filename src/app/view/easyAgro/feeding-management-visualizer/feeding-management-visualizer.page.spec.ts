import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeedingManagementVisualizerPage } from './feeding-management-visualizer.page';

describe('FeedingManagementVisualizerPage', () => {
  let component: FeedingManagementVisualizerPage;
  let fixture: ComponentFixture<FeedingManagementVisualizerPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(FeedingManagementVisualizerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
