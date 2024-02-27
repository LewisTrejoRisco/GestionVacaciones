import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import {
  ColumnMode,
  DatatableComponent,
  SelectionType
} from '@swimlane/ngx-datatable';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SolicitarLicenciaModalComponent } from './solicitar-modal/solicitar-licencia-modal.component';
import { AuthService } from 'app/shared/auth/auth.service';
import { SolicitarService } from 'app/shared/services/solicitar.service';
import { CancelarModalComponent } from 'app/vacaciones/cancelarModal/cancelar-modal.component';
import Swal from 'sweetalert2';
import { ReportAdapter } from 'app/shared/utilitarios/ReportAdapter.class';
import { Reporte } from 'app/shared/utilitarios/reporte.model';

@Component({
  selector: 'app-solicitar-licencia',
  templateUrl: './solicitar-licencia.component.html',
  styleUrls: ['./solicitar-licencia.component.scss', '../../../assets/sass/libs/datatables.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [SolicitarService]
})
export class SolicitarLicenciaComponent implements OnInit {

  @ViewChild('tableRowDetails') tableRowDetails: any;
  public ColumnMode = ColumnMode;
  public expanded: any = {};
  closeResult: string;
  public listaLicencia: any = [];
  public listaHistorialLicencias: any = [];
  //NUEVO
  sesion: any;
  public listReporte: Array<Reporte> = [];

  constructor(private modalService: NgbModal, 
    private solicitarService: SolicitarService,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.sesion = JSON.parse(this.authService.userToken);
    this.listarSolicitudesGroupBy();
    this.listarHistorialSolicitudes();
  }

  listarSolicitudesGroupBy() {
    this.solicitarService.listarSolicitudes(this.sesion.p_codipers, 4).subscribe(
      resp => {
        this.listaLicencia = resp;
        console.log(this.listaLicencia);
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
    this.solicitarService.listarHistorialLicenciasSolicitudes(this.sesion.p_codipers, 4).subscribe(
      resp => {
        this.listaHistorialLicencias = resp;
        console.log(this.listaHistorialLicencias);
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
    const modalRef = this.modalService.open(SolicitarLicenciaModalComponent);
    modalRef.componentInstance.id = tipo; // should be the id
    if(row == null) {
      modalRef.componentInstance.data = { fechaInic: null, 
                                          hasta: null, 
                                          descripcion: null,
                                          documento: null }; // should be the data
    } else {
      let fechInicEdit = null;
      if(row.tfechinicsoli.split('/').length == 3){
        fechInicEdit = {
          "year": parseInt(row.tfechinicsoli.split('/')[2]),
          "month": parseInt(row.tfechinicsoli.split('/')[1]),
          "day": parseInt(row.tfechinicsoli.split('/')[0])
        };
      }
      modalRef.componentInstance.data = { fechaInic: fechInicEdit, 
                                          hasta: row.tcantidaddias, 
                                          descripcion: row.tmotivo,
                                          documento: row.tficheroadjunto }; // should be the data
    }

    modalRef.result.then((result) => {
      let objSolicitud = null;
      if(row == null) {
        objSolicitud = {
          tsolicitudId : 0,
          idtiposolicitud : "4",
          usuarioregistro : this.sesion.p_codipers,
          usuariosolicitado : this.sesion.p_codipers,
          usuarioactual : this.sesion.p_matrresp,
          fechainiciosolicitud : result.fechaInic.day + '/' + result.fechaInic.month + '/' + result.fechaInic.year,
          status : "1",
          hasta : result.hasta.id,
          descripcion : result.descripcion,
          tficheroadjunto: result.documento
        }
      } else {
        objSolicitud = {
          tsolicitudId : row.tsolicitudId,
          idtiposolicitud : "4",
          usuarioregistro : this.sesion.p_codipers,
          usuariosolicitado : this.sesion.p_codipers,
          usuarioactual : this.sesion.p_matrresp,
          fechainiciosolicitud : result.fechaInic.day + '/' + result.fechaInic.month + '/' + result.fechaInic.year,
          status : "1",
          hasta : result.hasta.id,
          descripcion : result.descripcion,
          tficheroadjunto: result.documento
        }
      }
      this.solicitarService.grabarLicencia(objSolicitud).subscribe(
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
    modalRef.componentInstance.titulo = 'licencia'; // should be the id
    modalRef.componentInstance.data = { motivo: 'el motivo es' }; // should be the data

    modalRef.result.then((result) => {
      console.log(result)
      let objRechazar = {
        idsolicitud: user.tsolicitudId,
        usuarioactualizacion: this.sesion.p_codipers,
        motivorechazo: result.motivo
      }
      console.log(objRechazar);
      this.solicitarService.rechazarSolicitud(objRechazar).subscribe(
        resp => {
          console.log(resp)
          this.listarHistorialSolicitudes();
          this.listarSolicitudesGroupBy();
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
    this.solicitarService.reporteAprobadosRRHH(4, 1).subscribe(
      resp => {
        console.log(resp)
        this.listReporte = resp;
        const headers = ['Código', 'Nombre Completo', 'Tipo Solicitud', 'Fecha Registro', 'Fecha Inicio', 'Fecha Fin', 'Status', 'Código Aprobador' , 'Aprobador', 'Fecha Aprobada'];
        const report = new ReportAdapter(this.listReporte);
        console.log(report)
        this.solicitarService.generateReportWithAdapter(headers,report.data, 'Reporte_licencias_rrhh.xlsx');
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
