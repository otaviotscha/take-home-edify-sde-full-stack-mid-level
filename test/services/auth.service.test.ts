import { beforeEach, describe, expect, it, mock } from 'bun:test'
import { JwtService } from '@nestjs/jwt'
import { UserRoleEnum } from '@/db/schema'
import { AuthService } from '@/services/auth.service'
import { HashService } from '@/services/hash.service'
import { UserService } from '@/services/user.service'
import { createMock } from '../mocks/index.mock'

const baseMockUser = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  passwordHash: 'hashedPassword',
  role: UserRoleEnum.STUDENT,
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe('AuthService', () => {
  let authService: AuthService
  let userService: UserService
  let jwtService: JwtService
  let hashService: HashService

  beforeEach(() => {
    userService = createMock<UserService>({
      findOne: mock(() => Promise.resolve(null)),
    })

    jwtService = createMock<JwtService>({
      sign: mock(() => 'mockAccessToken'),
    })

    hashService = createMock<HashService>({
      compare: mock(() => Promise.resolve(false)),
    })

    authService = new AuthService(userService, jwtService, hashService)
  })

  it('should be defined', () => {
    expect(authService).toBeDefined()
  })

  describe('validateUser', () => {
    it('returns null if user is not found', async () => {
      const result = await authService.validateUser('nonexistent@example.com', 'password')
      expect(result).toBeNull()
      expect(userService.findOne).toHaveBeenCalledWith('nonexistent@example.com')
    })

    it('returns null if password does not match', async () => {
      ;(userService.findOne as ReturnType<typeof mock>).mockResolvedValue(baseMockUser)
      ;(hashService.compare as ReturnType<typeof mock>).mockResolvedValue(false)

      const result = await authService.validateUser('test@example.com', 'wrongPassword')
      expect(result).toBeNull()
      expect(userService.findOne).toHaveBeenCalledWith('test@example.com')
      expect(hashService.compare).toHaveBeenCalledWith('wrongPassword', 'hashedPassword')
    })

    it('returns the user if password matches', async () => {
      ;(userService.findOne as ReturnType<typeof mock>).mockResolvedValue(baseMockUser)
      ;(hashService.compare as ReturnType<typeof mock>).mockResolvedValue(true)

      const result = await authService.validateUser('test@example.com', 'correctPassword')
      expect(result).toEqual(baseMockUser)
      expect(userService.findOne).toHaveBeenCalledWith('test@example.com')
      expect(hashService.compare).toHaveBeenCalledWith('correctPassword', 'hashedPassword')
    })
  })

  describe('login', () => {
    it('returns an access token for a valid user', async () => {
      const result = await authService.login(baseMockUser)
      expect(result).toEqual({ accessToken: 'mockAccessToken' })
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: baseMockUser.email,
        sub: baseMockUser.id,
      })
    })
  })

  describe('error handling', () => {
    it('throws if UserService.findOne fails', async () => {
      ;(userService.findOne as ReturnType<typeof mock>).mockRejectedValue(new Error('DB error'))
      await expect(authService.validateUser('x', 'y')).rejects.toThrow('DB error')
    })
  })
})
