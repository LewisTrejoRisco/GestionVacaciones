import { Component, Output, EventEmitter, Input, OnInit, Injectable } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'app/shared/auth/auth.service';
import { SolicitarService } from 'app/shared/services/solicitar.service';


@Component({
  selector: 'app-solicitar-venta-modal',
  templateUrl: './solicitar-venta-modal.component.html',
  styleUrls: ['./solicitar-venta-modal.component.scss'],
  providers: [
    SolicitarService
  ]
})
export class SolicitarVentaModalComponent implements OnInit{

  @Input() id: number;
  @Input() data: {};
  myForm: UntypedFormGroup;
  d2: any;
  reglas: any;
  diasASalir = [
  ];
  modalFormSubmitted = false;
  tcodipers: string;
  sesion: any;
  fechaMayor: boolean = false;

  constructor(
   public activeModal: NgbActiveModal,
   private solicitarService: SolicitarService,
   private authService: AuthService,
   private formBuilder: UntypedFormBuilder
  ) {

  }

  ngOnInit() {
    this.sesion = JSON.parse(this.authService.userSesion);
    this.buildDays(this.data);
  }

  get lf() {
    // //console.log(this.myForm.controls)
    return this.myForm.controls;
  }

  // private listDiasASalir() {
  //   this.diasASalir;
  //   for(let i = 1; i<16; i++) {
  //     let dia = {
  //       id: i, 
  //       name: '' + i
  //     }
  //     this.diasASalir.push(dia);
  //   }
  // }

  private buildDays(item) {
    // console.log(item)
    // this.listDiasASalir();
    if (item.codipers.length > 0) {
      this.tcodipers = item.codipers;
      this.solicitarService.reglasVacaciones(this.tcodipers).subscribe(
        resp => {
          // console.log(resp);
          // console.log(this.sesion);
          this.reglas = resp;
          if (this.reglas.p_ejercicio_vacacional != null) {
            this.diasASalir = []
            var iMin = this.reglas.p_dias_minimo;
            var iMax = this.sesion.p_diastota >= 15 ? 15 : this.sesion.p_diastota
            for ( var i = iMin; i <= iMax; i++) {
              let dia = {
                id : i,
                name : ""+i
              }
              this.diasASalir.push(dia)
            }
            // if (item.periodo == null) { 
            //   item.periodo = this.reglas.p_ejercicio_vacacional;
            // }
            this.buildItemForm(item);
          }
        }, error => {
          console.log(error)
        }
      );
    }
  }

  private buildItemForm(item) {
    // if(item.hasta != null) {
    //   item.hasta = this.diasASalir.find(a => a.name == item.hasta);
    // }
    this.myForm = this.formBuilder.group({
      hasta: [item.hasta || null, Validators.required],
      periodo: [this.reglas.p_ejercicio_vacacional || null],
    });
  }

  submitForm() {    
    this.fechaMayor = false;
    this.modalFormSubmitted = true;
    if (this.myForm.invalid) {
      return;
    }
    // // if(this.reglas.p_fecha_inicio_minimo == null) {
    // //   return;
    // // }
    // // const anioBack: number =  Number(this.reglas.p_fecha_inicio_minimo.split('/')[2]);
    // // const anioFront: number = this.myForm.value.fechaInic.year;
    // // const montBack: number =  Number(this.reglas.p_fecha_inicio_minimo.split('/')[1]);
    // // const montFront: number = this.myForm.value.fechaInic.month;
    // // const dayBack: number =  Number(this.reglas.p_fecha_inicio_minimo.split('/')[0]);
    // // const dayFront: number = this.myForm.value.fechaInic.day;
    // // if( anioBack > anioFront) {
    // //   this.fechaMayor = true;
    // //   return;
    // // }
    // // if( montBack > montFront && anioBack == anioFront) {
    // //   this.fechaMayor = true; 
    // //   return;
    // // }
    // // if( dayBack > dayFront && montBack == montFront && anioBack == anioFront) {
    // //   this.fechaMayor = true;
    // //   return;
    // // }
    this.activeModal.close(this.myForm.value);
  }

}
