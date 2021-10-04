import { EntityRepository, EntityManager, InsertResult, UpdateResult } from "typeorm";
import { Account } from "../entity/Account";
import { Where } from "../../node/library/sql/Where";
import { Cond } from "../../node/library/sql/Cond";

@EntityRepository()
export class AccountRepository {

    constructor(private manager: EntityManager) {

    }

    public async save(username: string, password: string, type: string, actived: boolean, code: string | undefined, codeExp: Date | undefined): Promise<Account> {
        const obj = new Account(username, password, type, actived, undefined, undefined, code, codeExp)
        return this.manager.save(obj)
    }

    public async insert(username: string, password: string, type: string, actived: boolean, code: string | undefined, codeExp: Date | undefined): Promise<InsertResult> {
        const obj = new Account(username, password, type, actived, undefined, undefined, code, codeExp)
        return this.manager.createQueryBuilder()
        .insert()
        .into(Account)
        .values(obj)
        .execute()
    }

    public async getAccount(username: string, type: string, actived: boolean): Promise<Account | null> {
        const wheres = [
            Cond.equal("username", username),
            Cond.equal("actived", actived),
            Cond.equal("type", type)
        ]
        return this.manager.createQueryBuilder(Account, "t")
        .select(Account.detail("t"))
        .where(Where.and(wheres))
        .getOne()
    }

    public async updateCode(code: string | null, codeExp: Date | null, whereUsername: string, type: string, actived: boolean): Promise<UpdateResult> {
        const updateSet = {
            code: code,
            codeExp: codeExp
        }
        return this.manager.createQueryBuilder(Account, "t")
        .update(Account, updateSet)
        .where(Where.and([
            Cond.equal("username", whereUsername), 
            Cond.equal("type", type),
            Cond.equal("actived", actived)
        ]))
        .execute()
    }

    public async activate(whereUsername: string, type: string): Promise<UpdateResult> {
        const updateSet =  {
            code: null,
            codeExp: null,
            actived: true
        }
        return this.manager.createQueryBuilder(Account, "t")
        .update(Account, updateSet)
        .where(Where.and([
            Cond.equal("username", whereUsername), 
            Cond.equal("type", type),
            Cond.equal("actived", false)
        ]))
        .execute()
    }

    public async updatePasswordToken(setToken: string, tokenExp: Date, password: string, whereUsername: string, type: string): Promise<UpdateResult> {
        const updateSet =  {
            token: setToken,
            tokenExp: tokenExp,
            code: null,
            codeExp: null,
            password: password
        }
        return this.manager.createQueryBuilder(Account, "t")
        .update(Account, updateSet)
        .where(Where.and([
            Cond.equal("username", whereUsername), 
            Cond.equal("type", type),
            Cond.equal("actived", true)
        ]))
        .execute()
    }

    public async updateToken(setToken: string, tokenExp: Date, whereUsername: string, password: string, type: string): Promise<UpdateResult> {
        const updateSet =  {
            token: setToken,
            tokenExp: tokenExp,
        }
        return this.manager.createQueryBuilder(Account, "t")
        .update(Account, updateSet)
        .where(Where.and([
            Cond.equal("username", whereUsername), 
            Cond.equal("password", password),
            Cond.equal("type", type),
            Cond.equal("actived", true)
        ]))
        .execute()
    }

    public async getStatus(username: string, type: string): Promise<boolean | null> {
        let account = await this.manager.createQueryBuilder(Account, "t")
        .select("t.actived")
        .where(Where.and([
            Cond.equal("username", username), 
            Cond.equal("type", type)
        ]))
        .getOne()
        if (account == null) {
            return null
        } else {
            return account.actived
        }
    }

    public async get(token: string, type: string): Promise<Account | null> {
        const wheres = [
            Cond.equal("token", token),
            Cond.equal("actived", true),
            Cond.equal("type", type)
        ]
        return this.manager.createQueryBuilder(Account, "t")
        .select(Account.detail("t"))
        .where(Where.and(wheres))
        .getOne()
    }

}