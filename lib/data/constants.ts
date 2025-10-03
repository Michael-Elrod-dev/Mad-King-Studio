// lib/constants.ts

// ======================
// SOCIAL MEDIA & CONTACT
// ======================
export const SOCIAL_LINKS = {
  TWITCH: "https://www.twitch.tv/aimosthadme",
  DISCORD: "https://discord.gg/JSH5ct2nAC",
  X: "https://x.com/MadKingStudio",
  GMAIL: "madkingstudio.dev@gmail.com",
} as const;

// ======================
// API ENDPOINTS & CACHE
// ======================
export const API_LINKS = {
  S3_CACHE_URL: "https://mad-king-studio.s3.amazonaws.com/cache",
  S3_DOCS_IMAGES: "https://mad-king-studio.s3.amazonaws.com/docs-images",
} as const;

// ======================
// API POLLING & CACHING
// ======================
export const POLLING_INTERVALS = {
  TWITCH_STATUS: 60000, // 1 minute in milliseconds
  DOCS_TREE: 3600, // 1 hour in seconds (for Next.js revalidate)
  DOC_CONTENT: 1800, // 30 minutes in seconds
  BLOG_POSTS: 1800, // 30 minutes in seconds
  TASKS: 1800, // 30 minutes in seconds
} as const;

// ======================
// API RATE LIMITING
// ======================
export const RATE_LIMITS = {
  // ======================
  // PASSIVE / AUTOMATIC
  // ======================
  TWITCH_API: {
    MAX_REQUESTS: 10,
    WINDOW_MS: 60 * 1000,
  },
  DOCS_API: {
    MAX_REQUESTS: 10,
    WINDOW_MS: 60 * 1000,
  },
  TASKS_API: {
    MAX_REQUESTS: 10,
    WINDOW_MS: 60 * 1000,
  },
  BLOG_API: {
    MAX_REQUESTS: 10,
    WINDOW_MS: 60 * 1000,
  },

  // ======================
  // USER-TRIGGERED
  // ======================
  CONTACT_FORM: {
    MAX_REQUESTS: 3,
    WINDOW_MS: 15 * 60 * 1000,
  },
  DOC_CONTENT: {
    MAX_REQUESTS: 60,
    WINDOW_MS: 60 * 1000,
  },
} as const;

// ======================
// DOCUMENTATION CONFIG
// ======================
export const DOCS_CONFIG = {
  REPO_OWNER: "Michael-Elrod-dev",
  REPO_NAME: "Path-to-Valhalla",
  DOCS_PATH: "docs",
  EXCLUDED_FOLDERS: ["00-Templates"],
  DEFAULT_DOC: "00-project-management/dashboards/project-overview",
} as const;

// ======================
// MEDIA & FILE HANDLING
// ======================
export const MEDIA_CONFIG = {
  SUPPORTED_IMAGE_FORMATS: ["jpg", "jpeg", "png", "gif", "webp"] as const,
  SUPPORTED_VIDEO_FORMATS: ["mp4", "webm", "mov", "avi"] as const,
  MAX_IMAGE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_VIDEO_SIZE: 100 * 1024 * 1024, // 100MB
} as const;
export type SupportedVideoFormat =
  (typeof MEDIA_CONFIG.SUPPORTED_VIDEO_FORMATS)[number];
export type SupportedImageFormat =
  (typeof MEDIA_CONFIG.SUPPORTED_IMAGE_FORMATS)[number];

// ======================
// GAME DATA
// ======================
export const GAME_IDS = {
  PATH_TO_VALHALLA: "path-to-valhalla",
} as const;

// ======================
// FORM VALIDATION
// ======================
export const VALIDATION = {
  MIN_MESSAGE_LENGTH: 10,
  MAX_MESSAGE_LENGTH: 5000,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,
} as const;

// ======================
// CONTACT FORM SUBJECTS
// ======================
export const CONTACT_SUBJECTS = [
  { value: "collaboration", label: "Collaboration Opportunity" },
  { value: "feedback", label: "Game Feedback" },
  { value: "technical", label: "Technical Question" },
  { value: "general", label: "General Question" },
  { value: "other", label: "Other" },
] as const;

