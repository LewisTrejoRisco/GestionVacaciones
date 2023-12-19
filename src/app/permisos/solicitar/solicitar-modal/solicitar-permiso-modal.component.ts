import { Component, Output, EventEmitter, Input, OnInit, Injectable } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateParserFormatter, NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';

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
  selector: 'app-solicitar-permiso-modal',
  templateUrl: './solicitar-permiso-modal.component.html',
  styleUrls: ['./solicitar-permiso-modal.component.scss'],
  providers: [
    {
      provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter
    },
  ]
})
export class SolicitarPermisoModalComponent implements OnInit{

  type = 'Marketing';
  @Input() id: number;
  @Input() data: {};
  myForm: UntypedFormGroup;
  d2: any;
  horas = [
    { id: 1, name: '1' },
    { id: 2, name: '2' },
    { id: 3, name: '3' },
    { id: 4, name: '4' },
    { id: 5, name: '5' },
    { id: 6, name: '6' },
    { id: 7, name: '7' },
    { id: 8, name: '8' },
    { id: 9, name: '9' }
  ];
  minutos = [
    { id: 0, name: '00' },
    { id: 10, name: '10' },
    { id: 20, name: '20' },
    { id: 30, name: '30' },
    { id: 40, name: '40' },
    { id: 50, name: '50' },
    { id: 60, name: '60' }
  ];
  time: NgbTimeStruct = { hour: 13, minute: 30, second: 30 };

  constructor(
   public activeModal: NgbActiveModal,
   private formBuilder: UntypedFormBuilder
  ) {

  }

  ngOnInit() {
    this.buildItemForm(this.data);
  }

  private buildItemForm(item) {
    console.log(item)
    if(item.horas != null) {
      item.horas = this.horas.find(a => a.name == item.horas);
    }
    if(item.minutos != null) {
      item.minutos = this.minutos.find(a => a.name == item.minutos);
    }
    this.myForm = this.formBuilder.group({
      fechaInic: [item.fechaInic || '', Validators.required],
      timeInic: [item.timeInic || '', Validators.required],
      horas: [item.horas || null, Validators.required],
      minutos: [item.minutos || null, Validators.required],
      descripcion: [item.descripcion || '', Validators.required],
    });
  }

  submitForm() {
    this.activeModal.close(this.myForm.value);
  }

}
