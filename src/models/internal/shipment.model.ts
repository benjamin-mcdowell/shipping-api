import { RawTransportPacksDto } from "../request/raw-transport-packs.dto";

export class Shipment {
    public type: string;
    public referenceid: string;
    public organizations: string[];
    public transportPacks: RawTransportPacksDto;
    public timestamp: string;
}