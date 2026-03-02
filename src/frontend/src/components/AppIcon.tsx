import { useEffect, useState } from "react";
import type { ExternalBlob as ExternalBlobType } from "../backend.d";

interface AppIconProps {
  icon?: ExternalBlobType;
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "w-12 h-12 rounded-xl text-lg",
  md: "w-16 h-16 rounded-2xl text-2xl",
  lg: "w-20 h-20 rounded-2xl text-3xl",
  xl: "w-28 h-28 rounded-3xl text-4xl",
};

// Gradient palette for generated icons
const gradients = [
  "from-blue-500 to-indigo-600",
  "from-violet-500 to-purple-600",
  "from-sky-500 to-cyan-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-red-500",
  "from-pink-500 to-rose-600",
  "from-amber-500 to-orange-600",
  "from-lime-500 to-green-600",
];

function getGradient(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) % gradients.length;
  }
  return gradients[Math.abs(hash) % gradients.length];
}

export function AppIcon({
  icon,
  name,
  size = "md",
  className = "",
}: AppIconProps) {
  const [iconUrl, setIconUrl] = useState<string | null>(null);

  useEffect(() => {
    if (icon) {
      setIconUrl(icon.getDirectURL());
    }
  }, [icon]);

  const sizeClass = sizeClasses[size];
  const gradient = getGradient(name);
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (iconUrl) {
    return (
      <img
        src={iconUrl}
        alt={`${name} icon`}
        className={`${sizeClass} object-cover flex-shrink-0 shadow-sm ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 shadow-sm ${className}`}
    >
      <span className="font-display font-bold text-white">{initials}</span>
    </div>
  );
}
