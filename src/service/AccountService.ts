import { getCustomRepository } from "typeorm";
import { Result } from "../common/Result";
import { AccountRepository } from "../repository/AccountRepository";
import { RCode, Language, MessageType } from "../common/Enum";
import { MessageService } from "../externalService/MessageService";
import { Constant } from "../../Constant";
import { Validator } from "class-validator";
import { Encrypt } from "../../node/library/utility/Function";
import { Sql } from "../../node/library/sql/Sql";
import { Log } from "../../node/library/log/Log";
import { Code, Token } from "../util/Utils";
import { Account } from "../entity/Account";

export class AccountService {

    static async register(username: string, password: string, type: string, language: Language): Promise<Result> {
        let result: Result
        let code = Code.generate()
        let _password = Encrypt(password)
        await getCustomRepository(AccountRepository).insert(username, _password, type, false, code.value, code.exp)
        .then(obj => {
            const statusCode = Sql.insert(obj)
            if (statusCode == Sql.created) {
                const lang = language == null ? Language.vi : language
                const validator = new Validator()
                if (validator.isEmail(username)) {
                    result = Result.init(statusCode, {
                        code: MessageType.email
                    })
                    const subject = Constant.notify.activation.subject[lang]
                    const message = Constant.notify.activation.message[lang] + code.value
                    MessageService.sendEmail(username, subject, message, Constant.type.create)
                    .catch(err => {
                        Log.message("Activation email was not sent", err)
                    })
                } else {
                    result = Result.init(statusCode, {
                        code: MessageType.sms
                    })
                    const message = Constant.notify.activation.sms[lang] + code.value
                    MessageService.sendSms(username, message, Constant.type.create)
                    .catch(err => {
                        Log.message("Activation sms was not sent", err)
                    })
                }
            } else {
                result = Result.init(statusCode)
            }
        })
        .catch(err => {
            result = Result.init(Sql.error(err))
        })
        return result
    }

    static async resetActivationCode(username: string, type: string, language: Language): Promise<Result> {
        let result: Result
        let code = Code.generate()
        await getCustomRepository(AccountRepository).updateCode(code.value, code.exp, username, type, false)
        .then (obj => {
            const statusCode = Sql.update(obj)
            if (statusCode == Sql.success) {
                const lang = language == null ? Language.vi : language
                const validator = new Validator()
                if (validator.isEmail(username)) {
                    result = Result.init(statusCode, {
                        code: MessageType.email
                    })
                    const subject = Constant.notify.activation.subject[lang]
                    const message = Constant.notify.activation.message[lang] + code.value
                    MessageService.sendEmail(username, subject, message, Constant.type.activate)
                    .catch(err => {
                        Log.message("Activation email was not sent", err)
                    })
                } else {
                    result = Result.init(statusCode, {
                        code: MessageType.sms
                    })
                    const message = Constant.notify.activation.sms[lang] + code.value
                    MessageService.sendSms(username, message, Constant.type.activate)
                    .catch(err => {
                        Log.message("Activation sms was not sent", err)
                    })
                }
            } else {
                result = Result.init(statusCode)
            }
        })
        .catch (err => {
            result = Result.init(Sql.error(err))
        })
        return result
    }

    static async activate(username: string, type: string, code: string): Promise<Result> {
        let result: Result
        const repositoty = getCustomRepository(AccountRepository)
        const account = await repositoty.getAccount(username, type, false) 
        if (account == undefined) {
            result = Result.init(Sql.notFound)
        } else {
            if (account.code == code) {
                if (account.codeExp > new Date()) {
                    await getCustomRepository(AccountRepository).activate(username, type)
                    .then (obj => {
                        const statusCode = Sql.update(obj)
                        if (statusCode == Sql.success) {
                            result = Result.init(statusCode, {
                                message: "account actived"
                            })
                        } else {
                            result = Result.init(statusCode)
                        }
                    })
                    .catch (err => {
                        result = Result.init(Sql.error(err))
                    })
                } else {
                    await getCustomRepository(AccountRepository).updateCode(null, null, username, type, false)
                    result = Result.init(406)
                }
            } else {
                await getCustomRepository(AccountRepository).updateCode(null, null, username, type, false)
                result = Result.init(403)
            }
        }
        return result
    }

