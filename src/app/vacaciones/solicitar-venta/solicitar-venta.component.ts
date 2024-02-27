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
    this.sesion = JSON.parse(this.authService.userToken);
    this.listarSolicitudesGroupBy();
    this.listarHistorialSolicitudes();
  }

  listarSolicitudesGroupBy() {
    this.solicitarVentaService.listarSolicitudes(this.sesion.p_codipers, 2).subscribe(
      resp => {
        this.listaSolicitudesVenta = resp;
        console.log(this.listaSolicitudesVenta);
      }, 
      error => {
        console.log("error:", error.message)
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
        console.log(this.listaHistorialSolicitudesVenta);
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

  /**
   * rowDetailsToggleExpand
   *
   * @param row
   */

  rowDetailsToggleExpand(row) {
    this.tableRowDetails.rowDetail.toggleExpandRow(row);
  }

  modalShowSolicitar(tipo: any, row: any) {
    const modalRef = this.modalService.open(SolicitarVentaModalComponent);
    modalRef.componentInstance.id = tipo; // should be the id
    
    if(row == null) {
      modalRef.componentInstance.data = {hasta: ''}; // should be the data
    } else {
      modalRef.componentInstance.data = {hasta: row.tcantidad}; // should be the data
    }

    modalRef.result.then((result) => {
      let objSolicitud = null;
      if(row == null) {
        objSolicitud = {
          tsolicitudId : 0,
          idtiposolicitud : "2",
          usuarioregistro : this.sesion.p_codipers,
          usuariosolicitado : this.sesion.p_codipers,
          areaactualtrabajador : this.sesion.p_unidfunc,
          usuarioactual : this.sesion.p_matrresp,
          status : "1",
          cantidaddias : result.hasta.name
        }
      } else {
        objSolicitud = {
          tsolicitudId : row.tsolicitudId,
          idtiposolicitud : "2",
          usuarioregistro : this.sesion.p_codipers,
          usuariosolicitado : this.sesion.p_codipers,
          areaactualtrabajador : this.sesion.p_unidfunc,
          usuarioactual : this.sesion.p_matrresp,
          status : "1",
          cantidaddias : result.hasta.name
        }
      }
      console.log(objSolicitud);
      this.solicitarVentaService.grabarSolicitud(objSolicitud).subscribe(
        resp => {
          console.log(resp)
          this.listarSolicitudesGroupBy();
          this.listarHistorialSolicitudes();
          Swal.fire({
            title: 'Exito',
            text: 'Solicitud generada',
            icon: 'success',
            timer: 1500, 
            showConfirmButton: false,
          })
        }, 
        error => {
          console.log("Error: " + error.message)
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
    const modalRef = this.modalService.open(CancelarModalComponent);
    modalRef.componentInstance.titulo = 'venta de vacaciones'; // should be the id
    modalRef.componentInstance.data = { motivo: 'el motivo es' }; // should be the data

    modalRef.result.then((result) => {
      let objRechazar = {
        idsolicitud: user.tsolicitudId,
        usuarioactualizacion: this.sesion.p_codipers,
        motivorechazo: result.motivo
      }
      console.log(objRechazar);
      this.solicitarVentaService.rechazarSolicitud(objRechazar).subscribe(
        resp => {
          console.log(resp)
          this.listarHistorialSolicitudes();
        }, 
        error => {
          console.log("Error: " + error.message)
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
    this.solicitarVentaService.reporteAprobadosRRHH(2, 1).subscribe(
      resp => {
        console.log(resp)
        this.listReporte = resp;
        const headers = ['Código', 'Nombre Completo', 'Tipo Solicitud', 'Fecha Registro', 'Fecha Inicio', 'Fecha Fin', 'Status', 'Código Aprobador' , 'Aprobador', 'Fecha Aprobada'];
        const report = new ReportAdapter(this.listReporte);
        console.log(report)
        this.solicitarVentaService.generateReportWithAdapter(headers,report.data, 'Reporte_venta_vacaciones_rrhh.xlsx');
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
