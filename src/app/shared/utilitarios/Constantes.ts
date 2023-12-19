export const URL_END_POINT_BASE = 'http://localhost:8080';
//Auth
export const OBTENERDATOS = "/autenticar/obtenerDatos?pCodipers="

//Comunes
export const SOLICITUDXUSUARIO = "/solicitud/listarXUsuarioGroupByStatus?codiUsua=";
export const SOLICITUD_HISTORIALXUSUARIO = "/solicitud/listarHistorialXUsuario?codiUsua=";
export const LISTAR_SOLICITUD_PENDIENTE = "/solicitud/listarSolicitudesPendientes?codiUsua=";
export const APROBAR_SOLICITUD = "/solicitud/aprobarSolicitud";
export const RECHAZAR_SOLICITUD = "/solicitud/rechazarSolicitud";

// Solicitar vacaciones
export const GRABAR_SOLICITUD = "/solicitud/grabarSolicitud";

// Aprobar vacaciones
export const LISTAR_DETALLE_USUARIO = "/vacaciones/listarXSolicitud?tsolicitudId=";

// Solicitar permiso
export const SOLICITUD_HISTORIALPERMISOXUSUARIO = "/solicitud/listarHistorialPermisoXUsuario?codiUsua=";
export const GRABAR_PERMISO = "/solicitud/grabarPermiso";

// Aprobar permiso
export const LISTAR_DETALLE_USUARIO_PERMISO = "/permisos/listarXSolicitud?tsolicitudId=";

// Solicitar licencia
export const SOLICITUD_HISTORIALLICENCIAXUSUARIO = "/solicitud/listarHistorialLicenciaXUsuario?codiUsua=";
export const GRABAR_LICENCIA = "/solicitud/grabarLicencia";

// Aprobar licencia
export const LISTAR_DETALLE_USUARIO_LICENCIA = "/licencias/listarXSolicitud?tsolicitudId=";

// Solicitar movilidad
export const GRABAR_MOVILIDAD = "/solicitud/grabarMovilidad";
export const SOLICITUD_HISTORIALMOVILIDADXUSUARIO = "/solicitud/listarHistorialMovilidadXUsuario?codiUsua=";

// Aprobar movilidad
export const LISTAR_DETALLE_USUARIO_MOVILIDAD = "/movilidad/listarXSolicitud?tsolicitudId=";

