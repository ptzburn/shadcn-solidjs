import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/registry/ui/input-group.tsx";

export default function InputGroupIcon() {
  return (
    <div class="grid w-full max-w-sm gap-6">
      <InputGroup>
        <InputGroupInput placeholder="Search..." />
        <InputGroupAddon>
          <IconPlaceholder
            lucide="search"
            tabler="search"
            ph="magnifying-glass"
            ri="search-line"
            hugeicons="search-01"
          />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput type="email" placeholder="Enter your email" />
        <InputGroupAddon>
          <IconPlaceholder
            lucide="mail"
            tabler="mail"
            ph="envelope"
            ri="mail-line"
            hugeicons="mail-01"
          />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="Card number" />
        <InputGroupAddon>
          <IconPlaceholder
            lucide="credit-card"
            tabler="credit-card"
            ph="credit-card"
            ri="bank-card-line"
            hugeicons="credit-card"
          />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <IconPlaceholder
            lucide="check"
            tabler="check"
            ph="check"
            ri="check-line"
            hugeicons="tick-02"
          />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="Card number" />
        <InputGroupAddon align="inline-end">
          <IconPlaceholder
            lucide="star"
            tabler="star"
            ph="star"
            ri="star-line"
            hugeicons="star"
          />
          <IconPlaceholder
            lucide="info"
            tabler="info-circle"
            ph="info"
            ri="information-line"
            hugeicons="information-circle"
          />
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
