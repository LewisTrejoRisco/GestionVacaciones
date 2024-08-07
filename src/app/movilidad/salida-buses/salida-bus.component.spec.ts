import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalidaBusComponent } from './salida-bus.component';

describe('SalidaBusComponent', () => {
  let component: SalidaBusComponent;
  let fixture: ComponentFixture<SalidaBusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalidaBusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalidaBusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
