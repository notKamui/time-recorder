import { sha1 } from '@oslojs/crypto/sha1'
import { encodeHexLowerCase } from '@oslojs/encoding'

export async function hashPassword(password: string) {
  return await Bun.password.hash(password, {
    algorithm: 'argon2id',
    memoryCost: 2 ** 16,
    timeCost: 3,
  })
}

export async function verifyPassword(password: string, hash: string) {
  return await Bun.password.verify(password, hash)
}
