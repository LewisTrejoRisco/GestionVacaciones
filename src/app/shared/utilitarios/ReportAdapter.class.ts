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
    tmonto?:number,
    tstatus?: string,
    statusDesc?: string,
    tusuaaprob?: string,
    tdescusuaaprob?: string,
    tfechaprob?: string
}

export class ReportAdapter {
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
                tmonto: report.tmonto,
                statusDesc: report.statusDesc,
                tusuaaprob: report.tusuaactu,
                tdescusuaaprob: report.tdescusuaactu,
                tfechaprob: report.tfechactu
            }
            this.data.push(reportItem)
        })
    }
}