import { Component, OnInit, ViewEncapsulation, ViewChild, ChangeDetectorRef } from '@angular/core';
import {
  ColumnMode
} from '@swimlane/ngx-datatable';
import { DataVacation } from '../data/datavacation.data';
import { DataUserVacation } from '../data/datauservacation.data';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SolicitarModalComponent } from './solicitar-modal/solicitar-modal.component';
import { AuthService } from 'app/shared/auth/auth.service';
import { SolicitarService } from 'app/shared/services/solicitar.service';
import { CancelarModalComponent } from '../cancelarModal/cancelar-modal.component';
import Swal from 'sweetalert2';
import { ReportAdapter } from 'app/shared/utilitarios/ReportAdapter.class';
import { Reporte } from 'app/shared/utilitarios/reporte.model';
import { ReportAdapterComun } from 'app/shared/utilitarios/ReportAdapterComun.class';

@Component({
  selector: 'app-solicitar',
  templateUrl: './solicitar.component.html',
  styleUrls: ['./solicitar.component.scss', '../../../assets/sass/libs/datatables.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [SolicitarService]
})
export class SolicitarComponent implements OnInit {

  @ViewChild('tableRowDetails') tableRowDetails: any;
  public ColumnMode = ColumnMode;
  // row data
  public rows = DataVacation;
  public userRows = DataUserVacation;

  public expanded: any = {};
  closeResult: string;

  public listaSolicitudes: any = [];
  public listaHistorialSolicitudes: any = [];
  public p_diaspaga: string = null;
  public p_diaspend: string = null;
  public p_diastota: string = null;
  public p_diastrun: string = null;
  public p_diasvenc: string = null;


  //NUEVO
  sesion: any;
  fechaIngreso: string = null;
  public listReporte: Array<Reporte> = [];
  public objeDetaVaca: any;

  constructor(private modalService: NgbModal, 
    private solicitarService: SolicitarService,
    private authService: AuthService,
    private changeDetector:ChangeDetectorRef) { }

  ngOnInit(): void {
    this.sesion = JSON.parse(this.authService.userSesion);
    //console.log(this.sesion)
    this.fechaIngreso = this.sesion.p_fechingr.split("T")[0]
    this.listarHistorialSolicitudes();
    this.poblarListaResumen();
    this.changeDetector.detectChanges()
  }

  poblarListaResumen() {
    this.listaSolicitudes = [
      {
        "status": "p_diaspaga",
        "statusDesc": "Gozados",
        "cantidad": this.sesion.p_diaspaga,
      },
      {
        "status": "p_diasvenc",
        "statusDesc": "Vencidos",
        "cantidad": this.sesion.p_diasvenc
      },
      {
        "status": "p_diaspend",
        "statusDesc": "Pendientes",
        "cantidad": this.sesion.p_diaspend
      },
      {
        "status": "p_diastrun",
        "statusDesc": "Truncos",
        "cantidad": this.sesion.p_diastrun
      },
      {
        "status": "p_diasadela",
        "statusDesc": "Adelantado",
        "cantidad": '0'
      },
      {
        "status": "p_diastota",
        "statusDesc": "Totales",
        "cantidad": this.sesion.p_diastota
      },
      {
        "status": "p_diasprog",
        "statusDesc": "Programados",
        "cantidad": '0'
      }
    ]
  }

  listarHistorialSolicitudes() {
    this.solicitarService.listarHistorialSolicitudes(this.sesion.p_codipers, 1).subscribe(
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
    this.changeDetector.detectChanges();
  }

  openModal(tipo: any, row: any, fechaInic: any, hasta: any, descripcion: any, codipers: any, periodo: any, reemplazo: any) {
    var  modalRef = this.modalService.open(SolicitarModalComponent, { size: 'lg' });  
    modalRef.componentInstance.id = tipo; // should be the id
    modalRef.componentInstance.data = { fechaInic: fechaInic, 
                                        hasta: hasta, 
                                        descripcion: descripcion, 
                                        codipers: codipers,
                                        periodo: periodo,
                                        reemplazo: reemplazo
                                      }; // should be the data
    modalRef.result.then((result) => {
            let fechaInicio:string = result.fechaInic.day + '/' + result.fechaInic.month + '/' + result.fechaInic.year;
      let cantidadDias: number = result.hasta.id;
      let periodo: number = Number(result.periodo);
      
      let listTipoDia = [];
      if(this.sesion.p_diasvenc > 0 && cantidadDias > 0) {
        let diasProg: number = cantidadDias;
        let periProg: number = periodo;
        if (this.sesion.p_diasvenc <= cantidadDias) {
          diasProg = this.sesion.p_diasvenc;
        }
        let objTipoDia = {
          tfechaInicio : fechaInicio,
          tcantidadDias : diasProg,
          tperiodo : periProg.toString()
        }
        listTipoDia.push(objTipoDia);
        fechaInicio = this.sumarFecha(result.fechaInic.year, result.fechaInic.month, result.fechaInic.day, diasProg);
        cantidadDias = cantidadDias - diasProg;
        periodo = periodo + 1;
      }
      if(this.sesion.p_diaspend > 0 && cantidadDias > 0) {
        let diasProg: number = cantidadDias;
        let periProg: number = periodo;
        if (this.sesion.p_diaspend <= cantidadDias) {
          diasProg = this.sesion.p_diaspend;
        }
        let objTipoDia = {
          tfechaInicio : fechaInicio,
          tcantidadDias : diasProg,
          tperiodo : periProg.toString()
        }
        listTipoDia.push(objTipoDia);
        fechaInicio = this.sumarFecha(result.fechaInic.year, result.fechaInic.month, result.fechaInic.day, diasProg);
        cantidadDias = cantidadDias - diasProg;
        periodo = periodo + 1;
      }
      if(this.sesion.p_diastrun > 0 && cantidadDias > 0) {
        let diasProg: number = cantidadDias;
        let periProg: number = periodo;
        if (this.sesion.p_diastrun <= cantidadDias) {
          diasProg = this.sesion.p_diastrun;
        }
        let objTipoDia = {
          tfechaInicio : fechaInicio,
          tcantidadDias : diasProg,
          tperiodo : periProg.toString()
        }
        listTipoDia.push(objTipoDia);
      }
      for (var i = 0; i < listTipoDia.length; i++) {
        this.grabarSolicitud(row, listTipoDia[i].tfechaInicio, listTipoDia[i].tcantidadDias, listTipoDia[i].tperiodo, result);
      }
    }).catch((error) => {
      console.log(error);
    });
    // this.changeDetector.detectChanges();
  }

  modalShowSolicitar(tipo: any, row: any) {
    if(row == null) {
      this.openModal(tipo, row, null, null, null, this.sesion.p_codipers, null, null)
    } else {
      let fechInicEdit = null;
      if(row.tfechinicsoli.split('/').length == 3){
        fechInicEdit = {
          "year": parseInt(row.tfechinicsoli.split('/')[2]),
          "month": parseInt(row.tfechinicsoli.split('/')[1]),
          "day": parseInt(row.tfechinicsoli.split('/')[0])
        };
      }
      this.openModal(tipo, row, fechInicEdit, row.tcantidad, row.tdescripcion, this.sesion.p_codipers, row.tperiodo, row.treemplazo)
    }
  }

  public grabarSolicitud(row: any, fechaInicio:string, cantidadDias: number, periodo: number, result: any) {
    let objSolicitud = null;
    objSolicitud = {
      tsolicitudId : row == null ? 0 : row.tsolicitudId,
      idtiposolicitud : "1",
      usuarioregistro : this.sesion.p_codipers,
      usuariosolicitado : this.sesion.p_codipers,
      usuarioactual : this.sesion.p_matrresp,
      fechainiciosolicitud : fechaInicio,
      status : "1",
      cantidaddias : cantidadDias,
      descripcion : result.descripcion,
      periodo: periodo,
      treemplazo: result.reemplazo
    }
    //console.log(objSolicitud);
    this.solicitarService.grabarSolicitud(objSolicitud).subscribe(
      resp => {
        //console.log(resp)
        this.poblarListaResumen();
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
          //console.log("Error: " + error.message)
          Swal.fire(
          'Error',
          'error al grabar la solicitud:'+ error.message,
          'error'
          );
        }
    );
  }

  public sumarFecha(anio: number, mes: number, dia: number, diasProg): string {
    const startDate  = new Date(anio, mes - 1, dia)
        const currentDate = new Date(startDate.getTime());
        currentDate.setDate(startDate.getDate() + diasProg);
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Agregar 1 al mes porque los meses van de 0 a 11
        const day = currentDate.getDate().toString().padStart(2, '0');
        const formattedDate = `${day}/${month}/${year}`;
    return formattedDate
  }

  public modalEliminarSolicitar(user: any){
    const modalRef = this.modalService.open(CancelarModalComponent);
    modalRef.componentInstance.titulo = 'vacaciones'; // should be the id
    modalRef.componentInstance.data = { motivo: 'el motivo es' }; // should be the data

    modalRef.result.then((result) => {
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
    this.solicitarService.reporteAprobadosRRHH(1, 1).subscribe(
      resp => {
        //console.log(resp)
        this.listReporte = resp;
        const headers = ['Código', 'Nombre Completo', 'Tipo Solicitud', 'Fecha Registro', 'Fecha Inicio', 'Fecha Fin', 'Status', 'Código Aprobador' , 'Aprobador', 'Fecha Aprobada'];
        const report = new ReportAdapterComun(this.listReporte);
        //console.log(report)
        this.solicitarService.generateReportWithAdapter(headers,report.data, 'Reporte_vacaciones_rrhh.xlsx');
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
