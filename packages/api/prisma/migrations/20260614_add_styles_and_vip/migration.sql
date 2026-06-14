-- CreateTable
CREATE TABLE "style_templates" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "prompt_text" TEXT NOT NULL,
    "preview_url" TEXT,
    "category" VARCHAR(50) NOT NULL DEFAULT 'general',
    "tier" VARCHAR(20) NOT NULL DEFAULT 'free',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "style_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_subscriptions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "plan" VARCHAR(20) NOT NULL DEFAULT 'free',
    "payment_tx" TEXT,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "style_templates_slug_key" ON "style_templates"("slug");

-- AddForeignKey
ALTER TABLE "user_subscriptions" ADD CONSTRAINT "user_subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Seed default style templates
INSERT INTO "style_templates" ("id", "name", "slug", "prompt_text", "category", "tier", "sort_order") VALUES
(gen_random_uuid(), 'Classic Manga B&W', 'manga-bw', 'black and white manga style, high contrast ink, screentone shading, dynamic panel composition', 'manga', 'free', 1),
(gen_random_uuid(), 'Soft Color Manga', 'manga-soft-color', 'soft colored manga style, pastel tones, watercolor-like shading, gentle lighting', 'manga', 'free', 2),
(gen_random_uuid(), 'High Energy Action', 'high-energy', 'high energy action manga, speed lines, dynamic poses, explosive effects, bold ink strokes', 'manga', 'free', 3),
(gen_random_uuid(), 'Dark & Dramatic', 'dark-dramatic', 'dark dramatic manga style, heavy shadows, noir atmosphere, cinematic lighting, high contrast', 'manga', 'free', 4),
(gen_random_uuid(), 'Chibi Cute', 'chibi-cute', 'chibi art style, cute proportions, big expressive eyes, pastel colors, kawaii aesthetic', 'manga', 'vip', 5),
(gen_random_uuid(), 'Cyberpunk Neon', 'cyberpunk-neon', 'cyberpunk manga style, neon colors, holographic effects, futuristic city, glitch art elements', 'manga', 'vip', 6),
(gen_random_uuid(), 'Watercolor Fantasy', 'watercolor-fantasy', 'watercolor illustration style, fantasy setting, ethereal lighting, flowing colors, magical atmosphere', 'manga', 'vip', 7),
(gen_random_uuid(), 'Retro 80s Anime', 'retro-80s', '1980s anime style, retro color palette, cel shading, VHS aesthetic, vintage anime look', 'manga', 'vip', 8),
(gen_random_uuid(), 'Horror Junji Ito', 'horror-ito', 'horror manga style inspired by Junji Ito, detailed linework, grotesque imagery, spiral patterns, unsettling atmosphere', 'manga', 'vip', 9),
(gen_random_uuid(), 'Webtoon Full Color', 'webtoon-color', 'webtoon full color style, clean digital art, vibrant colors, Korean manhwa aesthetic, smooth gradients', 'manga', 'vip', 10);
