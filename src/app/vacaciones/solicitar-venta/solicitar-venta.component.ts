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
import { SolicitarVentaService } from './solicitar-venta.service';

@Component({
  selector: 'app-solicitar-venta',
  templateUrl: './solicitar-venta.component.html',
  styleUrls: ['./solicitar-venta.component.scss', '../../../assets/sass/libs/datatables.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [SolicitarVentaService]
})
export class SolicitarVentaComponent implements OnInit {

  @ViewChild('tableRowDetails') tableRowDetails: any;
  public ColumnMode = ColumnMode;
  // row data
  public rows = DataVacation;
  public userRows = DataUserVacation;

  public expanded: any = {};
  closeResult: string;

  public listaSolicitudesVenta: any = [];
  public listaHistorialSolicitudesVenta: any = [];

  constructor(private modalService: NgbModal, private solicitarVentaService: SolicitarVentaService) { }

  ngOnInit(): void {
    // this.listarSolicitudesGroupBy();
    // this.listarHistorialSolicitudes();
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
