require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  await prisma.patient.create({
    data: {
      firstName: 'Jeffrey',
      lastName: 'Murray',
      birthDate: new Date('1990-01-01'),
    },
  })

  console.log('✅ Patient seeded successfully')
}

main()
  .catch(e => {
    console.error('❌ Error seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

