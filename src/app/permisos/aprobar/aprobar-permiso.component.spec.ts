import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AprobarPermisoComponent } from './aprobar-permiso.component';

describe('AprobarPermisoComponent', () => {
  let component: AprobarPermisoComponent;
  let fixture: ComponentFixture<AprobarPermisoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AprobarPermisoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AprobarPermisoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
