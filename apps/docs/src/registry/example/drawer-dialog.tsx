import type { ComponentProps } from "solid-js";
import { createSignal, Show } from "solid-js";

import { useMediaQuery } from "~/lib/hooks/use-media-query.ts";
import { cn } from "~/lib/utils.ts";
import { Button } from "~/registry/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/registry/ui/dialog.tsx";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/registry/ui/drawer.tsx";
import { Input } from "~/registry/ui/input.tsx";
import { Label } from "~/registry/ui/label.tsx";

export default function DrawerDialogDemo() {
  const [open, setOpen] = createSignal(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <Show
      when={isDesktop()}
      fallback={
        <Drawer open={open()} onOpenChange={setOpen}>
          <DrawerTrigger as={Button<"button">} variant="outline">
            Edit Profile
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader class="text-left">
              <DrawerTitle>Edit profile</DrawerTitle>
              <DrawerDescription>
                Make changes to your profile here. Click save when you're done.
              </DrawerDescription>
            </DrawerHeader>
            <ProfileForm class="px-4" />
            <DrawerFooter class="pt-2">
              <DrawerClose as={Button<"button">} variant="outline">
                Cancel
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      }
    >
      <Dialog open={open()} onOpenChange={setOpen}>
        <DialogTrigger as={Button} variant="outline">
          Edit Profile
        </DialogTrigger>
        <DialogContent class="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <ProfileForm />
        </DialogContent>
      </Dialog>
    </Show>
  );
}

function ProfileForm(props: ComponentProps<"form">) {
  return (
    <form class={cn("grid items-start gap-6", props.class)}>
      <div class="grid gap-3">
        <Label for="email">Email</Label>
        <Input type="email" id="email" value="shadcn@example.com" />
      </div>
      <div class="grid gap-3">
        <Label for="username">Username</Label>
        <Input id="username" value="@shadcn" />
      </div>
      <Button type="submit">Save changes</Button>
    </form>
  );
}
