import { Component, OnInit } from '@angular/core';
import {
  ColumnMode
} from '@swimlane/ngx-datatable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'app/shared/auth/auth.service';
import { SolicitarService } from 'app/shared/services/solicitar.service';
import { CancelarModalComponent } from 'app/vacaciones/cancelarModal/cancelar-modal.component';

@Component({
  selector: 'app-aprobar-permiso',
  templateUrl: './aprobar-permiso.component.html',
  styleUrls: ['./aprobar-permiso.component.scss', '../../../assets/sass/libs/datatables.scss'],
  providers: [SolicitarService]

})
export class AprobarPermisoComponent implements OnInit {

  public ColumnMode = ColumnMode;
  public expanded: any = {};


  //NUEVO
  sesion: any;
  trabajador: any = null;
  public solicitudesPendientes: any = [];
  public detalleSolicitudUsuario: any = null;
  objVacaUsua: any;

  constructor(private aprobarService: SolicitarService, private modalService: NgbModal,
    private authService: AuthService) {
  }

  ngOnInit(): void {
    this.sesion = JSON.parse(this.authService.userToken);
    this.listarSolicitudesPendientes();
    console.log(this.detalleSolicitudUsuario)
  }

  listarSolicitudesPendientes() {
    this.aprobarService.listarSolicitudesPendientes(this.sesion.p_codipers, '1', 3).subscribe(
      resp => {
        // this.listaHistorialSolicitudes = resp;
        console.log(resp);
        this.solicitudesPendientes = resp;
        this.trabajador = null;
      }, 
      error => {
        console.log("error:", error.message)
      }
    )
  }

  detalleSolicitud(user: any) {
    this.detalleSolicitudUsuario = user;
    console.log(this.detalleSolicitudUsuario)
    this.aprobarService.listarDetalleUsuarioPermiso(this.detalleSolicitudUsuario.tsolicitudId).subscribe(
      resp => {
        console.log(resp)
        this.objVacaUsua = resp;
        this.trabajador = {
          tsolicitudId: this.detalleSolicitudUsuario.tsolicitudId,
          tusuasoli: this.detalleSolicitudUsuario.tusuasoli,
          tfoto: this.detalleSolicitudUsuario.tfoto,
          tdescusuasoli: this.detalleSolicitudUsuario.tdescusuasoli,
          periodo: this.detalleSolicitudUsuario.periodo,
          tusuaaprob: this.detalleSolicitudUsuario.tusuaaprob,
          tdescunidfuncsoli: this.detalleSolicitudUsuario.tdescunidfuncsoli,
          tfechingrsoli: this.detalleSolicitudUsuario.tfechingrsoli,
          thorasfin: this.objVacaUsua.thorasfin,
          tminufin: this.objVacaUsua.tminufin,
          tmotivo: this.objVacaUsua.tmotivo,
          tperiodo: this.objVacaUsua.tperiodo,
          tfechregi: this.detalleSolicitudUsuario.tfechregi
        };
      },
      error => {
        console.log("error detalle de solicitud:", error.message)
      }
    )
  }

  // @ViewChild('tableRowDetails') tableRowDetails: any;
  // public ColumnMode = ColumnMode;
  // row data
  // public rows = DataVacation;
  // public userRows = DataUserVacation;

  // public expanded: any = {};

  /**
   * rowDetailsToggleExpand
   *
   * @param row
   */
  // rowDetailsToggleExpand(row) {
  //   this.tableRowDetails.rowDetail.toggleExpandRow(row);
  // }

  modalShowCancelar(user: any) {
    console.log(user);
    const modalRef = this.modalService.open(CancelarModalComponent);
    modalRef.componentInstance.titulo = 'permisos'; // should be the id
    modalRef.componentInstance.data = { motivo: 'el motivo es' }; // should be the data

    modalRef.result.then((result) => {
      console.log(result)
      let objRechazar = {
        idsolicitud: user.tsolicitudId,
        usuarioactualizacion: this.sesion.p_codipers,
        motivorechazo: result.motivo
      }
      console.log(objRechazar);
      this.aprobarService.rechazarSolicitud(objRechazar).subscribe(
        resp => {
          console.log(resp)
          this.trabajador = null;
          this.listarSolicitudesPendientes();
        }, 
        error => {
          console.log("Error: " + error.message)
        }
      );
    }).catch((error) => {
      console.log(error);
    });
  }

  aprobarSolicitud(user: any) {
    console.log(user.tsolicitudId)
    console.log(user.tusuasoli)
    let objAprobar = {
      idsolicitud: user.tsolicitudId,
      usuarioactualizacion: this.sesion.p_codipers
    }
    console.log(objAprobar);
    this.aprobarService.aprobarSolicitud(objAprobar).subscribe(
      resp => {
        console.log(resp)
        this.trabajador = null;
        this.listarSolicitudesPendientes();
      }, 
      error => {
        console.log("Error: " + error.message)
      }
    );
  }

}
