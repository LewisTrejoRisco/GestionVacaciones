import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SolicitarComponent } from './solicitar/solicitar.component';
import { AprobarComponent } from './aprobar/aprobar.component';
import { SolicitarVentaComponent } from './solicitar-venta/solicitar-venta.component';
import { SolicitarUsuarioComponent } from './solicitar-usuario/solicitar-usuario.component';
import { AprobarVentaComponent } from './aprobar-venta/aprobar-venta.component';
import { GenerarTxtComponent } from './generar-txt/generar-txt.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'solicitar',
        component: SolicitarComponent,
        data: {
          title: 'Solicitar'
        }
      },
      {
        path: 'aprobar',
        component: AprobarComponent,
        data: {
          title: 'Aprobar'
        }
      },
      {
        path: 'solicitarventa',
        component: SolicitarVentaComponent,
        data: {
          title: 'SolicitarVenta'
        }
      },
      {
        path: 'solicitarusuario',
        component: SolicitarUsuarioComponent,
        data: {
          title: 'SolicitarUsuario'
        }
      },
      {
        path: 'aprobarventa',
        component: AprobarVentaComponent,
        data: {
          title: 'AprobarVenta'
        }
      },
      {
        path: 'generar',
        component: GenerarTxtComponent,
        data: {
          title: 'generar'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VacacionesRoutingModule { }
