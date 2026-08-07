import {
  Resizable,
  ResizableHandle,
  ResizablePanel,
} from "~/registry/ui/resizable.tsx";

export default function ResizableVertical() {
  return (
    <Resizable
      orientation="vertical"
      class="h-[200px] max-w-sm rounded-lg border"
    >
      <ResizablePanel initialSize={0.25}>
        <div class="flex h-full items-center justify-center p-6">
          <span class="font-semibold">Header</span>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel initialSize={0.75}>
        <div class="flex h-full items-center justify-center p-6">
          <span class="font-semibold">Content</span>
        </div>
      </ResizablePanel>
    </Resizable>
  );
}
