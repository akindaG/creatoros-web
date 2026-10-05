import CalendarClient from "./calendar-client";

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ post?: string | string[]; targets?: string | string[] }>;
}) {
  const { post, targets } = await searchParams;
  const postId=Array.isArray(post)?post[0]??"":post??"";
  const targetValue=Array.isArray(targets)?targets[0]??"":targets??"";
  return (
    <CalendarClient
      initialDate={new Date().toISOString()}
      postId={postId}
      initialTargets={targetValue}
    />
  );
}
