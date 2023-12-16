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
  selector: 'app-solicitar-modal',
  templateUrl: './solicitar-modal.component.html',
  styleUrls: ['./solicitar-modal.component.scss'],
  providers: [
    {
      provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter
    },
  ]
})
export class SolicitarModalComponent implements OnInit{

  @Input() id: number;
  @Input() data: {};
  myForm: UntypedFormGroup;
  d2: any;
  dias = [
    { id: 1, name: '7' },
    { id: 2, name: '8' },
    { id: 3, name: '9', disabled: true },
    { id: 4, name: '15' },
    { id: 5, name: '30' }
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
    if(item.hasta != null) {
      item.hasta = this.dias.find(a => a.name == item.hasta);
    }
    this.myForm = this.formBuilder.group({
      fechaInic: [item.fechaInic || null, Validators.required],
      hasta: [item.hasta || null, Validators.required],
      descripcion: [item.descripcion || null, Validators.required],
    });
  }

  submitForm() {
    this.activeModal.close(this.myForm.value);
  }

}
