import { Button } from "~/registry/ui/button.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/registry/ui/card.tsx";
import { Field, FieldGroup, FieldLabel } from "~/registry/ui/field.tsx";

import { Input } from "~/registry/ui/input.tsx";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "~/registry/ui/item.tsx";
import IconAlertCircle from "~icons/hugeicons/alert-circle";
import IconArrowRight01 from "~icons/hugeicons/arrow-right-01";
import IconSquareLock02 from "~icons/hugeicons/square-lock-02";

export function AccountAccess() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Access</CardTitle>
        <CardDescription>
          Update your credentials or re-authenticate.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel for="email-address">Email Address</FieldLabel>
            <Input
              id="email-address"
              type="email"
              placeholder="artist@studio.inc"
            />
          </Field>
          <Field>
            <div class="flex items-center justify-between">
              <FieldLabel for="current-password">Current Password</FieldLabel>
              <a
                href="#"
                class="font-medium text-muted-foreground text-xs uppercase tracking-wider hover:text-foreground"
              >
                Forgot?
              </a>
            </div>
            <Input
              id="current-password"
              type="password"
              placeholder="••••••••••••••••••••••••"
            />
          </Field>
        </FieldGroup>
      </CardContent>
      <CardFooter class="flex-col gap-4">
        <Button class="w-full">
          <IconSquareLock02 />
          Update Security
        </Button>
        <Item variant="muted" as="a" href="#">
          <ItemMedia variant="icon">
            <IconAlertCircle class="text-destructive" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Danger Zone</ItemTitle>
            <ItemDescription class="line-clamp-1">
              Archive account and remove catalog
            </ItemDescription>
          </ItemContent>
          <IconArrowRight01 class="size-4" />
        </Item>
      </CardFooter>
    </Card>
  );
}
