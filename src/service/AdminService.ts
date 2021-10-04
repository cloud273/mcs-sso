import { getCustomRepository } from "typeorm";
import { Result } from "../common/Result";
import { RCode } from "../common/Enum";
import { Sql } from "../../node/library/sql/Sql";
import { AdminAccountRepository } from "../repository/AdminAccountRepository";
import { Encrypt } from "../../node/library/utility/Function";

export class AdminService {

    static async create(username: string, password: string, type: string, actived: boolean): Promise<Result> {
        let result: Result
        let _password = Encrypt(password)
        await getCustomRepository(AdminAccountRepository).insert(username, _password, type, actived, undefined, undefined)
        .then(obj => {
            const statusCode = Sql.insert(obj)
            if (statusCode == RCode.created) {
                result = Result.init(statusCode, {
                    message: "account created"
                })
            } else {
                result = Result.init(statusCode)
            }
        })
        .catch(err => {
            result = Result.init(Sql.error(err))
        })
        return result
    }

    static async updateUsername(username: string, newUsername: string, type: string): Promise<Result> {
        let result: Result
        await getCustomRepository(AdminAccountRepository).updateUsername(username, newUsername, type)
        .then(async obj => {
            const statusCode = Sql.update(obj)
            if (statusCode == RCode.success) {
                result = Result.init(statusCode, {
                    message: "updated"
                })
            } else {
                result = Result.init(statusCode)
            }
        })
        .catch(err => {
            result = Result.init(Sql.error(err))
        })
        return result
    }

    static async clearToken(username: string, type: string): Promise<Result> {
        let result: Result
        await getCustomRepository(AdminAccountRepository).clearToken(username, type)
        .then(async obj => {
            const statusCode = Sql.update(obj)
            if (statusCode == RCode.success) {
                result = Result.init(statusCode, {
                    message: "token cleared"
                })
            } else {
                result = Result.init(statusCode)
            }
        })
        .catch(err => {
            result = Result.init(Sql.error(err))
        })
        return result
    }

    static async getListBasic(type: string): Promise<Result> {
        const objs = await getCustomRepository(AdminAccountRepository).getListBasic(type)
        return Result.init(RCode.success, objs)
    }

    static async getDetail(username: string, type: string): Promise<Result> {
        let result: Result
        const obj = await getCustomRepository(AdminAccountRepository).getDetail(username, type)
        if (obj == null) {
            result = Result.init(RCode.notFound)
        } else {
            result = Result.init(RCode.success, obj)
        } 
        return result
    }

    static async delete(username: string, type: string): Promise<Result> {
        let result: Result
        await getCustomRepository(AdminAccountRepository).delete(username, type)
        .then(async obj => {
            const statusCode = Sql.delete(obj)
            if (statusCode == RCode.success) {
                result = Result.init(statusCode, {
                    message: "deleted"
                })
            } else {
                result = Result.init(statusCode)
            }
        })
        .catch(err => {
            result = Result.init(Sql.error(err))
        })
        return result
    }

}