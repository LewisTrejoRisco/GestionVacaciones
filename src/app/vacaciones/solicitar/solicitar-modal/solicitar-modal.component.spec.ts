import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SolicitarModalComponent } from './solicitar-modal.component';

describe('SolicitarModalComponent', () => {
  let component: SolicitarModalComponent;
  let fixture: ComponentFixture<SolicitarModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SolicitarModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitarModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
