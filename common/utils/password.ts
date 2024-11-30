import { sha1 } from '@oslojs/crypto/sha1'
import { encodeHexLowerCase } from '@oslojs/encoding'

export async function verifyPasswordStrength(
  password: string,
): Promise<boolean> {
  if (password.length < 8 || password.length > 255) return false

  const hash = encodeHexLowerCase(sha1(new TextEncoder().encode(password)))
  const hashPrefix = hash.slice(0, 5)

  const response = await fetch(
    `https://api.pwnedpasswords.com/range/${hashPrefix}`,
  )
  const data = await response.text()

  const items = data.split('\n')
  return !items.some(
    (item) => hash === hashPrefix + item.slice(0, 35).toLowerCase(),
  )
}
