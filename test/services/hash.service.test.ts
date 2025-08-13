import { beforeEach, describe, expect, it, mock } from 'bun:test'
import * as argon2 from 'argon2'
import { HashService } from '@/services/hash.service'

const dataToHash = 'mySecretPassword'
const dataToCompare = 'mySecretPassword'
const existingHash = 'existingHashedPassword'

describe('HashService', () => {
  let hashService: HashService

  beforeEach(() => {
    mock.module('argon2', () => ({
      hash: mock(() => Promise.resolve('mockHashedData')),
      verify: mock(() => Promise.resolve(true)),
    }))
    hashService = new HashService()
  })

  it('should be defined', () => {
    expect(hashService).toBeDefined()
  })

  describe('hash', () => {
    it('should call argon2.hash with the provided data', async () => {
      await hashService.hash(dataToHash)
      expect(argon2.hash).toHaveBeenCalledWith(dataToHash)
    })

    it('should return the hashed data', async () => {
      const result = await hashService.hash(dataToHash)
      expect(result).toBe('mockHashedData')
    })
  })

  describe('compare', () => {
    it('should call argon2.verify with the provided data and hash', async () => {
      await hashService.compare(dataToCompare, existingHash)
      expect(argon2.verify).toHaveBeenCalledWith(existingHash, dataToCompare)
    })

    it('should return true if data matches the hash', async () => {
      ;(argon2.verify as ReturnType<typeof mock>).mockResolvedValue(true)
      const result = await hashService.compare(dataToCompare, existingHash)
      expect(result).toBeTrue()
    })

    it('should return false if data does not match the hash', async () => {
      ;(argon2.verify as ReturnType<typeof mock>).mockResolvedValue(false)
      const result = await hashService.compare(dataToCompare, existingHash)
      expect(result).toBeFalse()
    })
  })
})
