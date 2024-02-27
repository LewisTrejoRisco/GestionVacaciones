import { Component, Output, EventEmitter, Input, OnInit, Injectable } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { SolicitarService } from 'app/shared/services/solicitar.service';

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
  selector: 'app-movilidad-modal',
  templateUrl: './movilidad-modal.component.html',
  styleUrls: ['./movilidad-modal.component.scss'],
  providers: [
    {
      provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter
    },
    SolicitarService
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
    { id: 'U', name: 'Urbano' },
    { id: 'T', name: 'Taxi' }
  ];
  origen: any = null;
  destino: any = null;
  modalFormSubmitted = false;

  constructor(
   public activeModal: NgbActiveModal,
   private formBuilder: UntypedFormBuilder,
   private solicitarService: SolicitarService
  ) {

  }

  ngOnInit() {
    // this.solicitarService.listarDistrito().subscribe(
    //   resp => {
        this.origen = dataDistrito;
        this.destino = dataDistrito;
        this.buildItemForm(this.data);
    //   }, 
    //   error => {
    //     console.log("error:", error.message)
    //   }
    // )
  }

  get lf() {
    return this.myForm.controls;
  }

  private buildItemForm(item) {
    if(item.transporte != null) {
      item.transporte = this.transporte.find(a => a.id == item.transporte);
    }
    if(item.origen != null) {
      item.origen = this.origen.find(a => a.id_distrito == item.origen);
    }
    if(item.destino != null) {
      item.destino = this.destino.find(a => a.id_distrito == item.destino);
    }
    this.myForm = this.formBuilder.group({
      fechaInic: [item.fechaInic || null, Validators.required],
      fechaFina: [item.fechaFina || null, Validators.required],
      numeViajes: [item.numeViajes || null, Validators.required],
      transporte: [item.transporte || null, Validators.required],
      origen: [item.origen || null, Validators.required],
      destino: [item.destino || null, Validators.required],
      motivo: [item.motivo || null, Validators.required],
      monto: [item.monto || null, Validators.required]
    });
    // this.startTour();
  }

  submitForm() {
    this.modalFormSubmitted = true;
    if (this.myForm.invalid) {
      return;
    }
    this.activeModal.close(this.myForm.value);
  }


}
