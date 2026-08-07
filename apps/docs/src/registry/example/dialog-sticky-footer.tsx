import { Index } from "solid-js";
import { Button } from "~/registry/ui/button.tsx";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/registry/ui/dialog.tsx";

export default function DialogStickyFooter() {
  return (
    <Dialog>
      <DialogTrigger as={Button} variant="outline">
        Sticky Footer
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sticky Footer</DialogTitle>
          <DialogDescription>
            This dialog has a sticky footer that stays visible while the content
            scrolls.
          </DialogDescription>
        </DialogHeader>
        <div class="no-scrollbar -mx-4 max-h-[50vh] overflow-y-auto px-4">
          <Index each={Array.from({ length: 10 })}>
            {() => (
              <p class="mb-4 leading-normal">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            )}
          </Index>
        </div>
        <DialogFooter>
          <DialogClose as={Button} variant="outline">
            Close
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
