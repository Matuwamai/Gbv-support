import { useState } from "react";
import { User } from "lucide-react";

const SIZES = {
  sm: { box: "w-8 h-8", icon: 16 },
  md: { box: "w-10 h-10", icon: 20 },
  lg: { box: "w-24 h-24", icon: 48 },
} as const;

interface AvatarProps {
  src?: string | null;
  name?: string;
  size?: keyof typeof SIZES;
  className?: string;
}

// Profile picture with an icon fallback when there is no image or it fails to load.
const Avatar = ({ src, name, size = "md", className = "" }: AvatarProps) => {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const { box, icon } = SIZES[size];

  if (src && failedSrc !== src) {
    return (
      <img
        src={src}
        alt={name ? `${name}'s profile picture` : "Profile picture"}
        className={`${box} rounded-full object-cover shrink-0 ${className}`}
        onError={() => setFailedSrc(src)}
      />
    );
  }

  return (
    <div
      className={`${box} rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 ${className}`}
      aria-label={name ? `${name}'s profile picture` : "Profile picture"}
    >
      <User size={icon} />
    </div>
  );
};

export default Avatar;
