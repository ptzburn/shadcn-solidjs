import type { SubmitHandler } from "@modular-forms/solid";
import { createForm } from "@modular-forms/solid";

import { IconBrandGithub, IconLoader } from "~/components/icons.tsx";
import { Button } from "~/registry/ui/button.tsx";
import { Input } from "~/registry/ui/input.tsx";
import { Label } from "~/registry/ui/label.tsx";

import type { AuthForm } from "./validations/auth.ts";

export function UserAuthForm() {
  const [authForm, { Form, Field }] = createForm<AuthForm>();

  const handleSubmit: SubmitHandler<AuthForm> = () => {
    return new Promise((resolve) => setTimeout(resolve, 2000));
  };

  return (
    <div class="grid gap-6">
      <Form onSubmit={handleSubmit}>
        <div class="grid gap-4">
          <Field name="email">
            {(_, props) => (
              <div class="grid gap-1">
                <Label class="sr-only" for="email">
                  Email
                </Label>
                <Input
                  {...props}
                  id="email"
                  type="email"
                  placeholder="me@email.com"
                />
              </div>
            )}
          </Field>
          <Button type="submit" disabled={authForm.submitting}>
            {authForm.submitting && (
              <IconLoader class="mr-2 size-4 animate-spin" />
            )}
            Login
          </Button>
        </div>
      </Form>
      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <span class="w-full border-t" />
        </div>
        <div class="relative flex justify-center text-xs uppercase">
          <span class="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button variant="outline" type="button" disabled={authForm.submitting}>
        {authForm.submitting
          ? <IconLoader class="mr-2 size-4 animate-spin" />
          : <IconBrandGithub class="mr-2 size-4" />} Github
      </Button>
    </div>
  );
}
