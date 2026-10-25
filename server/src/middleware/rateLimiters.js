import { rateLimit } from 'express-rate-limit';

export const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "You've asked the AI Advisor a lot of questions. Please wait a few minutes and try again.",
  },
});
