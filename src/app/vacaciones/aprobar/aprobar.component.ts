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
import { ReportAdapterComun } from 'app/shared/utilitarios/ReportAdapterComun.class';
const now = new Date();

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
    this.aprobarService.listarSolicitudesPendientes(this.sesion.p_codipers, 1, 1).subscribe(
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
      user.tfoto = this.validaFoto(reader.result as string);
    }, false);
    if (image) {
      reader.readAsDataURL(image);
    }
  }
  
  validaFoto(foto: string) : string {
    return foto === 'data:image/gif;base64,' ? 'assets/img/userX.PNG' : foto;
  }

  listarSolicitudesAprobadas() {
    this.aprobarService.listarSolicitudesAprobadas(this.sesion.p_codipers, 1).subscribe(
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
    this.aprobarService.listarDetalleUsuario(this.detalleSolicitudUsuario.tsolicitudId).subscribe(
      resp => {
        //console.log(resp)
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
        //console.log("error detalle de solicitud:", error.message)
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
    this.aprobarService.aprobarSolicitud(objAprobar).subscribe(
      resp => {
        this.messageResponse = resp;
        if (this.messageResponse.codeMessage == "200") {
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
            'Error al aprobar solicitud',
            this.messageResponse.message,
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
    this.aprobarService.reporteAprobados(1, this.sesion.p_codipers, 1).subscribe(
      resp => {
        //console.log(resp)
        this.listReporte = resp;
        const headers = ['Código', 'Nombre Completo', 'Tipo Solicitud', 'Fecha Registro', 'Fecha Inicio', 'Fecha Fin', 'Status', 'Código Aprobador' , 'Aprobador', 'Fecha Aprobada'];
        const report = new ReportAdapterComun(this.listReporte);
        //console.log(report)
        this.aprobarService.generateReportWithAdapter(headers,report.data, 'Vacaciones_Aprobadas_' + (now.getFullYear()) + "/" + (now.getMonth() + 1) + "/" + now.getDate() + ':'+ now.getHours() +':' + now.getMinutes() + '.xlsx');
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
