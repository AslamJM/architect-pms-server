import { PrismaClient } from "generated/prisma";
const jsonData: {
    name: string
    description: string
    design_notes: string
}[] = require("./sample.json")

const db = new PrismaClient()

function selectRandom(l: number) {
    return Math.floor(Math.random() * l)
}

function randomDate() {
    const startTime = new Date(2024, 0, 1).getTime(); // JAN 2024
    const endTime = new Date(2025, 5, 30).getTime(); //MAR 2025
    const randomTime = Math.random() * (endTime - startTime) + startTime;
    return new Date(randomTime);
}

export const populateProjects = async () => {
    const users = await db.user.findMany({
        select: {
            id: true,
            role: true
        }
    })

    const userusers = users.filter(user => user.role === 'USER')
    const adminusers = users.filter(user => user.role !== 'ADMIN')

    console.log(jsonData[0]);


    for (const d of jsonData) {
        await db.project.create({
            data: {
                name: d.name,
                description: d.description,
                design_notes: d.design_notes,
                created_at: randomDate(),
                assigned_by_id: adminusers[selectRandom(adminusers.length)].id,
                assigned_to_id: userusers[selectRandom(userusers.length)].id
            }
        })
    }



}

populateProjects().then(() => {
    console.log("Populated projects successfully");
}).catch(e => {
    console.error("Error populating projects:", e);
}).finally(() => {
    db.$disconnect();
});