import { Button } from "~/registry/ui/button.tsx";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/registry/ui/hover-card.tsx";

export default function HoverCardDemo() {
  return (
    <HoverCard openDelay={10} closeDelay={100}>
      <HoverCardTrigger as={Button<"button">} variant="link">
        Hover Here
      </HoverCardTrigger>
      <HoverCardContent class="flex w-64 flex-col gap-0.5">
        <div class="font-semibold">@solidstart</div>
        <div>The Solid Framework – created and maintained by @solid_js.</div>
        <div class="mt-1 text-muted-foreground text-xs">
          Joined November 2022
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
