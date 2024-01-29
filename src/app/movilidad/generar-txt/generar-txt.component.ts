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
import { CancelarModalComponent } from 'app/vacaciones/cancelarModal/cancelar-modal.component';
import { BancosService } from 'app/shared/services/bancos.service';
import { CODIGO_BANCO_CUENTA_BENEFICIARIO, CODIGO_DEVOLUCION, CUENTA_CARGO, CUENTA_ORDENANTE, DIVISA_CUENTA_SOLES, DOCUMENTO_RUC_ORDENANTE, FLAG_IDC, INDICADOR_DEVOLUCION, MONEDA_CARGO_SOLES, MONEDA_IMPORTE_SOLES, NOMBRE_ORDENANTE, NUMERO_CUENTA_CARGO, PLANILLA_HABERES, PRIMER_BENEFICIARIO, PRIMER_BENEFICIARIO_SEGUNDO, PRIMER_ORDENANTE, REGISTRO_TOTALES, SEGUNDO_ORDENANTE, SERVICIO_QUINTA_CATEGORIA, SOLICITUDXUSUARIO, TIPO_ABONO_PROPIO, TIPO_CUENTA_ABONO_AHORRO, TIPO_CUENTA_TITULAR, TIPO_DOCUMENTO_RUC, TIPO_REGISTRO, TIPO_REGISTRO_BENEFICIARIO, URL_END_POINT_BASE, VALIDACION_PERTENENCIA_VALIDA } from "app/shared/utilitarios/Constantes";

