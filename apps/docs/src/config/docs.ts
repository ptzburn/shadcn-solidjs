type NavElement = {
  title: string;
  href: string;
  external?: boolean;
  status?: "new" | "updated";
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
          status: "new",
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
          status: "new",
        },
        {
          title: "Button",
          href: "/docs/components/button",
        },
        {
          title: "Button Group",
          href: "/docs/components/button-group",
          status: "new",
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
          status: "new",
        },
        {
          title: "Date Picker",
          href: "/docs/components/date-picker",
          status: "new",
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
          status: "new",
        },
        {
          title: "Field",
          href: "/docs/components/field",
          status: "new",
        },
        {
          title: "Hover Card",
          href: "/docs/components/hover-card",
        },
        {
          title: "Input",
          href: "/docs/components/input",
          status: "new",
        },
        {
          title: "Input Group",
          href: "/docs/components/input-group",
          status: "new",
        },
        {
          title: "Item",
          href: "/docs/components/item",
          status: "new",
        },
        {
          title: "Kbd",
          href: "/docs/components/kbd",
          status: "new",
        },
        {
          title: "Label",
          href: "/docs/components/label",
        },
        {
          title: "Marker",
          href: "/docs/components/marker",
          status: "new",
        },
        {
          title: "Menubar",
          href: "/docs/components/menubar",
        },
        {
          title: "Message",
          href: "/docs/components/message",
          status: "new",
        },
        {
          title: "Message Scroller",
          href: "/docs/components/message-scroller",
          status: "new",
        },
        {
          title: "Native Select",
          href: "/docs/components/native-select",
          status: "new",
        },
        {
          title: "Navigation Menu",
          href: "/docs/components/navigation-menu",
        },
        {
          title: "OTP Field",
          href: "/docs/components/otp-field",
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
          status: "new",
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
          status: "new",
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
          status: "new",
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
          status: "new",
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
        {
          title: "About",
          href: "/docs/about",
        },
      ],
    },
  ],
};

export const componentPages =
  docsConfig.sidebarNav.find((category) => category.title === "Components")
    ?.items ?? [];
