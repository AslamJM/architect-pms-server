import { TaskType } from "generated/prisma"

export class CreateProjectDto {
    name: string
    description: string
    design_notes: string
    assigned_to_id: string
}

export class CreateTaskDto {
    content: string
    type: TaskType
    completed: boolean
    image_urls: string[]
}

export class CreatePhaseDto {
    phase_number: number
    upload_ids: string[]
}