import { hash, verify } from '@node-rs/argon2'

export async function hashPassword(password: string) {
  return await hash(password, {
    memoryCost: 2 ** 16,
    timeCost: 3,
    outputLen: 32,
    parallelism: 1,
  })
}

export async function verifyPassword(password: string, hash: string) {
  return await verify(hash, password)
}
