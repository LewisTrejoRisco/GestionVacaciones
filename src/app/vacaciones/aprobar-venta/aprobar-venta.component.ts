import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { SolicitarService } from 'app/shared/services/solicitar.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CancelarModalComponent } from '../cancelarModal/cancelar-modal.component';
import { AuthService } from 'app/shared/auth/auth.service';
import { Trabajador } from '../aprobar/trabajador.model';
import Swal from 'sweetalert2';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { DataUserVacation } from '../data/datauservacation.data';
import { User } from '../aprobar/user.model';
import { ReportAdapter } from 'app/shared/utilitarios/ReportAdapter.class';
import { Reporte } from 'app/shared/utilitarios/reporte.model';
const now = new Date();

@Component({
  selector: 'app-aprobar-venta',
  templateUrl: './aprobar-venta.component.html',
  styleUrls: ['./aprobar-venta.component.scss', '../../../assets/sass/libs/datatables.scss'],
  providers: [SolicitarService]

})
export class AprobarVentaComponent implements OnInit {

  public ColumnMode = ColumnMode;
  public userRows = DataUserVacation;
  public expanded: any = {};
  public solicitudesPendientesVenta: any = [];
  public solicitudesAprobadas: any = [];
  public detalleSolicitudUsuarioVenta: any = null;
  //NUEVO
  sesion: any;
  objVacaUsua: any;
  trabajador: Trabajador = null;
  solicitudPendiente: User = null;
  public listReporte: Array<Reporte> = [];

  constructor(private aprobarVentaService: SolicitarService, 
    private modalService: NgbModal,
    private authService: AuthService) {
  }

  ngOnInit(): void {
    this.sesion = JSON.parse(this.authService.userSesion);
    this.listarSolicitudesAprobadas();
    this.listarSolicitudesPendientesVenta();
  }

  listarSolicitudesPendientesVenta() {
    this.aprobarVentaService.listarSolicitudesPendientesXStatusXTipo(1, 2).subscribe(
      resp => {
        this.solicitudesPendientesVenta = resp;
        this.solicitudesPendientesVenta.forEach(user => {
          this.authService.obtenerFoto(user.tusuasoli, JSON.parse(this.authService.userToken).token).subscribe(
            (imagen: Blob) =>{
              this.createImageFromBlob(imagen, user);
            }, error=> {
              console.log(error)
            }
          )
      })
      //console.log(this.solicitudesPendientesVenta);
      this.trabajador = null;
      }, 
      error => {
        //console.log("error:", error.message)
        Swal.fire(
          'Error',
          'error al listar solicitudes pendientes:'+ error.message,
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
    this.aprobarVentaService.listarSolicitudesAprobadas(this.sesion.p_codipers, 2).subscribe(
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

  detalleSolicitudVenta(user: any) {
    this.detalleSolicitudUsuarioVenta = user;
    this.aprobarVentaService.listarDetalleUsuario(this.detalleSolicitudUsuarioVenta.tsolicitudId).subscribe(
      resp => {
        //console.log(resp)
        this.objVacaUsua = resp;
        this.trabajador = {
          tsolicitudId: this.detalleSolicitudUsuarioVenta.tsolicitudId,
          tusuasoli: this.detalleSolicitudUsuarioVenta.tusuasoli,
          tfoto: this.detalleSolicitudUsuarioVenta.tfoto,
          tdescusuasoli: this.detalleSolicitudUsuarioVenta.tdescusuasoli,
          periodo: this.detalleSolicitudUsuarioVenta.periodo,
          tcantidaddias: this.objVacaUsua.tcantidaddias,
          tusuaaprob: this.detalleSolicitudUsuarioVenta.tusuaaprob,
          tdescunidfuncsoli: this.detalleSolicitudUsuarioVenta.tdescunidfuncsoli,
          tdescpues: this.detalleSolicitudUsuarioVenta.tdescpues,
          tfechingrsoli: this.detalleSolicitudUsuarioVenta.tfechingrsoli,
          tdescripcion: this.objVacaUsua.tdescripcion,
          tperiodo: this.objVacaUsua.tperiodo,
          tfechregi: this.detalleSolicitudUsuarioVenta.tfechregi,
          treemplazo: this.objVacaUsua.treemplazo
        };
        
        this.solicitudesPendientesVenta.forEach(user => {
            user.isActive = false;
        })
        this.solicitudPendiente = user;
        this.solicitudPendiente.isActive = true;
      },
      error => {
        //console.log("error detalle de solicitud:", error.message)
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

  modalShowCancelarVenta(user: any) {
    const modalRef = this.modalService.open(CancelarModalComponent);
    modalRef.componentInstance.titulo = 'venta vacaciones'; // should be the id
    modalRef.componentInstance.data = { motivo: 'el motivo es' }; // should be the data

    modalRef.result.then((result) => {
      let objRechazar = {
        idsolicitud: user.tsolicitudId,
        usuarioactualizacion: this.sesion.p_codipers,
        motivorechazo: result.motivo
      }
      //console.log(objRechazar);
      this.aprobarVentaService.rechazarSolicitud(objRechazar).subscribe(
        resp => {
          //console.log(resp)
          this.trabajador = null;
          this.listarSolicitudesPendientesVenta();
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

  aprobarSolicitudVenta(user: any) {
    let objAprobar = {
      idsolicitud: user.tsolicitudId,
      usuarioactualizacion: this.sesion.p_codipers
    }
    //console.log(objAprobar);
    this.aprobarVentaService.aprobarSolicitud(objAprobar).subscribe(
      resp => {
        //console.log(resp)
        this.trabajador = null;
        this.listarSolicitudesPendientesVenta();
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
    this.aprobarVentaService.reporteAprobados(2, this.sesion.p_codipers, 1).subscribe(
      resp => {
        //console.log(resp)
        this.listReporte = resp;
        const headers = ['Código', 'Nombre Completo', 'Tipo Solicitud', 'Fecha Registro', 'Fecha Inicio', 'Fecha Fin', 'Status', 'Código Aprobador' , 'Aprobador', 'Fecha Aprobada'];
        const report = new ReportAdapter(this.listReporte);
        //console.log(report)
        this.aprobarVentaService.generateReportWithAdapter(headers,report.data, 'Venta_vacaciones_Aprobadas_' + (now.getFullYear()) + "/" + (now.getMonth() + 1) + "/" + now.getDate() + ':'+ now.getHours() +':' + now.getMinutes() + '.xlsx');
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
