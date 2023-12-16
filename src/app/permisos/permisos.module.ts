import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PermisosRoutingModule } from './permisos-routing.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PipeModule } from 'app/shared/pipes/pipe.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { SolicitarPermisoComponent } from './solicitar/solicitar-permiso.component';
import { SolicitarPermisoModalComponent } from './solicitar/solicitar-modal/solicitar-permiso-modal.component';
import { AprobarPermisoComponent } from './aprobar/aprobar-permiso.component';


@NgModule({
  declarations: [SolicitarPermisoComponent,
                 SolicitarPermisoModalComponent,
                 AprobarPermisoComponent],
  imports: [
    CommonModule,
    PermisosRoutingModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    PipeModule,
    NgbModule,
    NgSelectModule,
    FormsModule,
  ]
})
export class PermisosModule { }
