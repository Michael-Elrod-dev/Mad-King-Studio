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
  removeMetadataFromContent,
  extractDayNumberFromContent,
  extractAssetsFromContent,
  getMediaType,
  extractAndRemoveAssetsSection,
} from "./parsers/content";

// Dataview utilities
export {
  extractDataviewBlocks,
  parseDataviewQuery,
  parseTasksFromMarkdown,
  filterTasks,
  sortTasks,
  executeDataviewQuery,
  groupTasksByDocument,
  executeTableQuery,
  evaluateTableField,
} from "./parsers/dataview";
export type {
  DataviewQuery,
  ParsedTask,
  DocumentWithTasks,
  TableField,
} from "./parsers/dataview";
