import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
// import { Trabajador } from "./trabajador.model";
import { APROBAR_SOLICITUD, LISTAR_SOLICITUD_PENDIENTE, RECHAZAR_SOLICITUD, URL_END_POINT_BASE } from "../Constantes";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";

@Injectable()
export class AprobarVentaService {
    constructor(private http: HttpClient) {

    }

    // public trabajador: Trabajador[] = [
    //     {
    //         userID: '1',
    //         nombre: "Lewis Bryan Trejo Risco",
    //         fechaInicio: '09/11/2023',
    //         fechaFin: '15/11/2023',
    //         foto: "assets/img/portrait/small/avatar-s-2.png"
    //     }
        // {
        //     userID: '2',
        //     nombre: "Carlos Daniel Evangelista Avila",
        //     fechaInicio: '09/11/2023',
        //     fechaFin: '15/11/2023',
        //     foto: "assets/img/portrait/small/avatar-s-2.png"
        // }
    // ]

    public listarSolicitudesPendientes(codiUsua: string, status: string, idtiposolicitud: number) {
        console.log(URL_END_POINT_BASE + LISTAR_SOLICITUD_PENDIENTE + codiUsua + "&status=" + status + "&idtiposolicitud=" + idtiposolicitud)
            return this.http.get(URL_END_POINT_BASE + LISTAR_SOLICITUD_PENDIENTE + codiUsua + "&status=" + status + "&idtiposolicitud=" + idtiposolicitud)
            .pipe(catchError(e => {
                console.error(' Error al intentar listar. Msg: ' + e.error);
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

}