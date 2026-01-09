import { prisma } from '../src/lib/prisma'
import {$Enums, Category} from "@prisma/client";
import Period = $Enums.Period;
import { saltAndHashPassword } from '../src/lib/password';

async function main() {

  const hashedPassword = await saltAndHashPassword("password")

  const terms = `
    <section>
      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing and using SubZero ("the Service"), you accept and agree to be bound by the terms and
        provision of this agreement. If you do not agree to these terms, please do not use the Service.
      </p>
    </section>
    
    <section>
      <h2>2. Description of Service</h2>
      <p>
        SubZero provides a subscription tracking and management platform that allows users to monitor their
        recurring expenses, categorize subscriptions, and receive insights about their spending patterns. The
        Service includes AI-powered features for auto-categorization and price detection.
      </p>
    </section>
    
    <section>
      <h2>3. User Accounts</h2>
      <p>
        To use certain features of the Service, you must register for an account. You agree to:
      </p>
      <ul>
        <li>Provide accurate, current, and complete information during registration</li>
        <li>Maintain the security of your password and account</li>
        <li>Notify us immediately of any unauthorized use of your account</li>
        <li>Accept responsibility for all activities that occur under your account</li>
      </ul>
    </section>
    
    <section>
      <h2>4. Privacy and Data Protection</h2>
      <p>
        Your privacy is important to us. We collect and process your data in accordance with our Privacy Policy.
        By using the Service, you consent to the collection and use of information as described in our Privacy
        Policy. We use industry-standard encryption to protect your data and never share your personal information
        with third parties without your explicit consent.
      </p>
    </section>
    
    <section>
      <h2>5. User Conduct</h2>
      <p>You agree not to use the Service to:</p>
      <ul>
        <li>Violate any applicable laws or regulations</li>
        <li>Infringe on the intellectual property rights of others</li>
        <li>Transmit any harmful or malicious code</li>
        <li>Attempt to gain unauthorized access to the Service or related systems</li>
        <li>Interfere with or disrupt the Service or servers</li>
      </ul>
    </section>
    
    <section>
      <h2>6. Intellectual Property</h2>
      <p>
        The Service and its original content, features, and functionality are owned by SubZero and are protected
        by international copyright, trademark, patent, trade secret, and other intellectual property laws.
      </p>
    </section>
    
    <section>
      <h2>7. Limitation of Liability</h2>
      <p>
        SubZero shall not be liable for any indirect, incidental, special, consequential, or punitive damages
        resulting from your use or inability to use the Service. We provide the Service "as is" without warranties
        of any kind, either express or implied.
      </p>
    </section>
    
    <section>
      <h2>8. Changes to Terms</h2>
      <p>
        We reserve the right to modify these terms at any time. We will notify users of any material changes by
        posting the new Terms of Service on this page. Your continued use of the Service after such modifications
        constitutes your acceptance of the updated terms.
      </p>
    </section>
    
    <section>
      <h2>9. Contact Information</h2>
      <p>If you have any questions about these Terms, please contact us through our support channels.</p>
    </section>
  `;

  // Cleanup existing data
  await prisma.subscription.deleteMany({})
  await prisma.user.deleteMany({})
  await prisma.legalDocument.deleteMany({})

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
        slug: 'terms-of-service',
        title: 'Terms of Service',
        content: terms,
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