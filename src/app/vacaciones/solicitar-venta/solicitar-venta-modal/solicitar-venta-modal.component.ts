import { Component, Output, EventEmitter, Input, OnInit, Injectable } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-solicitar-venta-modal',
  templateUrl: './solicitar-venta-modal.component.html',
  styleUrls: ['./solicitar-venta-modal.component.scss']
})
export class SolicitarVentaModalComponent implements OnInit{

  @Input() id: number;
  @Input() data: {};
  myForm: UntypedFormGroup;
  d2: any;
  diasASalir = [
    { id: 1, name: '7' },
    { id: 2, name: '8' },
    { id: 3, name: '9', disabled: true },
    { id: 4, name: '15' },
    { id: 5, name: '30' }
  ];
  modalFormSubmitted = false;

  constructor(
   public activeModal: NgbActiveModal,
   private formBuilder: UntypedFormBuilder
  ) {

  }

  ngOnInit() {
    this.buildItemForm(this.data);
  }

  get lf() {
    // //console.log(this.myForm.controls)
    return this.myForm.controls;
  }

  private buildItemForm(item) {
    if(item.hasta != null) {
      item.hasta = this.diasASalir.find(a => a.name == item.hasta);
    }
    this.myForm = this.formBuilder.group({
      hasta: [item.hasta || null, Validators.required],
    });
  }

  submitForm() {
    this.modalFormSubmitted = true;
    if (this.myForm.invalid) {
      return;
    }
    this.activeModal.close(this.myForm.value);
  }

}
