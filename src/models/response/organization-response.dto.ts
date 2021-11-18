import { ResponseType } from "../../enums/response-type.enum"

export class OrganizationResponseDto {
    public type: string = ResponseType.Organization
    public id: string;
    public code: string;
}