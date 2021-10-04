import { EntityRepository, EntityManager, DeleteResult, InsertResult, UpdateResult } from "typeorm";
import { Account } from "../entity/Account";
import { Where } from "../../node/library/sql/Where";
import { Cond } from "../../node/library/sql/Cond";

@EntityRepository()
export class AdminAccountRepository {

    constructor(private manager: EntityManager) {

    }

    public async insert(username: string, password: string, type: string, actived: boolean, code: string | undefined, codeExp: Date | undefined): Promise<InsertResult> {

        const obj = new Account(username, password, type, actived, undefined, undefined, code, codeExp)
        return this.manager.createQueryBuilder()
        .insert()
        .into(Account)
        .values(obj)
        .execute()
    }

    public async updateUsername(username: string, newUsername: string, type: string): Promise<UpdateResult> {
        const updateSet =  {
            username: newUsername
        }

        return this.manager.createQueryBuilder(Account, "t")
        .update(Account, updateSet)
        .where(Where.and([
            Cond.equal("username", username), 
            Cond.equal("type", type)
        ]))
        .execute()
    }

    public async clearToken(username: string, type: string): Promise<UpdateResult> {
        const updateSet =  {
            token: null,
            tokenExp: null,
        }

        return this.manager.createQueryBuilder(Account, "t")
        .update(Account, updateSet)
        .where(Where.and([
            Cond.equal("username", username), 
            Cond.equal("type", type)
        ]))
        .execute()
    }

    public async getListBasic(type: string): Promise<Account[]> {
        return this.manager.createQueryBuilder(Account, "t")
        .select(Account.basic("t"))
        .where(Where.and([Cond.equal("type", type)], "t"))
        .orderBy({
            "t.id": "DESC"
        })
        .getMany()
    }

    public async getDetail(username: string, type: string): Promise<Account | null> {
        return this.manager.createQueryBuilder(Account, "t")
        .select(Account.detail("t"))
        .where(Where.and([
            Cond.equal("username", username), 
            Cond.equal("type", type)
        ]))
        .getOne()
    }

    public async delete(username: string, type: string): Promise<DeleteResult> {
        return this.manager.createQueryBuilder(Account, "t")
        .delete()
        .where(Where.and([
            Cond.equal("username", username), 
            Cond.equal("type", type)
        ]))
        .execute()
    }

}