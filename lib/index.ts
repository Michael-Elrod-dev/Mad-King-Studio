// lib/utils/index.ts
// Date utilities
export { formatDate } from "./utils/date";

// Markdown utilities
export {
  getFirstSection,
  getRemainingContent,
  getCompleteFirstSection,
} from "./parsers/markdown";

// Validation utilities
export { validateEmail, validateContactForm } from "./utils/validation";

// Patch note utilities
export { getChangeTypeColor, getChangeTypeLabel } from "./utils/patchNotes";
export type { ChangeType } from "./utils/patchNotes";

// GitHub content processing utilities
export {
  extractDateFromContent,
  extractDayNumberFromContent,
  extractAssetsFromContent,
  getMediaType,
  extractAndRemoveAssetsSection,
} from "./parsers/content";
