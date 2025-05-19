import { Prisma } from "generated/prisma";

export const taskSelect = {
    id: true,
    content: true,
    completed: true,
    type: true,
    images: { select: { url: true } }
}

export const allProjecttSelect = {
    id: true,
    name: true,
    assigned_to: { select: { name: true } },
    is_completed: true,
    is_paid: true,
    created_at: true
}