import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import {
  ColumnMode
} from '@swimlane/ngx-datatable';
import { DataVacation } from '../data/datavacation.data';
import { DataUserVacation } from '../data/datauservacation.data';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SolicitarModalComponent } from './solicitar-modal/solicitar-modal.component';
import { AuthService } from 'app/shared/auth/auth.service';
import { SolicitarService } from 'app/shared/services/solicitar.service';
import { CancelarModalComponent } from '../cancelarModal/cancelar-modal.component';

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
    private authService: AuthService) { }

  ngOnInit(): void {
    this.sesion = JSON.parse(this.authService.userToken);
    // this.listarSolicitudesGroupBy();
    this.listarHistorialSolicitudes();
    this.poblarListaResumen();
    console.log(this.listaSolicitudes)
  }

  poblarListaResumen() {
    this.listaSolicitudes = [
      {
        "status": "p_diaspaga",
        "statusDesc": "Gozados",
        "cantidad": this.sesion.p_diaspaga,
      },
      {
        "status": "p_diaspend",
        "statusDesc": "Pendientes",
        "cantidad": this.sesion.p_diaspend
      },
      {
        "status": "p_diastota",
        "statusDesc": "Totales",
        "cantidad": this.sesion.p_diastota
      },
      {
        "status": "p_diastrun",
        "statusDesc": "Truncos",
        "cantidad": this.sesion.p_diastrun
      },
      {
        "status": "p_diasvenc",
        "statusDesc": "Vencidos",
        "cantidad": this.sesion.p_diasvenc
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
      }
    )
  }

  /**
   * rowDetailsToggleExpand
   *
   * @param row
   */

  rowDetailsToggleExpand(row) {
    console.log(row);
    this.tableRowDetails.rowDetail.toggleExpandRow(row);
  }

  modalShowSolicitar(tipo: any, row: any) {
    const modalRef = this.modalService.open(SolicitarModalComponent);
    modalRef.componentInstance.id = tipo; // should be the id
    if(row == null) {
      modalRef.componentInstance.data = { fechaInic: null, hasta: null, descripcion: null }; // should be the data
    } else {
      let fechInicEdit = null;
      if(row.tfechinicsoli.split('/').length == 3){
        fechInicEdit = {
          "year": parseInt(row.tfechinicsoli.split('/')[2]),
          "month": parseInt(row.tfechinicsoli.split('/')[1]),
          "day": parseInt(row.tfechinicsoli.split('/')[0])
        };
      }
      console.log(fechInicEdit)
      modalRef.componentInstance.data = { fechaInic: fechInicEdit, hasta: row.tcantidad, descripcion: row.tdescripcion }; // should be the data
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
          descripcion : result.descripcion
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
          descripcion : result.descripcion
        }
      }
      console.log(objSolicitud);
      this.solicitarService.grabarSolicitud(objSolicitud).subscribe(
        resp => {
          console.log(resp)
          this.poblarListaResumen();
          this.listarHistorialSolicitudes();
        }, 
        error => {
          console.log("Error: " + error.message)
        }
      );
    }).catch((error) => {
      console.log(error);
    });
  }

  public modalEliminarSolicitar(user: any){
    console.log(user);
    const modalRef = this.modalService.open(CancelarModalComponent);
    modalRef.componentInstance.titulo = 'vacaciones'; // should be the id
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
        }, 
        error => {
          console.log("Error: " + error.message)
        }
      );
    }).catch((error) => {
      console.log(error);
    });
  }

}
