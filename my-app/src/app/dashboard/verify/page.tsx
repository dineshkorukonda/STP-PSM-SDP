import VerifyPassPanel from "@/components/VerifyPassPanel";

export default function DashboardVerifyPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Verify pass</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          For staff and demos: confirm a traveller&apos;s pass using the QR payload or token.
        </p>
      </div>
      <VerifyPassPanel />
    </div>
  );
}
