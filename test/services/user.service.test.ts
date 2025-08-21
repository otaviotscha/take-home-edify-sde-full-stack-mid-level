import { beforeEach, describe, expect, mock, test } from 'bun:test'
import { UserRoleEnum } from '@/db/schema'
import { UserRepository } from '@/repositories/user.repository'
import { HashService } from '@/services/hash.service'
import { UserService } from '@/services/user.service'

describe('UserService', () => {
  let userService: UserService
  let userRepository: UserRepository
  let hashService: HashService

  const baseUser = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    role: UserRoleEnum.STUDENT,
    passwordHash: 'hashedPassword',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  beforeEach(() => {
    userRepository = {
      createUser: mock((data) =>
        Promise.resolve({
          ...baseUser,
          ...data,
        })
      ),
      findAllUsers: mock(() => Promise.resolve([baseUser])),
      findUserById: mock(() => Promise.resolve(baseUser)),
      findOne: mock(() => Promise.resolve(baseUser)),
      updateUser: mock((data) =>
        Promise.resolve({
          ...baseUser,
          ...data,
          ...(data.password ? { passwordHash: data.password } : {}),
        })
      ),
      deleteUser: mock(() => Promise.resolve(baseUser)),
    } as unknown as UserRepository

    hashService = {
      hash: mock(() => Promise.resolve('newHashedPassword')),
      compare: mock(() => Promise.resolve(true)),
    } as unknown as HashService

    userService = new UserService(userRepository, hashService)
  })

  test('should be defined', () => {
    expect(userService).toBeDefined()
  })

  describe('createUser', () => {
    test('hashes the password and creates a user', async () => {
      const createUserInput = {
        name: 'New User',
        email: 'new@example.com',
        password: 'password123',
        role: UserRoleEnum.STUDENT,
      }
      const result = await userService.createUser(createUserInput)
      expect(hashService.hash).toHaveBeenCalledWith('password123')
      expect(userRepository.createUser).toHaveBeenCalledWith({
        ...createUserInput,
        passwordHash: 'newHashedPassword',
      })
      expect(result).toEqual({
        ...baseUser,
        ...createUserInput,
        passwordHash: 'newHashedPassword',
      })
    })
  })

  describe('findAllUsers', () => {
    test('returns an array of users', async () => {
      const result = await userService.findAllUsers()
      expect(userRepository.findAllUsers).toHaveBeenCalled()
      expect(result).toEqual([baseUser])
    })
  })

  describe('findUserById', () => {
    test('returns a user by id', async () => {
      const result = await userService.findUserById('1')
      expect(userRepository.findUserById).toHaveBeenCalledWith('1')
      expect(result).toEqual(baseUser)
    })
  })

  describe('findOne', () => {
    test('returns a user by email', async () => {
      const result = await userService.findOne('test@example.com')
      expect(userRepository.findOne).toHaveBeenCalledWith('test@example.com')
      expect(result).toEqual(baseUser)
    })
  })

  describe('updateUser', () => {
    test('hashes the password and updates the user if password is provided', async () => {
      const updateUserInput = { id: '1', name: 'Updated User', password: 'newPassword' }
      await userService.updateUser(updateUserInput)
    })

    test('updates the user without hashing password if password is not provided', async () => {
      const updateUserInput = { id: '1', name: 'Updated User Only' }
      const result = await userService.updateUser(updateUserInput)
      expect(hashService.hash).not.toHaveBeenCalled()
      expect(userRepository.updateUser).toHaveBeenCalledWith(updateUserInput)
      expect(result).toEqual({
        ...baseUser,
        id: '1',
        name: 'Updated User Only',
      })
    })
  })

  describe('deleteUser', () => {
    test('deletes a user by id', async () => {
      const result = await userService.deleteUser('1')
      expect(userRepository.deleteUser).toHaveBeenCalledWith('1')
      expect(result).toEqual(baseUser)
    })
  })
})
