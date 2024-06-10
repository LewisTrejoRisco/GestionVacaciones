import { Component, Output, EventEmitter, Input, OnInit, Injectable, ChangeDetectorRef } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'app/shared/auth/auth.service';
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
  sesion: any;
  reglas: any;
  modelFecha: NgbDateStruct;
  dias = [
  ];
  fechaMayor: boolean = false;
  modalVacaFormSubmitted = false;
  numberOfWeek: boolean = false;
  tcodipers: string;
  colision: boolean = false;
  colissionNumber: any= 0;

  constructor(public activeModal: NgbActiveModal,
    private solicitarService: SolicitarService,
    private authService: AuthService,
    private formBuilder: UntypedFormBuilder) { }

  ngOnInit() {
    // //console.log(this.data)
    this.sesion = JSON.parse(this.authService.userSesion);
    this.buildDays(this.data)
  }

  get lf() {
    return this.myForm.controls;
  }

  private buildDays(item) {
    if (item.codipers.length > 0) {
      this.tcodipers = item.codipers;
      this.solicitarService.reglasVacaciones(this.tcodipers).subscribe(
        resp => {
//console.log(resp);
          this.reglas = resp;
          if (this.reglas.p_ejercicio_vacacional != null) {
            this.dias = []
            var iMin = this.reglas.p_dias_minimo;
            var iMax = this.sesion.p_diastota
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
        item.fechaInic = {year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate()};
    //   }
    }
    this.myForm = this.formBuilder.group({
      fechaInic: [item.fechaInic || null, Validators.required],
      hasta: [item.hasta || null, Validators.required],
      descripcion: [item.descripcion || null],
      periodo: [item.periodo || null, Validators.required],
      reemplazo: [item.reemplazo || null]
    });
    // this.startTour();
  }

  submitForm() {
    this.colision = false;
    this.fechaMayor = false;
    this.numberOfWeek = false;
    this.modalVacaFormSubmitted = true;
    if (this.myForm.invalid) {
      return;
    }
    if(this.reglas.p_fecha_inicio_minimo == null) {
      return;
    }
    this.solicitarService.colisionVacaciones(this.tcodipers, 
                            this.myForm.value.fechaInic.day+"/"+(this.myForm.value.fechaInic.month)+"/"+this.myForm.value.fechaInic.year, 
                            this.myForm.value.hasta.id).subscribe(
      resp => {
                this.colissionNumber = resp;
                if (this.colissionNumber > 0) {
                  this.colision = true;
                  return;
                }
                const anioBack: number =  Number(this.reglas.p_fecha_inicio_minimo.split('/')[2]);
                const anioFront: number = this.myForm.value.fechaInic.year;
                const montBack: number =  Number(this.reglas.p_fecha_inicio_minimo.split('/')[1]);
                const montFront: number = this.myForm.value.fechaInic.month;
                const dayBack: number =  Number(this.reglas.p_fecha_inicio_minimo.split('/')[0]);
                const dayFront: number = this.myForm.value.fechaInic.day;
                if( anioBack > anioFront) {
                  this.fechaMayor = true;
                  return;
                }
                if( montBack > montFront && anioBack == anioFront) {
                  this.fechaMayor = true; 
                  return;
                }
                if( dayBack > dayFront && montBack == montFront && anioBack == anioFront) {
                  this.fechaMayor = true;
                  return;
                }
                if(this.reglas.p_incluir_fin_semana == 1){
                  const startDate  = new Date(this.myForm.value.fechaInic.year, this.myForm.value.fechaInic.month - 1, this.myForm.value.fechaInic.day)
                  const numberOfDays = this.myForm.value.hasta.id;
                  // Iterar sobre las fechas
                  var numberOfWeekend: number = 0;
                  for (let i = 0; i < numberOfDays; i++) {
                    // Crear una nueva fecha sumando 'i' días a la fecha inicial
                    const currentDate = new Date(startDate.getTime());
                    currentDate.setDate(startDate.getDate() + i);

                    // Mostrar la fecha actual en la consola o realizar cualquier otra operación que necesites
                    // //console.log('Fecha', i + 1, ':', currentDate.getDay());
                    // 6 = sabado
                    // 0 = domingo
                    if (currentDate.getDay() == 6 || currentDate.getDay() == 0){
                      numberOfWeekend = numberOfWeekend + 1;
                    }
                  }
                  // //console.log(numberOfWeekend)
                  if (numberOfWeekend < 2) {
                    this.numberOfWeek = true;
                    return;
                  }
                }
                this.activeModal.close(this.myForm.value);
      }, error => {
        console.log(error)
      }
    );
  }

  PadLeftCeros(value: string, length: number) {
    return (value.toString().length < length) ? this.PadLeftCeros("0"+value, length) : value;
  }

  startTour() {
    //console.log('Ayuda');
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
