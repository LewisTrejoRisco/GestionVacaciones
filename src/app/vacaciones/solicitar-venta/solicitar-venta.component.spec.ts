import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitarVentaComponent } from './solicitar-venta.component';

describe('SolicitarVentaComponent', () => {
  let component: SolicitarVentaComponent;
  let fixture: ComponentFixture<SolicitarVentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolicitarVentaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitarVentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
