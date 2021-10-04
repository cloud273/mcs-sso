import { Request, Response} from "express";
import { Req, JsonController, Get, Res, OnUndefined, Patch, Post } from "routing-controllers";
import { RCode } from "../common/Enum";
import { Account } from "../entity/Account";
import { AccountService } from "../service/AccountService";
import { AppValidator } from "../util/Utils";

@JsonController("/account")
export class AccountController {

    @Post()
    @OnUndefined(RCode.badRequest)
    async register(@Req() request: Request, @Res() response: Response) {
        const language = request.body.language
        const username = request.body.username
        const password = request.body.password
        const type = request.body.type
        if (username != null && password != null && type != null 
            && Account.validate(username, type, undefined, undefined, undefined) 
            && AppValidator.isLanguageOrNull(language)
            && AppValidator.isPassword(password)) {
            const result = await AccountService.register(username, password, type, language)
            return response.status(result.code).send(result.data)
        }
    }

    @Patch("/reset-activation-code")
    @OnUndefined(RCode.badRequest)
    async resetActivationCode(@Req() request: Request, @Res() response: Response) {
        const language = request.body.language
        const username = request.body.username
        const type = request.body.type
        if (username != null && type != null 
            && Account.validate(username, type, undefined, undefined, undefined)
            && AppValidator.isLanguageOrNull(language)) {
            const result = await AccountService.resetActivationCode(username, type, language)
            return response.status(result.code).send(result.data)
        } 
    }

    @Patch("/activate")
    @OnUndefined(RCode.badRequest)
    async activate(@Req() request: Request, @Res() response: Response) {
        const username = request.body.username
        const code = request.body.code
        const type = request.body.type
        if (username != null && type != null && code != null
            && Account.validate(username, type, undefined, undefined, code)) {
            const result = await AccountService.activate(username, type, code)
            return response.status(result.code).send(result.data)
        } 
    }

    @Patch("/reset-password-request")
    @OnUndefined(RCode.badRequest)
    async resetPasswordRequest(@Req() request: Request, @Res() response: Response) {
        const language = request.body.language
        const username = request.body.username
        const type = request.body.type
        if (username != null && type != null 
            && Account.validate(username, type, undefined, undefined, undefined)
            && AppValidator.isLanguageOrNull(language)) {
            const result = await AccountService.resetPasswordRequest(username, type, language)
            return response.status(result.code).send(result.data)
        } 
    }

    @Patch("/reset-password")
    @OnUndefined(RCode.badRequest)
    async resetPassword(@Req() request: Request, @Res() response: Response) {
        const username = request.body.username
        const password = request.body.password
        const code = request.body.code
        const type = request.body.type
        if (username != null && password != null && type != null && code != null
            && Account.validate(username, type, undefined, undefined, code)
            && AppValidator.isPassword(password)) {
            const result = await AccountService.resetPassword(password, username, type, code)
            return response.status(result.code).send(result.data)
        } 
    }

    @Patch("/login")
    @OnUndefined(RCode.badRequest)
    async login(@Req() request: Request, @Res() response: Response) {
        const username = request.body.username
        const password = request.body.password
        const type = request.body.type
        if (username != null && type != null && password != null
            && Account.validate(username, type, undefined, undefined, undefined)
            && AppValidator.isPassword(password)) {
            const result = await AccountService.login(username, password, type)
            return response.status(result.code).send(result.data)
        } 
    }

    @Get()
    @OnUndefined(RCode.badRequest)
    async get(@Req() request: Request, @Res() response: Response) {
        const token = request.query.token
        const password = request.query.password
        const type = request.query.type
        if (token != null && type != null 
            && (password == null || AppValidator.isPassword(password))
            && Account.validate(undefined, type, undefined, token, undefined)) {
            const result = await AccountService.get(token, password, type)
            return response.status(result.code).send(result.data)
        } 
    }

    @Patch("/update-password")
    @OnUndefined(RCode.badRequest)
    async updatePassword(@Req() request: Request, @Res() response: Response) {
        const token = request.body.token
        const type = request.body.type
        const password = request.body.password
        const newPassword = request.body.newPassword
        if (token != null && password != null && type != null && newPassword != null
            && Account.validate(undefined, type, undefined, token, undefined)
            && AppValidator.isPassword(newPassword)
            && AppValidator.isPassword(password)) {
            const result = await AccountService.updatePassword(newPassword, password, token, type)
            return response.status(result.code).send(result.data)
        } 
    }

}