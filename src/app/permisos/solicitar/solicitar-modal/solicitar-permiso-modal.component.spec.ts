import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SolicitarPermisoModalComponent } from './solicitar-permiso-modal.component';

describe('SolicitarPermisoModalComponent', () => {
  let component: SolicitarPermisoModalComponent;
  let fixture: ComponentFixture<SolicitarPermisoModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SolicitarPermisoModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitarPermisoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
