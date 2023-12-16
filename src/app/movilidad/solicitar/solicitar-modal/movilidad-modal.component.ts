import { Component, Output, EventEmitter, Input, OnInit, Injectable } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

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
  selector: 'app-movilidad-modal',
  templateUrl: './movilidad-modal.component.html',
  styleUrls: ['./movilidad-modal.component.scss'],
  providers: [
    {
      provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter
    },
  ]
})
export class MovilidadModalComponent implements OnInit{

  type = 'Marketing';
  @Input() id: number;
  @Input() data: {};
  myForm: UntypedFormGroup;
  d2: any;
  d3: any;
  transporte = [
    { id: 1, name: 'Urbano' },
    { id: 2, name: 'Taxi' }
  ];
  origen = [
    { id: 1, name: 'Lima' },
    { id: 2, name: 'Callao' },
    // { id: 3, name: '3', disabled: true },
    { id: 4, name: 'ATE' },
    // { id: 5, name: '5' },
    // { id: 6, name: '6' },
    // { id: 7, name: '7' },
    // { id: 8, name: '8' }
  ];
  destino = [
    { id: 1, name: 'Lima' },
    { id: 2, name: 'Callao' },
    // { id: 3, name: '3', disabled: true },
    { id: 4, name: 'ATE' },
    // { id: 5, name: '5' },
    // { id: 6, name: '6' },
    // { id: 7, name: '7' },
    // { id: 8, name: '8' }
  ];

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
    this.myForm = this.formBuilder.group({
      fechaInic: [item.fechaInic || '', Validators.required],
      fechaFina: [item.fechaFina || '', Validators.required],
      numeViajes: [item.numeViajes || '', Validators.required],
      transporte: [item.transporte || null, Validators.required],
      origen: [item.origen || null, Validators.required],
      destino: [item.destino || null, Validators.required],
      motivo: [item.motivo || '', Validators.required],
      monto: [item.monto || '', Validators.required]
    });
  }

  submitForm() {
    this.activeModal.close(this.myForm.value);
  }

}
