import KidView from "@/components/KidView";
import { elioQuests } from "@/data/quests";

export default function ElioPage() {
  return (
    <div
      className="min-h-screen w-full px-6 py-6 md:px-10 md:py-10"
      style={{
        background:
          "radial-gradient(120% 80% at 0% 0%, #ffe7d3 0%, #fdf6ec 60%, #fdf6ec 100%)",
      }}
    >
      <div className="mx-auto w-full max-w-6xl pb-24">
        <KidView
          kidId="elio"
          kidName="Elio"
          kidEmoji="🦊"
          quests={elioQuests}
          accent={{
            tile: "bg-[#fde4cf] text-[#e07a5f]",
            ring: "ring-[#e07a5f]/30",
            chip: "bg-[#e07a5f] text-white",
          }}
          progressColor="#e07a5f"
        />
      </div>
    </div>
  );
}
