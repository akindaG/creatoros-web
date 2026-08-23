import CalendarClient from "./calendar-client";

export default async function CalendarPage({ searchParams }: { searchParams: Promise<{ post?: string | string[] }> }) {
  const { post } = await searchParams;
  return <CalendarClient initialDate={new Date().toISOString()} postId={Array.isArray(post) ? post[0] ?? "" : post ?? ""} />;
}
