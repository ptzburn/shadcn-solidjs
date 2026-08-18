import { useColorMode } from "~/lib/color-mode.tsx";

import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import { Button } from "~/registry/ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/registry/ui/dropdown-menu.tsx";

export default function ModeToggle() {
  const { setColorMode } = useColorMode();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        as={Button<"button">}
        variant="ghost"
        size="sm"
        class="w-9 px-0"
      >
        <IconPlaceholder
          lucide="sun"
          tabler="sun"
          ph="sun"
          ri="sun-line"
          hugeicons="sun-03"
          class="size-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
        />
        <IconPlaceholder
          lucide="moon"
          tabler="moon"
          ph="moon"
          ri="moon-line"
          hugeicons="moon-02"
          class="absolute size-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
        />
        <span class="sr-only">Toggle theme</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={() => setColorMode("light")}>
          <IconPlaceholder
            lucide="sun"
            tabler="sun"
            ph="sun"
            ri="sun-line"
            hugeicons="sun-03"
            class="mr-2 size-4"
          />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setColorMode("dark")}>
          <IconPlaceholder
            lucide="moon"
            tabler="moon"
            ph="moon"
            ri="moon-line"
            hugeicons="moon-02"
            class="mr-2 size-4"
          />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setColorMode("system")}>
          <IconPlaceholder
            lucide="laptop"
            tabler="device-laptop"
            ph="laptop"
            ri="computer-line"
            hugeicons="laptop"
            class="mr-2 size-4"
          />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
