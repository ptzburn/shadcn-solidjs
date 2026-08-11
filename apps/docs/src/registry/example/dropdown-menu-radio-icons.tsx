import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";

import { Button } from "~/registry/ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "~/registry/ui/dropdown-menu.tsx";
import { createSignal } from "solid-js";

export default function DropdownMenuRadioIcons() {
  const [paymentMethod, setPaymentMethod] = createSignal("card");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger as={Button<"button">} variant="outline">
        Payment Method
      </DropdownMenuTrigger>
      <DropdownMenuContent class="min-w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Select Payment Method</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={paymentMethod()}
            onChange={setPaymentMethod}
          >
            <DropdownMenuRadioItem value="card">
              <IconPlaceholder
                lucide="credit-card"
                tabler="credit-card"
                ph="credit-card"
                ri="bank-card-line"
                hugeicons="credit-card"
              />
              Credit Card
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="paypal">
              <IconPlaceholder
                lucide="wallet"
                tabler="wallet"
                ph="wallet"
                ri="wallet-line"
                hugeicons="wallet-01"
              />
              PayPal
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="bank">
              <IconPlaceholder
                lucide="building-2"
                tabler="building"
                ph="buildings"
                ri="building-line"
                hugeicons="building-03"
              />
              Bank Transfer
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
