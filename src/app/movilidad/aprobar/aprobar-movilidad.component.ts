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
import { DetalleModalComponent } from './detalle-modal/detalle-modal.component';
import { forkJoin } from 'rxjs';
import { ToleranciaModalComponent } from './tolerancia-modal/tolerancia-modal.component';
declare var require: any;
const dataDistrito: any = require('../../../assets/data/distritos-data.json');
const now = new Date();

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
  objTolerancia: any;
  solicitudPendiente: User = null;
  public listReporte: Array<Reporte> = [];
  distritos: any = null;
  messageResponse: any = null;

  constructor(private aprobarService: SolicitarService, private modalService: NgbModal,
    private authService: AuthService) {
  }

  ngOnInit(): void {
    this.sesion = JSON.parse(this.authService.userSesion);
    this.distritos = dataDistrito;
    this.listarSolicitudesAprobadas();
    this.listarSolicitudesMovilidad();
  }

  listarSolicitudesMovilidad() {
    this.aprobarService.listarSolicitudesPendientes(this.sesion.p_codipers, 1, 5).subscribe(
      resp => {
        this.solicitudesPendientes = resp;
        // console.log(this.solicitudesPendientes)
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
    this.aprobarService.listarSolicitudesAprobadas(this.sesion.p_codipers, 5).subscribe(
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
    forkJoin({
      objMoviUsua: this.aprobarService.listarDetalleMovilidadLicencia(this.detalleSolicitudUsuario.tsolicitudId),
      objTolerancia: this.aprobarService.toleranciaSalidaBus(this.detalleSolicitudUsuario.tsolicitudId)
    }).subscribe({
      next: ({ objMoviUsua, objTolerancia }) => {
        this.objMoviUsua = objMoviUsua;
        this.objTolerancia = objTolerancia;
        let tmotivo = this.objMoviUsua[0].tmotivo
        let tdestino = this.objMoviUsua[0].tdestino
        let tobservacion = this.objMoviUsua[0].tobservacion;
        let tmonto = 0
        let tnumeviaje = 0
        let torigen = this.objMoviUsua[0].torigen
        let ttransporte = this.objMoviUsua[0].ttransporte
        let tfechinicio = this.objMoviUsua[0].tfechinicio
        const tamanio = this.objMoviUsua.length - 1;
        let tfechfin = this.objMoviUsua[tamanio].tfechinicio
        this.objMoviUsua.forEach(user => {
            tmonto = tmonto + user.tmonto;
            tnumeviaje = tnumeviaje + user.tnumeviaje;
        })
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
          tmotivo: tmotivo,
          tobservacion: tobservacion,
          tdestino:  this.distritos.find(a => a.id_distrito == tdestino).descripcion_distrito,
          tmonto: tmonto,
          tnumeviaje: tnumeviaje,
          torigen: this.distritos.find(a => a.id_distrito == torigen).descripcion_distrito,
          ttransporte: ttransporte,
          tfechinicio: tfechinicio,
          tfechfin: tfechfin
        };
        this.solicitudesPendientes.forEach(user => {
            user.isActive = false;
        })
        this.solicitudPendiente = user;
        this.solicitudPendiente.isActive = true;
      },
      error: error => {
        Swal.fire(
          'Error',
          'Error al cargar los datos: ' + error.message,
          'error'
        );
      }
    });
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
      //console.log(objRechazar);
      this.aprobarService.rechazarSolicitud(objRechazar).subscribe(
        resp => {
          //console.log(resp)
          this.trabajador = null;
          this.listarSolicitudesMovilidad();
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
          this.listarSolicitudesMovilidad();
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
    this.aprobarService.reporteAprobados(5, this.sesion.p_codipers, 1).subscribe(
      resp => {
        //console.log(resp)
        this.listReporte = resp;
        const headers = ['Código', 'Nombre Completo', 'Tipo Solicitud', 'Fecha Registro', 'Fecha Inicio', 'Fecha Fin', 'Monto', 'Status', 'Código Actualizador' , 'Actualizador', 'Fecha Actualizada'];
        const report = new ReportAdapter(this.listReporte);
        //console.log(report)
        this.aprobarService.generateReportWithAdapter(headers,report.data, 'Movilidades_Aprobadas_' + (now.getFullYear()) + "/" + (now.getMonth() + 1) + "/" + now.getDate() + ':'+ now.getHours() +':' + now.getMinutes() + '.xlsx');
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

  modalShowDetalle() {
    const modalRef = this.modalService.open(DetalleModalComponent, { size: 'lg' });
    modalRef.componentInstance.titulo = 'movilidad'; // should be the id
    modalRef.componentInstance.data = { listDetalle:  this.objMoviUsua}; // should be the data

    modalRef.result.then((result) => {
      // console.log(result)
    }).catch((error) => {
      console.log(error);
    });
  }

  modalShowTolerancia() {
    const modalRef = this.modalService.open(ToleranciaModalComponent);
    modalRef.componentInstance.titulo = 'movilidad'; // should be the id
    modalRef.componentInstance.data = { listDetalle:  this.objTolerancia}; // should be the data

    modalRef.result.then((result) => {
      // console.log(result)
    }).catch((error) => {
      console.log(error);
    });
  }

}
