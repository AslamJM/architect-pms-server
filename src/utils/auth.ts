import { compare, hash } from "bcryptjs"

export function expiryAt(date: Date) {
    const month = date.getMonth()
    const year = date.getFullYear()

    if (month === 11) {
        date.setFullYear(year + 1)
    }

    date.setMonth((month + 1) % 12)

    return date

}

export function isExpired(current: Date, exp: Date) {
    return current > exp
}

export async function hashPassword(pw: string) {
    return await hash(pw, 10)
}

export async function verifyPassword(pw: string, hash: string) {
    return await compare(pw, hash)
}