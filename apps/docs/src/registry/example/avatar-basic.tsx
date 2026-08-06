import { Avatar, AvatarFallback, AvatarImage } from "~/registry/ui/avatar.tsx";

export default function AvatarBasic() {
  return (
    <Avatar>
      <AvatarImage
        src="https://github.com/shadcn.png"
        alt="@shadcn"
        class="grayscale"
      />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
}
