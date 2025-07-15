const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function updateBeerLocations() {
  try {
    const result = await prisma.beer.updateMany({
      where: {
        OR: [
          { location: null },
          { location: '' }
        ]
      },
      data: {
        location: '🇩🇪 Berlin, DE'
      }
    })
    
    console.log(`Updated ${result.count} beers with default location`)
  } catch (error) {
    console.error('Error updating beer locations:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateBeerLocations() 