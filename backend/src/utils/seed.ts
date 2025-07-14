import { getPayload } from 'payload'
import config from '../payload.config'

export async function createAdminUser() {
  const payload = await getPayload({ config })

  try {
    // Check if admin user already exists
    const existingAdmin = await payload.find({
      collection: 'users',
      where: {
        role: {
          equals: 'admin',
        },
      },
      limit: 1,
    })

    if (existingAdmin.docs.length > 0) {
      console.log('Admin user already exists')
      return existingAdmin.docs[0]
    }

    // Create admin user
    const adminUser = await payload.create({
      collection: 'users',
      data: {
        email: process.env.ADMIN_EMAIL || 'admin@example.com',
        password: process.env.ADMIN_PASSWORD || 'admin123',
        role: 'admin',
      },
    })

    console.log('Admin user created successfully:', adminUser.email)
    return adminUser
  } catch (error) {
    console.error('Error creating admin user:', error)
    throw error
  }
}

// Run if called directly
if (require.main === module) {
  createAdminUser()
    .then(() => {
      console.log('Seeding completed')
      process.exit(0)
    })
    .catch((error) => {
      console.error('Seeding failed:', error)
      process.exit(1)
    })
}