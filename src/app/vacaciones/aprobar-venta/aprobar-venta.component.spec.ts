import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AprobarVentaComponent } from './aprobar-venta.component';

describe('AprobarVentaComponent', () => {
  let component: AprobarVentaComponent;
  let fixture: ComponentFixture<AprobarVentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AprobarVentaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AprobarVentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
