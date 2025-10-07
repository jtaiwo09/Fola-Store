import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";

interface UserAvatarProps {
  imageUrl?: string;
  name?: string;
}

export const UserAvatar = ({ imageUrl, name }: UserAvatarProps) => {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n.charAt(0).toUpperCase())
        .join("")
    : "";

  return (
    <Avatar>
      {imageUrl ? (
        <AvatarImage src={imageUrl} alt={name || "User"} />
      ) : (
        <AvatarFallback>
          {initials || <User className="w-5 h-5" />}
        </AvatarFallback>
      )}
    </Avatar>
  );
};
