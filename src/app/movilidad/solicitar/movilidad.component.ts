import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import {
  ColumnMode,
  DatatableComponent,
  SelectionType
} from '@swimlane/ngx-datatable';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { SolicitarPermisoModalComponent } from './solicitar-modal/movilidad-modal.component';
import { AuthService } from 'app/shared/auth/auth.service';
import { SolicitarService } from 'app/shared/services/solicitar.service';
import { MovilidadModalComponent } from './solicitar-modal/movilidad-modal.component';
import { CancelarModalComponent } from 'app/vacaciones/cancelarModal/cancelar-modal.component';
import Swal from 'sweetalert2';
import { ReportAdapter } from 'app/shared/utilitarios/ReportAdapter.class';
import { Reporte } from 'app/shared/utilitarios/reporte.model';
import { forEach } from 'core-js/core/array';
import { ReportAdapterMovilidad } from 'app/shared/utilitarios/ReportAdapterMovilidad.class';
import { REPORTE_SOLICITUD_VENCIDA } from 'app/shared/utilitarios/Constantes';
import { forkJoin } from 'rxjs';
import { ReportAdapterVencida } from 'app/shared/utilitarios/ReportAdapterVencida.class';

@Component({
  selector: 'app-movilidad',
  templateUrl: './movilidad.component.html',
  styleUrls: ['./movilidad.component.scss', '../../../assets/sass/libs/datatables.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [SolicitarService]
})
export class MovilidadComponent implements OnInit {

  @ViewChild('tableRowDetails') tableRowDetails: any;
  public ColumnMode = ColumnMode;
  // row data
  // public rows = DataVacation;
  // public userRows = DataUserVacation;

  public expanded: any = {};
  closeResult: string;

  public listaMovilidad: any = [];
  public listaHistorialSolicitudes: any = [];
  public distritos: any = null;
  public listDetalle: any = [];;

  //NUEVO
  sesion: any;
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
    this.solicitarService.listarSolicitudes(this.sesion.p_codipers, 5).subscribe(
      resp => {
        this.listaMovilidad = resp;
        //console.log(this.listaMovilidad);
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
    this.solicitarService.listarHistorialMovilidadSolicitudes(this.sesion.p_codipers, 5).subscribe(
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
    var modalRef = null
    if(row == null) {
      this.openModal(tipo, null, null, null, null, null, null, null, null, null, []);
    } else {
      this.solicitarService.listarDetalleMovilidadLicencia(row.tsolicitudId).subscribe(
        resp => {
          this.listDetalle = resp;
          if(this.listDetalle.length != 0) {
            let listDinamic:any = [];
            let tfecha = this.formatDate(this.listDetalle[0].tfechinicio);
            let tnumeviaje = this.listDetalle[0].tnumeviaje;
            let ttransporte = this.listDetalle[0].ttransporte;
            let torigen = this.listDetalle[0].torigen;
            let tdestino = this.listDetalle[0].tdestino;
            let tmotivo = this.listDetalle[0].tmotivo;
            let ttiempo = this.listDetalle[0].ttiempo;
            let observacion = this.listDetalle[0].tobservacion;
            this.listDetalle.forEach(a => {
              const movilidad = {
                tfechinicio: this.formatDate(a.tfechinicio),
                tfechfina: this.formatHourMinu(a.tfechfin),
                tmonto : a.tmonto.toFixed(2)
              };
              listDinamic.push(movilidad)
            })
            this.openModal(tipo, row, tfecha, tnumeviaje, ttransporte, torigen, tdestino, tmotivo, ttiempo, observacion, listDinamic);
          }
        }, 
        error => {
          Swal.fire(
            'Error',
            'error al mostrar solicitudes pendientes:'+ error.message,
            'error'
          );
        }
      )
    
    }
  }

  openModal(tipo: any, row: any, fecha: any, numeViajes: any, transporte: any, origen: any, destino: any, motivo: any, idTiempo: any, observacion:any, listDinamic:any) {
    var  modalRef = this.modalService.open(MovilidadModalComponent, { size: 'lg' });
    modalRef.componentInstance.id = tipo; // should be the id
    modalRef.componentInstance.data = { fecha: fecha,
                                        numeViajes: numeViajes, 
                                        transporte: transporte , 
                                        origen: origen, 
                                        destino: destino , 
                                        motivo: motivo , 
                                        idTiempo: idTiempo,
                                        observacion: observacion,
                                        listDinamic: listDinamic  
                                      }
    modalRef.result.then((result) => {
      let objSolicitud = null;
      objSolicitud = {
        tsolicitudId :  row == null ? 0 : row.tsolicitudId,
        idtiposolicitud : "5",
        usuarioregistro : this.sesion.p_codipers,
        usuariosolicitado : this.sesion.p_codipers,
        usuarioactual : this.sesion.p_matrresp,
        status : "1",
        tfechinicio : null,
        tfechfin : null,
        listMovilidad: []
      }
      if (result.idTiempo == 'D') {
        if (result.fechaInic != null && result.fechaFina != null && result.monto != null) {
          if(result.monto > 0) {
            const movilidad = {
              tfechinicio: result.fechaInic == null ? null : result.fechaInic.day + '/' + result.fechaInic.month + '/' + result.fechaInic.year + ' '+ 0 + ':'+ 0,
              thora: result.fechaFina == null ? null : result.fechaFina.hour,
              tminuto: result.fechaFina == null ? null : result.fechaFina.minute,
              tmonto : result.monto == null ? null : Number(result.monto).toFixed(2),
              tnumeviaje : result.numeViajes,
              ttransporte : result.transporte.id,
              torigen : result.origen.id_distrito,
              tdestino : result.destino.id_distrito,
              ttiempo: result.idTiempo,
              tmotivoId : result.motivo.tmotivoId,
              tobservacion : result.observacion
            };
            objSolicitud.tfechinicio = result.fechaInic == null ? null : result.fechaInic.day + '/' + result.fechaInic.month + '/' + result.fechaInic.year;
            objSolicitud.tfechfin = result.fechaInic == null ? null : result.fechaInic.day + '/' + result.fechaInic.month + '/' + result.fechaInic.year;
            objSolicitud.listMovilidad.push(movilidad);   
            // console.log(objSolicitud)
          }
        }
      } else {
        let primeraFecha = null;
        let ultimaFecha = null;
        for(var i = 1; i <= 7; i++) {
          let fechaCabeza;
          let fecha;
          let hora;
          let minuto;
          let monto;
          switch (i) {
            case 1:
              fechaCabeza = result.fechaInic == null ? null : result.fechaInic.day + '/' + result.fechaInic.month + '/' + result.fechaInic.year;
              fecha = result.fechaInic == null ? null : result.fechaInic.day + '/' + result.fechaInic.month + '/' + result.fechaInic.year + ' '+ 0 + ':'+ 0;
              hora = result.fechaFina == null ? null : result.fechaFina.hour;
              minuto = result.fechaFina == null ? null : result.fechaFina.minute;
              monto = result.monto == null ? null : Number(result.monto);
              break;
            case 2:
              fechaCabeza = result.fechaInic1 == null ? null : result.fechaInic1.day + '/' + result.fechaInic1.month + '/' + result.fechaInic1.year;
              fecha = result.fechaInic1 == null ? null : result.fechaInic1.day + '/' + result.fechaInic1.month + '/' + result.fechaInic1.year + ' '+ 0 + ':'+ 0;
              hora =  result.fechaFina1 == null ? null : result.fechaFina1.hour;
              minuto =  result.fechaFina1 == null ? null : result.fechaFina1.minute;
              monto =   result.monto1 == null ? null : Number(result.monto1);
              break;
            case 3:
              fechaCabeza = result.fechaInic2 == null ? null : result.fechaInic2.day + '/' + result.fechaInic2.month + '/' + result.fechaInic2.year;
              fecha = result.fechaInic2 == null ? null : result.fechaInic2.day + '/' + result.fechaInic2.month + '/' + result.fechaInic2.year + ' '+ 0 + ':'+ 0;
              hora = result.fechaFina2 == null ? null : result.fechaFina2.hour;
              minuto = result.fechaFina2 == null ? null : result.fechaFina2.minute;
              monto =  result.monto2 == null ? null : Number(result.monto2);
              break;
            case 4:
              fechaCabeza = result.fechaInic3 == null ? null : result.fechaInic3.day + '/' + result.fechaInic3.month + '/' + result.fechaInic3.year;
              fecha = result.fechaInic3 == null ? null : result.fechaInic3.day + '/' + result.fechaInic3.month + '/' + result.fechaInic3.year + ' '+ 0 + ':'+ 0;
              hora = result.fechaFina3 == null ? null : result.fechaFina3.hour;
              minuto = result.fechaFina3 == null ? null : result.fechaFina3.minute;
              monto =  result.monto3 == null ? null : Number(result.monto3);
              break;
            case 5:
              fechaCabeza = result.fechaInic4 == null ? null : result.fechaInic4.day + '/' + result.fechaInic4.month + '/' + result.fechaInic4.year;
              fecha = result.fechaInic4 == null ? null : result.fechaInic4.day + '/' + result.fechaInic4.month + '/' + result.fechaInic4.year + ' '+ 0 + ':'+ 0;
              hora = result.fechaFina4 == null ? null : result.fechaFina4.hour;
              minuto = result.fechaFina4 == null ? null : result.fechaFina4.minute;
              monto =  result.monto4 == null ? null : Number(result.monto4);
              break;
            case 6:
              fechaCabeza = result.fechaInic5 == null ? null : result.fechaInic5.day + '/' + result.fechaInic5.month + '/' + result.fechaInic5.year;
              fecha = result.fechaInic5 == null ? null : result.fechaInic5.day + '/' + result.fechaInic5.month + '/' + result.fechaInic5.year + ' '+ 0 + ':'+ 0;
              hora = result.fechaFina5 == null ? null : result.fechaFina5.hour;
              minuto = result.fechaFina5 == null ? null : result.fechaFina5.minute;
              monto =  result.monto5 == null ? null : Number(result.monto5);
              break;
            case 7:
              fechaCabeza = result.fechaInic6 == null ? null : result.fechaInic6.day + '/' + result.fechaInic6.month + '/' + result.fechaInic6.year;
              fecha = result.fechaInic6 == null ? null : result.fechaInic6.day + '/' + result.fechaInic6.month + '/' + result.fechaInic6.year + ' '+ 0 + ':'+ 0;
              hora = result.fechaFina6 == null ? null : result.fechaFina6.hour;
              minuto = result.fechaFina6 == null ? null : result.fechaFina6.minute;
              monto =  result.monto6 == null ? null : Number(result.monto6);
              break;
            default:
              // console.log("Error al mapear la semana"); // Manejar un caso por defecto si es necesario
          }
          if (fecha != null && hora != null && minuto != null && monto != null) {
            if(monto > 0) {
              if(primeraFecha == null) {
                primeraFecha = fechaCabeza;
              }
              ultimaFecha = fechaCabeza;
              const movilidad = {
                tfechinicio: fecha,
                thora: hora,
                tminuto: minuto,
                tmonto : monto.toFixed(2),
                tnumeviaje : result.numeViajes,
                ttransporte : result.transporte.id,
                torigen : result.origen.id_distrito,
                tdestino : result.destino.id_distrito,
                ttiempo: result.idTiempo,
                tmotivoId : result.motivo.tmotivoId,
                tobservacion : result.observacion
              };
              objSolicitud.listMovilidad.push(movilidad);
            }
          }
        }

        objSolicitud.tfechinicio = primeraFecha;
        objSolicitud.tfechfin = ultimaFecha;   
        // console.log(objSolicitud)
      }
      this.solicitarService.grabarMovilidad(objSolicitud).subscribe(
        resp => {
          if (resp == 1) {
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
              'Error',
              'error al grabar la solicitud',
              'error'
            );
          }
        }, 
        error => {
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

  formatDate(date: string): any {
    var fecha = {
      "year": parseInt(date.split('/')[2]),
      "month": parseInt(date.split('/')[1]),
      "day": parseInt(date.split('/')[0])
    };
    return fecha;
  }

  formatHourMinu(date: string): any {
    var horaminu = {
      "hour": parseInt(date.split(':')[0]),
      "minute": parseInt(date.split(':')[1]),
      "second": 0
    };
    return horaminu;
  }

  public modalEliminarSolicitar(user: any){
    //console.log(user);
    const modalRef = this.modalService.open(CancelarModalComponent);
    modalRef.componentInstance.titulo = 'movilidad'; // should be the id
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

  public createXLSX() : void {
    this.solicitarService.reporteAprobadosRRHH(5, 1).subscribe(
      resp => {
        //console.log(resp)
        this.listReporte = resp;
        const headers = ['Código', 'Nombre Completo', 'Tipo Solicitud', 'Fecha Registro', 'Fecha Inicio', 'Fecha Fin', 'Status', 'Código Aprobador' , 'Aprobador', 'Fecha Aprobada', 'Código Actualiza' , 'Actualizador', 'Fecha Actualizar'];
        const report = new ReportAdapterMovilidad(this.listReporte);
        //console.log(report)
        this.solicitarService.generateReportWithAdapter(headers,report.data, 'Reporte_movilidad_rrhh.xlsx');
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
    let param = "?ttiposolicitud=5"
    
    forkJoin({
      solicitud: this.solicitarService.listar(path, param)
    }).subscribe({
      next: ({ solicitud }) => {
        let solivenc: any = solicitud;
        const headers = ['Solicitud', 'Tipo Solicitud', 'Codigo Aprobador', 'Aprobador', 'Estado Laboral', 'Fecha registro', 'Codi. Solicitante', 'Fecha Inicio', 'Fecha Fin', '# Días'];
        const report = new ReportAdapterVencida(solivenc);
        this.solicitarService.generateReportVencidaWithAdapter(headers,report.data, 'Movilidades_pendientes.xlsx');
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
