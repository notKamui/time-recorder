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

export async function verifyPasswordStrength(
  password: string,
): Promise<boolean> {
  if (password.length < 8 || password.length > 255) return false

  const hash = encodeHexLowerCase(sha1(new TextEncoder().encode(password)))
  const hashPrefix = hash.slice(0, 5)
  console.log(hashPrefix)

  const response = await fetch(
    `https://api.pwnedpasswords.com/range/${hashPrefix}`,
  )
  const data = await response.text()
  console.log(data)

  const items = data.split('\n')
  return !items.some(
    (item) => hash === hashPrefix + item.slice(0, 35).toLowerCase(),
  )
}