// ======================
// BLOG POST TYPES
// ======================
export const BLOG_TYPES = {
  DEVLOG: "devlog",
  PATCH_NOTE: "patch-note",
} as const;
export const BLOG_FILTERS = {
  ALL: "all",
  DEVLOG: "devlog",
  PATCH_NOTE: "patch-note",
} as const;

// ======================
// MARKDOWN PARSING
// ======================
export const MARKDOWN_CONFIG = {
  MAX_FIRST_SECTION_LINES: 3,
  MAX_FIRST_SECTION_CHARS: 250,
} as const;

// ======================
// DATAVIEW QUERY CONFIG
// ======================
export const DATAVIEW_CONFIG = {
  QUERY_TYPES: ["TASK", "TABLE", "LIST"],
  PRIORITY_ORDER: {
    high: 0,
    medium: 1,
    low: 2,
  },
} as const;

// ======================
// UI CONFIG
// ======================
export const UI_CONFIG = {
  SCROLL_THRESHOLD: 100,
  POSTS_PER_PAGE: 5,
} as const;

// ======================
// NAVIGATION ITEMS
// ======================
export const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/games", label: "Games" },
  { href: "/blog", label: "Blog" },
  { href: "/docs", label: "Docs" },
  { href: "/community", label: "Community" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

// ======================
// RESPONSE MESSAGES
// ======================
export const MESSAGES = {
  SUCCESS: {
    FORM_SUBMITTED: "Message sent successfully!",
    EMAIL_SENT: "Email sent successfully",
  },
  ERROR: {
    RATE_LIMIT: "Too many requests. Please try again later.",
    INVALID_EMAIL: "Invalid email address",
    REQUIRED_FIELD: "This field is required",
    FORM_VALIDATION: "Please check the form for errors",
    EMAIL_SERVICE_DOWN: "Email service is not configured",
    TWITCH_API_ERROR: "Failed to fetch stream status",
    DOCS_LOAD_ERROR: "Failed to load documentation",
    BLOG_LOAD_ERROR: "Failed to load blog posts",
  },
} as const;

// ======================
// HTTP STATUS CODES
// ======================
export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// ======================
// CACHE HEADERS
// ======================
export const CACHE_CONFIG = {
  TWITCH_STATUS: "public, max-age=30",
  DOCS_TREE: "public, max-age=1800",
  BLOG_POSTS: "public, max-age=1800",
} as const;

// ======================
// CHANGE TYPES (for Patch Notes)
// ======================
export const CHANGE_TYPES = {
  FEATURE: "feature",
  BUGFIX: "bugfix",
  IMPROVEMENT: "improvement",
  BALANCE: "balance",
} as const;
export const CHANGE_TYPE_COLORS = {
  [CHANGE_TYPES.FEATURE]: "text-green-500",
  [CHANGE_TYPES.BUGFIX]: "text-red-500",
  [CHANGE_TYPES.IMPROVEMENT]: "text-blue-500",
  [CHANGE_TYPES.BALANCE]: "text-yellow-500",
} as const;
export const CHANGE_TYPE_LABELS = {
  [CHANGE_TYPES.FEATURE]: "NEW",
  [CHANGE_TYPES.BUGFIX]: "FIX",
  [CHANGE_TYPES.IMPROVEMENT]: "IMPROVED",
  [CHANGE_TYPES.BALANCE]: "BALANCE",
} as const;

// ======================
// GAME STATUS OPTIONS
// ======================
export const GAME_STATUS = {
  IN_DEVELOPMENT: "In Development",
  EARLY_ACCESS: "Early Access",
  RELEASED: "Released",
} as const;
export const STEAM_BUTTON_TEXT = {
  [GAME_STATUS.IN_DEVELOPMENT]: "Wishlist on Steam",
  [GAME_STATUS.EARLY_ACCESS]: "Get Early Access",
  [GAME_STATUS.RELEASED]: "Buy on Steam",
} as const;

// Helper function to get environment-specific base URL
export const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // Browser should use relative URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
};
