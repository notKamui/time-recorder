import dotenv from '@dotenvx/dotenvx'

if (Bun.env.NODE_ENV === 'development') {
  dotenv.config({
    path: '.env.dev',
  })
}

dotenv.config({
  path: '.env',
  override: true,
})

export const env = {
  NODE_ENV: Bun.env.NODE_ENV! as 'development' | 'production',
  SERVER_URL: Bun.env.SERVER_URL! as string,
  DATABASE_URL: Bun.env.DATABASE_URL! as string,
}
