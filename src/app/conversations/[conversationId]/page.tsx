"use client";

export default function Page({
  params: { conversationId },
}: {
  params: { conversationId: string };
}) {
  return <p>Post: {conversationId}</p>;
}
