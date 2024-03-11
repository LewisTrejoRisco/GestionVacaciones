import { Component, Output, EventEmitter, Input, OnInit, Injectable, ChangeDetectorRef } from '@angular/core';
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
  selector: 'app-solicitar-licencia-modal',
  templateUrl: './solicitar-licencia-modal.component.html',
  styleUrls: ['./solicitar-licencia-modal.component.scss'],
  providers: [
    {
      provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter
    },
  ]
})
export class SolicitarLicenciaModalComponent implements OnInit{

  type = 'Marketing';
  @Input() id: number;
  @Input() data: {};
  myForm: UntypedFormGroup;
  d2: any;
  public profileImage:any;
  dias = [
    { id: 1, name: '1' },
    { id: 2, name: '2' },
    { id: 3, name: '3' },
    { id: 4, name: '4' },
    { id: 5, name: '5' },
    { id: 6, name: '6' },
    { id: 7, name: '7' },
    { id: 8, name: '8' },
    { id: 9, name: '9' },
    { id: 10, name: '10' },
    { id: 11, name: '11' }
  ];
  modalLiceFormSubmitted = false;

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
    var file = event.target.files.length;
    for(let i=0;i<file;i++)
    {
       var reader = new FileReader();
       reader.onload = (event:any) => 
       {
           this.profileImage = event.target.result;
           this.changeDetector.detectChanges();
       }
       reader.readAsDataURL(event.target.files[i]);
    }
  }

  get lf() {
    // //console.log(this.myForm.controls)
    return this.myForm.controls;
  }

  private buildItemForm(item) {
    if(item.hasta != null) {
      item.hasta = this.dias.find(a => a.name == item.hasta);
    }
    this.myForm = this.formBuilder.group({
      fechaInic: [item.fechaInic || null, Validators.required],
      hasta: [item.hasta || null, Validators.required],
      descripcion: [item.descripcion || null, Validators.required],
      documento: [item.documento || null]
    });
    this.profileImage = this.myForm.value.documento;
  }

  submitForm() {
    this.modalLiceFormSubmitted = true;
    if (this.myForm.invalid) {
      return;
    }
    this.myForm.value.documento = this.profileImage;
    this.activeModal.close(this.myForm.value);
  }

}
