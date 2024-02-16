import { Component, Output, EventEmitter, Input, OnInit, Injectable } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { SolicitarService } from 'app/shared/services/solicitar.service';

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
  selector: 'app-generar-modal',
  templateUrl: './generar-modal.component.html',
  styleUrls: ['./generar-modal.component.scss'],
  providers: [
    {
      provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter
    },
    SolicitarService
  ]
})
export class GenerarModalComponent implements OnInit{

  @Input() data: {};
  myForm: UntypedFormGroup;
  d2: any;
  d3: any;
  tiempo = [
    { id: 1, name: 'Semana' },
    { id: 2, name: 'Mes' }
  ];

  constructor(
   public activeModal: NgbActiveModal,
   private formBuilder: UntypedFormBuilder,
   private solicitarService: SolicitarService
  ) {

  }

  ngOnInit() {
    this.buildItemForm(this.data);
    // this.solicitarService.listarDistrito().subscribe(
    //   resp => {
    //     this.origen = resp;
    //     this.destino = resp;
    //     this.buildItemForm(this.data);
    //   }, 
    //   error => {
    //     console.log("error:", error.message)
    //   }
    // )
  }

  private buildItemForm(item) {
    this.myForm = this.formBuilder.group({
      fechaInic: [item.fechaInic || null, Validators.required],
      tiempo: [item.tiempo || null, Validators.required],
      tipoCambio: [item.tipoCambio || null, Validators.required]
    });
  }

  submitForm() {
    this.activeModal.close(this.myForm.value);
  }


}
