const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

async function backupBeers() {
  try {
    // Create backups directory if it doesn't exist
    const backupsDir = path.join(__dirname, '..', 'backups')
    if (!fs.existsSync(backupsDir)) {
      fs.mkdirSync(backupsDir, { recursive: true })
    }

    // Get all beers from database
    const beers = await prisma.beer.findMany({
      orderBy: { tapNumber: 'asc' }
    })

    // Create backup filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const backupFile = path.join(backupsDir, `beers-backup-${timestamp}.json`)

    // Save backup with pretty formatting
    fs.writeFileSync(
      backupFile,
      JSON.stringify({ 
        backupDate: new Date().toISOString(),
        beers: beers 
      }, null, 2)
    )

    console.log(`✅ Backup created successfully: ${backupFile}`)

    // Keep only the last 10 backups
    const files = fs.readdirSync(backupsDir)
      .filter(f => f.startsWith('beers-backup-'))
      .sort()
      .reverse()

    if (files.length > 10) {
      files.slice(10).forEach(file => {
        fs.unlinkSync(path.join(backupsDir, file))
      })
      console.log(`🧹 Cleaned up old backups, keeping latest 10`)
    }

  } catch (error) {
    console.error('Error creating backup:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run backup if called directly
if (require.main === module) {
  backupBeers()
}

// Export for use in other files
module.exports = backupBeers 