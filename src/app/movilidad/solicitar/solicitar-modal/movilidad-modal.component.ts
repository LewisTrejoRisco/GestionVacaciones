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
    { id: 1, name: 'Urbano' },
    { id: 2, name: 'Taxi' }
  ];
  origen: any = null;
  destino: any = null;

  constructor(
   public activeModal: NgbActiveModal,
   private formBuilder: UntypedFormBuilder,
   private solicitarService: SolicitarService
  ) {

  }

  ngOnInit() {
    this.solicitarService.listarDistrito().subscribe(
      resp => {
        this.origen = resp;
        this.destino = resp;
        this.buildItemForm(this.data);
      }, 
      error => {
        console.log("error:", error.message)
      }
    )
  }

  private buildItemForm(item) {
    console.log(this.origen)
    if(item.transporte != null) {
      item.transporte = this.transporte.find(a => a.name == item.transporte);
    }
    if(item.origen != null) {
      item.origen = this.origen.find(a => a.descripcion_distrito == item.origen);
    }
    if(item.destino != null) {
      item.destino = this.destino.find(a => a.descripcion_distrito == item.destino);
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
  }

  submitForm() {
    this.activeModal.close(this.myForm.value);
  }

}
