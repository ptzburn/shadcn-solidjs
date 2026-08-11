type NavElement = {
  title: string;
  href: string;
  external?: boolean;
};

type NavSection = {
  title: string;
  href: string;
  // Marks the section active for every pathname under this prefix; defaults to href.
  prefix?: string;
};

type NavCategory = {
  title: string;
  items: NavElement[];
};

type Config = {
  mainNav: NavElement[];
  sectionsNav: NavSection[];
  sidebarNav: NavCategory[];
};

export const COMPONENTS_INDEX = "/docs/components";

export const docsConfig: Config = {
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Docs",
      href: "/docs/introduction",
    },
    {
      title: "Components",
      href: "/docs/components",
    },
  ],
  sectionsNav: [
    {
      title: "Introduction",
      href: "/docs/introduction",
    },
    {
      title: "Components",
      href: "/docs/components",
      prefix: "/docs/components",
    },
    {
      title: "Installation",
      href: "/docs/installation",
      prefix: "/docs/installation",
    },
    {
      title: "CLI",
      href: "/docs/cli",
    },
  ],
  sidebarNav: [
    {
      title: "Components",
      items: [
        {
          title: "Accordion",
          href: "/docs/components/accordion",
        },
        {
          title: "Alert",
          href: "/docs/components/alert",
        },
        {
          title: "Alert Dialog",
          href: "/docs/components/alert-dialog",
        },
        {
          title: "Aspect Ratio",
          href: "/docs/components/aspect-ratio",
        },
        {
          title: "Attachment",
          href: "/docs/components/attachment",
        },
        {
          title: "Avatar",
          href: "/docs/components/avatar",
        },
        {
          title: "Badge",
          href: "/docs/components/badge",
        },
        {
          title: "Breadcrumb",
          href: "/docs/components/breadcrumb",
        },
        {
          title: "Bubble",
          href: "/docs/components/bubble",
        },
        {
          title: "Button",
          href: "/docs/components/button",
        },
        {
          title: "Button Group",
          href: "/docs/components/button-group",
        },
        {
          title: "Card",
          href: "/docs/components/card",
        },
        {
          title: "Carousel",
          href: "/docs/components/carousel",
        },
        {
          title: "Charts",
          href: "/docs/components/charts",
        },
        {
          title: "Checkbox",
          href: "/docs/components/checkbox",
        },
        {
          title: "Collapsible",
          href: "/docs/components/collapsible",
        },
        {
          title: "Combobox",
          href: "/docs/components/combobox",
        },
        {
          title: "Command",
          href: "/docs/components/command",
        },
        {
          title: "Context Menu",
          href: "/docs/components/context-menu",
        },
        {
          title: "Data Table",
          href: "/docs/components/data-table",
        },
        {
          title: "Date Picker",
          href: "/docs/components/date-picker",
        },
        {
          title: "Dialog",
          href: "/docs/components/dialog",
        },
        {
          title: "Drawer",
          href: "/docs/components/drawer",
        },
        {
          title: "Dropdown Menu",
          href: "/docs/components/dropdown-menu",
        },
        {
          title: "Empty",
          href: "/docs/components/empty",
        },
        {
          title: "Field",
          href: "/docs/components/field",
        },
        {
          title: "Hover Card",
          href: "/docs/components/hover-card",
        },
        {
          title: "Input",
          href: "/docs/components/input",
        },
        {
          title: "Input Group",
          href: "/docs/components/input-group",
        },
        {
          title: "Input OTP",
          href: "/docs/components/input-otp",
        },
        {
          title: "Item",
          href: "/docs/components/item",
        },
        {
          title: "Kbd",
          href: "/docs/components/kbd",
        },
        {
          title: "Label",
          href: "/docs/components/label",
        },
        {
          title: "Marker",
          href: "/docs/components/marker",
        },
        {
          title: "Menubar",
          href: "/docs/components/menubar",
        },
        {
          title: "Message",
          href: "/docs/components/message",
        },
        {
          title: "Message Scroller",
          href: "/docs/components/message-scroller",
        },
        {
          title: "Native Select",
          href: "/docs/components/native-select",
        },
        {
          title: "Navigation Menu",
          href: "/docs/components/navigation-menu",
        },
        {
          title: "Pagination",
          href: "/docs/components/pagination",
        },
        {
          title: "Popover",
          href: "/docs/components/popover",
        },
        {
          title: "Progress",
          href: "/docs/components/progress",
        },
        {
          title: "Radio Group",
          href: "/docs/components/radio-group",
        },
        {
          title: "Resizable",
          href: "/docs/components/resizable",
        },
        {
          title: "Scroll Area",
          href: "/docs/components/scroll-area",
        },
        {
          title: "Select",
          href: "/docs/components/select",
        },
        {
          title: "Separator",
          href: "/docs/components/separator",
        },
        {
          title: "Sheet",
          href: "/docs/components/sheet",
        },
        {
          title: "Sidebar",
          href: "/docs/components/sidebar",
        },
        {
          title: "Skeleton",
          href: "/docs/components/skeleton",
        },
        {
          title: "Slider",
          href: "/docs/components/slider",
        },
        {
          title: "Sonner",
          href: "/docs/components/sonner",
        },
        {
          title: "Spinner",
          href: "/docs/components/spinner",
        },
        {
          title: "Switch",
          href: "/docs/components/switch",
        },
        {
          title: "Table",
          href: "/docs/components/table",
        },
        {
          title: "Tabs",
          href: "/docs/components/tabs",
        },
        {
          title: "Textarea",
          href: "/docs/components/textarea",
        },
        {
          title: "Toggle",
          href: "/docs/components/toggle",
        },
        {
          title: "Toggle Group",
          href: "/docs/components/toggle-group",
        },
        {
          title: "Tooltip",
          href: "/docs/components/tooltip",
        },
      ],
    },
    {
      title: "Get Started",
      items: [
        {
          title: "Installation",
          href: "/docs/installation",
        },
        {
          title: "Dark Mode",
          href: "/docs/dark-mode",
        },
        {
          title: "CLI",
          href: "/docs/cli",
        },
        {
          title: "Figma",
          href: "/docs/figma",
        },
      ],
    },
  ],
};

export const componentPages =
  docsConfig.sidebarNav.find((category) => category.title === "Components")
    ?.items ?? [];
