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

  constructor(private modalService: NgbModal, 
    private solicitarService: SolicitarService,
    private authService: AuthService,
    private changeDetector:ChangeDetectorRef) { }

  ngOnInit(): void {
    this.sesion = JSON.parse(this.authService.userToken);
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
        console.log(this.listaHistorialSolicitudes);
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
    this.changeDetector.detectChanges();
  }

  modalShowSolicitar(tipo: any, row: any) {
    this.changeDetector.detectChanges();
    const modalRef = this.modalService.open(SolicitarModalComponent);
    modalRef.componentInstance.id = tipo; // should be the id
    if(row == null) {
      modalRef.componentInstance.data = { fechaInic: null, 
                                          hasta: null, 
                                          descripcion: null, 
                                          codipers: this.sesion.p_codipers,
                                          periodo: null,
                                          reemplazo: null
                                        }; // should be the data
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
                                          hasta: row.tcantidad, 
                                          descripcion: row.tdescripcion, 
                                          codipers: this.sesion.p_codipers, 
                                          periodo: row.tperiodo,
                                          reemplazo: row.treemplazo
                                        }; // should be the data
    }
    modalRef.result.then((result) => {
      let objSolicitud = null;
      if(row == null) {
        objSolicitud = {
          tsolicitudId : 0,
          idtiposolicitud : "1",
          usuarioregistro : this.sesion.p_codipers,
          usuariosolicitado : this.sesion.p_codipers,
          usuarioactual : this.sesion.p_matrresp,
          fechainiciosolicitud : result.fechaInic.day + '/' + result.fechaInic.month + '/' + result.fechaInic.year,
          status : "1",
          cantidaddias : result.hasta.name,
          descripcion : result.descripcion,
          periodo: result.periodo,
          treemplazo: result.reemplazo
        }
      } else {
        objSolicitud = {
          tsolicitudId : row.tsolicitudId,
          idtiposolicitud : "1",
          usuarioregistro : this.sesion.p_codipers,
          usuariosolicitado : this.sesion.p_codipers,
          usuarioactual : this.sesion.p_matrresp,
          fechainiciosolicitud : result.fechaInic.day + '/' + result.fechaInic.month + '/' + result.fechaInic.year,
          status : "1",
          cantidaddias : result.hasta.name,
          descripcion : result.descripcion,
          periodo: result.periodo,
          treemplazo: result.reemplazo
        }
      }
      console.log(objSolicitud);
      this.solicitarService.grabarSolicitud(objSolicitud).subscribe(
        resp => {
          console.log(resp)
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
    this.changeDetector.detectChanges();
  }

  public modalEliminarSolicitar(user: any){
    const modalRef = this.modalService.open(CancelarModalComponent);
    modalRef.componentInstance.titulo = 'vacaciones'; // should be the id
    modalRef.componentInstance.data = { motivo: 'el motivo es' }; // should be the data

    modalRef.result.then((result) => {
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

}
