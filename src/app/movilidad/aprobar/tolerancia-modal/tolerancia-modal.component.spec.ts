import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ToleranciaModalComponent } from './tolerancia-modal.component';

describe('ToleranciaModalComponent', () => {
  let component: ToleranciaModalComponent;
  let fixture: ComponentFixture<ToleranciaModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ToleranciaModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToleranciaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
