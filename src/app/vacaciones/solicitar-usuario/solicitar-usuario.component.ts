import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import {
  ColumnMode,
  DatatableComponent,
  SelectionType
} from '@swimlane/ngx-datatable';
import { DataVacation } from '../data/datavacation.data';
import { DataUserVacation } from '../data/datauservacation.data';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { SolicitarModalComponent } from './solicitar-modal/solicitar-modal.component';
import { SolicitarUsuarioService } from './solicitar-usuario.service';
import { SolicitarModalComponent } from '../solicitar/solicitar-modal/solicitar-modal.component';

@Component({
  selector: 'app-solicitar-usuario',
  templateUrl: './solicitar-usuario.component.html',
  styleUrls: ['./solicitar-usuario.component.scss', '../../../assets/sass/libs/datatables.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [SolicitarUsuarioService]
})
export class SolicitarUsuarioComponent implements OnInit {

  @ViewChild('tableRowDetails') tableRowDetails: any;
  public ColumnMode = ColumnMode;
  // row data
  public rows = DataVacation;
  public userRows = DataUserVacation;

  public expanded: any = {};
  closeResult: string;

  public listaSolicitudesUsua: any = [];
  public listaHistorialSolicitudesUsua: any = [];
  public solicitarFlag: boolean = false;

  constructor(private modalService: NgbModal, private solicitarUsuarioService: SolicitarUsuarioService) { }

  ngOnInit(): void {
    // this.listarSolicitudesGroupBy();
    // this.listarHistorialSolicitudes();
  }

  obtenerUsuario() {
    this.solicitarFlag = true;
  }

  modalShowSolicitar() {
    const modalRef = this.modalService.open(SolicitarModalComponent);
    modalRef.componentInstance.id = 0; // should be the id
    modalRef.componentInstance.data = { fechaInic: '', hasta: '', descripcion: '' }; // should be the data

    modalRef.result.then((result) => {
      console.log(result)
      
      let objSolicitud = {
        idtiposolicitud : "1",
        usuarioregistro : 'E003625',
        usuariosolicitado : 'E003625',
        areaactualtrabajador : "12",
        usuarioactual : 'E003620',
        fechainiciosolicitud : result.fechaInic.day + '/' + result.fechaInic.month + '/' + result.fechaInic.year,
        status : "1",
        cantidaddias : result.hasta.name,
        descripcion : result.descripcion
      }
      console.log(objSolicitud);
      // this.solicitarService.grabarSolicitud(objSolicitud).subscribe(
      //   resp => {
      //     console.log(resp)
      //     this.listarHistorialSolicitudes();
      //   }, 
      //   error => {
      //     console.log("Error: " + error.message)
      //   }
      // );

    }).catch((error) => {
      console.log(error);
    });
  }

  // listarSolicitudesGroupBy() {
  //   this.solicitarService.listarSolicitudes('E003625').subscribe(
  //     resp => {
  //       this.listaSolicitudes = resp;
  //       console.log(this.listaSolicitudes);
  //     }, 
  //     error => {
  //       console.log("error:", error.message)
  //     }
  //   )
  // }

  // listarHistorialSolicitudes() {
  //   this.solicitarService.listarHistorialSolicitudes('E003625').subscribe(
  //     resp => {
  //       this.listaHistorialSolicitudes = resp;
  //       console.log(this.listaHistorialSolicitudes);
  //     }, 
  //     error => {
  //       console.log("error:", error.message)
  //     }
  //   )
  // }

  /**
   * rowDetailsToggleExpand
   *
   * @param row
   */

  rowDetailsToggleExpand(row) {
    this.tableRowDetails.rowDetail.toggleExpandRow(row);
  }

  // modalShowSolicitar() {
  //   const modalRef = this.modalService.open(SolicitarModalComponent);
  //   modalRef.componentInstance.id = 0; // should be the id
  //   modalRef.componentInstance.data = { fechaInic: '', hasta: '', descripcion: '' }; // should be the data

  //   modalRef.result.then((result) => {
  //     console.log(result)
      
  //     let objSolicitud = {
  //       idtiposolicitud : "1",
  //       usuarioregistro : 'E003625',
  //       usuariosolicitado : 'E003625',
  //       areaactualtrabajador : "12",
  //       usuarioactual : 'E003620',
  //       fechainiciosolicitud : result.fechaInic.day + '/' + result.fechaInic.month + '/' + result.fechaInic.year,
  //       status : "1",
  //       cantidaddias : result.hasta.name,
  //       descripcion : result.descripcion
  //     }
  //     console.log(objSolicitud);
  //     this.solicitarService.grabarSolicitud(objSolicitud).subscribe(
  //       resp => {
  //         console.log(resp)
  //         this.listarHistorialSolicitudes();
  //       }, 
  //       error => {
  //         console.log("Error: " + error.message)
  //       }
  //     );

  //   }).catch((error) => {
  //     console.log(error);
  //   });
  // }

}
