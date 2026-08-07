import type { Registry } from "~/registry/schema.ts";

export const ui: Registry = [
  {
    name: "accordion",
    type: "ui",
    dependencies: ["@kobalte/core"],
    files: [
      {
        path: "ui/accordion.tsx",
        type: "ui",
      },
    ],
  },
  {
    name: "alert",
    type: "ui",
    dependencies: ["@kobalte/core"],
    files: [
      {
        path: "ui/alert.tsx",
        type: "ui",
      },
    ],
  },
  {
    name: "alert-dialog",
    type: "ui",
    dependencies: ["@kobalte/core"],
    registryDependencies: ["button"],
    files: [
      {
        path: "ui/alert-dialog.tsx",
        type: "ui",
      },
    ],
  },
  {
    name: "aspect-ratio",
    type: "ui",
    files: [
      {
        path: "ui/aspect-ratio.tsx",
        type: "ui",
      },
    ],
  },
  {
    name: "attachment",
    type: "ui",
    dependencies: ["@kobalte/core"],
    registryDependencies: ["button"],
    files: [
      {
        path: "ui/attachment.tsx",
        type: "ui",
      },
    ],
  },
  {
    name: "avatar",
    type: "ui",
    dependencies: ["@kobalte/core"],
    files: [
      {
        path: "ui/avatar.tsx",
        type: "ui",
      },
    ],
  },
  {
    name: "badge",
    type: "ui",
    dependencies: ["@kobalte/core"],
    files: [
      {
        path: "ui/badge.tsx",
        type: "ui",
      },
    ],
  },
  {
    name: "breadcrumb",
    type: "ui",
    dependencies: ["@kobalte/core"],
    files: [
      {
        path: "ui/breadcrumb.tsx",
        type: "ui",
      },
    ],
  },
  {
    name: "bubble",
    type: "ui",
    dependencies: ["@kobalte/core"],
    files: [
      {
        path: "ui/bubble.tsx",
        type: "ui",
      },
    ],
  },
  {
    name: "button",
    type: "ui",
    dependencies: ["@kobalte/core"],
    files: [
      {
        path: "ui/button.tsx",
        type: "ui",
      },
    ],
  },
  {
    name: "button-group",
    type: "ui",
    dependencies: ["@kobalte/core"],
    registryDependencies: ["separator"],
    files: [
      {
        path: "ui/button-group.tsx",
        type: "ui",
      },
    ],
  },
  {
    name: "card",
    type: "ui",
    files: [
      {
        path: "ui/card.tsx",
        type: "ui",
      },
    ],
  },
  {
    name: "carousel",
    type: "ui",
    dependencies: ["embla-carousel-solid"],
    registryDependencies: ["button"],
    files: [
      {
        path: "ui/carousel.tsx",
        type: "ui",
      },
    ],
  },
  {
    name: "charts",
    type: "ui",
    dependencies: ["chart.js", "@solid-primitives/refs"],
    files: [
      {
        path: "ui/charts.tsx",
        type: "ui",
      },
    ],
  },
  {
    name: "checkbox",
    type: "ui",
    dependencies: ["@kobalte/core"],
    files: [
      {
        path: "ui/checkbox.tsx",
        type: "ui",
      },
    ],
  },
  {
    name: "combobox",
    type: "ui",
    dependencies: ["@kobalte/core"],
    registryDependencies: ["button", "input-group"],
    files: [
      {
        path: "ui/combobox.tsx",
        type: "ui",
      },
    ],
  },
  {
    name: "command",
    type: "ui",
    dependencies: ["@kobalte/core", "cmdk-solid"],
    registryDependencies: ["dialog", "input-group"],
    files: [
      {
        path: "ui/command.tsx",
        type: "ui",
      },
    ],
  },
  {
    name: "context-menu",
    type: "ui",
    dependencies: ["@kobalte/core"],
    files: [
      {
        path: "ui/context-menu.tsx",
        type: "ui",
      },
    ],
  },
  {
    name: "collapsible",
    type: "ui",
    dependencies: ["@kobalte/core"],
    files: [
      {
        path: "ui/collapsible.tsx",
        type: "ui",
      },
    ],
  },
  {
    name: "date-picker",
    type: "ui",
    dependencies: ["@ark-ui/solid"],
    registryDependencies: ["button"],
    files: [
      {
        path: "ui/date-picker.tsx",
        type: "ui",
      },
    ],
  },
  {
    name: "dialog",
    type: "ui",
    dependencies: ["@kobalte/core"],
    registryDependencies: ["button"],
    files: [
      {
        path: "ui/dialog.tsx",
        type: "ui",
      },
    ],
  },
  {
    name: "drawer",
    type: "ui",
    dependencies: ["@corvu/drawer"],
    files: [
      {
        path: "ui/drawer.tsx",
        type: "ui",
      },
    ],
  },
  {
    name: "dropdown-menu",
    type: "ui",
    dependencies: ["@kobalte/core"],
    files: [
      {
        path: "ui/dropdown-menu.tsx",
        type: "ui",
      },
    ],
  },
  {
    name: "empty",
    type: "ui",
    files: [
      {
        path: "ui/empty.tsx",
        type: "ui",
      },
    ],
  },
  {
    name: "field",
    type: "ui",
    dependencies: ["@kobalte/core"],
    registryDependencies: ["label", "separator"],
    files: [
      {
        path: "ui/field.tsx",
        type: "ui",
      },
    ],
  },
  {
    name: "hover-card",
    type: "ui",
    dependencies: ["@kobalte/core"],
    files: [
      {
        path: "ui/hover-card.tsx",
        type: "ui",
      },
    ],
  },
  {
    name: "input",
    type: "ui",
    files: [
      {
        path: "ui/input.tsx",
        type: "ui",
      },
    ],
  },
  {
    name: "input-group",
    type: "ui",
    dependencies: ["@kobalte/core"],
    registryDependencies: ["button", "input", "textarea"],
    files: [
      {
        path: "ui/input-group.tsx",
        type: "ui",
      },
    ],
  },
  {
    name: "item",
    type: "ui",
    dependencies: ["@kobalte/core"],
    registryDependencies: ["separator"],
    files: [
      {
        path: "ui/item.tsx",
        type: "ui",
      },
    ],
  },
  {
    name: "kbd",
    type: "ui",
    files: [
      {
        path: "ui/kbd.tsx",
        type: "ui",
      },
    ],
  },
  {
    name: "label",
    type: "ui",
    dependencies: ["@kobalte/core"],
    files: [
      {
        path: "ui/label.tsx",
        type: "ui",
      },
    ],
  },
  {
    name: "marker",
    type: "ui",
    dependencies: ["@kobalte/core"],
    files: [
      {
        path: "ui/marker.tsx",
        type: "ui",
      },
    ],
  },
  {
    name: "menubar",
    type: "ui",
    dependencies: ["@kobalte/core"],
    files: [
      {
        path: "ui/menubar.tsx",
        type: "ui",
      },
    ],
  },
  {
    name: "message",
    type: "ui",
    files: [
      {
        path: "ui/message.tsx",
        type: "ui",
      },
    ],
  },
  {
    name: "message-scroller",
    type: "ui",
    dependencies: ["@kobalte/core", "@solid-primitives/refs"],
    registryDependencies: ["button"],
    files: [
      {
        path: "ui/message-scroller.tsx",
        type: "ui",
      },
      {
        path: "ui/message-scroller-primitive.ts",
        type: "ui",
      },
      {
        path: "ui/message-scroller-components.tsx",
        type: "ui",
      },
      {
        path: "ui/message-scroller-controller.ts",
        type: "ui",
      },
      {
        path: "ui/message-scroller-geometry.ts",
        type: "ui",
      },
      {
        path: "ui/message-scroller-types.ts",
        type: "ui",
      },
    ],
  },
  {
    name: "native-select",
    type: "ui",
    files: [
      {
        path: "ui/native-select.tsx",
        type: "ui",
      },
    ],
  },
  {
    name: "navigation-menu",
    type: "ui",
    dependencies: ["@kobalte/core"],
    files: [
      {
        path: "ui/navigation-menu.tsx",
        type: "ui",
      },
    ],
  },
  {
    name: "otp-field",
    type: "ui",
    dependencies: ["@corvu/otp-field"],
    files: [
      {
        path: "ui/otp-field.tsx",
        type: "ui",
      },
    ],
  },
  {
    name: "pagination",
    type: "ui",
    dependencies: ["@kobalte/core"],
    registryDependencies: ["button"],
    files: [
      {
        path: "ui/pagination.tsx",
        type: "ui",
      },
    ],
  },
  {
    name: "popover",
    type: "ui",
    dependencies: ["@kobalte/core"],
    files: [
      {
        path: "ui/popover.tsx",
        type: "ui",
      },
    ],
  },
  {
    name: "progress",
    type: "ui",
    dependencies: ["@kobalte/core"],
    files: [
      {
        path: "ui/progress.tsx",
        type: "ui",
      },
    ],
  },
  {
    name: "radio-group",
    type: "ui",
    dependencies: ["@kobalte/core"],
    files: [
      {
        path: "ui/radio-group.tsx",
        type: "ui",
      },
    ],
  },
  {
    name: "resizable",
    type: "ui",
    dependencies: ["@corvu/resizable"],
    files: [
      {
        path: "ui/resizable.tsx",
        type: "ui",
      },
    ],
  },
  {
    name: "scroll-area",
    type: "ui",
    files: [
      {
        path: "ui/scroll-area.tsx",
        type: "ui",
      },
    ],
  },
  {
    name: "select",
    type: "ui",
    dependencies: ["@kobalte/core"],
    files: [
      {
        path: "ui/select.tsx",
        type: "ui",
      },
    ],
  },
  {
    name: "separator",
    type: "ui",
    dependencies: ["@kobalte/core"],
    files: [
      {
        path: "ui/separator.tsx",
        type: "ui",
      },
    ],
  },
  {
    name: "sheet",
    type: "ui",
    dependencies: ["@kobalte/core"],
    registryDependencies: ["button"],
    files: [
      {
        path: "ui/sheet.tsx",
        type: "ui",
      },
    ],
  },
  {
    name: "sidebar",
    type: "ui",
    dependencies: ["@kobalte/core"],
    registryDependencies: [
      "button",
      "input",
      "separator",
      "sheet",
      "skeleton",
      "tooltip",
      "use-media-query",
    ],
    files: [
      {
        path: "ui/sidebar.tsx",
        type: "ui",
      },
    ],
  },
  {
    name: "skeleton",
    type: "ui",
    files: [
      {
        path: "ui/skeleton.tsx",
        type: "ui",
      },
    ],
  },
  {
    name: "slider",
    type: "ui",
    dependencies: ["@kobalte/core"],
    files: [
      {
        path: "ui/slider.tsx",
        type: "ui",
      },
    ],
  },
  {
    name: "sonner",
    type: "ui",
    dependencies: ["@kobalte/core", "solid-sonner"],
    files: [
      {
        path: "ui/sonner.tsx",
        type: "ui",
      },
    ],
  },
  {
    name: "spinner",
    type: "ui",
    files: [
      {
        path: "ui/spinner.tsx",
        type: "ui",
      },
    ],
  },
  {
    name: "switch",
    type: "ui",
    dependencies: ["@kobalte/core"],
    files: [
      {
        path: "ui/switch.tsx",
        type: "ui",
      },
    ],
  },
  {
    name: "table",
    type: "ui",
    files: [
      {
        path: "ui/table.tsx",
        type: "ui",
      },
    ],
  },
  {
    name: "tabs",
    type: "ui",
    dependencies: ["@kobalte/core"],
    files: [
      {
        path: "ui/tabs.tsx",
        type: "ui",
      },
    ],
  },
  {
    name: "textarea",
    type: "ui",
    files: [
      {
        path: "ui/textarea.tsx",
        type: "ui",
      },
    ],
  },
  {
    name: "toggle",
    type: "ui",
    dependencies: ["@kobalte/core"],
    files: [
      {
        path: "ui/toggle.tsx",
        type: "ui",
      },
    ],
  },
  {
    name: "toggle-group",
    type: "ui",
    dependencies: ["@kobalte/core"],
    registryDependencies: ["toggle"],
    files: [
      {
        path: "ui/toggle-group.tsx",
        type: "ui",
      },
    ],
  },
  {
    name: "tooltip",
    type: "ui",
    dependencies: ["@kobalte/core"],
    files: [
      {
        path: "ui/tooltip.tsx",
        type: "ui",
      },
    ],
  },
];
