import { useColorMode } from "@kobalte/core";
import type { Component, ComponentProps } from "solid-js";

import { Toaster as Sonner } from "solid-sonner";
import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";

type ToasterProps = ComponentProps<typeof Sonner>;

const Toaster: Component<ToasterProps> = (props) => {
  const { colorMode } = useColorMode();

  return (
    <Sonner
      theme={colorMode()}
      class="group toaster"
      icons={{
        success: (
          <IconPlaceholder
            lucide="circle-check"
            tabler="circle-check"
            ph="check-circle"
            ri="checkbox-circle-line"
            hugeicons="checkmark-circle-02"
            class="size-4"
          />
        ),
        info: (
          <IconPlaceholder
            lucide="info"
            tabler="info-circle"
            ph="info"
            ri="information-line"
            hugeicons="information-circle"
            class="size-4"
          />
        ),
        warning: (
          <IconPlaceholder
            lucide="triangle-alert"
            tabler="alert-triangle"
            ph="warning"
            ri="alert-line"
            hugeicons="alert-02"
            class="size-4"
          />
        ),
        error: (
          <IconPlaceholder
            lucide="octagon-x"
            tabler="alert-octagon"
            ph="warning-octagon"
            ri="close-circle-line"
            hugeicons="cancel-circle"
            class="size-4"
          />
        ),
        loading: (
          <IconPlaceholder
            lucide="loader-circle"
            tabler="loader-2"
            ph="circle-notch"
            ri="loader-4-line"
            hugeicons="loading-03"
            class="size-4 animate-spin"
          />
        ),
      }}
      style={{
        "--normal-bg": "var(--popover)",
        "--normal-text": "var(--popover-foreground)",
        "--normal-border": "var(--border)",
        "--border-radius": "var(--radius)",
      }}
      toastOptions={{
        classes: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
