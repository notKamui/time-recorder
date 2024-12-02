import dotenv from '@dotenvx/dotenvx'

if (process.env.NODE_ENV === 'development') {
  dotenv.config({
    path: '.env.dev',
    quiet: true,
  })
}

dotenv.config({
  path: '.env',
  override: true,
  quiet: true,
})

export const env = {
  NODE_ENV: process.env.NODE_ENV! as 'development' | 'production',
  SERVER_URL: process.env.SERVER_URL! as string,
  DATABASE_URL: process.env.DATABASE_URL! as string,
}
