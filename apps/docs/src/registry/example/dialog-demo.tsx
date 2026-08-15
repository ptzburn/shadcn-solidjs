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
import { Field, FieldGroup } from "~/registry/ui/field.tsx";
import { Input } from "~/registry/ui/input.tsx";
import { Label } from "~/registry/ui/label.tsx";

export default function DialogDemo() {
  return (
    <Dialog>
      <form>
        <DialogTrigger as={Button} variant="outline">
          Open Dialog
        </DialogTrigger>
        <DialogContent class="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label for="name-1">Name</Label>
              <Input id="name-1" name="name" value="Pedro Duarte" />
            </Field>
            <Field>
              <Label for="username-1">Username</Label>
              <Input id="username-1" name="username" value="@peduarte" />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose as={Button} variant="outline">
              Cancel
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
