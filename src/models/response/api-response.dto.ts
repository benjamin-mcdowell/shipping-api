import { ProcessResult } from "src/enums/process-result.enum";

export class ApiResponseDto {
    public result: ProcessResult;
    public status: number;
    public message: any;
}