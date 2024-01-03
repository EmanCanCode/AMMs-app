import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TttPage } from './ttt.page';

describe('TttPage', () => {
  let component: TttPage;
  let fixture: ComponentFixture<TttPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TttPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
