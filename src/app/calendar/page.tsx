import CalendarClient from "./calendar-client";

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{
    post?: string | string[];
    targets?: string | string[];
    group?: string | string[];
  }>;
}) {
  const { post, targets, group } = await searchParams;
  const postId=Array.isArray(post)?post[0]??"":post??"";
  const targetValue=Array.isArray(targets)?targets[0]??"":targets??"";
  const groupId=Array.isArray(group)?group[0]??"":group??"";

  return (
    <CalendarClient
      initialDate={new Date().toISOString()}
      postId={postId}
      initialTargets={targetValue}
      groupId={groupId}
    />
  );
}
