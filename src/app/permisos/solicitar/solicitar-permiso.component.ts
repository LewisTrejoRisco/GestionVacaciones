import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import {
  ColumnMode,
  DatatableComponent,
  SelectionType
} from '@swimlane/ngx-datatable';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SolicitarPermisoModalComponent } from './solicitar-modal/solicitar-permiso-modal.component';
import { AuthService } from 'app/shared/auth/auth.service';
import { SolicitarService } from 'app/shared/services/solicitar.service';
import { CancelarModalComponent } from 'app/vacaciones/cancelarModal/cancelar-modal.component';
import Swal from 'sweetalert2';
import { Reporte } from 'app/shared/utilitarios/reporte.model';
import { ReportAdapter } from 'app/shared/utilitarios/ReportAdapter.class';
import { ReportAdapterComun } from 'app/shared/utilitarios/ReportAdapterComun.class';
import { REPORTE_SOLICITUD_VENCIDA } from 'app/shared/utilitarios/Constantes';
import { forkJoin } from 'rxjs';
import { ReportAdapterVencida } from 'app/shared/utilitarios/ReportAdapterVencida.class';
const now = new Date();

@Component({
  selector: 'app-solicitar-permiso',
  templateUrl: './solicitar-permiso.component.html',
  styleUrls: ['./solicitar-permiso.component.scss', '../../../assets/sass/libs/datatables.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [SolicitarService]
})
export class SolicitarPermisoComponent implements OnInit {

  @ViewChild('tableRowDetails') tableRowDetails: any;
  public ColumnMode = ColumnMode;
  public expanded: any = {};
  closeResult: string;
  public listaPermisos: any = [];
  public listaHistorialSolicitudes: any = [];
  //NUEVO
  sesion: any;
  userExport: any;
  userExportAprob: any;
  public listReporte: Array<Reporte> = [];

  constructor(private modalService: NgbModal, 
    private solicitarService: SolicitarService,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.sesion = JSON.parse(this.authService.userSesion);
    this.listarSolicitudesGroupBy();
    this.listarHistorialSolicitudes();
  }

  listarSolicitudesGroupBy() {
    this.solicitarService.listarSolicitudes(this.sesion.p_codipers, 3).subscribe(
      resp => {
        this.listaPermisos = resp;
        //console.log(this.listaPermisos);
      }, 
      error => {
        //console.log("error:", error.message)
        Swal.fire(
          'Error',
          'error al mostrar solicitudes:'+ error.message,
          'error'
        );
      }
    )
  }

  listarHistorialSolicitudes() {
    this.solicitarService.listarHistorialPermisoSolicitudes(this.sesion.p_codipers, 3).subscribe(
      resp => {
        this.listaHistorialSolicitudes = resp;
        //console.log(this.listaHistorialSolicitudes);
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

  /**
   * rowDetailsToggleExpand
   *
   * @param row
   */

  rowDetailsToggleExpand(row) {
    this.tableRowDetails.rowDetail.toggleExpandRow(row);
  }

  modalShowSolicitar(tipo: any, row: any) {
    const modalRef = this.modalService.open(SolicitarPermisoModalComponent);
    modalRef.componentInstance.id = tipo; // should be the id
    if(row == null) {
      modalRef.componentInstance.data = { fechaInic: null, 
                                          timeInic: null, 
                                          horas: null, 
                                          minutos: null , 
                                          descripcion: null,
                                          documento: null }; // should be the data
    } else {
      let fechInicEdit = null;
      let timeInicEdit = null;
      if(row.tfechinicsoli.split('/').length == 3){
        fechInicEdit = {
          "year": parseInt(row.tfechinicsoli.split(' ')[0].split('/')[2]),
          "month": parseInt(row.tfechinicsoli.split(' ')[0].split('/')[1]),
          "day": parseInt(row.tfechinicsoli.split(' ')[0].split('/')[0])
        };

        timeInicEdit = { 
          "hour": parseInt(row.tfechinicsoli.split(':')[0].split(' ')[1]), 
          "minute": parseInt(row.tfechinicsoli.split(':')[1]), 
          "second": 0 
        };
        modalRef.componentInstance.data = { fechaInic: fechInicEdit, 
                                            timeInic: timeInicEdit, 
                                            horas: row.thorasfin, 
                                            minutos: row.tminufin , 
                                            descripcion: row.tmotivo,
                                            documento: row.tficheroadjunto }; // should be the data
      }
    }
    modalRef.result.then((result) => {
      let objSolicitud = null;
      // if(row == null) {
        objSolicitud = {
          tsolicitudId : row == null ? 0 : row.tsolicitudId,
          idtiposolicitud : "3",
          usuarioregistro : this.sesion.p_codipers,
          usuariosolicitado : this.sesion.p_codipers,
          // areaactualtrabajador : this.sesion.p_unidfunc,
          usuarioactual : this.sesion.p_matrresp,
          fechainiciosolicitud : result.fechaInic.day + '/' + result.fechaInic.month + '/' + result.fechaInic.year + ' '+ result.timeInic.hour + ':'+ result.timeInic.minute,
          status : "1",
          horas : result.horas.id,
          minutos : result.minutos.id,
          descripcion : result.descripcion,
          tficheroadjunto: result.documento
        }
      // } else {
      //   objSolicitud = {
      //     tsolicitudId : row.tsolicitudId,
      //     idtiposolicitud : "3",
      //     usuarioregistro : this.sesion.p_codipers,
      //     usuariosolicitado : this.sesion.p_codipers,
      //     // areaactualtrabajador : this.sesion.p_unidfunc,
      //     usuarioactual : this.sesion.p_matrresp,
      //     fechainiciosolicitud : result.fechaInic.day + '/' + result.fechaInic.month + '/' + result.fechaInic.year + ' '+ result.timeInic.hour + ':'+ result.timeInic.minute,
      //     status : "1",
      //     horas : result.horas.id,
      //     minutos : result.minutos.id,
      //     descripcion : result.descripcion,
      //     tficheroadjunto: result.documento
      //   }
      // }
      this.solicitarService.grabarPermiso(objSolicitud).subscribe(
        resp => {
          //console.log(resp)
          let message: any = resp;
          if (message.codeMessage == "200") {
            this.listarSolicitudesGroupBy();
            this.listarHistorialSolicitudes();
            Swal.fire({
              title: 'Exito',
              text: 'Solicitud generada',
              icon: 'success',
              timer: 1500, 
              showConfirmButton: false,
            })
          } else {
            Swal.fire(
              'Error: ',
              message.message,
              'error'
            );
          }
        }, 
        error => {
          //console.log("Error: " + error.message)
          Swal.fire(
            'Error',
            'error al grabar la solicitud:'+ error.message,
            'error'
          );
        }
      );

    }).catch((error) => {
      console.log(error);
    });
  }

  public modalEliminarSolicitar(user: any){
    //console.log(user);
    const modalRef = this.modalService.open(CancelarModalComponent);
    modalRef.componentInstance.titulo = 'permiso'; // should be the id
    modalRef.componentInstance.data = { motivo: 'el motivo es' }; // should be the data

    modalRef.result.then((result) => {
      //console.log(result)
      let objRechazar = {
        idsolicitud: user.tsolicitudId,
        usuarioactualizacion: this.sesion.p_codipers,
        motivorechazo: result.motivo,
        flagAnulado: true
      }
      //console.log(objRechazar);
      this.solicitarService.rechazarSolicitud(objRechazar).subscribe(
        resp => {
          //console.log(resp)
          this.listarHistorialSolicitudes();
          this.listarSolicitudesGroupBy();
        }, 
        error => {
          //console.log("Error: " + error.message)
          Swal.fire(
            'Error',
            'error al eliminar solicitud:'+ error.message,
            'error'
          );
        }
      );
    }).catch((error) => {
      console.log(error);
    });
  }

  createPDF(user: any) {
    this.solicitarService.obtenerDatosBasicos(user.tusuasoli).subscribe(
      resp => {
        this.userExport = resp;
        this.solicitarService.obtenerDatosBasicos(user.tusuaaprob).subscribe(
          resp => {
            this.userExportAprob = resp;
            var userData = {
              nombre: this.userExport.p_nombcomp,
              codigo : this.userExport.p_codipers,
              horaInicio: user.tfechinicsoli,
              horaFin: user.tfechfinasoli,
              fechaActual: now.getDate()+"/"+(now.getMonth() + 1)+"/"+ (now.getFullYear()),
              fechaAprobacion: user.tfechresp,
              codigoAprob: user.tusuaaprob,
              nombreAprob: this.userExportAprob.p_nombcomp
            };
            //console.log(userData);
            this.solicitarService.createPDF(userData);
          },
          error => {

          }
        )
      },
      error => {

      }
    )
  }

  public createXLSX() : void {
    this.solicitarService.reporteAprobadosRRHH(3, 1).subscribe(
      resp => {
        //console.log(resp)
        this.listReporte = resp;
        const headers = ['Código', 'Nombre Completo', 'Tipo Solicitud', 'Fecha Registro', 'Fecha Inicio', 'Fecha Fin', 'Status', 'Código Aprobador' , 'Aprobador', 'Fecha Aprobada'];
        const report = new ReportAdapterComun(this.listReporte);
        //console.log(report)
        this.solicitarService.generateReportWithAdapter(headers,report.data, 'Reporte_permiso_rrhh.xlsx');
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

  public createXLSXVencido() : void {
    let path = REPORTE_SOLICITUD_VENCIDA;
    let param = "?ttiposolicitud=3"
    
    forkJoin({
      solicitud: this.solicitarService.listar(path, param)
    }).subscribe({
      next: ({ solicitud }) => {
        let solivenc: any = solicitud;
        const headers = ['Solicitud', 'Tipo Solicitud', 'Codigo Aprobador', 'Aprobador', 'Estado Laboral', 'Fecha registro', 'Codi. Solicitante', 'Fecha Inicio', 'Fecha Fin', '# Días'];
        const report = new ReportAdapterVencida(solivenc);
        this.solicitarService.generateReportVencidaWithAdapter(headers,report.data, 'Permisos_pendientes.xlsx');
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

}
