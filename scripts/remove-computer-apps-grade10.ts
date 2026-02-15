import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Cleanup: remove computer-applications from CBSE grade 10 if present')

  const board = await prisma.board.findUnique({ where: { slug: 'cbse' } })
  if (!board) {
    console.log('CBSE board not found; nothing to do')
    return
  }

  const classLevel = await prisma.classLevel.findFirst({ where: { boardId: board.id, grade: 10 } })
  if (!classLevel) {
    console.log('Class level for CBSE grade 10 not found; nothing to do')
    return
  }

  const removed = await prisma.subjectDef.deleteMany({ where: { classId: classLevel.id, slug: 'computer-applications' } })
  console.log(`Deleted ${removed.count} subjectDef rows (computer-applications) for CBSE grade 10`)
}

main()
  .catch((e) => {
    console.error('Cleanup failed', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
