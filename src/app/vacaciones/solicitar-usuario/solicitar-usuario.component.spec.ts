import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitarUsuarioComponent } from './solicitar-usuario.component';

describe('SolicitarUsuarioComponent', () => {
  let component: SolicitarUsuarioComponent;
  let fixture: ComponentFixture<SolicitarUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolicitarUsuarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitarUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
