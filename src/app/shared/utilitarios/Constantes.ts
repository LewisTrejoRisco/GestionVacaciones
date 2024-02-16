export const URL_END_POINT_BASE = 'http://localhost:8080';
// export const URL_END_POINT_BASE = 'http://128.0.1.52:8080/gestionHumana'
//Auth
export const OBTENERDATOS = "/autenticar/obtenerDatos?pCodipers="
export const OBTENERDATOSBASICOS = "/autenticar/obtenerDatosBasicos?pCodipers="

//Comunes
export const SOLICITUDXUSUARIO = "/solicitud/listarXUsuarioGroupByStatus?codiUsua=";
export const SOLICITUD_HISTORIALXUSUARIO = "/solicitud/listarHistorialXUsuario?codiUsua=";
export const LISTAR_SOLICITUD_PENDIENTE = "/solicitud/listarSolicitudesXUsuarioXStatusXTipoSolicitud?";
export const LISTAR_SOLICITUD_APROBADA = "/solicitud/historialAprobados?";
export const APROBAR_SOLICITUD = "/solicitud/aprobarSolicitud";
export const RECHAZAR_SOLICITUD = "/solicitud/rechazarSolicitud";
export const GENERAR_PAGO = "/generar/pagoPersonasTiposolicitud?"
export const REPORTE_APROBADOSXAPROB = "/solicitud/buscarXTtiposolicitudIdAndTusuaaprobAndNotInTstatus?ttiposolicitudId=";
export const REPORTE_APROBADOS = "/solicitud/buscarXTipoSolicitudAndNotinStatus?ttiposolicitudId=";

// Solicitar vacaciones
export const GRABAR_SOLICITUD = "/solicitud/grabarSolicitud";
export const REGLAS_VACACIONES = "/vacaciones/reglasVacaciones?";

// Aprobar vacaciones
export const LISTAR_DETALLE_USUARIO = "/vacaciones/listarXSolicitud?tsolicitudId=";
export const LISTAR_SOLICITUD_VACACIONES_APROBADA = "/solicitud/listarHistorialVacacionesXStatusXTipo?";

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
export const LISTAR_DISTRITO = "/movilidad/listarDistritos";
export const LISTAR_SOLICITUD_MOVILIDAD_APROBADA = "/solicitud/listarHistorialMovilidadXStatusXTipo?";

// Aprobar movilidad
export const LISTAR_DETALLE_USUARIO_MOVILIDAD = "/movilidad/listarXSolicitud?tsolicitudId=";

//Banco BBVA
export const PRIMER_ORDENANTE = "2110";
export const SEGUNDO_ORDENANTE = "2120";
export const PRIMER_BENEFICIARIO = "2210";
export const PRIMER_BENEFICIARIO_SEGUNDO = "2220";
export const REGISTRO_TOTALES = "2910";
export const TIPO_DOCUMENTO_RUC = "R";
export const DOCUMENTO_RUC_ORDENANTE = "20100064571";
export const CUENTA_ORDENANTE = "00110686320100006627";
export const NOMBRE_ORDENANTE = "INDUSTRIAS NETTALCO SA";
export const DIVISA_CUENTA_SOLES = "PEN";
export const VALIDACION_PERTENENCIA_VALIDA = "1";
export const INDICADOR_DEVOLUCION = "0";
export const SERVICIO_QUINTA_CATEGORIA = "108";
export const CODIGO_DEVOLUCION = "0000";
export const CODIGO_BANCO_CUENTA_BENEFICIARIO = "0011";
export const TIPO_ABONO_PROPIO = "P";
export const TIPO_CUENTA_TITULAR = "00";

//Banco BCP
export const TIPO_REGISTRO = "1";
export const PLANILLA_HABERES = "X";
export const CUENTA_CARGO = "C";
export const MONEDA_CARGO_SOLES = "0001"
export const TIPO_REGISTRO_BENEFICIARIO = "2";
export const TIPO_CUENTA_ABONO_AHORRO = "A";
export const TIPO_DOCUMENTO_DNI = "DNI";
export const TIPO_DOCUMENTO_CE = "CE";
export const TIPO_DOCUMENTO_PAS = "PASS";
export const MONEDA_IMPORTE_SOLES = "0001";
export const FLAG_IDC = "S";
export const NUMERO_CUENTA_CARGO = "1930454658003"
