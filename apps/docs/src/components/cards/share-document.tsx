import { Avatar, AvatarFallback, AvatarImage } from "~/registry/ui/avatar.tsx";
import { Button } from "~/registry/ui/button.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/registry/ui/card.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/registry/ui/select.tsx";
import { Separator } from "~/registry/ui/separator.tsx";
import { Input } from "~/registry/ui/input.tsx";

export function ShareDocument() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Share this document</CardTitle>
        <CardDescription>
          Anyone with the link can view this document.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="flex space-x-2">
          <Input value="http://example.com/link/to/document" readonly />
          <Button variant="secondary" class="shrink-0">
            Copy Link
          </Button>
        </div>
        <Separator class="my-4" />
        <div class="space-y-4">
          <h4 class="text-sm font-medium">People with access</h4>
          <div class="grid gap-6">
            <div class="flex items-center justify-between space-x-4">
              <div class="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src="/avatars/03.png" />
                  <AvatarFallback>OM</AvatarFallback>
                </Avatar>
                <div>
                  <p class="text-sm font-medium leading-none">Olivia Martin</p>
                  <p class="text-sm text-muted-foreground">m@example.com</p>
                </div>
              </div>
              <Select
                defaultValue="Can edit"
                options={["Can edit", "Can view"]}
                placeholder="Select"
                itemComponent={(props) => (
                  <SelectItem item={props.item}>
                    {props.item.rawValue}
                  </SelectItem>
                )}
              >
                <SelectTrigger class="ml-auto w-[110px]">
                  <SelectValue<string>>
                    {(state) => state.selectedOption()}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent />
              </Select>
            </div>
            <div class="flex items-center justify-between space-x-4">
              <div class="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src="/avatars/05.png" />
                  <AvatarFallback>IN</AvatarFallback>
                </Avatar>
                <div>
                  <p class="text-sm font-medium leading-none">
                    Isabella Nguyen
                  </p>
                  <p class="text-sm text-muted-foreground">b@example.com</p>
                </div>
              </div>
              <Select
                defaultValue="Can view"
                options={["Can edit", "Can view"]}
                placeholder="Select"
                itemComponent={(props) => (
                  <SelectItem item={props.item}>
                    {props.item.rawValue}
                  </SelectItem>
                )}
              >
                <SelectTrigger class="ml-auto w-[110px]">
                  <SelectValue<string>>
                    {(state) => state.selectedOption()}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent />
              </Select>
            </div>
            <div class="flex items-center justify-between space-x-4">
              <div class="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src="/avatars/01.png" />
                  <AvatarFallback>SD</AvatarFallback>
                </Avatar>
                <div>
                  <p class="text-sm font-medium leading-none">Sofia Davis</p>
                  <p class="text-sm text-muted-foreground">p@example.com</p>
                </div>
              </div>
              <Select
                defaultValue="Can view"
                options={["Can edit", "Can view"]}
                placeholder="Select"
                itemComponent={(props) => (
                  <SelectItem item={props.item}>
                    {props.item.rawValue}
                  </SelectItem>
                )}
              >
                <SelectTrigger class="ml-auto w-[110px]">
                  <SelectValue<string>>
                    {(state) => state.selectedOption()}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent />
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
