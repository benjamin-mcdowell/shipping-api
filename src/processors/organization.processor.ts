import { HttpStatus } from "../enums/http-status.enum";
import { ProcessResult } from "../enums/process-result.enum";
import { ApiResponseDto } from "../models/response/api-response.dto";
import { OrganizationResponseDto } from "../models/response/organization-response.dto";
import { Organization } from "../models/internal/organization.model";
import { DatabaseService } from "../services/database.service";
import { MapperService } from "../services/mapper.service";
import { ValidationResult } from "../models/internal/validation-result.model";
import { ValidationService } from "../services/validation.service";

export class OrganizationProcessor {
    private readonly databaseService: DatabaseService;
    private readonly mapperService: MapperService;
    private readonly validationService: ValidationService;

    constructor(databaseService: DatabaseService, mapperService: MapperService, validationService: ValidationService) {
        this.databaseService = databaseService;
        this.mapperService = mapperService;
        this.validationService = validationService;
    }

     /**
     * processes a request to add an organization and store it in the database
     */
    public async addOrganization (req: any): Promise<ApiResponseDto> {
        const response: ApiResponseDto = new ApiResponseDto();
        
        // validate the request and if its invalid process no further
        const validationResult: ValidationResult = this.validationService.validateOrganizationRequest(req);
        if(!validationResult.isValid) {
            response.status = HttpStatus.Unprocessable;
            response.message = validationResult.message;
            return response;
        }

        const organization: Organization = this.mapperService.mapOrganizationRequestToModel(req);
        const result: ProcessResult = await this.databaseService.createOrUpdateOrganizationRecord(organization);
        
        if( result == ProcessResult.Successful){
            response.status = HttpStatus.OK;
            response.message = 'Successfully Processed';
            return response;
        }
        
        response.status = HttpStatus.Unprocessable;
        response.message = 'Unprocessable Entity';
        return response;
    }

    /**
     * processes a request to retrieve an organization record from the database
     */
    public async retrieveOrganization (req: any): Promise<ApiResponseDto> {
        const organizationId: string = req.params.organizationId;
        const organization: Organization = await this.databaseService.retrieveOrganizationById(organizationId);

        const response: ApiResponseDto = new ApiResponseDto();
        if(organization != null && organization != undefined) {
            const responseBody: OrganizationResponseDto = await this.mapperService.mapOrganizationToResponseBody(organization);
            response.status = HttpStatus.OK;
            response.message = responseBody;
            return response;
        }

        response.status = HttpStatus.OK;
        response.message = 'Organization Not Found';
        return response;
    }
}