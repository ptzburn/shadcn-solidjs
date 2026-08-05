import { createSignal } from "solid-js";
import { Dynamic } from "solid-js/web";

import { cn } from "~/lib/utils.ts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/registry/ui/select.tsx";

import { type Account, accounts } from "./data.tsx";

interface AccountSwitcherProps {
  isCollapsed: boolean;
}

export function AccountSwitcher(props: AccountSwitcherProps) {
  const [selectedAccount, setSelectedAccount] = createSignal(accounts[0]);

  return (
    <Select
      value={selectedAccount()}
      onChange={setSelectedAccount}
      options={accounts}
      optionValue="email"
      optionTextValue="label"
      placeholder="Select an account"
      placement="bottom-start"
      disallowEmptySelection
      itemComponent={(props) => (
        <SelectItem item={props.item}>
          <div class="flex items-center gap-3 [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-foreground">
            <Dynamic component={props.item.rawValue.icon} />
            {props.item.rawValue.email}
          </div>
        </SelectItem>
      )}
      class={cn("flex h-[56px] items-center justify-center px-2")}
    >
      <SelectTrigger
        class={cn(
          "flex items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:size-4 [&_svg]:shrink-0",
          props.isCollapsed &&
            "flex size-9 shrink-0 items-center justify-center p-0 [&>span]:w-auto [&>svg]:hidden",
        )}
        aria-label="Select account"
      >
        <SelectValue<Account>>
          {(state) => (
            <>
              <Dynamic component={state.selectedOption().icon} />
              <div class={cn("ml-2", props.isCollapsed && "hidden")}>
                {state.selectedOption().label}
              </div>
            </>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent />
    </Select>
  );
}
