import { ReporteVencida } from "./reporteVencida.model"; 

export interface iReporteVenc {
    tsolicitudid?: number,
    ttiposolicitud?: number,
    tnombtiposolicitud?: string,
    tnombpila?: string,
    tusuaaprob?: string,
    tsitutrab?: string,
    tfechregi?: string,
    tusuasoli?: string,
    tfechinicsoli?: string,
    tfechfinasoli?: string,
    tfechvenc?: number
}

export class ReportAdapterVencida {
    data: iReporteVenc[] = [];
    constructor(reportList: ReporteVencida[]) {
        reportList.forEach((report, index) => {
            const reportItem: iReporteVenc = {
                tsolicitudid: report.tsolicitudid,
                tnombtiposolicitud: report.tnombtiposolicitud,
                tusuaaprob: report.tusuaaprob,
                tnombpila: report.tnombpila,
                tsitutrab: report.tsitutrab,
                tfechregi: report.tfechregi,
                tusuasoli: report.tusuasoli,
                tfechinicsoli: report.tfechinicsoli,
                tfechfinasoli: report.tfechfinasoli,
                tfechvenc: report.tfechvenc,
            }
            this.data.push(reportItem)
        })
    }
}