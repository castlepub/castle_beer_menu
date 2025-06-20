const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  // Delete all existing beers
  await prisma.beer.deleteMany()

  // Core Range Beers
  const coreBeers = [
    {
      tapNumber: 1,
      name: "CASTLE BREW PILS",
      brewery: "HOPSCOR BREWING",
      style: "Pilsner",
      abv: "5% ABV",
      price: "0,3L €3 / 0,5L €4.50",
      status: "on_tap",
      isCore: true,
      tags: JSON.stringify(["HOUSE"]),
      location: "Bar",
      logo: "/static/logo/hopscor.png",
    },
    {
      tapNumber: 2,
      name: "HEFEWEIZEN",
      brewery: "WEIHENSTEPHAN",
      style: "Wheat Beer",
      abv: "5.4% ABV",
      price: "0,5L €5",
      status: "on_tap",
      isCore: true,
      location: "Bar",
      logo: "/static/logo/weihenstephan.jpg",
    },
    {
      tapNumber: 3,
      name: "PALE ALE",
      brewery: "HOPSCOR BREWING",
      style: "Pale Ale",
      abv: "4.5% ABV",
      price: "0,3L €4 / 0,5L €5.50",
      status: "on_tap",
      isCore: true,
      location: "Garden",
      logo: "/static/logo/hopscor.png",
    },
    {
      tapNumber: 4,
      name: "CIDER",
      brewery: "STOWFORD",
      style: "Cider",
      abv: "4.5% ABV",
      price: "0,3L €5.50 / 0,5L €7",
      status: "on_tap",
      isCore: true,
      location: "Bar",
    },
    {
      tapNumber: 5,
      name: "STOUT",
      brewery: "GUINNESS",
      style: "Stout",
      abv: "4.2% ABV",
      price: "0,3L €5.50 / 0,5L €7",
      status: "on_tap",
      isCore: true,
      location: "Upstairs",
    },
    {
      tapNumber: 6,
      name: "RADLER",
      brewery: "THE CASTLE",
      style: "Radler",
      abv: "2.5% ABV",
      price: "0,3L €3.50 / 0,5L €5",
      status: "on_tap",
      isCore: true,
      tags: JSON.stringify(["HOUSE"]),
      location: "Garden",
      logo: "/static/logo/castle.png",
    },
  ]

  // Rotating Beers
  const rotatingBeers = [
    {
      tapNumber: 7,
      name: "FLORIAN BOCKBIER",
      brewery: "QUELLMALZ",
      style: "Bockbier",
      abv: "6.8% ABV",
      price: "0,3L €4 / 0,5L €5.50",
      status: "on_tap",
      tags: JSON.stringify(["NEW"]),
      location: "Bar",
    },
    {
      tapNumber: 8,
      name: "HELLES",
      brewery: "WEIHENSTEPHAN",
      style: "Lager",
      abv: "4.8% ABV",
      price: "0,3L €4.50 / 0,5L €6",
      status: "on_tap",
      location: "Garden",
      logo: "/static/logo/weihenstephan.jpg",
    },
    {
      tapNumber: 9,
      name: "DIETER",
      brewery: "QUELLMALZ",
      style: "Spez Pils",
      abv: "5.3% ABV",
      price: "0,3L €4.50 / 0,5L €6",
      status: "on_tap",
      location: "Upstairs",
      logo: "/static/logo/strassenbrau.png",
    },
    {
      tapNumber: 10,
      name: "IPA",
      brewery: "STONE BREWING",
      style: "India Pale Ale",
      abv: "6.9% ABV",
      price: "0,3L €5 / 0,5L €6.50",
      status: "on_tap",
      location: "Bar",
    },
    {
      tapNumber: 11,
      name: "PORTER",
      brewery: "FULLER'S",
      style: "Porter",
      abv: "5.4% ABV",
      price: "0,3L €5.50 / 0,5L €7",
      status: "on_tap",
      location: "Garden",
    },
    {
      tapNumber: 12,
      name: "SAISON",
      brewery: "DUPONT",
      style: "Saison",
      abv: "6.5% ABV",
      price: "0,3L €6 / 0,5L €7.50",
      status: "on_tap",
      location: "Upstairs",
    },
    {
      tapNumber: 13,
      name: "BELGIAN TRIPEL",
      brewery: "ST. BERNARDUS",
      style: "Tripel",
      abv: "8% ABV",
      price: "0,3L €6 / 0,5L €7.50",
      status: "keg_empty",
      tags: JSON.stringify(["STRONG"]),
      logo: "https://via.placeholder.com/64x64/FFD700/000000?text=BERNARDUS",
    },
    {
      tapNumber: 14,
      name: "FESTBIER",
      brewery: "PAULANER",
      style: "Märzen",
      abv: "6% ABV",
      price: "0,5L €5.50",
      status: "on_tap",
      tags: JSON.stringify(["SEASONAL"]),
      logo: "https://via.placeholder.com/64x64/FFA500/000000?text=PAULANER",
    },
    {
      tapNumber: 15,
      name: "WEST COAST IPA",
      brewery: "BEVOG",
      style: "IPA",
      abv: "6.5% ABV",
      price: "0,3L €5 / 0,5L €6.50",
      status: "on_tap",
      logo: "https://via.placeholder.com/64x64/4169E1/FFFFFF?text=BEVOG",
    },
    {
      tapNumber: 16,
      name: "SCHWARZBIER",
      brewery: "KÖSTRITZER",
      style: "Black Lager",
      abv: "4.8% ABV",
      price: "0,3L €4 / 0,5L €5.50",
      status: "on_tap",
      logo: "https://via.placeholder.com/64x64/000000/FFFFFF?text=KOSTRITZER",
    },
    {
      tapNumber: 17,
      name: "HEFEWEIZEN DUNKEL",
      brewery: "WEIHENSTEPHAN",
      style: "Dark Wheat Beer",
      abv: "5.3% ABV",
      price: "0,5L €5",
      status: "on_tap",
      logo: "/static/logo/weihenstephan.jpg",
    },
    {
      tapNumber: 18,
      name: "BARLEYWINE",
      brewery: "LERVIG",
      style: "Barleywine",
      abv: "12% ABV",
      price: "0,2L €7.50",
      status: "on_tap",
      tags: JSON.stringify(["LIMITED", "STRONG"]),
      logo: "https://via.placeholder.com/64x64/8B4513/FFFFFF?text=LERVIG",
    },
    {
      tapNumber: 19,
      name: "BERLINER WEISSE",
      brewery: "LEMKE",
      style: "Sour Wheat",
      abv: "3.5% ABV",
      price: "0,3L €4 / 0,5L €5.50",
      status: "on_tap",
      logo: "https://via.placeholder.com/64x64/87CEEB/000000?text=LEMKE",
    },
  ]

  // Create all beers
  for (const beer of [...coreBeers, ...rotatingBeers]) {
    await prisma.beer.create({
      data: beer,
    })
  }

  console.log('Database has been seeded. 🍺')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 