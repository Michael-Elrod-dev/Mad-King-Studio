// app/utils/date.ts
export function formatDate(dateString: string): string {
  const [year, month, day] = dateString.split("-");
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long", 
    day: "numeric",
  });
}
