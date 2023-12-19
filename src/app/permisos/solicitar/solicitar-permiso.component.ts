import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import {
  ColumnMode,
  DatatableComponent,
  SelectionType
} from '@swimlane/ngx-datatable';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SolicitarPermisoModalComponent } from './solicitar-modal/solicitar-permiso-modal.component';
import { AuthService } from 'app/shared/auth/auth.service';
import { SolicitarService } from 'app/shared/services/solicitar.service';
import { CancelarModalComponent } from 'app/vacaciones/cancelarModal/cancelar-modal.component';

@Component({
  selector: 'app-solicitar-permiso',
  templateUrl: './solicitar-permiso.component.html',
  styleUrls: ['./solicitar-permiso.component.scss', '../../../assets/sass/libs/datatables.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [SolicitarService]
})
export class SolicitarPermisoComponent implements OnInit {

  @ViewChild('tableRowDetails') tableRowDetails: any;
  public ColumnMode = ColumnMode;
  // row data
  // public rows = DataVacation;
  // public userRows = DataUserVacation;

  public expanded: any = {};
  closeResult: string;

  public listaPermisos: any = [];
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
  }

  listarSolicitudesGroupBy() {
    this.solicitarService.listarSolicitudes(this.sesion.p_codipers, 3).subscribe(
      resp => {
        this.listaPermisos = resp;
        console.log(this.listaPermisos);
      }, 
      error => {
        console.log("error:", error.message)
      }
    )
  }

  listarHistorialSolicitudes() {
    this.solicitarService.listarHistorialPermisoSolicitudes(this.sesion.p_codipers, 3).subscribe(
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
    const modalRef = this.modalService.open(SolicitarPermisoModalComponent);
    modalRef.componentInstance.id = tipo; // should be the id
    if(row == null) {
      modalRef.componentInstance.data = { fechaInic: null, timeInic: null, horas: null, minutos: null , descripcion: null }; // should be the data
    } else {
      let fechInicEdit = null;
      let timeInicEdit = null;
      if(row.tfechinicsoli.split('/').length == 3){
        fechInicEdit = {
          "year": parseInt(row.tfechinicsoli.split(' ')[0].split('/')[2]),
          "month": parseInt(row.tfechinicsoli.split(' ')[0].split('/')[1]),
          "day": parseInt(row.tfechinicsoli.split(' ')[0].split('/')[0])
        };

        timeInicEdit = { 
          "hour": parseInt(row.tfechinicsoli.split(':')[0].split(' ')[1]), 
          "minute": parseInt(row.tfechinicsoli.split(':')[1]), 
          "second": 0 
        };
        modalRef.componentInstance.data = { fechaInic: fechInicEdit, timeInic: timeInicEdit, horas: row.thorasfin, minutos: row.tminufin , descripcion: row.tmotivo }; // should be the data
      }
    }
    modalRef.result.then((result) => {
      console.log(result)
      let objSolicitud = null;
      if(row == null) {
        objSolicitud = {
          tsolicitudId : 0,
          idtiposolicitud : "3",
          usuarioregistro : this.sesion.p_codipers,
          usuariosolicitado : this.sesion.p_codipers,
          // areaactualtrabajador : this.sesion.p_unidfunc,
          usuarioactual : this.sesion.p_matrresp,
          fechainiciosolicitud : result.fechaInic.day + '/' + result.fechaInic.month + '/' + result.fechaInic.year + ' '+ result.timeInic.hour + ':'+ result.timeInic.minute,
          status : "1",
          horas : result.horas.id,
          minutos : result.minutos.id,
          descripcion : result.descripcion
        }
      } else {
        objSolicitud = {
          tsolicitudId : row.tsolicitudId,
          idtiposolicitud : "3",
          usuarioregistro : this.sesion.p_codipers,
          usuariosolicitado : this.sesion.p_codipers,
          // areaactualtrabajador : this.sesion.p_unidfunc,
          usuarioactual : this.sesion.p_matrresp,
          fechainiciosolicitud : result.fechaInic.day + '/' + result.fechaInic.month + '/' + result.fechaInic.year + ' '+ result.timeInic.hour + ':'+ result.timeInic.minute,
          status : "1",
          horas : result.horas.id,
          minutos : result.minutos.id,
          descripcion : result.descripcion
        }
      }
      console.log(objSolicitud);
      this.solicitarService.grabarPermiso(objSolicitud).subscribe(
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
    modalRef.componentInstance.titulo = 'permiso'; // should be the id
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