import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { APROBAR_SOLICITUD, COLISION_VACACIONES, GENERAR_PAGO, GRABAR_LICENCIA, GRABAR_MOVILIDAD, GRABAR_PERMISO, GRABAR_SOLICITUD, LISTAR_DETALLE_USUARIO, LISTAR_DETALLE_USUARIO_LICENCIA, LISTAR_DETALLE_USUARIO_MOVILIDAD, LISTAR_DETALLE_USUARIO_PERMISO, LISTAR_DISTRITO, LISTAR_SOLICITUD_APROBADA, LISTAR_SOLICITUD_MOVILIDAD_APROBADA, LISTAR_SOLICITUD_PENDIENTE, LISTAR_SOLICITUD_VACACIONES_APROBADA, LISTAR_TXT_CONTABILIDAD, OBTENERDATOSBASICOS, RECHAZAR_SOLICITUD, REGLAS_VACACIONES, REPORTE_APROBADOS, REPORTE_APROBADOSXAPROB, SOLICITUDXUSUARIO, SOLICITUD_HISTORIALLICENCIAXUSUARIO, SOLICITUD_HISTORIALMOVILIDADXUSUARIO, SOLICITUD_HISTORIALPERMISOXUSUARIO, SOLICITUD_HISTORIALXUSUARIO, URL_END_POINT_BASE } from "app/shared/utilitarios/Constantes";
import { catchError } from "rxjs/operators";
import { Observable, throwError } from "rxjs";
import { PDFDocument, rgb } from 'pdf-lib';
import * as XLSX from 'xlsx'
import { async } from "@angular/core/testing";
import { Reporte } from "../utilitarios/reporte.model";
import { ReporteMovi } from "../utilitarios/reporteMovi.model";

@Injectable()
export class SolicitarService {
    constructor(private http: HttpClient) {

    }

