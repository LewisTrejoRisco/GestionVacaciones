import { Component, Output, EventEmitter, Input, OnInit, Injectable, ChangeDetectorRef } from '@angular/core';
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
  public profileImage:any;
  modalPermFormSubmitted = false;

  constructor(
   public activeModal: NgbActiveModal,
   private formBuilder: UntypedFormBuilder,
   private changeDetector:ChangeDetectorRef
  ) {

  }

  ngOnInit() {
    this.buildItemForm(this.data);
  }
  
  imageUpload(event:any) {
    const files = event.target.files;
    this.procesarImagen(files, (base64: string) => {
      // Asignamos la cadena Base64 generada a imageDNIPost
      this.profileImage = base64;

      // Actualizamos la vista
      this.changeDetector.detectChanges();
    });

    // var file = event.target.files.length;
    // for(let i=0;i<file;i++)
    // {
    //    var reader = new FileReader();
    //    reader.onload = (event:any) => 
    //    {
          //  this.profileImage = event.target.result;
          //  this.changeDetector.detectChanges();
    //    }
    //    reader.readAsDataURL(event.target.files[i]);
    // }
  }
  
  // Función genérica para procesar la imagen
  procesarImagen(files: FileList, callback: (base64: string) => void) {
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const imagen = new Image();
        imagen.src = e.target.result;

        imagen.onload = () => {
          // Redimensionamos la imagen
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          // Definir el tamaño máximo
          const MAX_WIDTH = 700;
          const MAX_HEIGHT = 700;

          let width = imagen.width;
          let height = imagen.height;

          // Calculamos el nuevo tamaño de la imagen
          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round(height * MAX_WIDTH / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round(width * MAX_HEIGHT / height);
              height = MAX_HEIGHT;
            }
          }

          // Ajustamos el tamaño del canvas
          canvas.width = width;
          canvas.height = height;

          // Dibujamos la imagen redimensionada en el canvas
          ctx.drawImage(imagen, 0, 0, width, height);

          // Convertir la imagen redimensionada a Base64 (con compresión de calidad 0.7)
          const base64 = canvas.toDataURL('image/jpeg', 0.7); // Ajusta el valor de calidad según lo necesites

          // Llamamos al callback con el resultado
          callback(base64);
        };
      };

      reader.readAsDataURL(files[i]);
    }
  }

  get lf() {
    // //console.log(this.myForm.controls)
    return this.myForm.controls;
  }

  private buildItemForm(item) {
    //console.log(item)
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
      documento: [item.documento || null]
    });
    this.profileImage = this.myForm.value.documento;
  }

  submitForm() {
    this.modalPermFormSubmitted = true;
    if (this.myForm.invalid) {
      return;
    }
    this.myForm.value.documento = this.profileImage;
    this.activeModal.close(this.myForm.value);
  }

}
