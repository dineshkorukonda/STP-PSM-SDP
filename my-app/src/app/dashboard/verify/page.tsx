import Link from "next/link";
import VerifyPassPanel from "@/components/VerifyPassPanel";

export default function DashboardVerifyPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Verify pass</h1>
        <p className="mt-2 max-w-2xl text-neutral-500">
          For staff and demos: confirm a traveller&apos;s pass using a link, QR data, or token.
          The same tool lives on the public page{" "}
          <Link
            href="/verify"
            className="font-medium text-[#6B46FE] underline-offset-4 hover:underline"
          >
            /verify
          </Link>{" "}
          (no login required).
        </p>
      </div>
      <VerifyPassPanel />
    </div>
  );
}
