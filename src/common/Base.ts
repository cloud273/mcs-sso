import { CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, VersionColumn } from "typeorm";
import { validate, validateSync } from "class-validator";
import { ScopeEntity, Scope, ScopeNested } from "../../node/library/decoration/ScopeEntity";
import { Log } from "../../node/library/log/Log";

// ==================== Decoration ====================

export function Id() {
    return Scope("id")
}

export function Basic() {
    return Scope("ba")
}

export function BasicNested(clas: Function) {
    return ScopeNested("ba", clas)
}

export function Detail() {
    return Scope("de")
}

export function DetailNested(clas: Function) {
    return ScopeNested("de", clas)
}

// ==================== Base Class ====================

export abstract class Base extends ScopeEntity {

    @PrimaryGeneratedColumn()
    @Id() @Basic() @Detail()
    id: number

    @CreateDateColumn({select: false})
    createdAt: Date

    @UpdateDateColumn({select: false})
    updatedAt: Date

    @VersionColumn({select: false})
    version: number

    public static id(alias?: string): string[] {
        return this.scope("id", alias)
    }

    public static basic(alias?: string): string[] {
        return this.scope("ba", alias)
    }

    public static detail(alias?: string): string[] {
        return this.scope("de", alias)
    }

    protected async validateAsync(isSkipNull: boolean = true): Promise<boolean> {
        const errors = await validate(this, {skipMissingProperties: isSkipNull})
        if (errors != null && errors.length > 0) {
            Log.message("Validation", errors)
        }
        return (errors == null || errors.length == 0)
    }

    protected validate(isSkipNull: boolean = true): boolean {
        const errors = validateSync(this, {skipMissingProperties: isSkipNull})
        if (errors != null && errors.length > 0) {
            Log.message("Validation", errors)
        }
        return (errors == null || errors.length == 0)
    }

}