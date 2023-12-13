import {HttpHeaders} from '@angular/common/http';

// Solicitar vacaciones
export const URL_END_POINT_BASE = 'http://localhost:8080';
export const SOLICITUDXUSUARIO = "/solicitud/listarXUsuarioGroupByStatus?codiUsua=";
export const SOLICITUD_HISTORIALXUSUARIO = "/solicitud/listarHistorialXUsuario?codiUsua=";
export const GRABAR_SOLICITUD = "/solicitud/grabarSolicitud";
// Aprobar vacaciones
export const LISTAR_SOLICITUD_PENDIENTE = "/solicitud/listarSolicitudesPendientes?codiUsua=";
export const APROBAR_SOLICITUD = "/solicitud/aprobarSolicitud";
export const RECHAZAR_SOLICITUD = "/solicitud/rechazarSolicitud";
