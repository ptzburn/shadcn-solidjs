import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import { Tabs, TabsList, TabsTrigger } from "~/registry/ui/tabs.tsx";

export default function TabsIcons() {
  return (
    <Tabs defaultValue="preview">
      <TabsList>
        <TabsTrigger value="preview">
          <IconPlaceholder
            lucide="app-window"
            tabler="app-window"
            ph="app-window"
            ri="window-line"
            hugeicons="browser"
          />
          Preview
        </TabsTrigger>
        <TabsTrigger value="code">
          <IconPlaceholder
            lucide="code"
            tabler="code"
            ph="code"
            ri="code-line"
            hugeicons="source-code"
          />
          Code
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
