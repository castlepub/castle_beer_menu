const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log(`Start seeding ...`)

  const coreBeers = [
    {
      tapNumber: 1,
      name: 'CASTLE BREW PILS',
      brewery: 'HOPSCOR BREWING',
      style: 'Pilsner',
      abv: '5% ABV',
      price: '0,3L €3 / 0,5L €4.50',
      status: 'on_tap',
      isCore: true,
      tags: JSON.stringify(['HOUSE']),
      location: 'Bar',
      logo: '/logo/hopscor.png',
    },
    {
      tapNumber: 2,
      name: 'HEFEWEIZEN',
      brewery: 'WEIHENSTEPHAN',
      style: 'Wheat Beer',
      abv: '5.4% ABV',
      price: '0,5L €5',
      status: 'on_tap',
      isCore: true,
      location: 'Bar',
      logo: '/logo/weihenstephan.jpg',
    },
    {
      tapNumber: 3,
      name: 'PALE ALE',
      brewery: 'HOPSCOR BREWING',
      style: 'Pale Ale',
      abv: '4.5% ABV',
      price: '0,3L €4 / 0,5L €5.50',
      status: 'on_tap',
      isCore: true,
      location: 'Garden',
      logo: '/logo/hopscor.png',
    },
    {
      tapNumber: 4,
      name: 'CIDER',
      brewery: 'STOWFORD',
      style: 'Cider',
      abv: '4.5% ABV',
      price: '0,3L €5.50 / 0,5L €7',
      status: 'on_tap',
      isCore: true,
      location: 'Bar',
      logo: '/logo/stowford.jpg'
    },
    {
      tapNumber: 5,
      name: 'STOUT',
      brewery: 'GUINNESS',
      style: 'Stout',
      abv: '4.2% ABV',
      price: '0,3L €5.50 / 0,5L €7',
      status: 'on_tap',
      isCore: true,
      location: 'Upstairs',
      logo: '/logo/guinness.jpg'
    },
    {
      tapNumber: 6,
      name: 'RADLER',
      brewery: 'THE CASTLE',
      style: 'Radler',
      abv: '2.5% ABV',
      price: '0,3L €3.50 / 0,5L €5',
      status: 'on_tap',
      isCore: true,
      tags: JSON.stringify(['HOUSE']),
      location: 'Garden',
      logo: '/logo/castle.png',
    },
  ]

  console.log('Upserting core beers...')
  for (const beer of coreBeers) {
    await prisma.beer.upsert({
      where: { tapNumber: beer.tapNumber },
      update: beer,
      create: beer,
    })
    console.log(`- ${beer.name}`)
  }

  // Note: Rotating beers are now managed via the admin panel
  // and are not part of the seed script to avoid data loss.

  console.log(`Seeding finished.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 