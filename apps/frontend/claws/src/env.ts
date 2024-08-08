import { z } from 'zod';

const env = z.object({
  NEXT_PUBLIC_CLAWS_API_URL: z.string(),
  NEXT_PUBLIC_FRONTEND_REDIRECT_URI: z.string(),
  NEXT_PUBLIC_BACKEND_URL: z.string(),
});

export const envSchema = env.parse({
  NEXT_PUBLIC_CLAWS_API_URL: process.env.NEXT_PUBLIC_CLAWS_API_URL,
  NEXT_PUBLIC_FRONTEND_REDIRECT_URI:
    process.env.NEXT_PUBLIC_FRONTEND_REDIRECT_URI,
  NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
});
