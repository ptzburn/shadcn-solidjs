import { Button } from "~/registry/ui/button.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/registry/ui/popover.tsx";

export default function PopoverDemo() {
  return (
    <Popover>
      <PopoverTrigger as={Button<"button">}>trigger me</PopoverTrigger>
      <PopoverContent>
        A UI toolkit for building accessible web apps and design systems with
        SolidJS.
      </PopoverContent>
    </Popover>
  );
}
