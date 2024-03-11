import { Component, Output, EventEmitter, Input, OnInit, Injectable } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-cancelar-modal',
  templateUrl: './cancelar-modal.component.html',
  styleUrls: ['./cancelar-modal.component.scss']
})
export class CancelarModalComponent implements OnInit{

  @Input() titulo: string;
  @Input() data: {};
  myForm: UntypedFormGroup;
  d2: any;
  // cities = [
  //   { id: 1, name: '7' },
  //   { id: 2, name: '8' },
  //   { id: 3, name: '9', disabled: true },
  //   { id: 4, name: '15' },
  //   { id: 5, name: '30' }
  // ];

  constructor(
   public activeModal: NgbActiveModal,
   private formBuilder: UntypedFormBuilder
  ) {

  }

  ngOnInit() {
    this.buildItemForm(this.data);
  }

  private buildItemForm(item) {
    //console.log(item)
    this.myForm = this.formBuilder.group({
      motivo: [item.motivo || '', Validators.required],
    });
  }

  submitForm() {
    this.activeModal.close(this.myForm.value);
  }

}
