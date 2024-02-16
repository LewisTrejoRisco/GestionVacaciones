import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import {
  ColumnMode,
  DatatableComponent,
  SelectionType
} from '@swimlane/ngx-datatable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'app/shared/auth/auth.service';
import { SolicitarService } from 'app/shared/services/solicitar.service';
import { Trabajador } from 'app/vacaciones/aprobar/trabajador.model';
import { CancelarModalComponent } from 'app/vacaciones/cancelarModal/cancelar-modal.component';
import Swal from 'sweetalert2';
import { DataUserVacation } from 'app/vacaciones/data/datauservacation.data';
import { User } from 'app/vacaciones/aprobar/user.model';
import { Reporte } from 'app/shared/utilitarios/reporte.model';
import { ReportAdapter } from 'app/shared/utilitarios/ReportAdapter.class';

@Component({
  selector: 'app-aprobar-movilidad',
  templateUrl: './aprobar-movilidad.component.html',
  styleUrls: ['./aprobar-movilidad.component.scss', '../../../assets/sass/libs/datatables.scss'],
  providers: [SolicitarService]

})
export class AprobarMovilidadComponent implements OnInit {

  public ColumnMode = ColumnMode;
  public userRows = DataUserVacation;
  public expanded: any = {};


  //NUEVO
  sesion: any;
  trabajador: any = null;
  public solicitudesPendientes: any = [];
  public solicitudesAprobadas: any = [];
  public detalleSolicitudUsuario: any = null;
  objMoviUsua: any;
  solicitudPendiente: User = null;
  public listReporte: Array<Reporte> = [];

  constructor(private aprobarService: SolicitarService, private modalService: NgbModal,
    private authService: AuthService) {
  }

  ngOnInit(): void {
    this.sesion = JSON.parse(this.authService.userToken);
    this.listarSolicitudesAprobadas();
    this.listarSolicitudesMovilidad();
  }

  listarSolicitudesMovilidad() {
    this.aprobarService.listarSolicitudesPendientes(this.sesion.p_codipers, '1', 5).subscribe(
      resp => {
        console.log(resp);
        this.solicitudesPendientes = resp;
        this.trabajador = null;
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
    this.aprobarService.listarSolicitudesAprobadas(this.sesion.p_codipers, 5).subscribe(
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
    this.aprobarService.listarDetalleMovilidadLicencia(this.detalleSolicitudUsuario.tsolicitudId).subscribe(
      resp => {
        console.log(resp)
        this.objMoviUsua = resp;
        this.trabajador = {
          tsolicitudId: this.detalleSolicitudUsuario.tsolicitudId,
          tusuasoli: this.detalleSolicitudUsuario.tusuasoli,
          tfoto: this.detalleSolicitudUsuario.tfoto,
          tdescusuasoli: this.detalleSolicitudUsuario.tdescusuasoli,
          periodo: this.detalleSolicitudUsuario.periodo,
          tusuaaprob: this.detalleSolicitudUsuario.tusuaaprob,
          tdescunidfuncsoli: this.detalleSolicitudUsuario.tdescunidfuncsoli,
          tfechingrsoli: this.detalleSolicitudUsuario.tfechingrsoli,
          tfechregi: this.detalleSolicitudUsuario.tfechregi,
          tmotivo: this.objMoviUsua.tmotivo,
          tdestino: this.objMoviUsua.tdestino,
          tmonto: this.objMoviUsua.tmonto,
          tnumeviaje: this.objMoviUsua.tnumeviaje,
          torigen: this.objMoviUsua.torigen,
          ttransporte: this.objMoviUsua.ttransporte,
          tfechinicio: this.objMoviUsua.tfechinicio,
          tfechfin: this.objMoviUsua.tfechfin
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

  /**
   * rowDetailsToggleExpand
   *
   * @param row
   */
  // rowDetailsToggleExpand(row) {
  //   this.tableRowDetails.rowDetail.toggleExpandRow(row);
  // }

  modalShowCancelar(user: any) {
    const modalRef = this.modalService.open(CancelarModalComponent);
    modalRef.componentInstance.titulo = 'movilidad'; // should be the id
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
          this.listarSolicitudesMovilidad();
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
        this.listarSolicitudesMovilidad();
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
    this.aprobarService.reporteAprobados(5, this.sesion.p_codipers, "1").subscribe(
      resp => {
        console.log(resp)
        this.listReporte = resp;
        const headers = ['Código', 'Nombre Completo', 'Tipo Solicitud', 'Fecha Registro', 'Fecha Inicio', 'Fecha Fin', 'Status', 'Código Aprobador' , 'Aprobador', 'Fecha Aprobada'];
        const report = new ReportAdapter(this.listReporte);
        console.log(report)
        this.aprobarService.generateReportWithAdapter(headers,report.data, 'Reporte_movilidad.xlsx');
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
