const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

async function importFromBackup() {
  try {
    // Get the most recent backup file
    const backupsDir = path.join(__dirname, '..', 'backups')
    const files = fs.readdirSync(backupsDir)
      .filter(f => f.startsWith('beers-backup-'))
      .sort()
      .reverse()

    if (files.length === 0) {
      throw new Error('No backup files found')
    }

    const backupFile = path.join(backupsDir, files[0])
    console.log(`Using backup file: ${files[0]}`)

    // Read and parse backup file
    const backup = JSON.parse(fs.readFileSync(backupFile, 'utf8'))
    const beers = backup.beers

    // Clear existing beers
    await prisma.beer.deleteMany({})
    console.log('Cleared existing beers')

    // Import beers from backup
    for (const beer of beers) {
      // Remove id to let Prisma auto-generate new ones
      const { id, ...beerData } = beer
      await prisma.beer.create({
        data: beerData
      })
      console.log(`Imported: Tap ${beer.tapNumber} - ${beer.name}`)
    }

    console.log(`✅ Successfully imported ${beers.length} beers from backup`)

  } catch (error) {
    console.error('Error importing from backup:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run if called directly
if (require.main === module) {
  importFromBackup()
}

module.exports = importFromBackup 