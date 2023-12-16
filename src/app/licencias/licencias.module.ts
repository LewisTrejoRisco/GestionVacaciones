import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PermisosRoutingModule } from './licencias-routing.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PipeModule } from 'app/shared/pipes/pipe.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { SolicitarLicenciaComponent } from './solicitar/solicitar-licencia.component';
import { SolicitarLicenciaModalComponent } from './solicitar/solicitar-modal/solicitar-licencia-modal.component';
import { AprobarLicenciaComponent } from './aprobar/aprobar-licencia.component';


@NgModule({
  declarations: [SolicitarLicenciaComponent,
                 SolicitarLicenciaModalComponent,
                 AprobarLicenciaComponent
                ],
  imports: [
    CommonModule,
    PermisosRoutingModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    PipeModule,
    NgbModule,
    NgSelectModule,
    FormsModule
  ]
})
export class LicenciasModule { }
