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
  selectedOption: boolean;
  meridian = true; 
  spinners = false;
  dynamicControls = [];
  // dynamicControlsD = [];

  constructor(
   public activeModal: NgbActiveModal,
   private formBuilder: UntypedFormBuilder,
   private solicitarService: SolicitarService
  ) {

  }

  ngOnInit() {
    // this.solicitarService.listarDistrito().subscribe(
    //   resp => {
      this.selectedOption = false; 
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

  private buildItemForm(item: any) {
    // debugger;
    if(item.transporte != null) {
      item.transporte = this.transporte.find(a => a.id == item.transporte);
    }
    if(item.origen != null) {
      item.origen = this.origen.find(a => a.id_distrito == item.origen);
    }
    if(item.destino != null) {
      item.destino = this.destino.find(a => a.id_distrito == item.destino);
    }
    if(item.idTiempo != null) {
      // if(item.idTiempo == 'D') {
        this.createForm(item);
        this.addDynamicControls(item.idTiempo);
        this.setValueDinamicControl(item);
        this.selectedOption = true;
      // } else {
      //   this.createForm(item);
      //   this.addDynamicControls();
      //   this.setValueDinamicControl(item);
      //   this.selectedOption = true;
      // }
    } else {
      this.createForm(item);
    }
    
    // this.startTour();
  }

  createForm(item: any) {
    this.myForm = this.formBuilder.group({
      fecha: [item.fecha || null, Validators.required],
      numeViajes: [item.numeViajes || null, Validators.required],
      transporte: [item.transporte || null, Validators.required],
      origen: [item.origen || null, Validators.required],
      destino: [item.destino || null, Validators.required],
      motivo: [item.motivo || null, Validators.required],
      idTiempo: [item.idTiempo || null, Validators.required]
    });
  }

  setValueDinamicControl(item: any): void {
    // console.log(this.dynamicControls.length)
    // this.dynamicControls.forEach((controlName, index) => {
    //   console.log(`Control ${index}: ${controlName}`);
    // });
    for(var i = 0; i < item.listDinamic.length; i++) {
      // let controlName;
      switch (i) {
        case 0:
          // controlName = 'fechaInic';
          this.patchValue('fechaInic', item.listDinamic[i].tfechinicio)
          this.patchValue('fechaFina', item.listDinamic[i].tfechfina)
          this.patchValue('monto', item.listDinamic[i].tmonto)
          break;
        case 1:
          // controlName = 'fechaInic1';
          this.patchValue('fechaInic1', item.listDinamic[i].tfechinicio)
          this.patchValue('fechaFina1', item.listDinamic[i].tfechfina)
          this.patchValue('monto1', item.listDinamic[i].tmonto)
          break;
        case 2:
          // controlName = 'fechaInic2';
          this.patchValue('fechaInic2', item.listDinamic[i].tfechinicio)
          this.patchValue('fechaFina2', item.listDinamic[i].tfechfina)
          this.patchValue('monto2', item.listDinamic[i].tmonto)
          break;
        case 3:
          // controlName = 'fechaInic3';
          this.patchValue('fechaInic3', item.listDinamic[i].tfechinicio)
          this.patchValue('fechaFina3', item.listDinamic[i].tfechfina)
          this.patchValue('monto3', item.listDinamic[i].tmonto)
          break;
        case 4:
          // controlName = 'fechaInic4';
          this.patchValue('fechaInic4', item.listDinamic[i].tfechinicio)
          this.patchValue('fechaFina4', item.listDinamic[i].tfechfina)
          this.patchValue('monto4', item.listDinamic[i].tmonto)
          break;
        case 5:
          // controlName = 'fechaInic5';
          this.patchValue('fechaInic5', item.listDinamic[i].tfechinicio)
          this.patchValue('fechaFina5', item.listDinamic[i].tfechfina)
          this.patchValue('monto5', item.listDinamic[i].tmonto)
          break;
        case 6:
          // controlName = 'fechaInic6';
          this.patchValue('fechaInic6', item.listDinamic[i].tfechinicio)
          this.patchValue('fechaFina6', item.listDinamic[i].tfechfina)
          this.patchValue('monto6', item.listDinamic[i].tmonto)
          break;
        default:
          // controlName = ''; // Manejar un caso por defecto si es necesario
      }
    }
  }

  patchValue(controlName: string, value: any): void{
    if (controlName) {
      const campoEjemploControl = this.myForm.get(controlName);
      if (campoEjemploControl) {
          campoEjemploControl.patchValue(value);
      }
    }
  }

  onDateChange(): void {
    if (this.myForm.value.idTiempo != null && this.myForm.value.fecha!= null) {
      this.selectedOption = true;
      if(this.myForm.value.idTiempo == 'S') {
        this.clearDynamicControls();
        this.addDynamicControls(this.myForm.value.idTiempo);
        this.myForm.patchValue({
          numeViajes: 1
        });
        const startDate  = new Date(this.myForm.value.fecha.year, this.myForm.value.fecha.month - 1, this.myForm.value.fecha.day)
        for(var i = 1; i <= 7; i++) {
          const firstDayOfWeek = this.getDayOfWeek(startDate, i);
          let controlName;
          switch (i) {
            case 1:
              controlName = 'fechaInic';
              break;
            case 2:
              controlName = 'fechaInic1';
              break;
            case 3:
              controlName = 'fechaInic2';
              break;
            case 4:
              controlName = 'fechaInic3';
              break;
            case 5:
              controlName = 'fechaInic4';
              break;
            case 6:
              controlName = 'fechaInic5';
              break;
            case 7:
              controlName = 'fechaInic6';
              break;
            default:
              controlName = ''; // Manejar un caso por defecto si es necesario
          }
          if (controlName) {
            const campoEjemploControl = this.myForm.get(controlName);
            if (campoEjemploControl) {
                campoEjemploControl.patchValue(this.formatDate(firstDayOfWeek));
            }
          }
        }
      } else {
        this.clearDynamicControls();
        this.addDynamicControls(this.myForm.value.idTiempo);
        this.myForm.patchValue({
          fechaInic: this.myForm.value.fecha || null,
          numeViajes: 1
        });
      }
    }
    // console.log(this.dynamicControls.length)
    // this.dynamicControls.forEach(controlName => {
    //   console.log(controlName)
    // });
  }
  
  getFirstDayOfWeek(date: Date): Date {
    // Obtiene el día de la semana de la fecha proporcionada
    const dayOfWeek = date.getDay();
    
    // Calcula cuántos días se debe restar para obtener el primer día de la semana (domingo)
    const daysToSubtract = (dayOfWeek === 0) ? 6 : dayOfWeek - 1;

    // Clona la fecha y ajusta para obtener el primer día de la semana
    const firstDayOfWeek = new Date(date);
    firstDayOfWeek.setDate(date.getDate() - daysToSubtract);

    return firstDayOfWeek;
  }

  getDayOfWeek(date: Date, desiredDayOfWeek: number): Date {
    // Obtiene el día de la semana de la fecha proporcionada
    const dayOfWeek = date.getDay();
    
    // Calcula cuántos días se debe restar o sumar para obtener el día de la semana deseado
    const difference = desiredDayOfWeek - dayOfWeek;
    
    // Clona la fecha y ajusta para obtener el día de la semana deseado
    const desiredDate = new Date(date);
    desiredDate.setDate(date.getDate() + difference);

    return desiredDate;
  }

  addDynamicControls(tiempo: string): void {
    if(tiempo == 'D') {
      this.dynamicControls = ['fechaInic', 'fechaFina', 'monto'];
    } else {
      this.dynamicControls = ['fechaInic', 'fechaFina', 'monto', 'fechaInic1','fechaFina1','monto1','fechaInic2','fechaFina2','monto2','fechaInic3','fechaFina3','monto3','fechaInic4','fechaFina4','monto4','fechaInic5','fechaFina5','monto5','fechaInic6','fechaFina6','monto6'];
    }
    this.dynamicControls.forEach(controlName => {
      this.myForm.addControl(controlName, new FormControl(null)); // Agregar un nuevo formControl al FormGroup
    });
  }

  // addDynamicControlsD(): void {
  //   this.dynamicControlsD = ['fechaInic', 'fechaFina', 'monto'];
  //   this.dynamicControlsD.forEach(controlName => {
  //     this.myForm.addControl(controlName, new FormControl(null, Validators.required)); // Agregar un nuevo formControl al FormGroup
  //   });
  // }
  
  clearDynamicControls(): void {
    this.dynamicControls = ['fechaInic', 'fechaFina', 'monto', 'fechaInic1','fechaFina1','monto1','fechaInic2','fechaFina2','monto2','fechaInic3','fechaFina3','monto3','fechaInic4','fechaFina4','monto4','fechaInic5','fechaFina5','monto5','fechaInic6','fechaFina6','monto6'];
    // Itera sobre los nombres de los controles dinámicos y elimina cada control del formulario
    this.dynamicControls.forEach(controlName => {
      this.myForm.removeControl(controlName);
    });
    // Vacía el array dynamicControls
    this.dynamicControls = [];
  }
  
  // clearDynamicControlsD(): void {
  //   this.dynamicControlsD = ['fechaInic1','fechaFina1','monto1','fechaInic2','fechaFina2','monto2','fechaInic3','fechaFina3','monto3','fechaInic4','fechaFina4','monto4','fechaInic5','fechaFina5','monto5','fechaInic6','fechaFina6','monto6'];
  //   // Itera sobre los nombres de los controles dinámicos y elimina cada control del formulario
  //   this.dynamicControlsD.forEach(controlName => {
  //     this.myForm.removeControl(controlName);
  //   });
  //   // Vacía el array dynamicControls
  //   this.dynamicControlsD = [];
  // }

  formatDate(date: Date): any {
    // Obtiene el día, mes y año de la fecha
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    // Formatea la fecha en el formato deseado (por ejemplo, "dd/mm/yyyy")
    // const formattedDate = `${this.padNumber(day)}/${this.padNumber(month)}/${year}`;

    var fecha = {
      "year": year,
      "month": month,
      "day": day
    }
    return fecha;
  }

  padNumber(num: number): string {
    // Añade un cero delante si el número es menor que 10
    return (num < 10) ? `0${num}` : `${num}`;
  }

  submitForm() {
    this.modalFormSubmitted = true;
    if (this.myForm.invalid) {
      return;
    }
    this.activeModal.close(this.myForm.value);
  }


}
