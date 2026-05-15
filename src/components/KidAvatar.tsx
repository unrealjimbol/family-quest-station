/**
 * Renders a kid's avatar — custom images for Elio (sea monster)
 * and Emilia (capybara), emoji spans for everyone else.
 */

/** Map emoji → custom image path */
const CUSTOM_AVATARS: Record<string, { src: string; alt: string }> = {
  "🦦": { src: "/sea-monster.png", alt: "Sea Eater Monster" },
  "🦫": { src: "/capybara.png", alt: "Capybara" },
};

type Props = {
  emoji: string;
  /** Tailwind text-size class or inline style will control size */
  className?: string;
  size?: number;
};

export default function KidAvatar({ emoji, className = "text-7xl", size }: Props) {
  const custom = CUSTOM_AVATARS[emoji];
  if (custom) {
    const px = size ?? sizeFromClass(className);
    return (
      <img
        src={custom.src}
        alt={custom.alt}
        style={{
          width: px,
          height: px,
          display: "inline-block",
          objectFit: "contain",
          borderRadius: "20%",
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <span className={className} aria-hidden="true" style={size ? { fontSize: size } : undefined}>
      {emoji}
    </span>
  );
}

/** Map common Tailwind text-size classes to pixel values */
function sizeFromClass(cls: string): number {
  if (cls.includes("text-8xl")) return 96;
  if (cls.includes("text-7xl")) return 72;
  if (cls.includes("text-6xl")) return 60;
  if (cls.includes("text-5xl")) return 48;
  if (cls.includes("text-4xl")) return 36;
  if (cls.includes("text-3xl")) return 30;
  if (cls.includes("text-2xl")) return 24;
  if (cls.includes("text-xl")) return 20;
  return 72; // default
}
