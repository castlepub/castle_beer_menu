const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function setLargeFontSize() {
  try {
    const beers = await prisma.beer.findMany();
    for (const beer of beers) {
      await prisma.beer.update({
        where: { id: beer.id },
        data: {
          nameFontSize: '2vw',
          breweryFontSize: '2vw',
        },
      });
      console.log(`Updated beer ${beer.name} (Tap ${beer.tapNumber})`);
    }
    console.log('All beers updated to large font size (2vw).');
  } catch (error) {
    console.error('Error updating beers:', error);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  setLargeFontSize();
} 