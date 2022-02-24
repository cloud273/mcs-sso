import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, ValidationOptions, registerDecorator, isEmail, isMobilePhone } from "class-validator";

@ValidatorConstraint({ name: "EmailMobileValidator", async: false })
export class EmailMobileValidator implements ValidatorConstraintInterface {

    isValidate(value: any) {
        return isEmail(value) || isMobilePhone(value, "vi-VN")
    }

    validate(value: any, args: ValidationArguments) {
        return this.isValidate(value)
    }

    defaultMessage(args: ValidationArguments) { 
        return "$value is not valid";
    }

}

export function IsEmailOrMobile(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
         registerDecorator({
             target: object.constructor,
             propertyName: propertyName,
             options: validationOptions,
             constraints: [],
             validator: EmailMobileValidator
         });
    };
}