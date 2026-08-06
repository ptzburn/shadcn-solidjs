import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/registry/ui/breadcrumb.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/registry/ui/dropdown-menu.tsx";
import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";

export default function BreadcrumbDropdown() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <IconPlaceholder
            lucide="dot"
            tabler="point-filled"
            ph="dot"
            ri="circle-fill"
            hugeicons="record"
          />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <DropdownMenu placement="bottom-start">
            <DropdownMenuTrigger class="flex items-center gap-1">
              Components
              <IconPlaceholder
                lucide="chevron-down"
                tabler="chevron-down"
                ph="caret-down"
                ri="arrow-down-s-line"
                hugeicons="arrow-down-01"
                class="size-3.5"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuItem>Documentation</DropdownMenuItem>
                <DropdownMenuItem>Themes</DropdownMenuItem>
                <DropdownMenuItem>GitHub</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <IconPlaceholder
            lucide="dot"
            tabler="point-filled"
            ph="dot"
            ri="circle-fill"
            hugeicons="record"
          />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
