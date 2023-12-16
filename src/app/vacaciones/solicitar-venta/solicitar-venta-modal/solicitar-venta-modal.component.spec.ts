import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SolicitarVentaModalComponent } from './solicitar-venta-modal.component';

describe('SolicitarModalComponent', () => {
  let component: SolicitarVentaModalComponent;
  let fixture: ComponentFixture<SolicitarVentaModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SolicitarVentaModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitarVentaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
