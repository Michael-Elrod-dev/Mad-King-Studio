// lib/utils/patchNotes.ts
import { CHANGE_TYPE_COLORS, CHANGE_TYPE_LABELS } from "../data/constants";

export type ChangeType = "feature" | "bugfix" | "improvement" | "balance";

export function getChangeTypeColor(type: string): string {
  return CHANGE_TYPE_COLORS[type as ChangeType] || "text-white/90";
}

export function getChangeTypeLabel(type: string): string {
  return CHANGE_TYPE_LABELS[type as ChangeType] || type.toUpperCase();
}
