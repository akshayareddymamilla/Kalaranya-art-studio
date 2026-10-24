"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('--- Starting Seed Process ---');
    const seedJsonPath = path_1.default.join(__dirname, 'seed.json');
    if (!fs_1.default.existsSync(seedJsonPath)) {
        throw new Error(`Seed data file not found at ${seedJsonPath}`);
    }
    const raw = fs_1.default.readFileSync(seedJsonPath, 'utf-8');
    const seedData = JSON.parse(raw);
    // 1. Ensure SQLite partial unique indexes
    console.log('Ensuring database integrity partial unique indexes...');
    await prisma.$executeRawUnsafe(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_order_active_placed 
    ON "Order"("paintingId") 
    WHERE "status" = 'placed';
  `);
    await prisma.$executeRawUnsafe(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_booking_active_date 
    ON "Booking"("date") 
    WHERE "status" IN ('requested', 'confirmed');
  `);
    // 2. Seed Studio Admin Account
    const studioEmail = process.env.STUDIO_ADMIN_EMAIL || seedData.studioAccount.email;
    const studioPassword = process.env.STUDIO_ADMIN_PASSWORD || seedData.studioAccount.password;
    const hashedPassword = await bcryptjs_1.default.hash(studioPassword, 10);
    const admin = await prisma.user.upsert({
        where: { email: studioEmail },
        update: {
            password: hashedPassword,
            role: 'studio',
            name: 'Studio Administrator'
        },
        create: {
            email: studioEmail,
            password: hashedPassword,
            name: 'Studio Administrator',
            role: 'studio'
        }
    });
    console.log(`Studio admin account verified: ${admin.email} (role: ${admin.role})`);
    // Ensure studio settings and seed data
    const demoCustomerPassword = await bcryptjs_1.default.hash('Customer@123', 10);
    const customer = await prisma.user.upsert({
        where: { email: 'customer@example.com' },
        update: {
            password: demoCustomerPassword,
            name: 'Priya Sharma',
            role: 'customer'
        },
        create: {
            email: 'customer@example.com',
            password: demoCustomerPassword,
            name: 'Priya Sharma',
            role: 'customer'
        }
    });
    console.log(`Demo customer account verified: ${customer.email} (password: Customer@123)`);
    // 3. Seed Mural Rate
    await prisma.studioSetting.upsert({
        where: { key: 'mural_rate_per_sq_ft' },
        update: { value: String(seedData.mural.ratePerSqFt) },
        create: { key: 'mural_rate_per_sq_ft', value: String(seedData.mural.ratePerSqFt) }
    });
    console.log(`Mural rate per sq ft set to: ${seedData.mural.ratePerSqFt} ${seedData.currency}`);
    // 4. Seed Pottery Items
    for (const item of seedData.potteryItems) {
        await prisma.potteryItem.upsert({
            where: { id: item.id },
            update: { name: item.name },
            create: { id: item.id, name: item.name }
        });
    }
    console.log(`Seeded ${seedData.potteryItems.length} pottery items.`);
    // 5. Seed Glazes
    for (const glaze of seedData.glazes) {
        await prisma.glaze.upsert({
            where: { id: glaze.id },
            update: { name: glaze.name },
            create: { id: glaze.id, name: glaze.name }
        });
    }
    console.log(`Seeded ${seedData.glazes.length} glazes.`);
    // 6. Clean rogue/extraneous test paintings and Seed Official Paintings
    const seedPaintingIds = seedData.paintings.map(p => p.id);
    await prisma.painting.deleteMany({
        where: {
            id: { notIn: seedPaintingIds },
            orders: { none: {} }
        }
    });
    for (const painting of seedData.paintings) {
        await prisma.painting.upsert({
            where: { id: painting.id },
            update: {
                title: painting.title,
                artist: painting.artist,
                description: painting.description,
                price: painting.price,
                imageUrl: painting.imageUrl,
                status: painting.status
            },
            create: {
                id: painting.id,
                title: painting.title,
                artist: painting.artist,
                description: painting.description,
                price: painting.price,
                imageUrl: painting.imageUrl,
                status: painting.status
            }
        });
    }
    console.log(`Seeded ${seedData.paintings.length} paintings.`);
    console.log('--- Seed completed successfully! ---');
}
main()
    .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
