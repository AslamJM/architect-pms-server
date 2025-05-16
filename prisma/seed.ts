import { hash } from "bcryptjs";
import { PrismaClient } from "../generated/prisma";

const db = new PrismaClient()

async function main() {
    const pw = await hash("123456", 10)

    const user = await db.user.upsert({
        where: { username: "admin" },
        create: {
            username: "admin",
            password: pw,
            name: "Admin",
            role: "ADMIN"
        },
        update: {}
    })

    return user

}

main().then(() => {
    console.log("seeded successfully");

})
    .catch(e => {
        console.error(e)
        process.exit(1)
    }).finally(() => {
        db.$disconnect()
    })