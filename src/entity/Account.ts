import { Column, Entity, Unique } from "typeorm";
import { MaxLength, IsBoolean} from "class-validator";
import { Base, Detail, Basic } from "../common/Base";
import { IsEmailOrMobile } from "../lib/validator/EmailMobileValidator";
import { Type } from "class-transformer";

@Entity()
@Unique(["username", "type"])
export class Account extends Base {
    
    @Column({type:"varchar", length: 128})
    @MaxLength(128)
    @IsEmailOrMobile()
    @Basic() @Detail()
    username: string

    @Column({type:"varchar", length: 128})
    @MaxLength(128)
    @Detail()
    password: string

    @Column({type:"varchar", length: 16})
    @MaxLength(16)
    @Basic() @Detail()
    type: string
    
    @Column("bool")
    @IsBoolean()
    @Detail()
    actived: boolean

    @Column({type: "varchar", length: 128, unique: true, nullable: true})
    @MaxLength(128)
    @Detail()
    token: string

    @Column({type: "timestamp", nullable: true})
    @Detail()
    @Type(() => Date)
    tokenExp: Date

    @Column({type: "varchar", length: 8, nullable: true})
    @Detail()
    code: string

    @Column({type: "timestamp", nullable: true})
    @Detail()
    @Type(() => Date)
    codeExp: Date

    public constructor(username: string, password: string, type: string, actived: boolean, token: string | undefined, tokenExp: Date | undefined, code: string | undefined, codeExp: Date | undefined) {
        super()
        this.username = username
        this.password = password
        this.type = type
        this.actived = actived
        this.token = token
        this.tokenExp = tokenExp
        this.code = code
        this.codeExp = codeExp
    }

    public static validate(username: any, type: any, actived: any, token: string, code: any): boolean {
        return new Account(username, undefined, type, actived, token, undefined, code, undefined).validate()
    }

}

