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

export type ProjectQuery = {
    name?: string
    page?: string
    assigned_to?: string
    is_completed?: string
    assigned_by?: string
    is_paid?: string
}

export function parseQuery(query: ProjectQuery) {
    const { name, assigned_to, is_completed, assigned_by, is_paid } = query
    const where: Prisma.ProjectWhereInput = {
        ...(name && { name: { contains: name, mode: "insensitive" } }),
        ...(assigned_to && { assigned_to: { id: assigned_to } }),
        ...(is_completed !== undefined && { is_completed: is_completed === "true" ? true : false }),
        ...(assigned_by && { assigned_by: { id: assigned_by } }),
        ...(is_paid !== undefined && { is_paid: is_paid === "true" ? true : false })
    }
    return where
}

export function parsePage(page: string, limit: number = 20) {
    const pageNumber = parseInt(page)
    if (isNaN(pageNumber) || pageNumber < 1) {

        return {
            take: limit,
            skip: 0
        }
    }
    return {
        take: limit,
        skip: (pageNumber - 1) * limit
    }
}