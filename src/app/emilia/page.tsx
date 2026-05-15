import KidView from "@/components/KidView";
import { emiliaQuests } from "@/data/quests";

export default function EmiliaPage() {
  return (
    <div
      className="min-h-screen w-full px-6 py-6 md:px-10 md:py-10"
      style={{
        background:
          "radial-gradient(120% 80% at 100% 0%, #fbe1ea 0%, #fdf6ec 60%, #fdf6ec 100%)",
      }}
    >
      <div className="mx-auto w-full max-w-6xl pb-24">
        <KidView
          kidId="emilia"
          kidName="Emilia"
          kidEmoji="🦫"
          quests={emiliaQuests}
          accent={{
            tile: "bg-[#f7d6e0] text-[#d68fa5]",
            ring: "ring-[#d68fa5]/30",
            chip: "bg-[#d68fa5] text-white",
          }}
          progressColor="#d68fa5"
        />
      </div>
    </div>
  );
}
