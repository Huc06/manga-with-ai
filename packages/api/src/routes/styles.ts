import { Router, Response } from "express";
import { prisma } from "../lib/prisma";
import { authMiddleware, AuthRequest } from "./auth";

const router = Router();

/**
 * GET /v1/styles
 * List all available style templates.
 * Returns tier info so frontend can gate VIP styles.
 */
router.get("/styles", async (_req, res) => {
  const styles = await prisma.styleTemplate.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      previewUrl: true,
      category: true,
      tier: true,
    },
  });
  res.json({ items: styles });
});

/**
 * GET /v1/user/subscription
 * Get current user's subscription status.
 */
router.get(
  "/user/subscription",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    const sub = await prisma.userSubscription.findFirst({
      where: { userId: req.userId!, isActive: true },
      orderBy: { createdAt: "desc" },
    });

    const isVip =
      sub?.plan === "vip" && (!sub.expiresAt || sub.expiresAt > new Date());

    res.json({
      plan: isVip ? "vip" : "free",
      expiresAt: sub?.expiresAt?.toISOString() || null,
    });
  },
);

/**
 * POST /v1/user/subscribe
 * Upgrade to VIP plan with payment.
 * Body: { paymentTx: string, plan: "vip" }
 */
router.post(
  "/user/subscribe",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    const { paymentTx, plan } = req.body;
    if (plan !== "vip") {
      res.status(400).json({ error: "Invalid plan" });
      return;
    }
    if (!paymentTx) {
      res.status(400).json({ error: "Payment transaction required" });
      return;
    }

    // Check for duplicate tx
    const existing = await prisma.userSubscription.findFirst({
      where: { paymentTx },
    });
    if (existing) {
      res.status(400).json({ error: "Payment already used" });
      return;
    }

    // Create subscription (30 days)
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const sub = await prisma.userSubscription.create({
      data: {
        userId: req.userId!,
        plan: "vip",
        paymentTx,
        expiresAt,
      },
    });

    res.json({
      plan: "vip",
      expiresAt: sub.expiresAt?.toISOString(),
      message: "VIP unlocked for 30 days!",
    });
  },
);

export default router;
