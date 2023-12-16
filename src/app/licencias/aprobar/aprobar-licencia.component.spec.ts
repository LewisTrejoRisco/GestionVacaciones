import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AprobarLicenciaComponent } from './aprobar-licencia.component';

describe('AprobarLicenciaComponent', () => {
  let component: AprobarLicenciaComponent;
  let fixture: ComponentFixture<AprobarLicenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AprobarLicenciaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AprobarLicenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
