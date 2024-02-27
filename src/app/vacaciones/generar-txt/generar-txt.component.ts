import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import {
  ColumnMode,
  DatatableComponent,
  SelectionType
} from '@swimlane/ngx-datatable';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'app/shared/auth/auth.service';
import { SolicitarService } from 'app/shared/services/solicitar.service';
import { BancosService } from 'app/shared/services/bancos.service';
import { CODIGO_BANCO_CUENTA_BENEFICIARIO, CODIGO_DEVOLUCION, CUENTA_ORDENANTE, DIVISA_CUENTA_SOLES, DOCUMENTO_RUC_ORDENANTE, INDICADOR_DEVOLUCION, NOMBRE_ORDENANTE, PRIMER_BENEFICIARIO, PRIMER_BENEFICIARIO_SEGUNDO, PRIMER_ORDENANTE, REGISTRO_TOTALES, SEGUNDO_ORDENANTE, SERVICIO_QUINTA_CATEGORIA, SOLICITUDXUSUARIO, TIPO_ABONO_PROPIO, TIPO_CUENTA_TITULAR, TIPO_DOCUMENTO_RUC, URL_END_POINT_BASE, VALIDACION_PERTENENCIA_VALIDA } from "app/shared/utilitarios/Constantes";

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
    this.solicitarService.generarTxtPersonas(this.sesion.p_codipers, 2, 2).subscribe(
      resp => {
        this.personasPagar = resp;
        console.log(this.personasPagar);
        this.docuBBVA(this.personasPagar);
      }, 
      error => {
        console.log("error al consultar:", error.message)
      }
    )
  }

  docuBBVA(personasPagar: any) {
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
    personasPagar.listBanco.forEach(e => {
      var tipo = null;
      if (e.tipoDocu == "DNI") {
        tipo = "L";
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
    var a = 3 + (2*personasPagar.listBanco.length)
    primerRegistro = primerRegistro + "\r\n" +
          this.PadLeft(REGISTRO_TOTALES, 4) +
          TIPO_DOCUMENTO_RUC + 
          this.PadLeft(DOCUMENTO_RUC_ORDENANTE, 12) +
          this.PadLeftCeros(a.toString(), 10) + 
          this.PadLeftCeros(personasPagar.listBanco.length, 8) + 
          this.PadLeftCeros(personasPagar.totalEntero, 12) +
          this.PadLeftCeros(personasPagar.totalDecimal, 2) +
          this.PadLeft(" ", 106);
    var fileName = "HABERE_LIQUIDACIONEN.txt"
    this.saveTextAsFile(primerRegistro, fileName);
    this.listarHistorialSolicitudes();
  }


  listarSolicitudesGroupBy() {
    this.solicitarService.listarSolicitudes(this.sesion.p_codipers, 2).subscribe(
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
    this.solicitarService.listarVacacionesAprobados(2, 2).subscribe(
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

}
