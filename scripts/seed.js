const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log(`Start seeding ...`)

  // Delete all existing beers to ensure a clean slate
  await prisma.beer.deleteMany({})
  console.log('Deleted all existing beers.')

  const coreBeers = [
    {
      tapNumber: 1,
      name: 'CASTLE BREW PILS',
      brewery: 'HOPSCOR BREWING',
      style: 'Pilsner',
      abv: '5% ABV',
      price: '0,3L €3 / 0,5L €4.50',
      status: 'on_tap',
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

  // Sample rotating beers to restore the menu
  const rotatingBeers = [
    {
      tapNumber: 7,
      name: 'LAGER',
      brewery: 'BRLO',
      style: 'Lager',
      abv: '4.8% ABV',
      price: '0,3L €4.50 / 0,5L €6',
      status: 'on_tap',
      location: 'Garden',
      logo: '/logo/Brlo.png',
    },
    {
      tapNumber: 8,
      name: 'WHEAT BEER',
      brewery: 'STRASSENBRAU',
      style: 'Hefeweizen',
      abv: '5.2% ABV',
      price: '0,3L €4 / 0,5L €5.50',
      status: 'on_tap',
      tags: JSON.stringify(['NEW']),
      location: 'Bar',
      logo: '/logo/strassenbrau.png',
    },
    {
      tapNumber: 9,
      name: 'IPA',
      brewery: 'FUERST WIACEK',
      style: 'India Pale Ale',
      abv: '6.2% ABV',
      price: '0,3L €5 / 0,5L €7',
      status: 'on_tap',
      tags: JSON.stringify(['STRONG']),
      location: 'Upstairs',
      logo: '/logo/fuerst wiacek.png',
    },
    {
      tapNumber: 10,
      name: 'SEASONAL ALE',
      brewery: 'BRAUGIER',
      style: 'Seasonal Ale',
      abv: '5.5% ABV',
      price: '0,3L €4.50 / 0,5L €6.50',
      status: 'on_tap',
      tags: JSON.stringify(['SEASONAL', 'LIMITED']),
      location: 'Garden',
      logo: '/logo/braugier.png',
    },
    {
      tapNumber: 11,
      name: 'PORTER',
      brewery: 'THE CASTLE',
      style: 'Porter',
      abv: '5.8% ABV',
      price: '0,3L €5.50 / 0,5L €7.50',
      status: 'on_tap',
      tags: JSON.stringify(['HOUSE', 'STRONG']),
      location: 'Bar',
      logo: '/logo/castle.png',
    },
    {
      tapNumber: 12,
      name: 'WEISSBIER',
      brewery: 'WEIHENSTEPHAN',
      style: 'Wheat Beer',
      abv: '5.4% ABV',
      price: '0,5L €5.50',
      status: 'on_tap',
      location: 'Upstairs',
      logo: '/logo/weihenstephan.jpg',
    },
    {
      tapNumber: 13,
      name: 'AMBER ALE',
      brewery: 'HOPSCOR BREWING',
      style: 'Amber Ale',
      abv: '5.0% ABV',
      price: '0,3L €4.50 / 0,5L €6',
      status: 'keg_empty',
      location: 'Garden',
      logo: '/logo/hopscor.png',
    },
    {
      tapNumber: 14,
      name: 'BERLINER WEISSE',
      brewery: 'BRLO',
      style: 'Sour Beer',
      abv: '3.8% ABV',
      price: '0,3L €4 / 0,5L €5.50',
      status: 'on_tap',
      tags: JSON.stringify(['NEW', 'LIMITED']),
      location: 'Bar',
      logo: '/logo/Brlo.png',
    }
  ]

  console.log('Upserting rotating beers...')
  for (const beer of rotatingBeers) {
    await prisma.beer.upsert({
      where: { tapNumber: beer.tapNumber },
      update: beer,
      create: beer,
    })
    console.log(`- Tap ${beer.tapNumber}: ${beer.name}`)
  }

  // Create default custom message
  console.log('Creating default custom message...')
  // await prisma.customMessage.upsert({
  //   where: { key: 'display2_message' },
  //   update: {},
  //   create: {
  //     key: 'display2_message',
  //     content: 'Welcome to The Castle - Enjoy our rotating selection of craft beers!'
  //   }
  // })
  console.log('- Default message created')

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