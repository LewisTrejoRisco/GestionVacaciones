import { Component, Output, EventEmitter, Input, OnInit, Injectable } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { SolicitarService } from 'app/shared/services/solicitar.service';
import {
  ColumnMode,
  DatatableComponent,
  SelectionType
} from '@swimlane/ngx-datatable';

declare var require: any;
const dataDistrito: any = require('../../../../assets/data/distritos-data.json');

@Component({
  selector: 'app-tolerancia-modal',
  templateUrl: './tolerancia-modal.component.html',
  styleUrls: ['./tolerancia-modal.component.scss'],
  providers: [
    SolicitarService
  ]
})
export class ToleranciaModalComponent implements OnInit{

  type = 'Marketing';
  @Input() id: number;
  @Input() data: {};
  myForm: UntypedFormGroup;
  d2: any;
  listDetalle: any = [];
  distritos: any = null;

  public ColumnMode = ColumnMode;
  public expanded: any = {};

  constructor(
   public activeModal: NgbActiveModal,
   private formBuilder: UntypedFormBuilder
  ) {

  }

  ngOnInit() {
    this.buildItemForm(this.data);
  }

  get lf() {
    return this.myForm.controls;
  }

  private buildItemForm(item: any) {
      this.listDetalle = item.listDetalle;
  }

  createForm(item: any) {
    this.myForm = this.formBuilder.group({
      listDetalle: [item.listDetalle || null, Validators.required]
    });
  }

  submitForm() {
    this.activeModal.close();
  }


}
