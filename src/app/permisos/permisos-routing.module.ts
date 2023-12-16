import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SolicitarPermisoComponent } from './solicitar/solicitar-permiso.component';
import { AprobarPermisoComponent } from './aprobar/aprobar-permiso.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'solicitar',
        component: SolicitarPermisoComponent,
        data: {
          title: 'Solicitar'
        }
      },
      {
        path: 'aprobar',
        component: AprobarPermisoComponent,
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
