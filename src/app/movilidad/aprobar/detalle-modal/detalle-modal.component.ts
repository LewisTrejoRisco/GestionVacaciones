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
/**
 * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
 */
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {
  readonly DELIMITER = '/';

  parse(value: string): NgbDateStruct | null {
    if (value) {
      const date = value.split(this.DELIMITER);
      return {
        day: parseInt(date[0], 10),
        month: parseInt(date[1], 10),
        year: parseInt(date[2], 10),
      };
    }
    return null;
  }

  format(date: NgbDateStruct | null): string {
    return date
      ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year
      : '';
  }
}

@Component({
  selector: 'app-detalle-modal',
  templateUrl: './detalle-modal.component.html',
  styleUrls: ['./detalle-modal.component.scss'],
  providers: [
    {
      provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter
    },
    SolicitarService
  ]
})
export class DetalleModalComponent implements OnInit{

  type = 'Marketing';
  @Input() id: number;
  @Input() data: {};
  myForm: UntypedFormGroup;
  d2: any;
  listDetalle: any = [];
  distritos: any = null;

  public ColumnMode = ColumnMode;
  // public userRows = DataUserVacation;
  public expanded: any = {};

  constructor(
   public activeModal: NgbActiveModal,
   private formBuilder: UntypedFormBuilder
  ) {

  }

  ngOnInit() {
    this.distritos = dataDistrito;
    this.buildItemForm(this.data);
  }

  get lf() {
    return this.myForm.controls;
  }

  private buildItemForm(item: any) {
      // this.createForm(item);
      this.listDetalle = item.listDetalle;
  }

  createForm(item: any) {
    console.log(item.listDetalle)
    this.myForm = this.formBuilder.group({
      listDetalle: [item.listDetalle || null, Validators.required]
    });
  }

  getDescription(idCiudad: any): string {
    return this.distritos.find(a => a.id_distrito == idCiudad).descripcion_distrito
  }

  submitForm() {
    this.activeModal.close();
  }


}
