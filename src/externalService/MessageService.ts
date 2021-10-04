import { Constant } from "../../Constant";
import { ApiResponse, Api } from "../../node/library/http/Api";

export class MessageService {

    private static host = Constant.message.host
    private static token = Constant.message.token
    private static sender = Constant.message.sender

    private static async request(endPoint: string, method: string, qs: {} | null, body: {} | null) : Promise<ApiResponse> {
        const uri = this.host + '/api' + endPoint
        const headers = {
            token: this.token
        }
        return Api.request(uri, method, qs, headers, body)
    }

    public static async getEmailProvider() : Promise<any> {
        const qs = {
            sender: this.sender,
        }
        return this.request("/provider/email", 'GET', qs, null)
    }

    public static async sendEmail(to: string, subject: string, message: string, type: string) : Promise<any> {
        const body = {
            to: to,
            sender: this.sender,
            subject: subject,
            message: message,
            type: type
        }
        return this.request("/email", 'POST', null, body)
    }

    public static async sendSms(to: string, message: string, type: string) : Promise<any> {
        const body = {
            phone: to,
            message: message,
            type: type
        }
        return this.request("/sms", 'POST', null, body)
    }

}