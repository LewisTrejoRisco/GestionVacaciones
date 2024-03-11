import { ReporteMovi } from "./reporteMovi.model";

export interface iReporte {
    tusuasoli?: string,
    tnumeviaje?: number,
    tfechinicsoli?: string,
    tfechfinasoli?: string,
    tmonto?: number,
    tfechresp?: string,
    tusuaaprob?: string,
    tfechactu?: string,
    tusuaactu?: string,
    tdesctiposolicitud?: string,
    statusDesc?: string
}

export class ReportMoviAdapter {
    data: iReporte[] = [];
    constructor(reportList: ReporteMovi[]) {
        reportList.forEach((report, index) => {
            const reportItem: iReporte = {
                tusuasoli: report.tusuasoli,
                tnumeviaje: report.tnumeviaje,
                tfechinicsoli: report.tfechinicsoli,
                tfechfinasoli: report.tfechfinasoli,
                tmonto: report.tmonto,
                tfechresp: report.tfechresp,
                tusuaaprob: report.tusuaaprob,
                tfechactu: report.tfechactu,
                tusuaactu: report.tusuaactu,
                tdesctiposolicitud: report.tdesctiposolicitud,
                statusDesc: report.statusDesc,
            }
            this.data.push(reportItem)
        })
    }
}