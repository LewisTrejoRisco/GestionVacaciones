import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MovilidadModalComponent } from './movilidad-modal.component';

describe('MovilidadModalComponent', () => {
  let component: MovilidadModalComponent;
  let fixture: ComponentFixture<MovilidadModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MovilidadModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovilidadModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
