import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DetalleModalComponent } from './detalle-modal.component';

describe('DetalleModalComponent', () => {
  let component: DetalleModalComponent;
  let fixture: ComponentFixture<DetalleModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
