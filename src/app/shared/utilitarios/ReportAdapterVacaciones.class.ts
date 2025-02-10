import { ReporteVacaciones } from "./reporteVacaciones.model";

export interface iReporteV {
    tusuasoli?: string,
    tdescusuasoli?: string,
    tdesctiposolicitud?: string,
    tfechinicsoli?: string,
    tfechfinasoli?: string,
    tcantdias?: number,
    statusDesc?: string,
    tdescusuaactu?: string,
    tfechactu?: string,
    tflagadelvaca?: string,
}

export class ReportAdapterVacaciones {
    data: iReporteV[] = [];
    constructor(reportList: ReporteVacaciones[]) {
        reportList.forEach((report, index) => {
            const reportItem: iReporteV = {
                tusuasoli: report.tusuasoli,
                tdescusuasoli: report.tdescusuasoli,
                tdesctiposolicitud: report.tdesctiposolicitud,
                tfechinicsoli: report.tfechinicsoli,
                tfechfinasoli: report.tfechfinasoli,
                tcantdias: report.tcantdias,
                statusDesc: report.statusDesc,
                tdescusuaactu: report.tdescusuaactu,
                tfechactu: report.tfechactu,
                tflagadelvaca: report.tflagadelvaca,
            }
            this.data.push(reportItem)
        })
    }
}