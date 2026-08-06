import { A } from "@solidjs/router";

import {
  PageActions,
  PageHeaderDescription,
  PageHeaderHeading,
} from "~/components/page-header.tsx";
import { Button } from "~/registry/ui/button.tsx";

export default function NotFound() {
  return (
    <div class="flex min-h-screen flex-col items-center justify-center">
      <PageHeaderHeading>Oops! Page not found.</PageHeaderHeading>
      <PageHeaderDescription>
        The page you're looking for doesn't exist or has been moved.
      </PageHeaderDescription>
      <PageActions class="justify-center">
        <Button as={A} href="/">
          Go back home
        </Button>
      </PageActions>
    </div>
  );
}
