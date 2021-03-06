import { isEnum, isString, isEmail, isMobilePhone } from "class-validator";
import { Language } from "../common/Enum";
import { Integer } from "../../node/library/utility/Integer";
import { Constant } from "../../Constant";


export class Token {
    
    constructor (public value: string, public exp: Date) {

    }

    static generate(): Token {
        return new Token(String.random(), new Date().addSecond(Constant.tokenLive))
    }

}

export class Code {
    
    constructor (public value: string, public exp: Date) {

    }

    static generate(): Code {
        return new Code(Integer.RandomWithLength(6).toString(), new Date().addSecond(Constant.activeCodeLive))
    }

}

export class AppValidator {

    public static isLanguageOrNull(data: any): boolean {
        return data == null || isEnum(data, Language)
    }

    public static isEmail(data: any): boolean {
        return isString(data) && isEmail(data)
    }

    public static isMobilePhone(data: any): boolean {
        return isString(data) && isMobilePhone(data, "vi-VN")
    }

    public static isPhoneOrEmail(data: any): boolean {
        return this.isMobilePhone(data) || this.isEmail(data)
    }

    public static isPassword(data: any): boolean {
        if (isString(data)) {
            const str: string = data
            return str.length >= 6 && str.length <= 32
        }
        return false
    }

}

