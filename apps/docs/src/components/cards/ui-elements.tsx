import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/registry/ui/alert-dialog.tsx";
import { Badge } from "~/registry/ui/badge.tsx";
import { ButtonGroup } from "~/registry/ui/button-group.tsx";

import { Button } from "~/registry/ui/button.tsx";
import { Card, CardContent } from "~/registry/ui/card.tsx";
import { Checkbox } from "~/registry/ui/checkbox.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/registry/ui/dropdown-menu.tsx";
import { Field, FieldGroup } from "~/registry/ui/field.tsx";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "~/registry/ui/input-group.tsx";
import { Label } from "~/registry/ui/label.tsx";
import {
  RadioGroup,
  RadioGroupItem,
  RadioGroupItemLabel,
} from "~/registry/ui/radio-group.tsx";
import {
  Switch,
  SwitchControl,
  SwitchLabel,
  SwitchThumb,
} from "~/registry/ui/switch.tsx";
import { Textarea } from "~/registry/ui/textarea.tsx";
import IconArrowRight02 from "~icons/hugeicons/arrow-right-02";
import IconArrowUp01 from "~icons/hugeicons/arrow-up-01";
import IconSearch01 from "~icons/hugeicons/search-01";

export function UIElements() {
  return (
    <Card class="w-full">
      <CardContent class="flex flex-col gap-6">
        <div class="flex gap-2">
          <Button>
            Button <IconArrowRight02 data-icon="inline-end" />
          </Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
        </div>
        <FieldGroup>
          <Field>
            <InputGroup>
              <InputGroupInput placeholder="Name" />
              <InputGroupAddon align="inline-end">
                <InputGroupText>
                  <IconSearch01 />
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </Field>
          <Field class="flex-1">
            <Textarea placeholder="Message" class="resize-none" />
          </Field>
        </FieldGroup>
        <div class="flex items-center gap-2">
          <div class="flex gap-2">
            <Badge>Badge</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline" class="hidden 4xl:flex">
              Outline
            </Badge>
          </div>
          <RadioGroup
            defaultValue="apple"
            class="ml-auto flex w-fit gap-3"
            aria-label="Fruit preference"
          >
            <RadioGroupItem value="apple">
              <RadioGroupItemLabel class="sr-only">Apple</RadioGroupItemLabel>
            </RadioGroupItem>
            <RadioGroupItem value="banana">
              <RadioGroupItemLabel class="sr-only">Banana</RadioGroupItemLabel>
            </RadioGroupItem>
          </RadioGroup>
          <div class="flex gap-3">
            <Checkbox id="ui-elements-email-alerts" defaultChecked />
            <Label for="ui-elements-email-alerts-input" class="sr-only">
              Enable email alerts
            </Label>
            <div class="hidden 4xl:block">
              <Checkbox id="ui-elements-push-alerts" />
              <Label for="ui-elements-push-alerts-input" class="sr-only">
                Enable push alerts
              </Label>
            </div>
          </div>
          <Switch defaultChecked class="flex 4xl:hidden">
            <SwitchControl>
              <SwitchThumb />
            </SwitchControl>
            <SwitchLabel class="sr-only">
              Enable compact notifications
            </SwitchLabel>
          </Switch>
        </div>
        <div class="flex items-center gap-4">
          <AlertDialog>
            <AlertDialogTrigger as={Button} variant="outline">
              <span class="hidden md:flex style-sera:md:hidden">
                Alert Dialog
              </span>
              <span class="flex md:hidden style-sera:md:flex">Dialog</span>
            </AlertDialogTrigger>
            <AlertDialogContent size="sm" class="theme-neutral">
              <AlertDialogHeader>
                <AlertDialogTitle>Allow accessory to connect?</AlertDialogTitle>
                <AlertDialogDescription>
                  Do you want to allow the USB accessory to connect to this
                  device and your data?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Don't allow</AlertDialogCancel>
                <AlertDialogAction>Allow</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <ButtonGroup class="ml-auto">
            <Button variant="outline">
              <span class="style-sera:hidden">Button Group</span>
              <span class="hidden style-sera:block">Group</span>
            </Button>
            <DropdownMenu placement="top-end">
              <DropdownMenuTrigger
                as={Button<"button">}
                variant="outline"
                size="icon"
                aria-label="Open quick actions"
              >
                <IconArrowUp01 />
              </DropdownMenuTrigger>
              <DropdownMenuContent class="w-40">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
                  <DropdownMenuItem>Mute Conversation</DropdownMenuItem>
                  <DropdownMenuItem>Mark as Read</DropdownMenuItem>
                  <DropdownMenuItem>Block User</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem variant="destructive">
                    Delete Conversation
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </ButtonGroup>
          <Switch defaultChecked class="hidden 4xl:flex">
            <SwitchControl>
              <SwitchThumb />
            </SwitchControl>
            <SwitchLabel class="sr-only">Enable advanced setting</SwitchLabel>
          </Switch>
        </div>
      </CardContent>
    </Card>
  );
}
