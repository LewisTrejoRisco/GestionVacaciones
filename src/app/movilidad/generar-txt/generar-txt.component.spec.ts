import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerarTxtComponent } from './generar-txt.component';

describe('GenerarTxtComponent', () => {
  let component: GenerarTxtComponent;
  let fixture: ComponentFixture<GenerarTxtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerarTxtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerarTxtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
