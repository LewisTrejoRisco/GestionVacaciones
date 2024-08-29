import { Component, OnInit } from '@angular/core';
import {
  ColumnMode
} from '@swimlane/ngx-datatable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'app/shared/auth/auth.service';
import { SolicitarService } from 'app/shared/services/solicitar.service';
import { CancelarModalComponent } from 'app/vacaciones/cancelarModal/cancelar-modal.component';
import Swal from 'sweetalert2';
import { DataUserVacation } from 'app/vacaciones/data/datauservacation.data';
import { User } from 'app/vacaciones/aprobar/user.model';
import { ReportAdapter } from 'app/shared/utilitarios/ReportAdapter.class';
import { Reporte } from 'app/shared/utilitarios/reporte.model';
import { ReportAdapterComun } from 'app/shared/utilitarios/ReportAdapterComun.class';
const now = new Date();

@Component({
  selector: 'app-aprobar-permiso',
  templateUrl: './aprobar-permiso.component.html',
  styleUrls: ['./aprobar-permiso.component.scss', '../../../assets/sass/libs/datatables.scss'],
  providers: [SolicitarService]

})
export class AprobarPermisoComponent implements OnInit {

  public ColumnMode = ColumnMode;
  public userRows = DataUserVacation;
  public expanded: any = {};


  //NUEVO
  sesion: any;
  trabajador: any = null;
  public solicitudesPendientes: any = [];
  public solicitudesAprobadas: any = [];
  public detalleSolicitudUsuario: any = null;
  objVacaUsua: any;
  solicitudPendiente: User = null;
  public listReporte: Array<Reporte> = [];
  messageResponse: any = null;

  constructor(private aprobarService: SolicitarService, private modalService: NgbModal,
    private authService: AuthService) {
  }

  ngOnInit(): void {
    this.sesion = JSON.parse(this.authService.userSesion);
    this.listarSolicitudesAprobadas() ;
    this.listarSolicitudesPendientes();
  }

  listarSolicitudesPendientes() {
    this.aprobarService.listarSolicitudesPendientes(this.sesion.p_codipers, 1, 3).subscribe(
      resp => {
        this.solicitudesPendientes = resp;
        this.solicitudesPendientes.forEach(user => {
          this.authService.obtenerFoto(user.tusuasoli, JSON.parse(this.authService.userToken).token).subscribe(
            (imagen: Blob) =>{
              this.createImageFromBlob(imagen, user);
            }, error=> {
              console.log(error)
            }
          )
      })
      //console.log(this.solicitudesPendientes);
        this.trabajador = null;
      }, 
      error => {
        //console.log("error:", error.message)
        Swal.fire(
          'Error',
          'error al mostrar solicitudes pendientes:'+ error.message,
          'error'
        );
      }
    )
  }

  createImageFromBlob(image: Blob, user: any): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      user.tfoto = reader.result as string;
    }, false);
    if (image) {
      reader.readAsDataURL(image);
    }
  }

  listarSolicitudesAprobadas() {
    this.aprobarService.listarSolicitudesAprobadas(this.sesion.p_codipers, 3).subscribe(
      resp => {
        //console.log(resp);
        this.solicitudesAprobadas = resp;
      }, 
      error => {
        //console.log("error:", error.message)
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
    this.aprobarService.listarDetalleUsuarioPermiso(this.detalleSolicitudUsuario.tsolicitudId).subscribe(
      resp => {
        //console.log(resp)
        this.objVacaUsua = resp;
        this.trabajador = {
          tsolicitudId: this.detalleSolicitudUsuario.tsolicitudId,
          tusuasoli: this.detalleSolicitudUsuario.tusuasoli,
          tfoto: this.detalleSolicitudUsuario.tfoto,
          tdescusuasoli: this.detalleSolicitudUsuario.tdescusuasoli,
          periodo: this.detalleSolicitudUsuario.periodo,
          tusuaaprob: this.detalleSolicitudUsuario.tusuaaprob,
          tdescunidfuncsoli: this.detalleSolicitudUsuario.tdescunidfuncsoli,
          tdescpues: this.detalleSolicitudUsuario.tdescpues,
          tfechingrsoli: this.detalleSolicitudUsuario.tfechingrsoli,
          thorasfin: this.objVacaUsua.thorasfin,
          tminufin: this.objVacaUsua.tminufin,
          tmotivo: this.objVacaUsua.tmotivo,
          tperiodo: this.objVacaUsua.tperiodo,
          tfechregi: this.detalleSolicitudUsuario.tfechregi,
          tfechinicio: this.objVacaUsua.tfechinicio,
          tficheroadjunto: this.objVacaUsua.tficheroadjunto
        };
        
        this.solicitudesPendientes.forEach(user => {
            user.isActive = false;
        })
        this.solicitudPendiente = user;
        this.solicitudPendiente.isActive = true;
      },
      error => {
        //console.log("error detalle de solicitud:", error.message)
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
    //console.log(user);
    const modalRef = this.modalService.open(CancelarModalComponent);
    modalRef.componentInstance.titulo = 'permiso'; // should be the id
    modalRef.componentInstance.data = { motivo: 'el motivo es' }; // should be the data

    modalRef.result.then((result) => {
      let objRechazar = {
        idsolicitud: user.tsolicitudId,
        usuarioactualizacion: this.sesion.p_codipers,
        motivorechazo: result.motivo,
        flagAnulado: false
      }
      //console.log(objRechazar);
      this.aprobarService.rechazarSolicitud(objRechazar).subscribe(
        resp => {
          //console.log(resp)
          this.trabajador = null;
          this.listarSolicitudesPendientes();
          this.listarSolicitudesAprobadas();
        }, 
        error => {
          //console.log("Error: " + error.message)
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
    //console.log(objAprobar);
    this.aprobarService.aprobarSolicitud(objAprobar).subscribe(
      resp => {
        //console.log(resp)
        this.messageResponse = resp;
        if (this.messageResponse.codeMessage = "200") {
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
        } else {
          Swal.fire(
            'Error',
            'error al aprobar solicitud',
            'error'
          );
        }
      }, 
      error => {
        //console.log("Error: " + error.message)
        Swal.fire(
          'Error',
          'error al aprobar solicitud:'+ error.message,
          'error'
        );
      }
    );
  }

  public createXLSX() : void {
    this.aprobarService.reporteAprobados(3, this.sesion.p_codipers, 1).subscribe(
      resp => {
        //console.log(resp)
        this.listReporte = resp;
        const headers = ['Código', 'Nombre Completo', 'Tipo Solicitud', 'Fecha Registro', 'Fecha Inicio', 'Fecha Fin', 'Status', 'Código Aprobador' , 'Aprobador', 'Fecha Aprobada'];
        const report = new ReportAdapterComun(this.listReporte);
        //console.log(report)
        this.aprobarService.generateReportWithAdapter(headers,report.data, 'Permisos_Aprobados_' + (now.getFullYear()) + "/" + (now.getMonth() + 1) + "/" + now.getDate() + ':'+ now.getHours() +':' + now.getMinutes() + '.xlsx');
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
