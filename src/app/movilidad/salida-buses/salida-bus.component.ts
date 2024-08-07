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
// import { MovilidadModalComponent } from './solicitar-modal/movilidad-modal.component';
import { CancelarModalComponent } from 'app/vacaciones/cancelarModal/cancelar-modal.component';
import Swal from 'sweetalert2';
import { ReportAdapter } from 'app/shared/utilitarios/ReportAdapter.class';
import { Reporte } from 'app/shared/utilitarios/reporte.model';
import { forEach } from 'core-js/core/array';
import { ReportAdapterMovilidad } from 'app/shared/utilitarios/ReportAdapterMovilidad.class';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-salida-bus',
  templateUrl: './salida-bus.component.html',
  styleUrls: ['./salida-bus.component.scss', '../../../assets/sass/libs/datatables.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [SolicitarService]
})
export class SalidaBusComponent implements OnInit {

  @ViewChild('tableRowDetails') tableRowDetails: any;
  public ColumnMode = ColumnMode;

  //NUEVO
  sesion: any;
  public listSalidaBus: any = [];
  reserva: any;
  flagformreserva: boolean = false;
  spinners = false;
  meridian = true; 

  constructor(private modalService: NgbModal, 
    private solicitarService: SolicitarService,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.sesion = JSON.parse(this.authService.userSesion);
    this.iniciarReserva();
    this.findAll();
  }

  iniciarReserva(): void {
    this.reserva = {
      fechInic: null,
      timeInic: null
    }
    this.handleReserva(this.reserva)
  }

  modalDataRese: {
    reserva: any
  };

  handleReserva(reserva: any): void {
    this.modalDataRese = { reserva};
  }

  findAll() {
    this.solicitarService.listarSalidaBus().subscribe(
      resp => {
        this.listSalidaBus = resp;
      }, 
      error => {
        //console.log("error:", error.message)
        Swal.fire(
          'Error',
          'error al mostrar solicitudes:'+ error.message,
          'error'
        );
      }
    )
  }

  registrar(form: NgForm): void {
    if (form.invalid) {
      this.flagformreserva =  true;
      return;
    }
    let objinsert = {
      "tsalidabus":null,
      "tfechinicio":this.modalDataRese.reserva.fechInic.day + '/' + 
                    this.modalDataRese.reserva.fechInic.month + '/' + 
                    this.modalDataRese.reserva.fechInic.year + ' '+ 
                    this.modalDataRese.reserva.timeInic.hour + ':'+ 
                    this.modalDataRese.reserva.timeInic.minute,
      "tusuaregi":this.sesion.p_codipers
    }
    this.solicitarService.grabarSalidaBus(objinsert).subscribe(
      resp => {
        let msg: any = resp;
        this.flagformreserva =  false;
        this.iniciarReserva();
        this.findAll();
        Swal.fire({
          title: 'Exito',
          text: msg.message,
          icon: 'success',
          timer: 1500, 
          showConfirmButton: false,
        })
      }, 
      error => {
        //console.log("error:", error.message)
        Swal.fire(
          'Error',
          'error al mostrar solicitudes:'+ error.message,
          'error'
        );
      }
    )
  }

  borrar(row: any) {
    let tsalidabusId = row.tsalidabusId;
    // console.log(idsolicitud);
    this.solicitarService.borrarSalidaBus(tsalidabusId).subscribe(
      resp => {
        // console.log(resp)
        this.findAll();
        Swal.fire({
          title: 'Exito',
          text: 'Salida de Bus borrada',
          icon: 'success',
          timer: 1000, 
          showConfirmButton: false,
        })
      },
      error => {
        // this.modal.dismissAll();
        Swal.fire(
          'Error',
          'al intentar grabar reserva: '+ error.message,
          'error'
        );
      }
    )
  }

}
