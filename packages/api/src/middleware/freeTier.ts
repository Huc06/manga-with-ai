import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../routes/auth';

const FREE_STORIES = 1; // First N stories are free

export async function freeTierGuard(req: AuthRequest, _res: Response, next: NextFunction) {
  if (!req.userId) { next(); return; }

  const storyCount = await prisma.story.count({ where: { ownerUserId: req.userId } });

  if (storyCount < FREE_STORIES) {
    // Skip payment — user still in free tier
    (req as any).skipPayment = true;
  }

  next();
}
