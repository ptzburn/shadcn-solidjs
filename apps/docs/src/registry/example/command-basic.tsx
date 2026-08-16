import { Command } from "~/registry/ui/command.tsx";

export default function CommandBasic() {
  return (
    <Command
      class="max-w-sm rounded-lg border"
      options={[
        {
          heading: "Suggestions",
          options: [
            { value: "calendar", label: "Calendar" },
            { value: "search-emoji", label: "Search Emoji" },
            { value: "calculator", label: "Calculator" },
          ],
        },
      ]}
    />
  );
}
