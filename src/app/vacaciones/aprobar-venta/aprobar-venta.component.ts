import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { SolicitarService } from 'app/shared/services/solicitar.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CancelarModalComponent } from '../cancelarModal/cancelar-modal.component';
import { AuthService } from 'app/shared/auth/auth.service';
import { Trabajador } from '../aprobar/trabajador.model';

@Component({
  selector: 'app-aprobar-venta',
  templateUrl: './aprobar-venta.component.html',
  styleUrls: ['./aprobar-venta.component.scss', '../../../assets/sass/libs/datatables.scss'],
  providers: [SolicitarService]

})
export class AprobarVentaComponent implements OnInit {
  public solicitudesPendientesVenta: any = [];
  public detalleSolicitudUsuarioVenta: any = null;
  //NUEVO
  sesion: any;
  objVacaUsua: any;
  trabajador: Trabajador = null;

  constructor(private aprobarVentaService: SolicitarService, 
    private modalService: NgbModal,
    private authService: AuthService) {
  }

  ngOnInit(): void {
    this.sesion = JSON.parse(this.authService.userToken);
    this.listarSolicitudesPendientesVenta();
    console.log(this.detalleSolicitudUsuarioVenta)
  }

  listarSolicitudesPendientesVenta() {
    this.aprobarVentaService.listarSolicitudesPendientesXStatusXTipo('1', 2).subscribe(
      resp => {
        // this.listaHistorialSolicitudes = resp;
        console.log(resp);
        this.solicitudesPendientesVenta = resp;
      }, 
      error => {
        console.log("error:", error.message)
      }
    )
  }

  detalleSolicitudVenta(user: any) {
    this.detalleSolicitudUsuarioVenta = user;
    console.log(this.detalleSolicitudUsuarioVenta)
    this.aprobarVentaService.listarDetalleUsuario(this.detalleSolicitudUsuarioVenta.tsolicitudId).subscribe(
      resp => {
        console.log(resp)
        this.objVacaUsua = resp;
        this.trabajador = {
          tsolicitudId: this.detalleSolicitudUsuarioVenta.tsolicitudId,
          tusuasoli: this.detalleSolicitudUsuarioVenta.tusuasoli,
          tfoto: this.detalleSolicitudUsuarioVenta.tfoto,
          tdescusuasoli: this.detalleSolicitudUsuarioVenta.tdescusuasoli,
          periodo: this.detalleSolicitudUsuarioVenta.periodo,
          tcantidaddias: this.objVacaUsua.tcantidaddias,
          tusuaaprob: this.detalleSolicitudUsuarioVenta.tusuaaprob,
          tdescunidfuncsoli: this.detalleSolicitudUsuarioVenta.tdescunidfuncsoli,
          tfechingrsoli: this.detalleSolicitudUsuarioVenta.tfechingrsoli,
          tdescripcion: this.objVacaUsua.tdescripcion,
          tperiodo: this.objVacaUsua.tperiodo,
          tfechregi: this.detalleSolicitudUsuarioVenta.tfechregi
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

  modalShowCancelarVenta(user: any) {
    console.log(user);
    const modalRef = this.modalService.open(CancelarModalComponent);
    modalRef.componentInstance.titulo = 'venta vacaciones'; // should be the id
    modalRef.componentInstance.data = { motivo: 'el motivo es' }; // should be the data

    modalRef.result.then((result) => {
      console.log(result)
      let objRechazar = {
        idsolicitud: user.tsolicitudId,
        usuarioactualizacion: this.sesion.p_codipers,
        motivorechazo: result.motivo
      }
      console.log(objRechazar);
      this.aprobarVentaService.rechazarSolicitud(objRechazar).subscribe(
        resp => {
          console.log(resp)
          this.trabajador = null;
          this.listarSolicitudesPendientesVenta();
        }, 
        error => {
          console.log("Error: " + error.message)
        }
      );
    }).catch((error) => {
      console.log(error);
    });
  }

  aprobarSolicitudVenta(user: any) {
    console.log(user.idsolicitud)
    console.log(user.usuarioactual)
    let objAprobar = {
      idsolicitud: user.tsolicitudId,
      usuarioactualizacion: this.sesion.p_codipers
    }
    console.log(objAprobar);
    this.aprobarVentaService.aprobarSolicitud(objAprobar).subscribe(
      resp => {
        console.log(resp)
        this.trabajador = null;
        this.listarSolicitudesPendientesVenta();
      }, 
      error => {
        console.log("Error: " + error.message)
      }
    );
  }

}
