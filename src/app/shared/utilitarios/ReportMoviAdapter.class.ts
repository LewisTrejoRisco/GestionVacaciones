import { ReporteMovi } from "./reporteMovi.model";

export interface iReporte {
    tsolicitudId?: number, 
    ttiposolicitudId?: number,
    tfechresp?: string,
    tusuaaprob?: string,
    tfechactu?: string,
    tusuaactu?: string,
    tdesctiposolicitud?: string,
    tstatus?: number,
    statusDesc?: string
}

export class ReportMoviAdapter {
    data: iReporte[] = [];
    constructor(reportList: ReporteMovi[]) {
        reportList.forEach((report, index) => {
            const reportItem: iReporte = {
                tsolicitudId: report.tsolicitudId,
                ttiposolicitudId: report.ttiposolicitudId,
                tfechresp: report.tfechresp,
                tusuaaprob: report.tusuaaprob,
                tfechactu: report.tfechactu,
                tusuaactu: report.tusuaactu,
                tdesctiposolicitud: report.tdesctiposolicitud,
                tstatus: report.tstatus,
                statusDesc: report.statusDesc,
            }
            this.data.push(reportItem)
        })
    }
}