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

@Component({
  selector: 'app-movilidad',
  templateUrl: './movilidad.component.html',
  styleUrls: ['./movilidad.component.scss', '../../../assets/sass/libs/datatables.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [SolicitarService]
})
export class MovilidadComponent implements OnInit {

  // @ViewChild('tableRowDetails') tableRowDetails: any;
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
    this.solicitarService.listarHistorialSolicitudes(this.sesion.p_codipers, 5).subscribe(
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
    const modalRef = this.modalService.open(MovilidadModalComponent, { size: 'lg' });
    modalRef.componentInstance.id = 0; // should be the id
    modalRef.componentInstance.data = { fechaInic: '', fechaFina: '', numeViajes: '', transporte: '' , origen: '', destino: '' , motivo: '' , monto: ''  }; // should be the data

    modalRef.result.then((result) => {
      console.log(result)
      
      let objSolicitud = {
        idtiposolicitud : "5",
        usuarioregistro : this.sesion.p_codipers,
        usuariosolicitado : this.sesion.p_codipers,
        // areaactualtrabajador : this.sesion.p_unidfunc,
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

}