    static async resetPasswordRequest(username: string, type: string, language: Language): Promise<Result> {
        let result: Result
        let code = Code.generate()
        await getCustomRepository(AccountRepository).updateCode(code.value, code.exp, username, type, true)
        .then (obj => {
            const statusCode = Sql.update(obj)
            if (statusCode == Sql.success) {
                const lang = language == null ? Language.vi : language
                const validator = new Validator()
                if (validator.isEmail(username)) {
                    result = Result.init(statusCode, {
                        code: MessageType.email
                    })
                    const subject = Constant.notify.resetPassword.subject[lang]
                    const message = Constant.notify.resetPassword.message[lang] + code.value
                    MessageService.sendEmail(username, subject, message, Constant.type.forgot)
                    .catch(err => {
                        Log.message("Reset password email was not sent", err)
                    })
                } else {
                    result = Result.init(statusCode, {
                        code: MessageType.sms
                    })
                    const message = Constant.notify.resetPassword.sms[lang] + code.value
                    MessageService.sendSms(username, message, Constant.type.forgot)
                    .catch(err => {
                        Log.message("Reset password sms was not sent", err)
                    })
                }
            } else {
                result = Result.init(statusCode)
            }
        })
        .catch (err => {
            result = Result.init(Sql.error(err))
        })
        return result
    }

    static async resetPassword(password: string, whereUsername: string, type: string, code: string): Promise<Result> {
        let result: Result
        const repositoty = getCustomRepository(AccountRepository)
        const account = await repositoty.getAccount(whereUsername, type, true) 
        if (account == undefined) {
            result = Result.init(Sql.notFound)
        } else {
            if (account.code == code) {
                if (account.codeExp > new Date()) {
                    let _password = Encrypt(password)
                    let token = Token.generate()
                    await getCustomRepository(AccountRepository).updatePasswordToken(token.value, token.exp, _password, whereUsername, type)
                    .then (obj => {
                        const statusCode = Sql.update(obj)
                        if (statusCode == Sql.success) {
                            result = Result.init(statusCode, {
                                message: "password resetted"
                            })
                        } else {
                            result = Result.init(statusCode)
                        }
                    })
                    .catch (err => {
                        result = Result.init(Sql.error(err))
                    })
                } else {
                    await getCustomRepository(AccountRepository).updateCode(null, null, whereUsername, type, true)
                    result = Result.init(406)
                }
            } else {
                await getCustomRepository(AccountRepository).updateCode(null, null, whereUsername, type, true)
                result = Result.init(403)
            }
        }
        return result
    }

    static async login(username: string, password: string, type: string): Promise<Result> {
        let _password = Encrypt(password)
        let result: Result
        let token = Token.generate()
        const repositoty = getCustomRepository(AccountRepository)
        await repositoty.updateToken(token.value, token.exp, username, _password, type)
        .then (async obj => {
            const statusCode = Sql.update(obj)
            if (statusCode == Sql.success) {
                result = Result.init(statusCode, {
                    token: token.value
                })
            } else if (statusCode == Sql.notFound) {
                let status = await repositoty.getStatus(username, type)
                if (status != null) {
                    if (status) {
                        result = Result.init(RCode.unAuthorized)
                    } else {
                        result = Result.init(RCode.forbidden)
                    }
                } else {
                    result = Result.init(RCode.notFound)
                }
            } else {
                result = Result.init(statusCode)
            }
        })
        .catch (err => {
            result = Result.init(Sql.error(err))
        })
        return result
    }

    static async get(token: string, password: string | undefined, type: string): Promise<Result> {
        let result: Result
        let account = await getCustomRepository(AccountRepository).get(token, type)
        if (account == null || account.tokenExp < new Date()) {
            result = Result.init(RCode.forbidden)
        } else if (password != undefined && account.password != Encrypt(password)) {
            result = Result.init(RCode.notFound)
        } else {
            result = Result.init(RCode.success, {
                username: account.username
            })
        }
        return result
    }

    static async updatePassword(newPassword: string, wherePassword: string, token: string, type: string): Promise<Result> {
        let result = await this.get(token, wherePassword, type)
        if (result.code == RCode.success) {
            const account: Account = result.data
            const username = account.username
            let _password = Encrypt(newPassword)
            let nToken = Token.generate()
            await getCustomRepository(AccountRepository).updatePasswordToken(nToken.value, nToken.exp, _password, username, type)
            .then (obj => {
                const statusCode = Sql.update(obj)
                if (statusCode == Sql.success) {
                    result = Result.init(statusCode, {
                        token: nToken.value
                    })
                } else {
                    result = Result.init(statusCode)
                }
            })
            .catch (err => {
                result = Result.init(Sql.error(err))
            })
        }
        return result
    }

}