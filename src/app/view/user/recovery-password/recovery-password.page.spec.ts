import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecoveryPasswordPage } from './recovery-password.page';

describe('RecoveryPasswordPage', () => {
  let component: RecoveryPasswordPage;
  let fixture: ComponentFixture<RecoveryPasswordPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RecoveryPasswordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
