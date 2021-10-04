import { RequestApiManager } from "./RequestApiManager"

export class AutomationTest {

    public static async testOne() {
        let result = await RequestApiManager.register("nglequduph@gmail.com", "111111", "person", "vi")
        console.log(result.code)
        console.log(result.data)
    }

}