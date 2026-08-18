import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/registry/ui/breadcrumb.tsx";
import { Button } from "~/registry/ui/button.tsx";
import { Card, CardContent, CardHeader } from "~/registry/ui/card.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/registry/ui/dropdown-menu.tsx";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "~/registry/ui/item.tsx";

import IconArrowRight01 from "~icons/hugeicons/arrow-right-01";
import IconCalendar03 from "~icons/hugeicons/calendar-03";
import IconMoreHorizontalCircle01 from "~icons/hugeicons/more-horizontal-circle-01";
import IconRefresh from "~icons/hugeicons/refresh";
import IconSettings01 from "~icons/hugeicons/settings-01";

export function Payments() {
  return (
    <Card>
      <CardHeader class="flex flex-col gap-3">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <DropdownMenu placement="bottom-start">
                <DropdownMenuTrigger
                  as={Button<"button">}
                  size="icon-sm"
                  variant="ghost"
                  aria-label="Account options"
                >
                  <IconMoreHorizontalCircle01 />
                  <span class="sr-only">Account options</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuGroup>
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Statements</DropdownMenuItem>
                    <DropdownMenuItem>Documents</DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Payments</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </CardHeader>
      <CardContent>
        <ItemGroup>
          <div role="listitem" class="w-full">
            <Item variant="muted" as="a" href="#">
              <ItemMedia variant="icon">
                <IconSettings01 />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Change transfer limit</ItemTitle>
                <ItemDescription>
                  Adjust how much you can send from your balance.
                </ItemDescription>
              </ItemContent>
              <IconArrowRight01 class="size-4 shrink-0 text-muted-foreground" />
            </Item>
          </div>
          <div role="listitem" class="w-full">
            <Item variant="muted" as="a" href="#">
              <ItemMedia variant="icon">
                <IconCalendar03 />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Scheduled transfers</ItemTitle>
                <ItemDescription>
                  Set up a transfer to send at a later date.
                </ItemDescription>
              </ItemContent>
              <IconArrowRight01 class="size-4 shrink-0 text-muted-foreground" />
            </Item>
          </div>
          <div role="listitem" class="w-full">
            <Item variant="muted" as="a" href="#">
              <ItemMedia variant="icon">
                <IconRefresh />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Recurring card payments</ItemTitle>
                <ItemDescription>
                  Manage your repeated card transactions.
                </ItemDescription>
              </ItemContent>
              <IconArrowRight01 class="size-4 shrink-0 text-muted-foreground" />
            </Item>
          </div>
        </ItemGroup>
      </CardContent>
    </Card>
  );
}
