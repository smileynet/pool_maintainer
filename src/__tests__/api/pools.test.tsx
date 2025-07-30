import { describe, it, expect } from 'vitest'

describe('API Integration', () => {
  it('should mock API calls with MSW', async () => {
    // Test that MSW is working by making a fetch request
    const response = await fetch('/api/pools')
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('pools')
    expect(Array.isArray(data.pools)).toBe(true)
    expect(data.pools).toHaveLength(2)
    expect(data.pools[0]).toHaveProperty('name', 'Main Pool')
  })

  it('should handle pool creation', async () => {
    const newPool = {
      name: 'Test Pool',
      location: 'Test Location',
      capacity: 100,
      status: 'active' as const,
    }

    const response = await fetch('/api/pools', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPool),
    })

    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data).toHaveProperty('pool')
    expect(data.pool.name).toBe('Test Pool')
    expect(data.pool).toHaveProperty('id')
  })

  it('should handle authentication', async () => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@pool.com',
        password: 'password123',
      }),
    })

    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('user')
    expect(data).toHaveProperty('token')
    expect(data.user.email).toBe('admin@pool.com')
  })
})
