import { prisma } from '../src/lib/prisma'
import {$Enums, Category} from "@prisma/client";
import Period = $Enums.Period;
import { saltAndHashPassword } from '../src/lib/password';

async function main() {

  const hashedPassword = await saltAndHashPassword("password")
  // 1. Users
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
      sendNotifications: true,
    },
  })

  // 2. Subscriptions
  await prisma.subscription.createMany({
    data: [
      {
        userId: user.id,
        name: 'Netflix',
        startDate: new Date('2024-01-01'),
        category: Category.ENTERTAINMENT,
        icon: '🎬',
        color: '#e50914',
        price: 15.99,
        frequency: 1,
        period: Period.MONTHLY,
      },
      {
        userId: user.id,
        name: 'Spotify',
        startDate: new Date('2024-02-01'),
        category: Category.ENTERTAINMENT,
        icon: '🎵',
        color: '#1db954',
        price: 9.99,
        frequency: 1,
        period: Period.MONTHLY,
      },
      {
        userId: user.id,
        name: 'JetBrains',
        startDate: new Date('2024-03-01'),
        category: Category.SOFTWARE,
        icon: '💻',
        color: '#000000',
        price: 249,
        frequency: 1,
        period: Period.YEARLY,
      },
    ],
  })

  // 3. Legal documents
  await prisma.legalDocument.createMany({
    data: [
      {
        slug: 'privacy-policy',
        title: 'Privacy Policy',
        content: 'This is the privacy policy...',
      },
      {
        slug: 'terms-of-service',
        title: 'Terms of Service',
        content: 'These are the terms...',
      },
    ],
  })

  console.log('✅ Seed completed')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })