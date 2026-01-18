declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CONTACT_FORM_TO?: string
      PAYLOAD_SECRET: string
      DATABASE_URL: string
      NEXT_PUBLIC_SERVER_URL: string
      SMTP_HOST?: string
      SMTP_PORT?: string
      SMTP_SECURE?: string
      SMTP_USER?: string
      SMTP_PASS?: string
      SMTP_FROM?: string
      SMTP_FROM_NAME?: string
      VERCEL_PROJECT_PRODUCTION_URL: string
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}
