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
import { Input } from "~/registry/ui/input.tsx";
import { Label } from "~/registry/ui/label.tsx";

export default function DialogCloseButton() {
  return (
    <Dialog>
      <DialogTrigger as={Button} variant="outline">
        Share
      </DialogTrigger>
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
          <DialogDescription>
            Anyone who has this link will be able to view this.
          </DialogDescription>
        </DialogHeader>
        <div class="flex items-center gap-2">
          <div class="grid flex-1 gap-2">
            <Label for="link" class="sr-only">
              Link
            </Label>
            <Input
              id="link"
              value="https://ui.shadcn.com/docs/installation"
              readonly
            />
          </div>
        </div>
        <DialogFooter class="sm:justify-start">
          <DialogClose as={Button} type="button">
            Close
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
