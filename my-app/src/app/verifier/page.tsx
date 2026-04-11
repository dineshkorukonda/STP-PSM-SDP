import { redirect } from "next/navigation";

/** Short alias for the public verifier at `/verify`. */
export default function VerifierAliasPage() {
  redirect("/verify");
}
