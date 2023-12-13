import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import {
  ColumnMode,
  DatatableComponent,
  SelectionType
} from '@swimlane/ngx-datatable';
import { DataVacation } from '../data/datavacation.data';
import { DataUserVacation } from '../data/datauservacation.data';
import { Trabajador } from './trabajador.model';
import { AprobarService } from './aprobar.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CancelarModalComponent } from '../cancelarModal/cancelar-modal.component';

@Component({
  selector: 'app-aprobar',
  templateUrl: './aprobar.component.html',
  styleUrls: ['./aprobar.component.scss', '../../../assets/sass/libs/datatables.scss'],
  providers: [AprobarService]

})
export class AprobarComponent implements OnInit {

  trabajador: Trabajador[] = [];
  public ColumnMode = ColumnMode;
  public userRows = DataUserVacation;
  public expanded: any = {};

  public solicitudesPendientes: any = [];
  public detalleSolicitudUsuario: any = null;

  constructor(private aprobarService: AprobarService, private modalService: NgbModal) {
    this.trabajador = aprobarService.trabajador;
  }

  ngOnInit(): void {
    this.listarSolicitudesPendientes();
    console.log(this.detalleSolicitudUsuario)
  }

  listarSolicitudesPendientes() {
    this.aprobarService.listarSolicitudesPendientes('E003620', '1', 1).subscribe(
      resp => {
        // this.listaHistorialSolicitudes = resp;
        console.log(resp);
        this.solicitudesPendientes = resp;
      }, 
      error => {
        console.log("error:", error.message)
      }
    )
  }

  detalleSolicitud(user: any) {
    this.detalleSolicitudUsuario = user;
    console.log(this.detalleSolicitudUsuario)
  }

  // @ViewChild('tableRowDetails') tableRowDetails: any;
  // public ColumnMode = ColumnMode;
  // row data
  // public rows = DataVacation;
  // public userRows = DataUserVacation;

  // public expanded: any = {};

  /**
   * rowDetailsToggleExpand
   *
   * @param row
   */
  // rowDetailsToggleExpand(row) {
  //   this.tableRowDetails.rowDetail.toggleExpandRow(row);
  // }

  modalShowCancelar(user: any) {
    console.log(user);
    const modalRef = this.modalService.open(CancelarModalComponent);
    modalRef.componentInstance.titulo = 'vacaciones'; // should be the id
    modalRef.componentInstance.data = { motivo: 'el motivo es' }; // should be the data

    modalRef.result.then((result) => {
      console.log(result)
      let objRechazar = {
        idsolicitud: user.idsolicitud,
        usuarioactualizacion: user.usuarioactual,
        motivorechazo: result.motivo
      }
      console.log(objRechazar);
      this.aprobarService.rechazarSolicitud(objRechazar).subscribe(
        resp => {
          console.log(resp)
          this.detalleSolicitudUsuario = null;
          this.listarSolicitudesPendientes();
        }, 
        error => {
          console.log("Error: " + error.message)
        }
      );
    }).catch((error) => {
      console.log(error);
    });
  }

  aprobarSolicitud(user: any) {
    console.log(user.idsolicitud)
    console.log(user.usuarioactual)
    let objAprobar = {
      idsolicitud: user.idsolicitud,
      usuarioactualizacion: user.usuarioactual
    }
    console.log(objAprobar);
    this.aprobarService.aprobarSolicitud(objAprobar).subscribe(
      resp => {
        console.log(resp)
        this.detalleSolicitudUsuario = null;
        this.listarSolicitudesPendientes();
      }, 
      error => {
        console.log("Error: " + error.message)
      }
    );
  }

}
