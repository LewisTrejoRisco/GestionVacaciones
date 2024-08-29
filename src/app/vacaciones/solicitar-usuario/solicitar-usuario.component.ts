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
    this.sesion = JSON.parse(this.authService.userSesion);
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
          this.authService.obtenerFoto(this.usuarioSolicitar.p_codipers, JSON.parse(this.authService.userToken).token).subscribe(
            (imagen: Blob) =>{
              this.createImageFromBlob(imagen, this.usuarioSolicitar);
            }, error=> {
              console.log(error)
            }
          )
          // console.log(this.usuarioSolicitar)
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

  createImageFromBlob(image: Blob, user: any): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      user.p_foto = reader.result as string;
    }, false);
    if (image) {
      reader.readAsDataURL(image);
    }
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
      if(this.usuarioSolicitar.p_diasvenc > 0 && cantidadDias > 0) {
        let diasProg: number = cantidadDias;
        let periProg: number = periodo;
        if (this.usuarioSolicitar.p_diasvenc <= cantidadDias) {
          diasProg = this.usuarioSolicitar.p_diasvenc;
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
      if(this.usuarioSolicitar.p_diaspend > 0 && cantidadDias > 0) {
        let diasProg: number = cantidadDias;
        let periProg: number = periodo;
        if (this.usuarioSolicitar.p_diaspend <= cantidadDias) {
          diasProg = this.usuarioSolicitar.p_diaspend;
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
      if(this.usuarioSolicitar.p_diastrun > 0 && cantidadDias > 0) {
        let diasProg: number = cantidadDias;
        let periProg: number = periodo;
        if (this.usuarioSolicitar.p_diastrun <= cantidadDias) {
          diasProg = this.usuarioSolicitar.p_diastrun;
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

  public grabarSolicitud(row: any, fechaInicio:string, cantidadDias: number, periodo: number, result: any) {
    let objSolicitud = null;
    objSolicitud = {
      tsolicitudId : row == null ? 0 : row.tsolicitudId,
      idtiposolicitud : "1",
      usuarioregistro : this.sesion.p_codipers,
      // usuariosolicitado : this.sesion.p_codipers,
      // usuarioactual : this.sesion.p_matrresp,
      usuariosolicitado : this.usuarioSolicitar.p_codipers,
      usuarioactual : this.usuarioSolicitar.p_matrresp,
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
        this.poblarListaResumen(this.usuarioSolicitar);
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
          //console.log("Error: " + error.message)
          Swal.fire(
          'Error',
          'error al grabar la solicitud:'+ error.message,
          'error'
          );
        }
    );
  }

  modalShowSolicitar(tipo: any, row: any) {
    // const modalRef = this.modalService.open(SolicitarModalComponent);
    // modalRef.componentInstance.id = tipo; // should be the id
    if(row == null) {
      // modalRef.componentInstance.data = { fechaInic: null, 
      //                                     hasta: null, 
      //                                     descripcion: null, 
      //                                     codipers: this.usuarioSolicitar.p_codipers,
      //                                     periodo: null }; // should be the data
      this.openModal(tipo, row, null, null, null, this.usuarioSolicitar.p_codipers, null, null)
    } else {
      let fechInicEdit = null;
      if(row.tfechinicsoli.split('/').length == 3){
        fechInicEdit = {
          "year": parseInt(row.tfechinicsoli.split('/')[2]),
          "month": parseInt(row.tfechinicsoli.split('/')[1]),
          "day": parseInt(row.tfechinicsoli.split('/')[0])
        };
      }
      this.openModal(tipo, row, fechInicEdit, row.tcantidad, row.tdescripcion, this.usuarioSolicitar.p_codipers, row.tperiodo, row.treemplazo)
      // modalRef.componentInstance.data = { fechaInic: fechInicEdit, 
      //                                     hasta: row.tcantidad, 
      //                                     descripcion: row.tdescripcion, 
      //                                     codipers: this.usuarioSolicitar.p_codipers,
      //                                     periodo: null }; // should be the data
    }
    // modalRef.result.then((result) => {
    //   let objSolicitud = null;
    //   if(row == null) {
    //     objSolicitud = {
    //       tsolicitudId : 0,
    //       idtiposolicitud : "1",
    //       usuarioregistro : this.sesion.p_codipers,
    //       usuariosolicitado : this.usuarioSolicitar.p_codipers,
    //       usuarioactual : this.usuarioSolicitar.p_matrresp,
    //       fechainiciosolicitud : result.fechaInic.day + '/' + result.fechaInic.month + '/' + result.fechaInic.year,
    //       status : "1",
    //       cantidaddias : result.hasta.name,
    //       descripcion : result.descripcion,
    //       periodo: result.periodo
    //     }
    //   } else {
    //     objSolicitud = {
    //       tsolicitudId : row.tsolicitudId,
    //       idtiposolicitud : "1",
    //       usuarioregistro : this.sesion.p_codipers,
    //       usuariosolicitado : this.usuarioSolicitar.p_codipers,
    //       usuarioactual : this.usuarioSolicitar.p_matrresp,
    //       fechainiciosolicitud : result.fechaInic.day + '/' + result.fechaInic.month + '/' + result.fechaInic.year,
    //       status : "1",
    //       cantidaddias : result.hasta.name,
    //       descripcion : result.descripcion,
    //       periodo: result.periodo
    //     }
    //   }
    //   //console.log(objSolicitud);
    //   this.solicitarService.grabarSolicitud(objSolicitud).subscribe(
    //     resp => {
    //       //console.log(resp)
    //       this.poblarListaResumen(this.usuarioSolicitar);
    //       this.listarHistorialSolicitudesUsua();
    //       Swal.fire({
    //         title: 'Exito',
    //         text: 'Solicitud generada',
    //         icon: 'success',
    //         timer: 1500, 
    //         showConfirmButton: false,
    //       })
    //     }, 
    //     error => {
    //       //console.log("Error: " + error.message)
    //       Swal.fire(
    //         'Error',
    //         'error al grabar la solicitud:'+ error.message,
    //         'error'
    //       );
    //     }
    //   );
    // }).catch((error) => {
    //   console.log(error);
    // });
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

  listarHistorialSolicitudesUsua() {
    this.solicitarService.listarHistorialSolicitudes(this.usuarioSolicitar.p_codipers, 1).subscribe(
      resp => {
        this.listaHistorialSolicitudesUsua = resp;
        //console.log(this.listaHistorialSolicitudesUsua);
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
          this.listarHistorialSolicitudesUsua();
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

}
