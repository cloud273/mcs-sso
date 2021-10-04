export class Result {

    code : number
    data? : any

    constructor(code: number, data: any) {
        this.code = code
        this.data = data
    }

    static init(code: number, data: any = null): Result {
        return new Result(code, data)
    }

}
