export type ChangeType = "feature" | "bugfix" | "improvement" | "balance";

export function getChangeTypeColor(type: string): string {
  switch (type) {
    case "feature": return "text-green-400";
    case "bugfix": return "text-red-400";
    case "improvement": return "text-blue-400";
    case "balance": return "text-yellow-400";
    default: return "text-white/90";
  }
}

export function getChangeTypeLabel(type: string): string {
  switch (type) {
    case "feature": return "NEW";
    case "bugfix": return "FIX";
    case "improvement": return "IMPROVED";
    case "balance": return "BALANCE";
    default: return type.toUpperCase();
  }
}
