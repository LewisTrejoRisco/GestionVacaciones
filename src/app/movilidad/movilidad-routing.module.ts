import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MovilidadComponent } from './solicitar/movilidad.component';
import { AprobarMovilidadComponent } from './aprobar/aprobar-movilidad.component';
import { GenerarTxtComponent } from './generar-txt/generar-txt.component';
import { SalidaBusComponent } from './salida-buses/salida-bus.component';

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
      },
      {
        path: 'generar',
        component: GenerarTxtComponent,
        data: {
          title: 'Generar TXT'
        }
      },
      {
        path: 'salidaBus',
        component: SalidaBusComponent,
        data: {
          title: 'Salida Bus'
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
