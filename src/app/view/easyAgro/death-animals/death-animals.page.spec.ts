import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeathAnimalsPage } from './death-animals.page';

describe('DeathAnimalsPage', () => {
  let component: DeathAnimalsPage;
  let fixture: ComponentFixture<DeathAnimalsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DeathAnimalsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
