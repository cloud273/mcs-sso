import { ApiResponse, Api } from "../../node/library/http/Api";

export class RequestApiManager {

    private static host = "http://localhost:3040"
    private static token = "73NuuN8wPVhScY5+6K7Y4IkRpMSwveojrhingtYirAUw+cRcKNGqRrMGBtYJ21kmS9T3uxsirsMh2rQacrALSQ"


    private static async userRequest(endPoint: string, method: string, qs: {} | null, body: {} | null) : Promise<ApiResponse> {
        const uri = this.host + '/api' + endPoint
        return Api.request(uri, method, qs, null, body)
    }

    private static async adminRequest(endPoint: string, method: string, qs: {} | null, body: {} | null) : Promise<ApiResponse> {
        const uri = this.host + '/api' + endPoint
        const headers = {
            token: this.token
        }
        return Api.request(uri, method, qs, headers, body)
    }

    public static async get(token: string, password: string | null, type: string) : Promise<ApiResponse> {
        const qs = {
            token: token,
            type: type
        }
        if (password != null) {
            qs["password"] = password
        }
        return this.userRequest('/account', 'GET', qs, null)
    }

    public static async register(username: string, password: string, type: string, language: string | null) : Promise<ApiResponse> {
        const body = {
            username: username,
            password: password,
            type: type,
            language: language
        }
        return this.userRequest('/account', 'POST', null, body)
    }

    public static async resetActivationCode(username: string, type: string, language: string | null) : Promise<ApiResponse> {
        const body = {
            username: username,
            type: type,
            language: language
        }
        return this.userRequest('/account/reset-activation-code', 'PATCH', null, body)
    }

    public static async activate(username: string, type: string, code: string) : Promise<ApiResponse> {
        const body = {
            username: username,
            type: type,
            code: code
        }
        return this.userRequest('/account/activate', 'PATCH', null, body)
    }

    public static async resetPasswordRequest(username: string, type: string, language: string | null) : Promise<ApiResponse> {
        const body = {
            username: username,
            type: type,
            language: language
        }
        return this.userRequest('/account/reset-password-request', 'PATCH', null, body)
    }

    public static async resetPassword(username: string, password: string, type: string, code: string) : Promise<ApiResponse> {
        const body = {
            username: username,
            password: password,
            type: type,
            code: code
        }
        return this.userRequest('/account/reset-password', 'PATCH', null, body)
    }

    public static async login(username: string, password: string, type: string) : Promise<ApiResponse> { 
        const body = {
            username: username,
            password: password,
            type: type
        }
        return this.userRequest('/account/login', 'PATCH', null, body)
    }

    public static async updatePassword(token: string, type: string, password: string, newPassword: string) : Promise<ApiResponse> {
        const body = {
            token: token,
            type: type,
            password: password,
            newPassword: newPassword
        }
        return this.userRequest('/account/update-password', 'PATCH', null, body)
    }

    public static async adminGetAccount(username: string, type: string) : Promise<ApiResponse> {
        const qs = {
            username: username,
            type: type
        }
        return this.adminRequest('/admin/account', 'GET', qs, null)
    }

    public static async adminCreateAccount(username: string, password: string, type: string, actived: boolean) : Promise<ApiResponse> {
        const body = {
            username: username,
            password: password,
            type: type,
            actived: actived
        }
        return this.adminRequest('/admin/account', 'POST', null, body)
    }

    public static async adminDeleteAccount(username: string, type: string) : Promise<ApiResponse> {
        const qs = {
            username: username,
            type: type
        }
        return this.adminRequest('/admin/account', 'DELETE', qs, null)
    }

    public static async adminUpdateAccountUsername(username: string, newUsername: string, type: string) : Promise<ApiResponse> { 
        const body = {
            username: username,
            newUsername: newUsername,
            type: type
        }
        return this.adminRequest('/admin/account/username', 'PATCH', null, body)
    }

    public static async adminDeleteAccountToken(username: string, type: string) : Promise<ApiResponse> { 
        const body = {
            username: username,
            type: type
        }
        return this.adminRequest('/admin/account/delete-token', 'PATCH', null, body)
    }

    public static async adminGetList(type: string) : Promise<ApiResponse> {
        const qs = {
            type: type
        }
        return this.adminRequest('/admin/account/list', 'GET', qs, null)
    }

}
