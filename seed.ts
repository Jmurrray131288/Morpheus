import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.patient.create({
    data: {
      firstName: 'Jeffrey',
      lastName: 'Murray',
      birthDate: new Date('1990-01-01')
    }
  })
  console.log('Patient seeded!')
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())
