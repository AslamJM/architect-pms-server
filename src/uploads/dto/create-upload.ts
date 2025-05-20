import { UploadType } from "generated/prisma"

export class CreateUploadDto {
    url: string
    phase_number: number
    type: UploadType
}