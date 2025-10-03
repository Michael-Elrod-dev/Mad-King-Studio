// app/docs/page.tsx
"use client";

import { redirect } from "next/navigation";
import { DOCS_CONFIG } from "@/lib/data/docs";

export default function DocsPage() {
  redirect(`/docs/${DOCS_CONFIG.DEFAULT_DOC}`);
}
