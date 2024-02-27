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
import Swal from 'sweetalert2';
import { User } from './user.model';
import { ReportAdapter } from 'app/shared/utilitarios/ReportAdapter.class';
import { Reporte } from 'app/shared/utilitarios/reporte.model';

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
  public solicitudesAprobadas: any = [];
  public detalleSolicitudUsuario: any = null;
  objVacaUsua: any;
  solicitudPendiente: User = null;
  public listReporte: Array<Reporte> = [];

  constructor(private aprobarService: SolicitarService, private modalService: NgbModal,
    private authService: AuthService) {
  }

  ngOnInit(): void {
    this.sesion = JSON.parse(this.authService.userToken);
    this.listarSolicitudesAprobadas() ;
    this.listarSolicitudesPendientes();
  }

  listarSolicitudesPendientes() {
    this.aprobarService.listarSolicitudesPendientes(this.sesion.p_codipers, 1, 1).subscribe(
      resp => {
        // this.listaHistorialSolicitudes = resp;
        console.log(resp);
        this.solicitudesPendientes = resp;
      }, 
      error => {
        console.log("error:", error.message)
        Swal.fire(
          'Error',
          'error al mostrar solicitudes pendientes:'+ error.message,
          'error'
        );
      }
    )
  }

  listarSolicitudesAprobadas() {
    this.aprobarService.listarSolicitudesAprobadas(this.sesion.p_codipers, 1).subscribe(
      resp => {
        console.log(resp);
        this.solicitudesAprobadas = resp;
      }, 
      error => {
        console.log("error:", error.message)
        Swal.fire(
          'Error',
          'error al mostrar solicitudes aprobadas:'+ error.message,
          'error'
        );
      }
    )
  }

  detalleSolicitud(user: any) {
    this.detalleSolicitudUsuario = user;
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
          tdescpues: this.detalleSolicitudUsuario.tdescpues,
          tfechingrsoli: this.detalleSolicitudUsuario.tfechingrsoli,
          tdescripcion: this.objVacaUsua.tdescripcion,
          tperiodo: this.objVacaUsua.tperiodo,
          tfechregi: this.detalleSolicitudUsuario.tfechregi,
          treemplazo: this.objVacaUsua.treemplazo
        };
        
        this.solicitudesPendientes.forEach(user => {
            user.isActive = false;
        })
        this.solicitudPendiente = user;
        this.solicitudPendiente.isActive = true;
      },
      error => {
        console.log("error detalle de solicitud:", error.message)
        Swal.fire(
          'Error',
          'error al mostrar detalle solicitud:'+ error.message,
          'error'
        );
      }
    )
  }

  modalShowCancelar(user: any) {
    const modalRef = this.modalService.open(CancelarModalComponent);
    modalRef.componentInstance.titulo = 'vacaciones'; // should be the id
    modalRef.componentInstance.data = { motivo: 'el motivo es' }; // should be the data

    modalRef.result.then((result) => {
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
          this.listarSolicitudesAprobadas();
        }, 
        error => {
          console.log("Error: " + error.message)
          Swal.fire(
            'Error',
            'error al rechazar solicitud:'+ error.message,
            'error'
          );
        }
      );
    }).catch((error) => {
      console.log(error);
    });
  }

  aprobarSolicitud(user: any) {
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
        this.listarSolicitudesAprobadas();
        Swal.fire({
          title: 'Exito',
          text: 'Solicitud aprobada',
          icon: 'success',
          timer: 1500, 
          showConfirmButton: false,
        })
      }, 
      error => {
        console.log("Error: " + error.message)
        Swal.fire(
          'Error',
          'error al aprobar solicitud:'+ error.message,
          'error'
        );
      }
    );
  }

  public createXLSX() : void {
    this.aprobarService.reporteAprobados(1, this.sesion.p_codipers, 1).subscribe(
      resp => {
        console.log(resp)
        this.listReporte = resp;
        const headers = ['Código', 'Nombre Completo', 'Tipo Solicitud', 'Fecha Registro', 'Fecha Inicio', 'Fecha Fin', 'Status', 'Código Aprobador' , 'Aprobador', 'Fecha Aprobada'];
        const report = new ReportAdapter(this.listReporte);
        console.log(report)
        this.aprobarService.generateReportWithAdapter(headers,report.data, 'Reporte_vacaciones.xlsx');
        Swal.fire(
          'Exito',
          'Se generó con éxito',
          'success'
        );
      },
      error => {
        Swal.fire(
          'Error',
          'error obtener imagen:'+ error.message,
          'error'
        );
      }
    )
  }

}
