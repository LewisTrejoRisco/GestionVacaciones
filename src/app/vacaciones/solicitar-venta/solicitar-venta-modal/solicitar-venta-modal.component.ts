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

  private listDiasASalir() {
    this.diasASalir;
    for(let i = 1; i<16; i++) {
      let dia = {
        id: i, 
        name: '' + i
      }
      this.diasASalir.push(dia);
    }
  }

  private buildItemForm(item) {
    this.listDiasASalir();
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
