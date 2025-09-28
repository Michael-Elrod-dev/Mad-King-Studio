// lib/utils/index.ts
// Date utilities
export { formatDate } from './date';

// Markdown utilities
export { getFirstSection,
  getRemainingContent,
  getCompleteFirstSection,
} from './markdownParser';

// Validation utilities
export { validateEmail,
  validateContactForm,
} from './validation';

// Patch note utilities
export { getChangeTypeColor,
  getChangeTypeLabel,
} from './patchNotes';
export type { ChangeType } from './patchNotes';

// GitHub content processing utilities
export { 
  extractDateFromContent, 
  removeMetadataFromContent, 
  extractDayNumberFromContent,
  extractAssetsFromContent, 
  getMediaType, 
} from './content';