    public listarSolicitudes(codiUsua: string, ttiposolicitudId: number) {
        //console.log(URL_END_POINT_BASE + SOLICITUDXUSUARIO + codiUsua + '&ttiposolicitudId=' + ttiposolicitudId)
            return this.http.get(URL_END_POINT_BASE + SOLICITUDXUSUARIO + codiUsua + '&ttiposolicitudId=' + ttiposolicitudId)
            .pipe(catchError(e => {
                console.error(' Error al intentar listar. Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public listarHistorialSolicitudes(codiUsua: string, ttiposolicitudId: number) {
        //console.log(URL_END_POINT_BASE + SOLICITUD_HISTORIALXUSUARIO + codiUsua + '&ttiposolicitudId=' + ttiposolicitudId)
            return this.http.get(URL_END_POINT_BASE + SOLICITUD_HISTORIALXUSUARIO + codiUsua + '&ttiposolicitudId=' + ttiposolicitudId)
            .pipe(catchError(e => {
                console.error(' Error al intentar listar historial. Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public listarHistorialPermisoSolicitudes(codiUsua: string, ttiposolicitudId: number) {
        //console.log(URL_END_POINT_BASE + SOLICITUD_HISTORIALPERMISOXUSUARIO + codiUsua + '&ttiposolicitudId=' + ttiposolicitudId)
            return this.http.get(URL_END_POINT_BASE + SOLICITUD_HISTORIALPERMISOXUSUARIO + codiUsua + '&ttiposolicitudId=' + ttiposolicitudId)
            .pipe(catchError(e => {
                console.error(' Error al intentar listar historial. Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public listarHistorialLicenciasSolicitudes(codiUsua: string, ttiposolicitudId: number) {
        //console.log(URL_END_POINT_BASE + SOLICITUD_HISTORIALLICENCIAXUSUARIO + codiUsua + '&ttiposolicitudId=' + ttiposolicitudId)
            return this.http.get(URL_END_POINT_BASE + SOLICITUD_HISTORIALLICENCIAXUSUARIO + codiUsua + '&ttiposolicitudId=' + ttiposolicitudId)
            .pipe(catchError(e => {
                console.error(' Error al intentar listar historial. Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public listarHistorialMovilidadSolicitudes(codiUsua: string, ttiposolicitudId: number) {
        //console.log(URL_END_POINT_BASE + SOLICITUD_HISTORIALMOVILIDADXUSUARIO + codiUsua + '&ttiposolicitudId=' + ttiposolicitudId)
            return this.http.get(URL_END_POINT_BASE + SOLICITUD_HISTORIALMOVILIDADXUSUARIO + codiUsua + '&ttiposolicitudId=' + ttiposolicitudId)
            .pipe(catchError(e => {
                console.error(' Error al intentar listar historial. Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public colisionVacaciones(pCodipers: string, pFechInic: string, pCantDias: number) {
        //console.log(URL_END_POINT_BASE + GRABAR_SOLICITUD + objSolicitud)
        return this.http.get(URL_END_POINT_BASE + COLISION_VACACIONES + "pCodipers=" + pCodipers + "&pFechInic=" + pFechInic + "&pCantDias=" + pCantDias)
            .pipe(catchError(e => {
                console.error(' Error al intentar grabar solicitud por solicitud. Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public grabarSolicitud(objSolicitud: any) {
        //console.log(URL_END_POINT_BASE + GRABAR_SOLICITUD + objSolicitud)
        return this.http.post(URL_END_POINT_BASE + GRABAR_SOLICITUD, objSolicitud)
            .pipe(catchError(e => {
                console.error(' Error al intentar grabar solicitud. Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public grabarPermiso(objSolicitud: any) {
        //console.log(URL_END_POINT_BASE + GRABAR_PERMISO + objSolicitud)
        return this.http.post(URL_END_POINT_BASE + GRABAR_PERMISO, objSolicitud)
            .pipe(catchError(e => {
                console.error(' Error al intentar grabar permiso. Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public grabarLicencia(objSolicitud: any) {
        //console.log(URL_END_POINT_BASE + GRABAR_LICENCIA + objSolicitud)
        return this.http.post(URL_END_POINT_BASE + GRABAR_LICENCIA, objSolicitud)
            .pipe(catchError(e => {
                console.error(' Error al intentar grabar licencia. Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public grabarMovilidad(objSolicitud: any) {
        //console.log(URL_END_POINT_BASE + GRABAR_MOVILIDAD + objSolicitud)
        return this.http.post(URL_END_POINT_BASE + GRABAR_MOVILIDAD, objSolicitud)
            .pipe(catchError(e => {
                console.error(' Error al intentar grabar movilidad. Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public listarSolicitudesPendientes(codiUsua: string, status: number, idtiposolicitud: number) {
        //console.log(URL_END_POINT_BASE + LISTAR_SOLICITUD_PENDIENTE + "codiUsua=" + codiUsua + "&status=" + status + "&idtiposolicitud=" + idtiposolicitud)
            return this.http.get(URL_END_POINT_BASE + LISTAR_SOLICITUD_PENDIENTE + "codiUsua=" + codiUsua + "&status=" + status + "&idtiposolicitud=" + idtiposolicitud)
            .pipe(catchError(e => {
                console.error(' Error al intentar listar. Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public listarSolicitudesAprobadas(codiUsua: string, idtiposolicitud: number) {
        //console.log(URL_END_POINT_BASE + LISTAR_SOLICITUD_APROBADA + "codiUsua=" + codiUsua + "&ttiposolicitudId=" + idtiposolicitud)
            return this.http.get(URL_END_POINT_BASE + LISTAR_SOLICITUD_APROBADA + "codiUsua=" + codiUsua + "&ttiposolicitudId=" + idtiposolicitud)
            .pipe(catchError(e => {
                console.error(' Error al intentar listar. Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public listarSolicitudesPendientesXStatusXTipo(status: number, idtiposolicitud: number) {
        //console.log(URL_END_POINT_BASE + LISTAR_SOLICITUD_PENDIENTE + "status=" + status + "&idtiposolicitud=" + idtiposolicitud)
            return this.http.get(URL_END_POINT_BASE + LISTAR_SOLICITUD_PENDIENTE + "status=" + status + "&idtiposolicitud=" + idtiposolicitud)
            .pipe(catchError(e => {
                console.error(' Error al intentar listar. Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public listarDetalleUsuario(tsolicitudId: number) {
        //console.log(URL_END_POINT_BASE + LISTAR_DETALLE_USUARIO + tsolicitudId)
            return this.http.get(URL_END_POINT_BASE + LISTAR_DETALLE_USUARIO + tsolicitudId)
            .pipe(catchError(e => {
                console.error(' Error al intentar listar el detalle de usuario. Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public listarDetalleUsuarioPermiso(tsolicitudId: number) {
        //console.log(URL_END_POINT_BASE + LISTAR_DETALLE_USUARIO_PERMISO + tsolicitudId)
            return this.http.get(URL_END_POINT_BASE + LISTAR_DETALLE_USUARIO_PERMISO + tsolicitudId)
            .pipe(catchError(e => {
                console.error(' Error al intentar listar el detalle de usuario. Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public listarDetalleUsuarioLicencia(tsolicitudId: number) {
        //console.log(URL_END_POINT_BASE + LISTAR_DETALLE_USUARIO_LICENCIA + tsolicitudId)
            return this.http.get(URL_END_POINT_BASE + LISTAR_DETALLE_USUARIO_LICENCIA + tsolicitudId)
            .pipe(catchError(e => {
                console.error(' Error al intentar listar el detalle de usuario. Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public listarDetalleMovilidadLicencia(tsolicitudId: number) {
        //console.log(URL_END_POINT_BASE + LISTAR_DETALLE_USUARIO_MOVILIDAD + tsolicitudId)
            return this.http.get(URL_END_POINT_BASE + LISTAR_DETALLE_USUARIO_MOVILIDAD + tsolicitudId)
            .pipe(catchError(e => {
                console.error(' Error al intentar listar el detalle de usuario. Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public aprobarSolicitud(objAprobar: any) {
        //console.log(URL_END_POINT_BASE + APROBAR_SOLICITUD + objAprobar)
        return this.http.post(URL_END_POINT_BASE + APROBAR_SOLICITUD, objAprobar)
            .pipe(catchError(e => {
                console.error(' Error al intentar aprobar solicitud. Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public rechazarSolicitud(objRechazar: any) {
        //console.log(URL_END_POINT_BASE + RECHAZAR_SOLICITUD + objRechazar)
        return this.http.post(URL_END_POINT_BASE + RECHAZAR_SOLICITUD, objRechazar)
            .pipe(catchError(e => {
                console.error(' Error al intentar rechazar solicitud. Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public listarDistrito() {
        //console.log(URL_END_POINT_BASE + LISTAR_DISTRITO)
        return this.http.get(URL_END_POINT_BASE + LISTAR_DISTRITO)
            .pipe(catchError(e => {
                console.error(' Error al intentar listar distritos. Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public listarMovilidadesAprobados(status: number, idtiposolicitud: number) {
        //console.log(URL_END_POINT_BASE + LISTAR_SOLICITUD_MOVILIDAD_APROBADA + "status=" + status + "&ttiposolicitudId=" + idtiposolicitud)
            return this.http.get(URL_END_POINT_BASE + LISTAR_SOLICITUD_MOVILIDAD_APROBADA + "status=" + status + "&ttiposolicitudId=" + idtiposolicitud)
            .pipe(catchError(e => {
                console.error(' Error al intentar listar. Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public generarTxtPersonas(codipers: string, status: number, idtiposolicitud: number) {
        //console.log(URL_END_POINT_BASE + GENERAR_PAGO + "codiActu=" + codipers + "&status=" + status + "&ttiposolicitudId=" + idtiposolicitud)
            return this.http.get(URL_END_POINT_BASE + GENERAR_PAGO + "codiActu=" + codipers + "&status=" + status + "&ttiposolicitudId=" + idtiposolicitud)
            .pipe(catchError(e => {
                console.error(' Error al intentar listar personas para pago. Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public listarVacacionesAprobados(status: number, idtiposolicitud: number) {
        //console.log(URL_END_POINT_BASE + LISTAR_SOLICITUD_VACACIONES_APROBADA + "status=" + status + "&ttiposolicitudId=" + idtiposolicitud)
            return this.http.get(URL_END_POINT_BASE + LISTAR_SOLICITUD_VACACIONES_APROBADA + "status=" + status + "&ttiposolicitudId=" + idtiposolicitud)
            .pipe(catchError(e => {
                console.error(' Error al intentar listar. Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public reglasVacaciones(pCodipers: string) {
        //console.log(URL_END_POINT_BASE + REGLAS_VACACIONES + "pCodipers=" + pCodipers )
            return this.http.get(URL_END_POINT_BASE + REGLAS_VACACIONES + "pCodipers=" + pCodipers )
            .pipe(catchError(e => {
                console.error(' Error al intentar listar las reglas. Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public obtenerDatosBasicos(pCodipers: string) {
        //console.log(URL_END_POINT_BASE + OBTENERDATOSBASICOS + pCodipers )
            return this.http.get(URL_END_POINT_BASE + OBTENERDATOSBASICOS + pCodipers )
            .pipe(catchError(e => {
                console.error(' Error al intentar obtener datos básicos. Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public reporteAprobados(ttiposolicitudId: number, tusuaaprob: string, status: number): Observable<any>  {
        // console.log(URL_END_POINT_BASE + REPORTE_APROBADOSXAPROB + ttiposolicitudId + "&tusuaaprob=" + tusuaaprob + "&status=" + status)
            return this.http.get(URL_END_POINT_BASE + REPORTE_APROBADOSXAPROB + ttiposolicitudId + "&tusuaaprob=" + tusuaaprob  + "&status=" + status)
            .pipe(catchError(e => {
                console.error(' Error al intentar obtener datos APROBADOS. Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public reporteAprobadosRRHH(ttiposolicitudId: number, status: number): Observable<any>  {
        //console.log(URL_END_POINT_BASE + REPORTE_APROBADOS + ttiposolicitudId + "&status=" + status)
            return this.http.get(URL_END_POINT_BASE + REPORTE_APROBADOS + ttiposolicitudId + "&status=" + status)
            .pipe(catchError(e => {
                console.error(' Error al intentar obtener datos APROBADOS RRHH. Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public exportarTxtCont(pFechInic: string, pTiempo: string, pTipoCambio: number,) {
        //console.log(URL_END_POINT_BASE + LISTAR_TXT_CONTABILIDAD + "pFechInic=" + pFechInic + "&pTiempo=" + pTiempo + "&pTipoCambio=" + pTipoCambio)
            return this.http.get(URL_END_POINT_BASE + LISTAR_TXT_CONTABILIDAD + "pFechInic=" + pFechInic + "&pTiempo=" + pTiempo + "&pTipoCambio=" + pTipoCambio)
            .pipe(catchError(e => {
                console.error(' Error al intentar obtener txt para contabilidad. Msg: ' + e.error);
                return throwError(e);
            })
        );
    }
    
    // Función para crear un PDF
    
    async createPDF(userData: any) {
        const pdfDoc = await PDFDocument.create()
        const page = pdfDoc.addPage([550, 750])
          // Cargar la imagen
        const imgUrl = 'assets/img/nettalco.jpg'; // URL de la imagen
        const imgBytes = await fetch(imgUrl).then(res => res.arrayBuffer());
        const image = await pdfDoc.embedJpg(imgBytes);
          // Dibujar la imagen en la página
        const width = 100; // Anchura de la imagen en puntos
        const height = 50; // Altura de la imagen en puntos
        const x = 30; // Posición X de la imagen en la página
        const y = 670; // Posición Y de la imagen en la página
        page.drawImage(image, {
            x,
            y,
            width,
            height,
        });

        const form = pdfDoc.getForm()

        page.drawText('BOLETA DE PERMISO', { x: 180, y: 670, size: 18 })
        page.drawText('Revisión:  001', { x: 420, y: 720, size: 12 })
        page.drawText('Página:    1 DE 1', { x: 420, y: 700, size: 12 })
        page.drawText('Código:    FSF-002', { x: 420, y: 680, size: 12 })

        page.drawText('Fecha: ', { x: 50, y: 550, size: 15 })
        page.drawText('---------------------------------', { x: 100, y: 540, size: 15 })
        page.drawText(userData.fechaActual, { x: 120, y: 550, size: 13 })
        page.drawText('Código: ', { x: 275, y: 550, size: 15 })
        page.drawText('-------------------------------', { x: 330, y: 540, size: 15 })
        page.drawText(userData.codigo, { x: 350, y: 550, size: 13 })
        page.drawText('Nombre: ', { x: 50, y: 500, size: 15 })
        page.drawText('---------------------------------------------------------------------------', { x: 113, y: 490, size: 15 })
        page.drawText(userData.nombre, { x: 133, y: 500, size: 13 })
        page.drawText('Hora Inicio: ', { x: 50, y: 450, size: 15 })
        page.drawText('---------------------------', { x: 130, y: 440, size: 15 })
        page.drawText(userData.horaInicio, { x: 150, y: 450, size: 13 })
        page.drawText('Hora Fin: ', { x: 275, y: 450, size: 15 })
        page.drawText('-----------------------------', { x: 340, y: 440, size: 15 })
        page.drawText(userData.horaFin, { x: 360, y: 450, size: 13 })
        page.drawText('Motivo: ', { x: 50, y: 400, size: 15 })
        page.drawText('---------------------------------------------------------------------------', { x: 113, y: 390, size: 15 })
        page.drawText('-----------------------------------------------------------------------------------------', { x: 50, y: 340, size: 15 })
        page.drawText(userData.nombreAprob, { x: 180, y: 240, size: 15 })
        page.drawText('-------------------------------------------------', { x: 160, y: 230, size: 15 })
        page.drawText('Jefe de Sector ' + userData.codigoAprob, { x: 180, y: 210, size: 15 })
        page.drawText('Fecha aprobación: ', { x: 20, y: 30, size: 10 })
        page.drawText('04/08/2023', { x: 110, y: 30, size: 10 })


        const pdfBytes = await pdfDoc.save()

        // Crear un blob a partir de los bytes del PDF
        const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });

        // Descargar el archivo PDF
        const link = document.createElement('a');
        link.href = URL.createObjectURL(pdfBlob);
        link.download = 'permiso_'+userData.codigo+'.pdf';
        link.click();
    }

    generateReportWithAdapter(headers: string[], data: Reporte[], filename: string) {
      let workbook = XLSX.utils.book_new();
      let worksheet = XLSX.utils.json_to_sheet([], { header: headers });
    
      XLSX.utils.sheet_add_json(worksheet, data, { origin: 'A2', skipHeader: true })
    
      XLSX.utils.book_append_sheet(workbook, worksheet, "Hoja 1")
      XLSX.writeFileXLSX(workbook, filename);
    }

    generateReporMovitWithAdapter(headers: string[], data: ReporteMovi[], filename: string) {
      let workbook = XLSX.utils.book_new();
      let worksheet = XLSX.utils.json_to_sheet([], { header: headers });
    
      XLSX.utils.sheet_add_json(worksheet, data, { origin: 'A2', skipHeader: true })
    
      XLSX.utils.book_append_sheet(workbook, worksheet, "Hoja 1")
      XLSX.writeFileXLSX(workbook, filename);
    }
  

}