import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { APROBAR_SOLICITUD, GENERAR_PAGO, GRABAR_LICENCIA, GRABAR_MOVILIDAD, GRABAR_PERMISO, GRABAR_SOLICITUD, LISTAR_DETALLE_USUARIO, LISTAR_DETALLE_USUARIO_LICENCIA, LISTAR_DETALLE_USUARIO_MOVILIDAD, LISTAR_DETALLE_USUARIO_PERMISO, LISTAR_DISTRITO, LISTAR_SOLICITUD_MOVILIDAD_APROBADA, LISTAR_SOLICITUD_PENDIENTE, LISTAR_SOLICITUD_VACACIONES_APROBADA, RECHAZAR_SOLICITUD, SOLICITUDXUSUARIO, SOLICITUD_HISTORIALLICENCIAXUSUARIO, SOLICITUD_HISTORIALMOVILIDADXUSUARIO, SOLICITUD_HISTORIALPERMISOXUSUARIO, SOLICITUD_HISTORIALXUSUARIO, URL_END_POINT_BASE } from "app/shared/utilitarios/Constantes";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";

@Injectable()
export class SolicitarService {
    constructor(private http: HttpClient) {

    }

    public listarSolicitudes(codiUsua: string, ttiposolicitudId: number) {
        console.log(URL_END_POINT_BASE + SOLICITUDXUSUARIO + codiUsua + '&ttiposolicitudId=' + ttiposolicitudId)
            return this.http.get(URL_END_POINT_BASE + SOLICITUDXUSUARIO + codiUsua + '&ttiposolicitudId=' + ttiposolicitudId)
            .pipe(catchError(e => {
                console.error(' Error al intentar listar. Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public listarHistorialSolicitudes(codiUsua: string, ttiposolicitudId: number) {
        console.log(URL_END_POINT_BASE + SOLICITUD_HISTORIALXUSUARIO + codiUsua + '&ttiposolicitudId=' + ttiposolicitudId)
            return this.http.get(URL_END_POINT_BASE + SOLICITUD_HISTORIALXUSUARIO + codiUsua + '&ttiposolicitudId=' + ttiposolicitudId)
            .pipe(catchError(e => {
                console.error(' Error al intentar listar historial. Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public listarHistorialPermisoSolicitudes(codiUsua: string, ttiposolicitudId: number) {
        console.log(URL_END_POINT_BASE + SOLICITUD_HISTORIALPERMISOXUSUARIO + codiUsua + '&ttiposolicitudId=' + ttiposolicitudId)
            return this.http.get(URL_END_POINT_BASE + SOLICITUD_HISTORIALPERMISOXUSUARIO + codiUsua + '&ttiposolicitudId=' + ttiposolicitudId)
            .pipe(catchError(e => {
                console.error(' Error al intentar listar historial. Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public listarHistorialLicenciasSolicitudes(codiUsua: string, ttiposolicitudId: number) {
        console.log(URL_END_POINT_BASE + SOLICITUD_HISTORIALLICENCIAXUSUARIO + codiUsua + '&ttiposolicitudId=' + ttiposolicitudId)
            return this.http.get(URL_END_POINT_BASE + SOLICITUD_HISTORIALLICENCIAXUSUARIO + codiUsua + '&ttiposolicitudId=' + ttiposolicitudId)
            .pipe(catchError(e => {
                console.error(' Error al intentar listar historial. Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public listarHistorialMovilidadSolicitudes(codiUsua: string, ttiposolicitudId: number) {
        console.log(URL_END_POINT_BASE + SOLICITUD_HISTORIALMOVILIDADXUSUARIO + codiUsua + '&ttiposolicitudId=' + ttiposolicitudId)
            return this.http.get(URL_END_POINT_BASE + SOLICITUD_HISTORIALMOVILIDADXUSUARIO + codiUsua + '&ttiposolicitudId=' + ttiposolicitudId)
            .pipe(catchError(e => {
                console.error(' Error al intentar listar historial. Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public grabarSolicitud(objSolicitud: any) {
        console.log(URL_END_POINT_BASE + GRABAR_SOLICITUD + objSolicitud)
        return this.http.post(URL_END_POINT_BASE + GRABAR_SOLICITUD, objSolicitud)
            .pipe(catchError(e => {
                console.error(' Error al intentar grabar solicitud. Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public grabarPermiso(objSolicitud: any) {
        console.log(URL_END_POINT_BASE + GRABAR_PERMISO + objSolicitud)
        return this.http.post(URL_END_POINT_BASE + GRABAR_PERMISO, objSolicitud)
            .pipe(catchError(e => {
                console.error(' Error al intentar grabar permiso. Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public grabarLicencia(objSolicitud: any) {
        console.log(URL_END_POINT_BASE + GRABAR_LICENCIA + objSolicitud)
        return this.http.post(URL_END_POINT_BASE + GRABAR_LICENCIA, objSolicitud)
            .pipe(catchError(e => {
                console.error(' Error al intentar grabar licencia. Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public grabarMovilidad(objSolicitud: any) {
        console.log(URL_END_POINT_BASE + GRABAR_MOVILIDAD + objSolicitud)
        return this.http.post(URL_END_POINT_BASE + GRABAR_MOVILIDAD, objSolicitud)
            .pipe(catchError(e => {
                console.error(' Error al intentar grabar movilidad. Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public listarSolicitudesPendientes(codiUsua: string, status: string, idtiposolicitud: number) {
        console.log(URL_END_POINT_BASE + LISTAR_SOLICITUD_PENDIENTE + "codiUsua=" + codiUsua + "&status=" + status + "&idtiposolicitud=" + idtiposolicitud)
            return this.http.get(URL_END_POINT_BASE + LISTAR_SOLICITUD_PENDIENTE + "codiUsua=" + codiUsua + "&status=" + status + "&idtiposolicitud=" + idtiposolicitud)
            .pipe(catchError(e => {
                console.error(' Error al intentar listar. Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public listarSolicitudesPendientesXStatusXTipo(status: string, idtiposolicitud: number) {
        console.log(URL_END_POINT_BASE + LISTAR_SOLICITUD_PENDIENTE + "status=" + status + "&idtiposolicitud=" + idtiposolicitud)
            return this.http.get(URL_END_POINT_BASE + LISTAR_SOLICITUD_PENDIENTE + "status=" + status + "&idtiposolicitud=" + idtiposolicitud)
            .pipe(catchError(e => {
                console.error(' Error al intentar listar. Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public listarDetalleUsuario(tsolicitudId: number) {
        console.log(URL_END_POINT_BASE + LISTAR_DETALLE_USUARIO + tsolicitudId)
            return this.http.get(URL_END_POINT_BASE + LISTAR_DETALLE_USUARIO + tsolicitudId)
            .pipe(catchError(e => {
                console.error(' Error al intentar listar el detalle de usuario. Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public listarDetalleUsuarioPermiso(tsolicitudId: number) {
        console.log(URL_END_POINT_BASE + LISTAR_DETALLE_USUARIO_PERMISO + tsolicitudId)
            return this.http.get(URL_END_POINT_BASE + LISTAR_DETALLE_USUARIO_PERMISO + tsolicitudId)
            .pipe(catchError(e => {
                console.error(' Error al intentar listar el detalle de usuario. Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public listarDetalleUsuarioLicencia(tsolicitudId: number) {
        console.log(URL_END_POINT_BASE + LISTAR_DETALLE_USUARIO_LICENCIA + tsolicitudId)
            return this.http.get(URL_END_POINT_BASE + LISTAR_DETALLE_USUARIO_LICENCIA + tsolicitudId)
            .pipe(catchError(e => {
                console.error(' Error al intentar listar el detalle de usuario. Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public listarDetalleMovilidadLicencia(tsolicitudId: number) {
        console.log(URL_END_POINT_BASE + LISTAR_DETALLE_USUARIO_MOVILIDAD + tsolicitudId)
            return this.http.get(URL_END_POINT_BASE + LISTAR_DETALLE_USUARIO_MOVILIDAD + tsolicitudId)
            .pipe(catchError(e => {
                console.error(' Error al intentar listar el detalle de usuario. Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public aprobarSolicitud(objAprobar: any) {
        console.log(URL_END_POINT_BASE + APROBAR_SOLICITUD + objAprobar)
        return this.http.post(URL_END_POINT_BASE + APROBAR_SOLICITUD, objAprobar)
            .pipe(catchError(e => {
                console.error(' Error al intentar aprobar solicitud. Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public rechazarSolicitud(objRechazar: any) {
        console.log(URL_END_POINT_BASE + RECHAZAR_SOLICITUD + objRechazar)
        return this.http.post(URL_END_POINT_BASE + RECHAZAR_SOLICITUD, objRechazar)
            .pipe(catchError(e => {
                console.error(' Error al intentar rechazar solicitud. Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public listarDistrito() {
        console.log(URL_END_POINT_BASE + LISTAR_DISTRITO)
        return this.http.get(URL_END_POINT_BASE + LISTAR_DISTRITO)
            .pipe(catchError(e => {
                console.error(' Error al intentar listar distritos. Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public listarMovilidadesAprobados(status: string, idtiposolicitud: number) {
        console.log(URL_END_POINT_BASE + LISTAR_SOLICITUD_MOVILIDAD_APROBADA + "status=" + status + "&ttiposolicitudId=" + idtiposolicitud)
            return this.http.get(URL_END_POINT_BASE + LISTAR_SOLICITUD_MOVILIDAD_APROBADA + "status=" + status + "&ttiposolicitudId=" + idtiposolicitud)
            .pipe(catchError(e => {
                console.error(' Error al intentar listar. Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public generarTxtPersonas(codipers: string, status: string, idtiposolicitud: number) {
        console.log(URL_END_POINT_BASE + GENERAR_PAGO + "codiActu=" + codipers + "&status=" + status + "&ttiposolicitudId=" + idtiposolicitud)
            return this.http.get(URL_END_POINT_BASE + GENERAR_PAGO + "codiActu=" + codipers + "&status=" + status + "&ttiposolicitudId=" + idtiposolicitud)
            .pipe(catchError(e => {
                console.error(' Error al intentar listar personas para pago. Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public listarVacacionesAprobados(status: string, idtiposolicitud: number) {
        console.log(URL_END_POINT_BASE + LISTAR_SOLICITUD_VACACIONES_APROBADA + "status=" + status + "&ttiposolicitudId=" + idtiposolicitud)
            return this.http.get(URL_END_POINT_BASE + LISTAR_SOLICITUD_VACACIONES_APROBADA + "status=" + status + "&ttiposolicitudId=" + idtiposolicitud)
            .pipe(catchError(e => {
                console.error(' Error al intentar listar. Msg: ' + e.error);
                return throwError(e);
            })
        );
    }
  
    // public guardarDistritos(distritos: string): void {
    //     sessionStorage.setItem('distritos', distritos);
    // }
    

}