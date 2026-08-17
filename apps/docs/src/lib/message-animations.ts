// Entrance presets for MessageAnimated. Upstream drives these with motion
// variants; here each preset is a tw-animate-css class set applied to the user
// row on mount (assistant rows never animate). motion-reduce disables them.
const ANIMATIONS = [
  { id: "fade", name: "Fade", class: "animate-in fade-in duration-200" },
  {
    id: "slide-up",
    name: "Slide Up",
    class:
      "animate-in fade-in slide-in-from-bottom-2 duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
  },
  {
    id: "slide-side",
    name: "Slide Side",
    class:
      "animate-in fade-in slide-in-from-right-4 duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
  },
  {
    id: "pop",
    name: "Pop",
    class:
      "animate-in fade-in zoom-in-95 slide-in-from-bottom-1 duration-300 ease-out origin-bottom-right",
  },
  {
    id: "spring-bounce",
    name: "Spring Bounce",
    class:
      "animate-in fade-in zoom-in-95 slide-in-from-bottom-3 duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
  },
  {
    id: "blur-fade",
    name: "Blur Fade",
    class:
      "animate-in fade-in blur-in-4 slide-in-from-bottom-1 duration-300 ease-out",
  },
  {
    id: "scale-fade",
    name: "Scale Fade",
    class: "animate-in fade-in zoom-in-[0.98] duration-250 ease-out",
  },
] as const satisfies readonly { id: string; name: string; class: string }[];

type MessageAnimationPreset = (typeof ANIMATIONS)[number];
type MessageAnimationId = MessageAnimationPreset["id"];

const MESSAGE_ANIMATIONS = ANIMATIONS.reduce(
  (acc, preset) => {
    acc[preset.id] = preset;
    return acc;
  },
  {} as Record<MessageAnimationId, MessageAnimationPreset>,
);

export { MESSAGE_ANIMATIONS };
export type { MessageAnimationId, MessageAnimationPreset };
