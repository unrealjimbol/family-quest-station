import BadgeShelf from "@/components/BadgeShelf";

export default function ElioBadgesPage() {
  return (
    <div
      className="min-h-screen w-full"
      style={{
        background:
          "radial-gradient(120% 80% at 0% 0%, #ffe7d3 0%, #fdf6ec 60%, #fdf6ec 100%)",
      }}
    >
      <BadgeShelf
        kidId="elio"
        kidName="Elio"
        kidEmoji="🦦"
        accentColor="#e07a5f"
      />
    </div>
  );
}
