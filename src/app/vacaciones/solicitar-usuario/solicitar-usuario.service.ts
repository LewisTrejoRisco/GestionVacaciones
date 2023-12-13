import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Trabajador } from "../aprobar/trabajador.model";
import { GRABAR_SOLICITUD, SOLICITUDXUSUARIO, SOLICITUD_HISTORIALXUSUARIO, URL_END_POINT_BASE } from "../Constantes";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";

@Injectable()
export class SolicitarUsuarioService {
    constructor(private http: HttpClient) {

    }

    public trabajador: Trabajador[] = [
        {
            userID: '1',
            nombre: "Lewis Bryan Trejo Risco",
            fechaInicio: '09/11/2023',
            fechaFin: '15/11/2023',
            foto: "assets/img/portrait/small/avatar-s-2.png"
        }
        // {
        //     userID: '2',
        //     nombre: "Carlos Daniel Evangelista Avila",
        //     fechaInicio: '09/11/2023',
        //     fechaFin: '15/11/2023',
        //     foto: "assets/img/portrait/small/avatar-s-2.png"
        // }
    ]

    public listarSolicitudes(codiUsua: string) {
        console.log(URL_END_POINT_BASE + SOLICITUDXUSUARIO + codiUsua)
            return this.http.get(URL_END_POINT_BASE + SOLICITUDXUSUARIO + codiUsua)
            .pipe(catchError(e => {
                console.error(' Error al intentar listar. Msg: ' + e.error);
                return throwError(e);
            })
        );
    }

    public listarHistorialSolicitudes(codiUsua: string) {
        console.log(URL_END_POINT_BASE + SOLICITUD_HISTORIALXUSUARIO + codiUsua)
            return this.http.get(URL_END_POINT_BASE + SOLICITUD_HISTORIALXUSUARIO + codiUsua)
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

}