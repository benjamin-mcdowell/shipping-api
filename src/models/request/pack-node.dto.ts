import { totalWeight } from "./total-weight.dto";

export class PackNodeDto {
    totalWeight: totalWeight

    constructor() {
        this.totalWeight = new totalWeight();
    }
}