import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PipeModule } from 'app/shared/pipes/pipe.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { MovilidadRoutingModule } from './movilidad-routing.module';
import { MovilidadComponent } from './solicitar/movilidad.component';
import { MovilidadModalComponent } from './solicitar/solicitar-modal/movilidad-modal.component';
import { AprobarMovilidadComponent } from './aprobar/aprobar-movilidad.component';


@NgModule({
  declarations: [MovilidadComponent,
                 MovilidadModalComponent,
                 AprobarMovilidadComponent],
  imports: [
    CommonModule,
    MovilidadRoutingModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    PipeModule,
    NgbModule,
    NgSelectModule,
    FormsModule
  ]
})
export class MovilidadModule { }
