import {
  Bubble,
  BubbleContent,
  BubbleReactions,
} from "~/registry/ui/bubble.tsx";

export default function BubbleVariantsDemo() {
  return (
    <div class="flex w-full max-w-sm flex-col gap-12 py-12">
      <Bubble>
        <BubbleContent>This is the default primary bubble.</BubbleContent>
      </Bubble>
      <Bubble variant="secondary" align="end">
        <BubbleContent>This is the secondary variant.</BubbleContent>
      </Bubble>
      <Bubble variant="muted">
        <BubbleContent>
          This one is muted. It uses a lower emphasis color for the chat bubble.
        </BubbleContent>
        <BubbleReactions role="img" aria-label="Reaction: thumbs up">
          <span>👍</span>
        </BubbleReactions>
      </Bubble>
      <Bubble variant="tinted" align="end">
        <BubbleContent>
          This one is tinted. The tint is a softer color derived from the
          primary color.
        </BubbleContent>
      </Bubble>
      <Bubble variant="outline">
        <BubbleContent>We can also use an outlined variant.</BubbleContent>
      </Bubble>
      <Bubble variant="destructive" align="end">
        <BubbleContent>
          Or a destructive variant with a reaction.
        </BubbleContent>
        <BubbleReactions role="img" aria-label="Reaction: fire">
          <span>🔥</span>
        </BubbleReactions>
      </Bubble>
      <Bubble variant="ghost">
        <BubbleContent class="flex flex-col gap-4">
          <p>
            Ghost bubbles work for assistant text, rich content, and anything
            else that should not be framed.
          </p>
          <p>
            This is perfect for assistant messages that should not have a frame
            and can take the full width of the container. You can also render
            {" "}
            <code class="rounded bg-muted px-1 py-0.5 font-mono text-xs">
              code
            </code>{" "}
            in it.
          </p>
        </BubbleContent>
      </Bubble>
    </div>
  );
}
