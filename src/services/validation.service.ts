import { ValidationResult } from "../models/internal/validation-result.model";

export class ValidationService {
    public validateOrganizationRequest(req: any): ValidationResult {

        const validation: ValidationResult = new ValidationResult();
        validation.isValid = true;

        if(!req.body.code || !req.body.id || !req.body.type) {
            validation.isValid = false;
            validation.message = "request missing required fields: code, id, and type parameters are required"
        }

        return validation;
    }

    public validateShipmentRequest(req: any): ValidationResult {

        const validation: ValidationResult = new ValidationResult();
        validation.isValid = true;

        if(!req.body.referenceId || !req.body.organizations || !req.body.type) {
            validation.isValid = false;
            validation.message = "request missing required fields: referenceId, organizations, and type parameters are required"
        }

        return validation;
    }

    public validateWeightRequest(req: any): ValidationResult {

        const validation: ValidationResult = new ValidationResult();
        validation.isValid = true;

        if(!req.body.unit) {
            validation.isValid = false;
            validation.message = "request missing required fields: unit parameter is required"
        }

        return validation;
    }
}