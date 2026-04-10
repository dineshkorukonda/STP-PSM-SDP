import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const { error } = await searchParams;
  const q = new URLSearchParams({ mode: "login" });
  if (error === "auth") q.set("error", "auth");
  redirect(`/auth?${q.toString()}`);
}
