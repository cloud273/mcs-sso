import { Request, Response} from "express";
import { Req, JsonController, Get, Res, OnUndefined, Delete, Post, Patch } from "routing-controllers";
import { RCode } from "../common/Enum";
import { Account } from "../entity/Account";
import { AdminService } from "../service/AdminService";
import { Constant } from "../../Constant";
import { AppValidator } from "../util/Utils";

@JsonController("/admin/account")
export class AdminController {

    @Post()
    @OnUndefined(RCode.badRequest)
    async create(@Req() request: Request, @Res() response: Response) {
        const token = request.get("token")
        if (token != null && token == Constant.server.token) {
            const username = request.body.username
            const password = request.body.password
            const actived = request.body.actived
            const type = request.body.type
            if (username != null && password != null && actived != null && type != null
                && Account.validate(username, type, actived, undefined, undefined)
                && AppValidator.isPassword(password)) {
                const result = await AdminService.create(username, password, type, actived)
                return response.status(result.code).send(result.data)
            }
        }
    }

    @Patch("/username")
    @OnUndefined(RCode.badRequest)
    async updateUsername(@Req() request: Request, @Res() response: Response) {
        const token = request.get("token")
        if (token != null && token == Constant.server.token) {
            const username = request.body.username
            const newUsername = request.body.newUsername
            const type = request.body.type
            if (newUsername != null && username != null && type != null
                && Account.validate(newUsername, type, undefined, undefined, undefined)
                && Account.validate(username, type, undefined, undefined, undefined)) {
                const result = await AdminService.updateUsername(username, newUsername, type)
                return response.status(result.code).send(result.data)
            }
        }
    }

    @Patch("/delete-token")
    @OnUndefined(RCode.badRequest)
    async clearToken(@Req() request: Request, @Res() response: Response) {
        const token = request.get("token")
        if (token != null && token == Constant.server.token) {
            const username = request.body.username
            const type = request.body.type
            if (username != null && type != null
                && Account.validate(username, type, undefined, undefined, undefined)) {
                const result = await AdminService.clearToken(username, type)
                return response.status(result.code).send(result.data)
            }
        }
    }

    @Get("/list")
    @OnUndefined(RCode.badRequest)
    async getListBasic(@Req() request: Request, @Res() response: Response) {
        const token = request.get("token")
        if (token != null && token == Constant.server.token) {
            const type = request.query.type as string
            if (type != null 
                && Account.validate(undefined, type, undefined , undefined, undefined)) {
                const result = await AdminService.getListBasic(type)
                return response.status(result.code).send(result.data)
            } 
        }
    }

    @Get()
    @OnUndefined(RCode.badRequest)
    async getDetail(@Req() request: Request, @Res() response: Response) {
        const token = request.get("token")
        if (token != null && token == Constant.server.token) {
            const username = request.query.username as string
            const type = request.query.type as string
            if (username != null && type != null 
                && Account.validate(username, type, undefined, undefined, undefined)) {
                const result = await AdminService.getDetail(username, type)
                return response.status(result.code).send(result.data)
            }
        }
    }

    @Delete()
    @OnUndefined(RCode.badRequest)
    async delete(@Req() request: Request, @Res() response: Response) {
        const token = request.get("token")
        if (token != null && token == Constant.server.token) {
            const username = request.query.username as string
            const type = request.query.type as string
            if (username != null && type != null 
                && Account.validate(username, type, undefined, undefined, undefined)) {
                const result = await AdminService.delete(username, type)
                return response.status(result.code).send(result.data)
            }
        }
    }

}