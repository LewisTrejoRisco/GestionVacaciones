import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AprobarMovilidadComponent } from './aprobar-movilidad.component';

describe('AprobarMovilidadComponent', () => {
  let component: AprobarMovilidadComponent;
  let fixture: ComponentFixture<AprobarMovilidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AprobarMovilidadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AprobarMovilidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
