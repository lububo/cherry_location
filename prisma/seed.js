const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("demo123", 10);

  const owner1 = await prisma.user.upsert({
    where: { email: "owner1@demo.bg" },
    update: {},
    create: {
      email: "owner1@demo.bg",
      name: "Черешова градина Тракия",
      passwordHash,
      role: "GARDEN",
    },
  });

  const owner2 = await prisma.user.upsert({
    where: { email: "owner2@demo.bg" },
    update: {},
    create: {
      email: "owner2@demo.bg",
      name: "Black Sea Cherry Farm",
      passwordHash,
      role: "GARDEN",
    },
  });

  const owner3 = await prisma.user.upsert({
    where: { email: "owner3@demo.bg" },
    update: {},
    create: {
      email: "owner3@demo.bg",
      name: "Родопски череши",
      passwordHash,
      role: "GARDEN",
    },
  });

  const owner4 = await prisma.user.upsert({
    where: { email: "owner4@demo.bg" },
    update: {},
    create: {
      email: "owner4@demo.bg",
      name: "Балканска черешова ферма",
      passwordHash,
      role: "GARDEN",
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: "admin@demo.bg" },
    update: {},
    create: {
      email: "admin@demo.bg",
      name: "Администратор Черешово",
      passwordHash,
      role: "ADMIN",
    },
  });

  const existingGardens = await prisma.garden.count();
  if (existingGardens === 0) {
    await prisma.garden.create({
      data: {
        ownerId: owner1.id,
        name: "Градина Пловдив",
        region: "Пловдив",
        latitude: 42.1354,
        longitude: 24.7453,
        coordinatesText: "42.1354, 24.7453",
        isSelfPick: true,
        pricePerKg: "6.50 лв/кг",
        contactPhone: "+359 88 123 4567",
        contactEmail: "plovdiv@demo.bg",
      },
    });
    await prisma.garden.create({
      data: {
        ownerId: owner1.id,
        name: "Староселски череши",
        region: "Хисаря",
        latitude: 42.5167,
        longitude: 24.5667,
        coordinatesText: "42.5167, 24.5667",
        isSelfPick: false,
        pricePerKg: "5.80 лв/кг",
        contactPhone: "+359 88 234 5678",
        contactEmail: "starosel@demo.bg",
      },
    });
    await prisma.garden.create({
      data: {
        ownerId: owner2.id,
        name: "Черешова градина Варна",
        region: "Варна",
        latitude: 43.2141,
        longitude: 27.9147,
        coordinatesText: "43.2141, 27.9147",
        isSelfPick: true,
        pricePerKg: "7.20 лв/кг",
        contactPhone: "+359 88 345 6789",
        contactEmail: "varna@demo.bg",
      },
    });
    await prisma.garden.create({
      data: {
        ownerId: owner2.id,
        name: "Бургаски череши",
        region: "Бургас",
        latitude: 42.4976,
        longitude: 27.47,
        coordinatesText: "42.4976, 27.4700",
        isSelfPick: true,
        pricePerKg: "7.00 лв/кг",
        contactPhone: "+359 88 456 7890",
        contactEmail: "burgas@demo.bg",
      },
    });
    await prisma.garden.create({
      data: {
        ownerId: owner3.id,
        name: "Родопска черешова градина",
        region: "Смолян",
        latitude: 41.5766,
        longitude: 24.7075,
        coordinatesText: "41.5766, 24.7075",
        isSelfPick: true,
        pricePerKg: "6.80 лв/кг",
        contactPhone: "+359 88 567 8901",
        contactEmail: "rhodope@demo.bg",
      },
    });
    await prisma.garden.create({
      data: {
        ownerId: owner4.id,
        name: "Балканска черешова градина",
        region: "Габрово",
        latitude: 42.8742,
        longitude: 25.3187,
        coordinatesText: "42.8742, 25.3187",
        isSelfPick: false,
        pricePerKg: "6.20 лв/кг",
        contactPhone: "+359 88 678 9012",
        contactEmail: "balkan@demo.bg",
      },
    });
    await prisma.garden.create({
      data: {
        ownerId: admin.id,
        name: "Административна черешова градина",
        region: "София",
        latitude: 42.6977,
        longitude: 23.3219,
        coordinatesText: "42.6977, 23.3219",
        isSelfPick: true,
        pricePerKg: "7.50 лв/кг",
        contactPhone: "+359 88 789 0123",
        contactEmail: "admin@demo.bg",
      },
    });
  }

  const existingImages = await prisma.gardenImage.count();
  if (existingImages === 0) {
    const gardens = await prisma.garden.findMany();
    const demoImages = [
      "/images/demo/garden-1.svg",
      "/images/demo/garden-2.svg",
      "/images/demo/garden-3.svg",
    ];

    for (const garden of gardens) {
      const imageData = demoImages.map((url) => ({
        gardenId: garden.id,
        url,
      }));
      await prisma.gardenImage.createMany({ data: imageData });
    }
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
