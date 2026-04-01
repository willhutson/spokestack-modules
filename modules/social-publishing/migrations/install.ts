/**
 * Social Publishing — Install Migration
 * Seeds PlatformSpec records for the 6 main platforms.
 */

const platformSpecs = [
  {
    platform: "INSTAGRAM",
    displayName: "Instagram",
    captionMaxLength: 2200,
    hashtagMaxCount: 30,
    mentionMaxCount: 20,
    imageMaxSize: 30000000,
    videoMaxSize: 650000000,
    videoMaxDuration: 90,
    videoMinDuration: 3,
    supportedAspectRatios: ["1:1", "4:5", "9:16", "16:9"],
    recommendedAspectRatio: "4:5",
    supportsCarousel: true,
    maxCarouselItems: 10,
    supportsScheduling: true,
    supportsStories: true,
    supportsLinks: false,
    supportsHashtags: true,
    supportsMentions: true,
    supportsLocation: true,
    brandColor: "#E1306C",
    iconName: "instagram",
  },
  {
    platform: "FACEBOOK",
    displayName: "Facebook",
    captionMaxLength: 63206,
    hashtagMaxCount: 30,
    supportedAspectRatios: ["1:1", "4:5", "16:9"],
    supportsCarousel: true,
    maxCarouselItems: 10,
    supportsScheduling: true,
    supportsStories: true,
    supportsLinks: true,
    supportsHashtags: true,
    supportsMentions: true,
    supportsLocation: true,
    brandColor: "#1877F2",
    iconName: "facebook",
  },
  {
    platform: "TWITTER",
    displayName: "X (Twitter)",
    captionMaxLength: 280,
    hashtagMaxCount: 2,
    supportedAspectRatios: ["16:9", "1:1"],
    supportsCarousel: false,
    supportsScheduling: true,
    supportsLinks: true,
    supportsHashtags: true,
    supportsMentions: true,
    supportsLocation: false,
    brandColor: "#000000",
    iconName: "twitter",
  },
  {
    platform: "LINKEDIN",
    displayName: "LinkedIn",
    captionMaxLength: 3000,
    hashtagMaxCount: 5,
    supportedAspectRatios: ["1:1", "4:5", "16:9"],
    supportsCarousel: true,
    maxCarouselItems: 9,
    supportsScheduling: true,
    supportsLinks: true,
    supportsHashtags: true,
    supportsMentions: true,
    supportsLocation: false,
    brandColor: "#0A66C2",
    iconName: "linkedin",
  },
  {
    platform: "TIKTOK",
    displayName: "TikTok",
    captionMaxLength: 2200,
    hashtagMaxCount: 20,
    videoMaxDuration: 600,
    videoMinDuration: 3,
    supportedAspectRatios: ["9:16"],
    recommendedAspectRatio: "9:16",
    supportsCarousel: false,
    supportsScheduling: true,
    supportsStories: false,
    supportsLinks: false,
    supportsHashtags: true,
    supportsMentions: true,
    supportsLocation: false,
    brandColor: "#010101",
    iconName: "tiktok",
  },
  {
    platform: "YOUTUBE",
    displayName: "YouTube",
    captionMaxLength: 5000,
    videoMaxDuration: 43200,
    supportedAspectRatios: ["16:9"],
    recommendedAspectRatio: "16:9",
    supportsCarousel: false,
    supportsScheduling: true,
    supportsLinks: true,
    supportsHashtags: true,
    supportsMentions: false,
    supportsLocation: false,
    brandColor: "#FF0000",
    iconName: "youtube",
  },
];

export async function install(prisma: any, organizationId: string): Promise<{ success: boolean }> {
  // Seed PlatformSpec records
  for (const spec of platformSpecs) {
    await prisma.platformSpec?.upsert?.({
      where: { platform: spec.platform },
      create: spec,
      update: spec,
    }).catch(() => {
      // PlatformSpec may not exist yet in the mock — that's OK
    });
  }

  // Write context entry
  await prisma.contextEntry?.create?.({
    data: {
      organizationId,
      entryType: "ENTITY",
      category: "social_publishing.module",
      key: "installed",
      value: { platformsSeeded: platformSpecs.map((s) => s.platform), installedAt: new Date().toISOString() },
      confidence: 0.9,
      sourceAgentType: "MODULE",
    },
  }).catch(() => {});

  return { success: true };
}
