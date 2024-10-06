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
    tfechaprob?: string,
    tflagadelvaca?: string
}

export class ReportAdapterComun {
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
                tusuaaprob: report.tusuaactu,
                tdescusuaaprob: report.tdescusuaactu,
                tfechaprob: report.tfechactu
            }
            this.data.push(reportItem)
        })
    }
}

export class ReportAdapterComun2 {
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
                tusuaaprob: report.tusuaactu,
                tdescusuaaprob: report.tdescusuaactu,
                tfechaprob: report.tfechactu,
                tflagadelvaca: report.tflagadelvaca,
            }
            this.data.push(reportItem)
        })
    }
}