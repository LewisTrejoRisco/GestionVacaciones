import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitarPermisoComponent } from './solicitar-permiso.component';

describe('SolicitarPermisoComponent', () => {
  let component: SolicitarPermisoComponent;
  let fixture: ComponentFixture<SolicitarPermisoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolicitarPermisoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitarPermisoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
