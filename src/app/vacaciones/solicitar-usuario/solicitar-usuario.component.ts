import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import {
  ColumnMode
} from '@swimlane/ngx-datatable';
import { DataVacation } from '../data/datavacation.data';
import { DataUserVacation } from '../data/datauservacation.data';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SolicitarModalComponent } from '../solicitar/solicitar-modal/solicitar-modal.component';
import { AuthService } from 'app/shared/auth/auth.service';
import { SolicitarService } from 'app/shared/services/solicitar.service';
import { CancelarModalComponent } from '../cancelarModal/cancelar-modal.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-solicitar-usuario',
  templateUrl: './solicitar-usuario.component.html',
  styleUrls: ['./solicitar-usuario.component.scss', '../../../assets/sass/libs/datatables.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [SolicitarService]
})
export class SolicitarUsuarioComponent implements OnInit {

  @ViewChild('tableRowDetails') tableRowDetails: any;
  public ColumnMode = ColumnMode;
  public rows = DataVacation;
  public userRows = DataUserVacation;
  public expanded: any = {};
  closeResult: string;

  public listaSolicitudesUsua: any = [];
  public listaHistorialSolicitudesUsua: any = [];
  public solicitarFlag: boolean = false;
  //NUEVO
  sesion: any;
  codigoTrabajador: string = null;
  usuarioSolicitar: any = null;
  nombreCompleto: string = null;

  constructor(private modalService: NgbModal, 
    private solicitarService: SolicitarService,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.sesion = JSON.parse(this.authService.userToken);
  }

  poblarListaResumen(usuario: any) {
    this.listaSolicitudesUsua = [
      {
        "status": "p_diaspaga",
        "statusDesc": "Gozados",
        "cantidad": usuario.p_diaspaga,
      },
      {
        "status": "p_diasvenc",
        "statusDesc": "Vencidos",
        "cantidad": usuario.p_diasvenc
      },
      {
        "status": "p_diaspend",
        "statusDesc": "Pendientes",
        "cantidad": usuario.p_diaspend
      },
      {
        "status": "p_diastrun",
        "statusDesc": "Truncos",
        "cantidad": usuario.p_diastrun
      },
      {
        "status": "p_diasadela",
        "statusDesc": "Adelantado",
        "cantidad": '0'
      },
      {
        "status": "p_diastota",
        "statusDesc": "Totales",
        "cantidad": usuario.p_diastota
      },
      {
        "status": "p_diasprog",
        "statusDesc": "Programados",
        "cantidad": '0'
      }
    ]
  }

  obtenerUsuario() {
    this.authService.obtenerDatos(this.codigoTrabajador).subscribe(
      resp => {
        this.usuarioSolicitar = resp;
        if (this.usuarioSolicitar.p_menserro == null) {
          console.log(this.usuarioSolicitar)
          this.nombreCompleto = this.usuarioSolicitar.p_nombcompleto;
          this.solicitarFlag = true;
          this.poblarListaResumen(this.usuarioSolicitar);
          this.listarHistorialSolicitudesUsua();
        } else {
          this.solicitarFlag = false;
        }
      },
      error => {
        this.solicitarFlag = false;
        Swal.fire(
          'Error',
          'error al obtener usuario:'+ error.message,
          'error'
        );
      }
    )
  }

  modalShowSolicitar(tipo: any, row: any) {
    const modalRef = this.modalService.open(SolicitarModalComponent);
    modalRef.componentInstance.id = tipo; // should be the id
    if(row == null) {
      modalRef.componentInstance.data = { fechaInic: null, 
                                          hasta: null, 
                                          descripcion: null, 
                                          codipers: this.usuarioSolicitar.p_codipers,
                                          periodo: null }; // should be the data
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
                                          codipers: this.usuarioSolicitar.p_codipers,
                                          periodo: null }; // should be the data
    }
    modalRef.result.then((result) => {
      let objSolicitud = null;
      if(row == null) {
        objSolicitud = {
          tsolicitudId : 0,
          idtiposolicitud : "1",
          usuarioregistro : this.sesion.p_codipers,
          usuariosolicitado : this.usuarioSolicitar.p_codipers,
          usuarioactual : this.usuarioSolicitar.p_matrresp,
          fechainiciosolicitud : result.fechaInic.day + '/' + result.fechaInic.month + '/' + result.fechaInic.year,
          status : "1",
          cantidaddias : result.hasta.name,
          descripcion : result.descripcion,
          periodo: result.periodo
        }
      } else {
        objSolicitud = {
          tsolicitudId : row.tsolicitudId,
          idtiposolicitud : "1",
          usuarioregistro : this.sesion.p_codipers,
          usuariosolicitado : this.usuarioSolicitar.p_codipers,
          usuarioactual : this.usuarioSolicitar.p_matrresp,
          fechainiciosolicitud : result.fechaInic.day + '/' + result.fechaInic.month + '/' + result.fechaInic.year,
          status : "1",
          cantidaddias : result.hasta.name,
          descripcion : result.descripcion,
          periodo: result.periodo
        }
      }
      console.log(objSolicitud);
      this.solicitarService.grabarSolicitud(objSolicitud).subscribe(
        resp => {
          console.log(resp)
          this.poblarListaResumen(this.usuarioSolicitar.p_codipers);
          this.listarHistorialSolicitudesUsua();
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

  listarHistorialSolicitudesUsua() {
    this.solicitarService.listarHistorialSolicitudes(this.usuarioSolicitar.p_codipers, 1).subscribe(
      resp => {
        this.listaHistorialSolicitudesUsua = resp;
        console.log(this.listaHistorialSolicitudesUsua);
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
          this.listarHistorialSolicitudesUsua();
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
