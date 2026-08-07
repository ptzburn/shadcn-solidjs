import {
  Resizable,
  ResizableHandle,
  ResizablePanel,
} from "~/registry/ui/resizable.tsx";

export default function ResizableDemo() {
  return (
    <Resizable orientation="horizontal" class="max-w-sm rounded-lg border">
      <ResizablePanel initialSize={0.5}>
        <div class="flex h-[200px] items-center justify-center p-6">
          <span class="font-semibold">One</span>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel initialSize={0.5}>
        <Resizable orientation="vertical">
          <ResizablePanel initialSize={0.25}>
            <div class="flex h-full items-center justify-center p-6">
              <span class="font-semibold">Two</span>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel initialSize={0.75}>
            <div class="flex h-full items-center justify-center p-6">
              <span class="font-semibold">Three</span>
            </div>
          </ResizablePanel>
        </Resizable>
      </ResizablePanel>
    </Resizable>
  );
}
