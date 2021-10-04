import TokenGenerator = require('uuid-token-generator');
import moment = require('moment');

export class Global {

    public static startup() {
        console.log("--------------------------------------------------")
        console.log("---------------Prepare Build Global---------------")
        console.log("--------------------------------------------------")
    }

}

declare global {

    interface Date {
        addSecond(second: number): Date
        gmtString(format: string): string
        localString(format: string): string
        offset(date: Date): number
        second(): number
    }

    interface String {
        toDates(): Date[]
    }

    interface StringConstructor {
        random(): string
    }

}

Date.prototype.addSecond = function(second: number): Date {
    return new Date(this.getTime() + second * 1000)
}

Date.prototype.second = function(): number {
    return this.getTime()/1000
}

Date.prototype.offset = function(date: Date): number {
    return (this.getTime() - date.getTime())/1000
}

Date.prototype.localString = function(format: string): string {
    return moment(this).format(format)
}

Date.prototype.gmtString = function(format: string): string {
    return moment.utc(this).format(format)
}

String.prototype.toDates = function(): Date[] {
    let result : Date[] = []
    const array = this.toJson()
    try {
        array.forEach(text => {
            result.push(new Date(text))
        })
    } catch (error) {
        console.log("string.toDates")
        console.log(error)
    }
    return result
}

String.random = function(): string {
    const tokgen = new TokenGenerator(512, TokenGenerator.BASE62)
    return tokgen.generate()
}

