import { Reporte } from "./reporte.model";

export interface iReporte {
    tsolicitudId?: number, 
    ttiposolicitudId?: number,
    tdesctiposolicitud?: string,
    tfechregi?: string,
    tusuasoli?: string,
    tdescusuasoli?: string,
    tfechinicsoli?: string,
    tfechfinasoli?: string,
    tstatus?: string,
    statusDesc?: string,
    tusuaaprob?: string,
    tdescusuaaprob?: string,
    tfechaprob?: string,
    tusuaactu?: string,
    tdescusuaactu?: string,
    tfechactu?: string 
}

export class ReportAdapterMovilidad {
    data: iReporte[] = [];
    constructor(reportList: Reporte[]) {
        reportList.forEach((report, index) => {
            const reportItem: iReporte = {
                tusuasoli: report.tusuasoli,
                tdescusuasoli: report.tdescusuasoli,
                tdesctiposolicitud: report.tdesctiposolicitud,
                tfechregi: report.tfechregi,
                tfechinicsoli: report.tfechinicsoli,
                tfechfinasoli: report.tfechfinasoli,
                statusDesc: report.statusDesc,
                tusuaaprob: report.tusuaaprob,
                tdescusuaaprob: report.tdescusuaaprob,
                tfechaprob: report.tfechaprob,
                tusuaactu: report.tusuaactu,
                tdescusuaactu: report.tdescusuaactu,
                tfechactu: report.tfechactu,
            }
            this.data.push(reportItem)
        })
    }
}