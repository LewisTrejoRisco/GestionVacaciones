import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SolicitarLicenciaModalComponent } from './solicitar-licencia-modal.component';

describe('SolicitarLicenciaModalComponent', () => {
  let component: SolicitarLicenciaModalComponent;
  let fixture: ComponentFixture<SolicitarLicenciaModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SolicitarLicenciaModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitarLicenciaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
