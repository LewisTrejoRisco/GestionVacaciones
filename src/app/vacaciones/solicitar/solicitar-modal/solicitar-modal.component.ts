import { Component, Output, EventEmitter, Input, OnInit, Injectable } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { SolicitarService } from 'app/shared/services/solicitar.service';
import * as hopscotch from 'hopscotch';
const now = new Date();

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
    SolicitarService
  ]
})
export class SolicitarModalComponent implements OnInit{

  @Input() id: number;
  @Input() data: {};
  myForm: UntypedFormGroup;
  d2: any;
  reglas: any;
  modelFecha: NgbDateStruct;
  dias = [
    // { id: 1, name: '7' },
    // { id: 2, name: '8' },
    // { id: 3, name: '9', disabled: true },
    // { id: 4, name: '15' },
    // { id: 5, name: '30' }
  ];

  constructor(public activeModal: NgbActiveModal,
    private solicitarService: SolicitarService,
    private formBuilder: UntypedFormBuilder) { }

  ngOnInit() {
    console.log(this.data)
    this.buildDays(this.data)
  }

  private buildDays(item) {
    if (item.codipers.length > 0) {
      this.solicitarService.reglasVacaciones(item.codipers).subscribe(
        resp => {
          console.log(resp);
          this.reglas = resp;
          if (this.reglas.p_ejercicio_vacacional != null) {
            this.dias = []
            var iMin = this.reglas.p_dias_minimo;
            var iMax = this.reglas.p_dias_maximo
            for ( var i = iMin; i <= iMax; i++) {
              let dia = {
                id : i,
                name : ""+i
              }
              this.dias.push(dia)
            }
            if (item.periodo == null) { 
              item.periodo = this.reglas.p_ejercicio_vacacional;
            }
            this.buildItemForm(item);
          }
        }, error => {
          console.log(error)
        }
      );
    }
  }

  private buildItemForm(item) {
    if(item.hasta != null) {
      item.hasta = this.dias.find(a => a.name == item.hasta);
    }
    if(item.fechaInic == null){
    //   if(item.periodo != null) {
        item.fechaInic = {year: now.getFullYear, month: now.getMonth() + 1, day: now.getDate()};
    //   }
    }
    this.myForm = this.formBuilder.group({
      fechaInic: [item.fechaInic || null, Validators.required],
      hasta: [item.hasta || null, Validators.required],
      descripcion: [item.descripcion || null, Validators.required],
      periodo: [item.periodo || null, Validators.required],
      reemplazo: [item.reemplazo || null, Validators.required]
    });
    // this.startTour();
  }

  submitForm() {
    this.activeModal.close(this.myForm.value);
  }

  startTour() {
    console.log('Ayuda');
    // Destroy running tour
    hopscotch.endTour(true);
    // Initialize new tour
    hopscotch.startTour(this.tourSteps());
  }

  tourSteps(): any {
    return {
      id: 'demo-tour',
      showPrevButton: true,
      steps: [

        {
          title: "Presionar",
          content: "este botón para elegir dias a empezar las vacaciones",
          target: "fechInicVaca",
          placement: "bottom",
          xOffset: -20,
          arrowOffset: 20
        },
        {
          title: "Busqueda",
          content: "Presionar para buscar los días a salir.",
          target: "hasta",
          placement: "bottom",
          xOffset: -270,
          arrowOffset: 260
        },
        {
          title: "Escribir",
          content: "Pequeña descripción de diás a vacacionar.",
          target: "descripcion",
          placement: "top",
          xOffset: -80,
          arrowOffset: 100
        }
      ]
    }
  }

  ngOnDestroy() {
    // Destroy running tour
    hopscotch.endTour(true);
  }

}
