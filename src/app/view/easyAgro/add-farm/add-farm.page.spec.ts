import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddFarmPage } from './add-farm.page';

describe('AddFarmPage', () => {
  let component: AddFarmPage;
  let fixture: ComponentFixture<AddFarmPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AddFarmPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
