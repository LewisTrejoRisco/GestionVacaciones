import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SolicitarLicenciaComponent } from './solicitar/solicitar-licencia.component';
import { AprobarLicenciaComponent } from './aprobar/aprobar-licencia.component';
const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'solicitar',
        component: SolicitarLicenciaComponent,
        data: {
          title: 'Solicitar'
        }
      },
      {
        path: 'aprobar',
        component: AprobarLicenciaComponent,
        data: {
          title: 'Aprobar'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PermisosRoutingModule { }
