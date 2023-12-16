import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { VacacionesRoutingModule } from './vacaciones-routing.module';
import { SolicitarComponent } from './solicitar/solicitar.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PipeModule } from 'app/shared/pipes/pipe.module';
import { AprobarComponent } from './aprobar/aprobar.component';
import { SolicitarModalComponent } from './solicitar/solicitar-modal/solicitar-modal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { CancelarModalComponent } from './cancelarModal/cancelar-modal.component';
import { SolicitarVentaComponent } from './solicitar-venta/solicitar-venta.component';
import { SolicitarUsuarioComponent } from './solicitar-usuario/solicitar-usuario.component';
import { AprobarVentaComponent } from './aprobar-venta/aprobar-venta.component';
import { SolicitarVentaModalComponent } from './solicitar-venta/solicitar-venta-modal/solicitar-venta-modal.component';


@NgModule({
  declarations: [SolicitarComponent, 
                 SolicitarUsuarioComponent,
                 SolicitarVentaComponent, 
                 SolicitarModalComponent, 
                 SolicitarVentaModalComponent,
                 AprobarComponent, 
                 AprobarVentaComponent, 
                 CancelarModalComponent],
  imports: [
    CommonModule,
    VacacionesRoutingModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    PipeModule,
    NgbModule,
    NgSelectModule,
    FormsModule
  ]
})
export class VacacionesModule { }
