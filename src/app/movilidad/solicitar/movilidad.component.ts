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

  //NUEVO
  sesion: any;

  constructor(private modalService: NgbModal, 
    private solicitarService: SolicitarService,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.sesion = JSON.parse(this.authService.userToken);
    this.listarSolicitudesGroupBy();
    this.listarHistorialSolicitudes();
    console.log("solicitar componente")
    console.log(this.sesion.p_codipers)
  }

  listarSolicitudesGroupBy() {
    this.solicitarService.listarSolicitudes(this.sesion.p_codipers, 5).subscribe(
      resp => {
        this.listaMovilidad = resp;
        console.log(this.listaMovilidad);
      }, 
      error => {
        console.log("error:", error.message)
      }
    )
  }

  listarHistorialSolicitudes() {
    this.solicitarService.listarHistorialMovilidadSolicitudes(this.sesion.p_codipers, 5).subscribe(
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
    this.tableRowDetails.rowDetail.toggleExpandRow(row);
  }

  modalShowSolicitar(tipo: any, row: any) {
    const modalRef = this.modalService.open(MovilidadModalComponent, { size: 'lg' });
    modalRef.componentInstance.id = tipo; // should be the id
    if(row == null) {
      modalRef.componentInstance.data = { fechaInic: null, fechaFina: null, numeViajes: null, transporte: null , origen: null, destino: null , motivo: null , monto: null  }; // should be the data
    } else {
      let fechInicEdit = null;
      let fechFinEdit = null;
      if(row.tfechinicsoli.split('/').length == 3){
        fechInicEdit = {
          "year": parseInt(row.tfechinicsoli.split('/')[2]),
          "month": parseInt(row.tfechinicsoli.split('/')[1]),
          "day": parseInt(row.tfechinicsoli.split('/')[0])
        };
      }
      if(row.tfechfinasoli.split('/').length == 3){
        fechFinEdit = {
          "year": parseInt(row.tfechfinasoli.split('/')[2]),
          "month": parseInt(row.tfechfinasoli.split('/')[1]),
          "day": parseInt(row.tfechfinasoli.split('/')[0])
        };
      }
      modalRef.componentInstance.data = { fechaInic: fechInicEdit, 
                                          fechaFina: fechFinEdit, 
                                          numeViajes: row.tnumeviaje, 
                                          transporte: row.ttransporte , 
                                          origen: row.torigen, 
                                          destino: row.tdestino , 
                                          motivo: row.tmotivo , 
                                          monto: row.tmonto  }; // should be the data
    
    }

    modalRef.result.then((result) => {
      let objSolicitud = null;
      if(row == null) {
        objSolicitud = {
          tsolicitudId : 0,
          idtiposolicitud : "5",
          usuarioregistro : this.sesion.p_codipers,
          usuariosolicitado : this.sesion.p_codipers,
          usuarioactual : this.sesion.p_matrresp,
          status : "1",
          tfechinicio : result.fechaInic.day + '/' + result.fechaInic.month + '/' + result.fechaInic.year,
          tfechfin : result.fechaFina.day + '/' + result.fechaFina.month + '/' + result.fechaFina.year,
          tnumeviaje : result.numeViajes,
          ttransporte : result.transporte.name,
          torigen : result.origen.name,
          tdestino : result.destino.name,
          tmotivo : result.motivo,
          tmonto : result.monto,
        }
      } else {
        objSolicitud = {
          tsolicitudId : row.tsolicitudId,
          idtiposolicitud : "5",
          usuarioregistro : this.sesion.p_codipers,
          usuariosolicitado : this.sesion.p_codipers,
          usuarioactual : this.sesion.p_matrresp,
          status : "1",
          tfechinicio : result.fechaInic.day + '/' + result.fechaInic.month + '/' + result.fechaInic.year,
          tfechfin : result.fechaFina.day + '/' + result.fechaFina.month + '/' + result.fechaFina.year,
          tnumeviaje : result.numeViajes,
          ttransporte : result.transporte.name,
          torigen : result.origen.name,
          tdestino : result.destino.name,
          tmotivo : result.motivo,
          tmonto : result.monto,
        }
      }
      console.log(objSolicitud);
      this.solicitarService.grabarMovilidad(objSolicitud).subscribe(
        resp => {
          console.log(resp)
          this.listarSolicitudesGroupBy();
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
    modalRef.componentInstance.titulo = 'movilidad'; // should be the id
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
        }
      );
    }).catch((error) => {
      console.log(error);
    });
  }

}
