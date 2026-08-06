import { createSignal, For } from "solid-js";

import { Button } from "~/registry/ui/button.tsx";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/registry/ui/card.tsx";
import { Input } from "~/registry/ui/input.tsx";
import { Label } from "~/registry/ui/label.tsx";
import { ToggleGroup, ToggleGroupItem } from "~/registry/ui/toggle-group.tsx";

const spacingOptions = [
  {
    class: "[--card-spacing:--spacing(4)]",
    label: "16px",
    value: "4",
  },
  {
    class: "[--card-spacing:--spacing(5)]",
    label: "20px",
    value: "5",
  },
  {
    class: "[--card-spacing:--spacing(6)]",
    label: "24px",
    value: "6",
  },
  {
    class: "[--card-spacing:--spacing(8)]",
    label: "32px",
    value: "8",
  },
];

export default function CardSpacing() {
  const [spacing, setSpacing] = createSignal("4");
  const selectedSpacing = () =>
    spacingOptions.find((option) => option.value === spacing());

  return (
    <div class="mx-auto grid w-full max-w-sm gap-4">
      <ToggleGroup
        value={spacing()}
        onChange={(value) => {
          if (value) {
            setSpacing(value);
          }
        }}
        variant="outline"
        size="sm"
        class="justify-center"
      >
        <For each={spacingOptions}>
          {(option) => (
            <ToggleGroupItem value={option.value}>
              {option.label}
            </ToggleGroupItem>
          )}
        </For>
      </ToggleGroup>
      <Card class={selectedSpacing()?.class}>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
          <CardAction>
            <Button variant="link">Sign Up</Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form>
            <div class="flex flex-col gap-6">
              <div class="grid gap-2">
                <Label for="email-spacing">Email</Label>
                <Input
                  id="email-spacing"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div class="grid gap-2">
                <div class="flex items-center">
                  <Label for="password-spacing">Password</Label>
                  <a
                    href="#"
                    class="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password-spacing" type="password" required />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter class="flex-col gap-2">
          <Button type="submit" class="w-full">
            Login
          </Button>
          <Button variant="outline" class="w-full">
            Login with Google
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
