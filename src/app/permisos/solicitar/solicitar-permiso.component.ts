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

@Component({
  selector: 'app-solicitar-permiso',
  templateUrl: './solicitar-permiso.component.html',
  styleUrls: ['./solicitar-permiso.component.scss', '../../../assets/sass/libs/datatables.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [SolicitarService]
})
export class SolicitarPermisoComponent implements OnInit {

  // @ViewChild('tableRowDetails') tableRowDetails: any;
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
    console.log("solicitar componente")
    console.log(this.sesion.p_codipers)
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
    this.solicitarService.listarHistorialSolicitudes(this.sesion.p_codipers, 3).subscribe(
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

  // rowDetailsToggleExpand(row) {
  //   this.tableRowDetails.rowDetail.toggleExpandRow(row);
  // }

  modalShowSolicitar() {
    const modalRef = this.modalService.open(SolicitarPermisoModalComponent);
    modalRef.componentInstance.id = 0; // should be the id
    modalRef.componentInstance.data = { fechaInic: '', horas: '', minutos: '' , descripcion: '' }; // should be the data

    modalRef.result.then((result) => {
      console.log(result)
      
      let objSolicitud = {
        idtiposolicitud : "3",
        usuarioregistro : this.sesion.p_codipers,
        usuariosolicitado : this.sesion.p_codipers,
        // areaactualtrabajador : this.sesion.p_unidfunc,
        usuarioactual : this.sesion.p_matrresp,
        fechainiciosolicitud : result.fechaInic.day + '/' + result.fechaInic.month + '/' + result.fechaInic.year,
        status : "1",
        horas : result.horas.id,
        minutos : result.minutos.id,
        descripcion : result.descripcion
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

}
