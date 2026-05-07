import BadgeShelf from "@/components/BadgeShelf";

export default function EmiliaBadgesPage() {
  return (
    <div
      className="min-h-screen w-full"
      style={{
        background:
          "radial-gradient(120% 80% at 100% 0%, #fbe1ea 0%, #fdf6ec 60%, #fdf6ec 100%)",
      }}
    >
      <BadgeShelf
        kidId="emilia"
        kidName="Emilia"
        kidEmoji="🦄"
        accentColor="#d68fa5"
      />
    </div>
  );
}