@Component({
  selector: 'app-generar-txt',
  templateUrl: './generar-txt.component.html',
  styleUrls: ['./generar-txt.component.scss', '../../../assets/sass/libs/datatables.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [SolicitarService, BancosService]
})
export class GenerarTxtComponent implements OnInit {

  @ViewChild('tableRowDetails') tableRowDetails: any;
  public ColumnMode = ColumnMode;
  // row data
  // public rows = DataVacation;
  // public userRows = DataUserVacation;

  public expanded: any = {};
  closeResult: string;

  public listaMovilidad: any = [];
  public listaHistorialSolicitudes: any = [];
  public personasPagar: any;

  //NUEVO
  sesion: any;

  constructor(private modalService: NgbModal, 
    private solicitarService: SolicitarService,
    private bancoService: BancosService,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.sesion = JSON.parse(this.authService.userToken);
    // this.listarSolicitudesGroupBy();
    this.listarHistorialSolicitudes();
    console.log("solicitar componente")
    console.log(this.sesion.p_codipers)
  }

  saveTextAsFile (data: any, filename: any){
    if(!data) {
        console.error('Console.save: No data')
        return;
    }
    if(!filename) filename = 'console.json'
    var blob = new Blob([data], {type: 'text/plain'}),
        e    = document.createEvent('MouseEvents'),
        a    = document.createElement('a')
// FOR IE:
    const nav = (window.navigator as any)

    if (window.navigator && nav.msSaveOrOpenBlob) {
      nav.msSaveOrOpenBlob(blob, filename);
    } else {
      var e = document.createEvent('MouseEvents'),
          a = document.createElement('a');

      a.download = filename;
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ['text/plain', a.download, a.href].join(':');
      e.initEvent('click', true, false);
      a.dispatchEvent(e);
    }
  }

  PadLeft(value: string, length: number) {
    return (value.toString().length < length) ? this.PadLeft(value+ " ", length) : value;
  }

  PadLeftCeros(value: string, length: number) {
    return (value.toString().length < length) ? this.PadLeftCeros("0"+value, length) : value;
  }


  exportarTXT() {
    this.solicitarService.generarTxtPersonas(this.sesion.p_codipers,"2", 5).subscribe(
      resp => {
        this.personasPagar = resp;
        console.log(this.personasPagar);
        this.dataExportarBancos(this.personasPagar);
      }, 
      error => {
        console.log("error al consultar:", error.message)
      }
    )
  }

  dataExportarBancos(personasPagar: any) { 
    var bcp = personasPagar.responseBCP.listBancoBCP;
    var bbva = personasPagar.responseBBVA.listBancoBBVA;
    console.log('bcp' + bcp);
    console.log('bcp' + bcp.length);
    console.log('bbva' + bbva)
    console.log('bbva' + bbva.length)
    if (bcp.length > 0) {
      this.docuBCP(bcp, personasPagar.responseBCP.sumatoriaCuenta, personasPagar.responseBCP.totalEnteroBCP, personasPagar.responseBCP.totalDecimalBCP)
    }
    if (bbva.length > 0) {
      this.docuBBVA(bbva, personasPagar.responseBBVA.totalEnteroBBVA, personasPagar.responseBBVA.totalDecimalBBVA);
    }
  }

  docuBBVA(listBanco: any, totalEntero: any, totalDecimal: any) {
    var primerRegistro = PRIMER_ORDENANTE + 
        TIPO_DOCUMENTO_RUC + 
        this.PadLeft(DOCUMENTO_RUC_ORDENANTE, 12) + 
        "17012024" + 
        "17012024" + 
        this.PadLeft(CUENTA_ORDENANTE, 20) + 
        DIVISA_CUENTA_SOLES + 
        this.PadLeft(" ", 12) + 
        VALIDACION_PERTENENCIA_VALIDA + 
        INDICADOR_DEVOLUCION + 
        this.PadLeft("HABERE_LIQUIDACIONEN", 20) + 
        SERVICIO_QUINTA_CATEGORIA + 
        this.PadLeft(" ", 162);
    primerRegistro = primerRegistro + "\r\n" 
          + SEGUNDO_ORDENANTE + 
          TIPO_DOCUMENTO_RUC + 
          this.PadLeft(DOCUMENTO_RUC_ORDENANTE, 12) + 
          this.PadLeft(NOMBRE_ORDENANTE, 35) + 
          this.PadLeft(" ", 35) + 
          this.PadLeft(" ", 168);
    console.log(listBanco.length)
    listBanco.forEach(e => {
      var tipo = null;
      switch (e.tipoDocu) {
        case '01':
          tipo = "L";
          break;
        case '04' :
          tipo = "E";
          break;
        case '06' :
          tipo = "R";
          break;
        case '07' :
          tipo = "P";
          break;
        case '11' :
          console.log('No existe el tipo de documento')
          break;
      }
      primerRegistro = primerRegistro + "\r\n"+
          PRIMER_BENEFICIARIO + 
          TIPO_DOCUMENTO_RUC + 
          this.PadLeft(DOCUMENTO_RUC_ORDENANTE, 12) +
          tipo +
          this.PadLeft(e.numeDocu, 12) +
          this.PadLeft(e.nombComp, 35) +
          this.PadLeftCeros(e.montoEntero, 12) +
          this.PadLeftCeros(e.montoDecimal, 2) +
          this.PadLeft(DIVISA_CUENTA_SOLES, 3) +
          this.PadLeft(" ", 12) +
          this.PadLeft(CODIGO_DEVOLUCION, 4) +
          this.PadLeft(" ", 40) +
          this.PadLeft(" ", 117);
      
      primerRegistro = primerRegistro + "\r\n"+
          PRIMER_BENEFICIARIO_SEGUNDO + 
          TIPO_DOCUMENTO_RUC + 
          this.PadLeft(DOCUMENTO_RUC_ORDENANTE, 12) +
          tipo +
          this.PadLeft(e.numeDocu, 12) +
          this.PadLeft(CODIGO_BANCO_CUENTA_BENEFICIARIO, 4) +
          this.PadLeft(e.numeCuen, 20) +
          this.PadLeft(" ", 35) +
          this.PadLeft(TIPO_ABONO_PROPIO, 1) +
          this.PadLeft(" ", 24) +
          this.PadLeft(TIPO_CUENTA_TITULAR, 2) +
          this.PadLeft(" ", 139);
    });
    var a = 3 + (2*listBanco.length)
    primerRegistro = primerRegistro + "\r\n" +
          this.PadLeft(REGISTRO_TOTALES, 4) +
          TIPO_DOCUMENTO_RUC + 
          this.PadLeft(DOCUMENTO_RUC_ORDENANTE, 12) +
          this.PadLeftCeros(a.toString(), 10) + 
          this.PadLeftCeros(listBanco.length, 8) + 
          this.PadLeftCeros(totalEntero, 12) +
          this.PadLeftCeros(totalDecimal, 2) +
          this.PadLeft(" ", 106);
    var fileName = "HABERE_LIQUIDACIONEN.txt"
    this.saveTextAsFile(primerRegistro, fileName);
    this.listarHistorialSolicitudes();
  }

  docuBCP(listBanco: any, sumatoriaCuenta: number, totalEntero: any, totalDecimal: any) {
    var primerRegistro = TIPO_REGISTRO +
          this.PadLeftCeros(listBanco.length, 6) + 
          "20240127" + 
          PLANILLA_HABERES + 
          CUENTA_CARGO +
          MONEDA_CARGO_SOLES +
          this.PadLeft(NUMERO_CUENTA_CARGO, 20) + 
          this.PadLeftCeros(totalEntero+"."+totalDecimal, 17) +
          this.PadLeft("HABERE_LIQUIDACIONEN", 40) + 
          this.PadLeftCeros(sumatoriaCuenta.toString(), 15);
    listBanco.forEach(e => {
      var tipo = null;
      switch (e.tipoDocu) {
        case '01':
          tipo = "1";
          break;
        case '04' :
          tipo = "3";
          break;
        case '06' :
          console.log('No existe el tipo de documento RUC')
          break;
        case '07' :
          tipo = "4";
          break;
        case '11' :
          console.log('No existe el tipo de documento PN')
          break;
      }
      primerRegistro = primerRegistro + "\r\n"+
          TIPO_REGISTRO_BENEFICIARIO + 
          TIPO_CUENTA_ABONO_AHORRO + 
          this.PadLeft(e.numeCuen,20) + 
          tipo + 
          this.PadLeft(e.numeDocu, 12) +
          this.PadLeft("", 3) +
          this.PadLeft(e.nombComp, 75) +
          this.PadLeft("Referencia Beneficiario", 40) +
          this.PadLeft("Ref Emp", 20) +
          MONEDA_IMPORTE_SOLES +
          this.PadLeftCeros(e.montoEntero + "." + e.montoDecimal, 17) +
          FLAG_IDC
    });
    var fileName = "HABERE_LIQUIDACIONBCP.txt"
    this.saveTextAsFile(primerRegistro, fileName);
    this.listarHistorialSolicitudes();

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
    this.solicitarService.listarMovilidadesAprobados("2", 5).subscribe(
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

  // modalShowSolicitar(tipo: any, row: any) {
  //   const modalRef = this.modalService.open(MovilidadModalComponent, { size: 'lg' });
  //   modalRef.componentInstance.id = tipo;
  //   if(row == null) {
  //     modalRef.componentInstance.data = { fechaInic: null, fechaFina: null, numeViajes: null, transporte: null , origen: null, destino: null , motivo: null , monto: null  }; // should be the data
  //   } else {
  //     let fechInicEdit = null;
  //     let fechFinEdit = null;
  //     if(row.tfechinicsoli.split('/').length == 3){
  //       fechInicEdit = {
  //         "year": parseInt(row.tfechinicsoli.split('/')[2]),
  //         "month": parseInt(row.tfechinicsoli.split('/')[1]),
  //         "day": parseInt(row.tfechinicsoli.split('/')[0])
  //       };
  //     }
  //     if(row.tfechfinasoli.split('/').length == 3){
  //       fechFinEdit = {
  //         "year": parseInt(row.tfechfinasoli.split('/')[2]),
  //         "month": parseInt(row.tfechfinasoli.split('/')[1]),
  //         "day": parseInt(row.tfechfinasoli.split('/')[0])
  //       };
  //     }
  //     modalRef.componentInstance.data = { fechaInic: fechInicEdit, 
  //                                         fechaFina: fechFinEdit, 
  //                                         numeViajes: row.tnumeviaje, 
  //                                         transporte: row.ttransporte , 
  //                                         origen: row.torigen, 
  //                                         destino: row.tdestino , 
  //                                         motivo: row.tmotivo , 
  //                                         monto: row.tmonto  }; // should be the data
    
  //   }

  //   modalRef.result.then((result) => {
  //     let objSolicitud = null;
  //     if(row == null) {
  //       objSolicitud = {
  //         tsolicitudId : 0,
  //         idtiposolicitud : "5",
  //         usuarioregistro : this.sesion.p_codipers,
  //         usuariosolicitado : this.sesion.p_codipers,
  //         usuarioactual : this.sesion.p_matrresp,
  //         status : "1",
  //         tfechinicio : result.fechaInic.day + '/' + result.fechaInic.month + '/' + result.fechaInic.year,
  //         tfechfin : result.fechaFina.day + '/' + result.fechaFina.month + '/' + result.fechaFina.year,
  //         tnumeviaje : result.numeViajes,
  //         ttransporte : result.transporte.name,
  //         torigen : result.origen.name,
  //         tdestino : result.destino.name,
  //         tmotivo : result.motivo,
  //         tmonto : result.monto,
  //       }
  //     } else {
  //       objSolicitud = {
  //         tsolicitudId : row.tsolicitudId,
  //         idtiposolicitud : "5",
  //         usuarioregistro : this.sesion.p_codipers,
  //         usuariosolicitado : this.sesion.p_codipers,
  //         usuarioactual : this.sesion.p_matrresp,
  //         status : "1",
  //         tfechinicio : result.fechaInic.day + '/' + result.fechaInic.month + '/' + result.fechaInic.year,
  //         tfechfin : result.fechaFina.day + '/' + result.fechaFina.month + '/' + result.fechaFina.year,
  //         tnumeviaje : result.numeViajes,
  //         ttransporte : result.transporte.name,
  //         torigen : result.origen.name,
  //         tdestino : result.destino.name,
  //         tmotivo : result.motivo,
  //         tmonto : result.monto,
  //       }
  //     }
  //     console.log(objSolicitud);
  //     this.solicitarService.grabarMovilidad(objSolicitud).subscribe(
  //       resp => {
  //         console.log(resp)
  //         this.listarSolicitudesGroupBy();
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

  // public modalEliminarSolicitar(user: any){
  //   console.log(user);
  //   const modalRef = this.modalService.open(CancelarModalComponent);
  //   modalRef.componentInstance.titulo = 'movilidad'; // should be the id
  //   modalRef.componentInstance.data = { motivo: 'el motivo es' }; // should be the data

  //   modalRef.result.then((result) => {
  //     console.log(result)
  //     let objRechazar = {
  //       idsolicitud: user.tsolicitudId,
  //       usuarioactualizacion: this.sesion.p_codipers,
  //       motivorechazo: result.motivo
  //     }
  //     console.log(objRechazar);
  //     this.solicitarService.rechazarSolicitud(objRechazar).subscribe(
  //       resp => {
  //         console.log(resp)
  //         this.listarHistorialSolicitudes();
  //         this.listarSolicitudesGroupBy();
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
