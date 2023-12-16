import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import {
  ColumnMode
} from '@swimlane/ngx-datatable';
import { DataUserVacation } from '../data/datauservacation.data';
import { Trabajador } from './trabajador.model';
import { SolicitarService } from 'app/shared/services/solicitar.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CancelarModalComponent } from '../cancelarModal/cancelar-modal.component';
import { AuthService } from 'app/shared/auth/auth.service';

@Component({
  selector: 'app-aprobar',
  templateUrl: './aprobar.component.html',
  styleUrls: ['./aprobar.component.scss', '../../../assets/sass/libs/datatables.scss'],
  providers: [SolicitarService]

})
export class AprobarComponent implements OnInit {

  public ColumnMode = ColumnMode;
  public userRows = DataUserVacation;
  public expanded: any = {};


  //NUEVO
  sesion: any;
  trabajador: Trabajador = null;
  public solicitudesPendientes: any = [];
  public detalleSolicitudUsuario: any = null;
  objVacaUsua: any;

  constructor(private aprobarService: SolicitarService, private modalService: NgbModal,
    private authService: AuthService) {
  }

  ngOnInit(): void {
    this.sesion = JSON.parse(this.authService.userToken);
    this.listarSolicitudesPendientes();
    console.log(this.detalleSolicitudUsuario)
  }

  listarSolicitudesPendientes() {
    this.aprobarService.listarSolicitudesPendientes(this.sesion.p_codipers, '1', 1).subscribe(
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
    this.aprobarService.listarDetalleUsuario(this.detalleSolicitudUsuario.tsolicitudId).subscribe(
      resp => {
        console.log(resp)
        this.objVacaUsua = resp;
        this.trabajador = {
          tsolicitudId: this.detalleSolicitudUsuario.tsolicitudId,
          tusuasoli: this.detalleSolicitudUsuario.tusuasoli,
          tfoto: this.detalleSolicitudUsuario.tfoto,
          tdescusuasoli: this.detalleSolicitudUsuario.tdescusuasoli,
          periodo: this.detalleSolicitudUsuario.periodo,
          tcantidaddias: this.objVacaUsua.tcantidaddias,
          tusuaaprob: this.detalleSolicitudUsuario.tusuaaprob,
          tdescunidfuncsoli: this.detalleSolicitudUsuario.tdescunidfuncsoli,
          tfechingrsoli: this.detalleSolicitudUsuario.tfechingrsoli,
          tdescripcion: this.objVacaUsua.tdescripcion,
          tperiodo: this.objVacaUsua.tperiodo,
          tfechregi: this.detalleSolicitudUsuario.tfechregi
        };
      },
      error => {
        console.log("error detalle de solicitud:", error.message)
      }
    )
  }

  modalShowCancelar(user: any) {
    console.log(user);
    const modalRef = this.modalService.open(CancelarModalComponent);
    modalRef.componentInstance.titulo = 'vacaciones'; // should be the id
    modalRef.componentInstance.data = { motivo: 'el motivo es' }; // should be the data

    modalRef.result.then((result) => {
      console.log(result)
      let objRechazar = {
        idsolicitud: user.tsolicitudId,
        usuarioactualizacion: this.sesion.p_codipers,
        motivorechazo: result.motivo
      }
      console.log(objRechazar);
      this.aprobarService.rechazarSolicitud(objRechazar).subscribe(
        resp => {
          console.log(resp)
          this.trabajador = null;
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
    console.log(user.tsolicitudId)
    console.log(user.tusuasoli)
    let objAprobar = {
      idsolicitud: user.tsolicitudId,
      usuarioactualizacion: this.sesion.p_codipers
    }
    console.log(objAprobar);
    this.aprobarService.aprobarSolicitud(objAprobar).subscribe(
      resp => {
        console.log(resp)
        this.trabajador = null;
        this.listarSolicitudesPendientes();
      }, 
      error => {
        console.log("Error: " + error.message)
      }
    );
  }

}
