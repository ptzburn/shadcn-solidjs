import {
  Resizable,
  ResizableHandle,
  ResizablePanel,
} from "~/registry/ui/resizable.tsx";

export default function ResizableHandleDemo() {
  return (
    <Resizable
      orientation="horizontal"
      class="min-h-[200px] max-w-md rounded-lg border md:min-w-[450px]"
    >
      <ResizablePanel initialSize={0.25}>
        <div class="flex h-full items-center justify-center p-6">
          <span class="font-semibold">Sidebar</span>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel initialSize={0.75}>
        <div class="flex h-full items-center justify-center p-6">
          <span class="font-semibold">Content</span>
        </div>
      </ResizablePanel>
    </Resizable>
  );
}
