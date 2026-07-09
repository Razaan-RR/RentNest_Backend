import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

async function main() {

    const hashedPassword = await bcrypt.hash(
        "123456",
        12
    );

    const admin = await prisma.user.upsert({
        where: {
            email: "admin@rentnest.com"
        },
        update: {},
        create: {
            name: "Admin",
            email: "admin@rentnest.com",
            password: hashedPassword,
            role: "ADMIN",
            activeStatus: "ACTIVE"
        }
    });

    console.log("Admin created:", admin.email);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });