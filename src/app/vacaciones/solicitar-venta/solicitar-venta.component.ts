import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import {
  ColumnMode
} from '@swimlane/ngx-datatable';
import { DataVacation } from '../data/datavacation.data';
import { DataUserVacation } from '../data/datauservacation.data';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SolicitarService } from 'app/shared/services/solicitar.service';
import { AuthService } from 'app/shared/auth/auth.service';
import { SolicitarVentaModalComponent } from './solicitar-venta-modal/solicitar-venta-modal.component';
import Swal from 'sweetalert2';
import { CancelarModalComponent } from '../cancelarModal/cancelar-modal.component';
import { Reporte } from 'app/shared/utilitarios/reporte.model';
import { ReportAdapter } from 'app/shared/utilitarios/ReportAdapter.class';
import { ReportAdapterComun } from 'app/shared/utilitarios/ReportAdapterComun.class';
import { ReportAdapterVacaciones } from 'app/shared/utilitarios/ReportAdapterVacaciones.class';
import { REPORTE_SOLICITUD_VENCIDA } from 'app/shared/utilitarios/Constantes';
import { forkJoin } from 'rxjs';
import { ReportAdapterVencida } from 'app/shared/utilitarios/ReportAdapterVencida.class';

@Component({
  selector: 'app-solicitar-venta',
  templateUrl: './solicitar-venta.component.html',
  styleUrls: ['./solicitar-venta.component.scss', '../../../assets/sass/libs/datatables.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [SolicitarService]
})
export class SolicitarVentaComponent implements OnInit {

  @ViewChild('tableRowDetails') tableRowDetails: any;
  public ColumnMode = ColumnMode;
  // row data
  public rows = DataVacation;
  public userRows = DataUserVacation;

  public expanded: any = {};
  closeResult: string;

  public listaSolicitudesVenta: any = [];
  public listaHistorialSolicitudesVenta: any = [];
  //NUEVO
  sesion: any;
  public listReporte: Array<Reporte> = [];

  constructor(private modalService: NgbModal, 
    private solicitarVentaService: SolicitarService,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.sesion = JSON.parse(this.authService.userSesion);
    this.listarSolicitudesGroupBy();
    this.listarHistorialSolicitudes();
  }

  listarSolicitudesGroupBy() {
    this.solicitarVentaService.listarSolicitudes(this.sesion.p_codipers, 2).subscribe(
      resp => {
        this.listaSolicitudesVenta = resp;
        //console.log(this.listaSolicitudesVenta);
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
    this.solicitarVentaService.listarHistorialSolicitudes(this.sesion.p_codipers, 2).subscribe(
      resp => {
        this.listaHistorialSolicitudesVenta = resp;
        //console.log(this.listaHistorialSolicitudesVenta);
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

  openModal(tipo: any, row: any, hasta: any, codipers: any) {
    const modalRef = this.modalService.open(SolicitarVentaModalComponent);
    modalRef.componentInstance.id = tipo; // should be the id
    modalRef.componentInstance.data = {hasta: hasta,
                                       codipers: codipers
                                      }; // should be the data
    modalRef.result.then((result) => {
      let objSolicitud = null;
      objSolicitud = {
        tsolicitudId : row == null ? 0 : row.tsolicitudId,
        idtiposolicitud : "2",
        usuarioregistro : this.sesion.p_codipers,
        usuariosolicitado : this.sesion.p_codipers,
        areaactualtrabajador : this.sesion.p_unidfunc,
        usuarioactual : this.sesion.p_matrresp,
        status : "1",
        cantidaddias : result.hasta.name,
        periodo: result.periodo,
      }
      this.solicitarVentaService.grabarSolicitud(objSolicitud).subscribe(
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

  modalShowSolicitar(tipo: any, row: any) {    
    if(row == null) {
      this.openModal(tipo, row, null, this.sesion.p_codipers);
    } else {
      this.openModal(tipo, row, row.tcantidad, this.sesion.p_codipers);
    }
  }

  public modalEliminarSolicitar(user: any){
    const modalRef = this.modalService.open(CancelarModalComponent);
    modalRef.componentInstance.titulo = 'venta de vacaciones'; // should be the id
    modalRef.componentInstance.data = { motivo: 'el motivo es' }; // should be the data

    modalRef.result.then((result) => {
      let objRechazar = {
        idsolicitud: user.tsolicitudId,
        usuarioactualizacion: this.sesion.p_codipers,
        motivorechazo: result.motivo,
        flagAnulado: true
      }
      //console.log(objRechazar);
      this.solicitarVentaService.rechazarSolicitud(objRechazar).subscribe(
        resp => {
          //console.log(resp)
          this.listarHistorialSolicitudes();
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
    this.solicitarVentaService.reporteVentaVacacionesRRHH().subscribe(
      resp => {
        //console.log(resp)
        this.listReporte = resp;
        const headers = ['Código', 'Nombre Completo', 'Tipo Solicitud', 'Fecha Inicio', 'Fecha Fin', '# Dias', 'Status', 'Aprobador', 'Fecha Aprobada', 'Adelanto de Pago'];
        const report = new ReportAdapterVacaciones(this.listReporte);
        //console.log(report)
        this.solicitarVentaService.generateReportVacationWithAdapter(headers,report.data, 'Reporte_venta_vacaciones_rrhh.xlsx');
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
    let param = "?ttiposolicitud=2"
    
    forkJoin({
      solicitud: this.solicitarVentaService.listar(path, param)
    }).subscribe({
      next: ({ solicitud }) => {
        let solivenc: any = solicitud;
        const headers = ['Solicitud', 'Tipo Solicitud', 'Codigo Aprobador', 'Aprobador', 'Estado Laboral', 'Fecha registro', 'Codi. Solicitante', 'Fecha Inicio', 'Fecha Fin', '# Días'];
        const report = new ReportAdapterVencida(solivenc);
        this.solicitarVentaService.generateReportVencidaWithAdapter(headers,report.data, 'Venta_vacaciones_pendientes.xlsx');
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
