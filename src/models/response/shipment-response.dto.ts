import { ResponseType } from "../../enums/response-type.enum"
import { RawTransportPacksDto } from "../request/raw-transport-packs.dto";

export class ShipmentResponseDto {
    public type: string = ResponseType.Shipment
    public referenceid: string;
    public organizations: string[];
    public transportPacks: RawTransportPacksDto;

    constructor () {
        this.transportPacks = new RawTransportPacksDto();
    }
}