const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkBeers() {
  try {
    const beers = await prisma.beer.findMany({
      orderBy: { tapNumber: 'asc' }
    });
    
    console.log('Total beers:', beers.length);
    console.log('\nAll beers:');
    beers.forEach(beer => {
      console.log(`Tap ${beer.tapNumber}: ${beer.name} (Core: ${beer.isCore})`);
    });
    
    console.log('\nCore beers:');
    const coreBeers = beers.filter(b => b.isCore);
    coreBeers.forEach(beer => {
      console.log(`Tap ${beer.tapNumber}: ${beer.name}`);
    });
    
    console.log('\nRotating beers:');
    const rotatingBeers = beers.filter(b => !b.isCore);
    rotatingBeers.forEach(beer => {
      console.log(`Tap ${beer.tapNumber}: ${beer.name}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkBeers(); 