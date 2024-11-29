import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  out: './.drizzle',
  schema: './server/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: "postgres://timerecorder:timerecorder@localhost:5432/timerecorder",
  },
})
