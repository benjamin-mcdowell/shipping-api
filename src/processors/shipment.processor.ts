import { WeightUnit } from "../enums/weight-unit.enum";
import { ProcessResult } from "../enums/process-result.enum";
import { DatabaseService } from "../services/database.service";
import { MapperService } from "../services/mapper.service";
import { Shipment } from "../models/internal/shipment.model";
import { TransportPack } from "../models/internal/transportPack.model";
import { ShipmentResponseDto } from "../models/response/shipment-response.dto";
import { WeightResponseDto } from "../models/response/weight-response.dto";
import { ApiResponseDto } from "../models/response/api-response.dto";
import { HttpStatus } from "../enums/http-status.enum";
import { ValidationService } from "../services/validation.service";
import { ValidationResult } from "../models/internal/validation-result.model";

export class ShipmentProcessor {
    private readonly databaseService: DatabaseService;
    private readonly mapperService: MapperService;
    private readonly validationService: ValidationService;

    constructor(databaseService: DatabaseService, mapperService: MapperService, validationService: ValidationService) {
        this.databaseService = databaseService;
        this.mapperService = mapperService;
        this.validationService = validationService;
    }

    public async addShipment (req: any): Promise<ApiResponseDto> {
        const response: ApiResponseDto = new ApiResponseDto();

        // validate the request and if its invalid process no further
        const validationResult: ValidationResult = this.validationService.validateShipmentRequest(req);
        if(!validationResult.isValid) {
            response.status = HttpStatus.Unprocessable;
            response.message = validationResult.message;
            return response;
        }
  
        const requestedShipment: Shipment = this.mapperService.mapShipmentRequestToModel(req);

        // check if its newer than newest record    
        const existingShipment: Shipment = await this.databaseService.retrieveShipmentById(requestedShipment.referenceid);

        if((existingShipment != null || existingShipment != undefined) && requestedShipment.timestamp < existingShipment.timestamp)
        {
            response.status = HttpStatus.Unprocessable;
            response.message = 'this record is older than the existing record';
            return response;
        }

        const shipmentResult: ProcessResult = await this.databaseService.createOrUpdateShipmentRecord(requestedShipment);

        // only process transport packs if there are transport packs to process on this request
        let transportPackResult: ProcessResult = ProcessResult.Failure;
        if(requestedShipment.transportPacks.nodes.length > 0){
            const transportPacks: TransportPack[] = this.mapperService.mapTransportPackDtoToModel(requestedShipment.transportPacks);
            transportPackResult = await this.databaseService.createOrUpdateTransportPackRecords(requestedShipment.referenceid, transportPacks);
        } else {
            transportPackResult = ProcessResult.Successful;
        }
        
        if( shipmentResult == ProcessResult.Successful && transportPackResult == ProcessResult.Successful){
            response.status = HttpStatus.OK;
            response.message = 'Successfully Processed';
            return response;
        }

        response.status = HttpStatus.Unprocessable;
        response.message = 'Unprocessable Entity';
        return response;
    }

    public async retrieveShipment (req: any): Promise<ApiResponseDto> {
        const shipmentId: string = req.params.shipmentId;
        const shipment: Shipment = await this.databaseService.retrieveShipmentById(shipmentId);

        const response: ApiResponseDto = new ApiResponseDto();
        if(shipment != null && shipment != undefined) {
            const transportPacks: TransportPack[] = await this.databaseService.retrieveTransportPacksById(shipmentId);
            const responseBody: ShipmentResponseDto = await this.mapperService.mapShipmentToResponseBody(shipment, transportPacks);
            response.status = HttpStatus.OK;
            response.message = responseBody;
            return response;
        }

        response.status = HttpStatus.OK;
        response.message = 'Shipment Not Found';
        return response;
    }

    public async aggregateWeight (req: any): Promise<ApiResponseDto> {
        const response: ApiResponseDto = new ApiResponseDto();

        // validate the request and if its invalid process no further
        const validationResult: ValidationResult = this.validationService.validateWeightRequest(req);
        if(!validationResult.isValid) {
            response.status = HttpStatus.Unprocessable;
            response.message = validationResult.message;
            return response;
        }

        const responseUnits: WeightUnit = this.mapperService.mapRequestToWeightUnit(req);
        const transportPacks: TransportPack[] = await this.databaseService.retrieveAllTransportPacks();
        const responseWeight: number = this.mapperService.mapTransportPacksToAggregateWeight(transportPacks, responseUnits);

        const responseBody: WeightResponseDto = new WeightResponseDto();
        responseBody.unit = responseUnits;
        responseBody.weight = responseWeight;

        response.status = HttpStatus.OK;
        response.message = responseBody;

        return response;
    }
}