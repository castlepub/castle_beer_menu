const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const sampleBeers = [
  {
    tapNumber: 1,
    name: "Castle IPA",
    brewery: "The Castle Brewery",
    abv: "6.2%",
    style: "India Pale Ale",
    price: "0.3L €5.50 / 0.5L €7.50",
    logo: "https://images.unsplash.com/photo-1518176258765-fa3b1d41dae0?w=200&h=200&fit=crop&crop=center",
    status: "on_tap",
    tags: JSON.stringify(["HOUSE", "POPULAR"])
  },
  {
    tapNumber: 2,
    name: "Golden Pilsner",
    brewery: "Bavarian Craft",
    abv: "4.8%",
    style: "Pilsner",
    price: "0.3L €4.50 / 0.5L €6.00",
    logo: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop&crop=center",
    status: "on_tap",
    tags: JSON.stringify(["NEW"])
  },
  {
    tapNumber: 3,
    name: "Stout Porter",
    brewery: "Dark Horse Brewing",
    abv: "5.8%",
    style: "Stout",
    price: "0.3L €5.00 / 0.5L €6.80",
    logo: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop&crop=center",
    status: "on_tap",
    tags: JSON.stringify(["LIMITED"])
  },
  {
    tapNumber: 4,
    name: "Wheat Hefeweizen",
    brewery: "Bavarian Craft",
    abv: "5.4%",
    style: "Hefeweizen",
    price: "0.3L €4.80 / 0.5L €6.50",
    logo: "https://images.unsplash.com/photo-1518176258765-fa3b1d41dae0?w=200&h=200&fit=crop&crop=center",
    status: "on_tap",
    tags: JSON.stringify([])
  },
  {
    tapNumber: 5,
    name: "Amber Ale",
    brewery: "Mountain Brew Co",
    abv: "5.2%",
    style: "Amber Ale",
    price: "0.3L €4.20 / 0.5L €5.80",
    logo: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop&crop=center",
    status: "keg_empty",
    tags: JSON.stringify([])
  },
  {
    tapNumber: 6,
    name: "Sour Cherry",
    brewery: "Fruit Craft Brewery",
    abv: "4.1%",
    style: "Sour Ale",
    price: "0.3L €6.00 / 0.5L €8.00",
    logo: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop&crop=center",
    status: "on_tap",
    tags: JSON.stringify(["NEW", "LIMITED"])
  },
  {
    tapNumber: 7,
    name: "Lager Classic",
    brewery: "Traditional Brews",
    abv: "4.5%",
    style: "Lager",
    price: "0.3L €3.80 / 0.5L €5.20",
    logo: "https://images.unsplash.com/photo-1518176258765-fa3b1d41dae0?w=200&h=200&fit=crop&crop=center",
    status: "on_tap",
    tags: JSON.stringify([])
  },
  {
    tapNumber: 8,
    name: "Double IPA",
    brewery: "Hop Masters",
    abv: "8.2%",
    style: "Double IPA",
    price: "0.3L €7.50 / 0.5L €10.00",
    logo: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop&crop=center",
    status: "on_tap",
    tags: JSON.stringify(["STRONG"])
  },
  {
    tapNumber: 9,
    name: "Belgian Tripel",
    brewery: "Monastery Brewery",
    abv: "9.0%",
    style: "Tripel",
    price: "0.3L €8.00 / 0.5L €11.00",
    logo: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop&crop=center",
    status: "on_tap",
    tags: JSON.stringify(["LIMITED", "STRONG"])
  },
  {
    tapNumber: 10,
    name: "Session Pale",
    brewery: "Light Brew Co",
    abv: "3.8%",
    style: "Pale Ale",
    price: "0.3L €4.00 / 0.5L €5.50",
    logo: "https://images.unsplash.com/photo-1518176258765-fa3b1d41dae0?w=200&h=200&fit=crop&crop=center",
    status: "on_tap",
    tags: JSON.stringify(["SESSION"])
  },
  {
    tapNumber: 11,
    name: "Red Ale",
    brewery: "Irish Craft",
    abv: "5.0%",
    style: "Red Ale",
    price: "0.3L €4.50 / 0.5L €6.20",
    logo: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop&crop=center",
    status: "on_tap",
    tags: JSON.stringify([])
  },
  {
    tapNumber: 12,
    name: "Porter Classic",
    brewery: "Dark Horse Brewing",
    abv: "5.5%",
    style: "Porter",
    price: "0.3L €5.20 / 0.5L €7.00",
    logo: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop&crop=center",
    status: "on_tap",
    tags: JSON.stringify([])
  },
  {
    tapNumber: 13,
    name: "Wheat Beer",
    brewery: "Bavarian Craft",
    abv: "5.1%",
    style: "Wheat Beer",
    price: "0.3L €4.60 / 0.5L €6.30",
    logo: "https://images.unsplash.com/photo-1518176258765-fa3b1d41dae0?w=200&h=200&fit=crop&crop=center",
    status: "on_tap",
    tags: JSON.stringify([])
  },
  {
    tapNumber: 14,
    name: "Blonde Ale",
    brewery: "Summer Brews",
    abv: "4.8%",
    style: "Blonde Ale",
    price: "0.3L €4.30 / 0.5L €5.90",
    logo: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop&crop=center",
    status: "on_tap",
    tags: JSON.stringify([])
  },
  {
    tapNumber: 15,
    name: "Brown Ale",
    brewery: "Traditional Brews",
    abv: "5.3%",
    style: "Brown Ale",
    price: "0.3L €4.70 / 0.5L €6.40",
    logo: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop&crop=center",
    status: "on_tap",
    tags: JSON.stringify([])
  },
  {
    tapNumber: 16,
    name: "Saison",
    brewery: "Farmhouse Brewery",
    abv: "6.0%",
    style: "Saison",
    price: "0.3L €6.50 / 0.5L €8.80",
    logo: "https://images.unsplash.com/photo-1518176258765-fa3b1d41dae0?w=200&h=200&fit=crop&crop=center",
    status: "on_tap",
    tags: JSON.stringify(["NEW"])
  },
  {
    tapNumber: 17,
    name: "Scotch Ale",
    brewery: "Highland Brewing",
    abv: "7.2%",
    style: "Scotch Ale",
    price: "0.3L €7.00 / 0.5L €9.50",
    logo: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop&crop=center",
    status: "on_tap",
    tags: JSON.stringify(["STRONG"])
  },
  {
    tapNumber: 18,
    name: "Kolsch",
    brewery: "German Craft",
    abv: "4.8%",
    style: "Kolsch",
    price: "0.3L €4.90 / 0.5L €6.60",
    logo: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop&crop=center",
    status: "on_tap",
    tags: JSON.stringify([])
  },
  {
    tapNumber: 19,
    name: "Barleywine",
    brewery: "Strong Ale Co",
    abv: "10.5%",
    style: "Barleywine",
    price: "0.3L €9.00 / 0.5L €12.00",
    logo: "https://images.unsplash.com/photo-1518176258765-fa3b1d41dae0?w=200&h=200&fit=crop&crop=center",
    status: "on_tap",
    tags: JSON.stringify(["LIMITED", "STRONG"])
  },
  {
    tapNumber: 20,
    name: "Light Lager",
    brewery: "Traditional Brews",
    abv: "3.5%",
    style: "Light Lager",
    price: "0.3L €3.50 / 0.5L €4.80",
    logo: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop&crop=center",
    status: "on_tap",
    tags: JSON.stringify(["SESSION"])
  }
]

async function main() {
  console.log('🌱 Starting database seeding...')
  
  // Clear existing data
  await prisma.beer.deleteMany()
  console.log('🗑️  Cleared existing beer data')
  
  // Insert sample beers
  for (const beer of sampleBeers) {
    await prisma.beer.create({
      data: beer
    })
  }
  
  console.log(`✅ Successfully seeded ${sampleBeers.length} beers!`)
  console.log('🍺 Sample beers added:')
  sampleBeers.forEach(beer => {
    console.log(`   Tap ${beer.tapNumber}: ${beer.name} by ${beer.brewery}`)
  })
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 