import { Injectable } from '@nestjs/common'
import * as argon2 from 'argon2'

@Injectable()
export class HashService {
  async hash(data: string): Promise<string> {
    return argon2.hash(data)
  }

  async compare(data: string, hash: string): Promise<boolean> {
    return argon2.verify(hash, data)
  }
}
