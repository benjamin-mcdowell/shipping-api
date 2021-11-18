import { WeightUnit } from "../enums/weight-unit.enum";
import { RawTransportPacksDto } from "../models/request/raw-transport-packs.dto";
import { Organization } from "../models/internal/organization.model";
import { totalWeight } from "../models/request/total-weight.dto";
import { Shipment } from "../models/internal/shipment.model";
import { TransportPack } from "../models/internal/transportPack.model";
import { OrganizationResponseDto } from "../models/response/organization-response.dto";
import { ShipmentResponseDto } from "../models/response/shipment-response.dto";
import { PackNodeDto } from "../models/request/pack-node.dto";

export class MapperService {
    public mapOrganizationRequestToModel(req: any): Organization {
        const organization: Organization = req.body;

        return organization;
    }

    public mapShipmentRequestToModel(req: any): Shipment {
        const shipment: Shipment = req.body;
        shipment.referenceid = req.body.referenceId;

        return shipment;
    }

    public mapTransportPackDtoToModel(transportPacksDto: RawTransportPacksDto): TransportPack[] {

        const mappedTransportPacks: TransportPack[] = [];
        for (let i = 0; i < transportPacksDto.nodes.length; i++) {
            const transportPack: TransportPack = new TransportPack();
            transportPack.unit = (<WeightUnit>transportPacksDto.nodes[0].totalWeight.unit);
            transportPack.weight = parseFloat(transportPacksDto.nodes[0].totalWeight.weight);
            mappedTransportPacks.push(transportPack);
            
        }
        return mappedTransportPacks;
    }

    public mapOrganizationToResponseBody(organization: Organization): OrganizationResponseDto {
        const organizationResponse: OrganizationResponseDto = new OrganizationResponseDto();
        organizationResponse.code = organization.code;
        organizationResponse.id = organization.id;

        return organizationResponse;
    }

    public mapShipmentToResponseBody(shipment: Shipment, transportPacks: TransportPack[]): ShipmentResponseDto {
        const shipmentResponse: ShipmentResponseDto = new ShipmentResponseDto();
        shipmentResponse.referenceid = shipment.referenceid;
        shipmentResponse.organizations = shipment.organizations;
        
        for (let i = 0; i < transportPacks.length; i++) {
            const packNode: PackNodeDto = new PackNodeDto();
            packNode.totalWeight.unit = transportPacks[i].unit;
            packNode.totalWeight.weight = transportPacks[i].weight.toString();
            shipmentResponse.transportPacks.nodes.push(packNode);
        }

        return shipmentResponse;
    }

    public mapRequestToWeightUnit(req: any): WeightUnit {
        const weight: totalWeight = req.body;
        const weightUnit: WeightUnit = (<WeightUnit>weight.unit);

        return weightUnit;
    }

    public mapTransportPacksToAggregateWeight(transportPacks: TransportPack[], units: WeightUnit) {
        let totalWeightInKilograms: number = 0;
        for (let i = 0; i < transportPacks.length; i++) {
            const weightInKilograms: number = this.convertUnitToKilograms(transportPacks[i].weight, transportPacks[i].unit)
            totalWeightInKilograms = totalWeightInKilograms + weightInKilograms;
        }

        return this.convertKilogramsToUnit(totalWeightInKilograms, units);
    }

    private convertUnitToKilograms(weight: number, unit: WeightUnit) {
        switch (unit) {
            case WeightUnit.Kilograms:
                return weight;
            case WeightUnit.Ounces:
                return weight / 35.27396;
            case WeightUnit.Pounds:
                return weight / 2.204623;
        }
    }

    private convertKilogramsToUnit(weight: number, outputUnit: WeightUnit) {
        switch (outputUnit) {
            case WeightUnit.Kilograms:
                return weight;
            case WeightUnit.Ounces:
                return weight * 35.27396;
            case WeightUnit.Pounds:
                return weight * 2.204623;
        }
    }

}