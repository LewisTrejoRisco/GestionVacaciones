import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MovilidadComponent } from './solicitar/movilidad.component';
import { AprobarMovilidadComponent } from './aprobar/aprobar-movilidad.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'solicitar',
        component: MovilidadComponent,
        data: {
          title: 'Solicitar'
        }
      },
      {
        path: 'aprobar',
        component: AprobarMovilidadComponent,
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
export class MovilidadRoutingModule { }
