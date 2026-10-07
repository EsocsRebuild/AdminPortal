import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/** The official crest of the Eternal Sacred Order of the Cherubim & Seraphim. */
export function Crest({
  size = 40,
  className,
  priority = false,
}: {
  size?: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/brand/esocs-crest.png"
      alt="ESOCS Official Crest"
      width={size}
      height={size}
      priority={priority}
      className={cn("shrink-0 rounded-full object-contain drop-shadow-md ring-2 ring-amber-400/70", className)}
    />
  );
}

/** Legacy / icon mark wrapper returning the official Crest */
export function LogoMark({ className, size = 36 }: { className?: string; size?: number }) {
  return <Crest size={size} className={className} />;
}

/** Official Crest and stacked brand wordmark */
export function Logo({
  className,
  collapsible = false,
  href = "/dashboard",
  size = "md",
}: {
  className?: string;
  collapsible?: boolean;
  href?: string;
  size?: "sm" | "md" | "lg";
}) {
  const crestSize = size === "lg" ? 52 : size === "sm" ? 32 : 40;
  return (
    <Link
      href={href}
      aria-label={`${siteConfig.name} Home`}
      className={cn("flex min-w-0 items-center gap-3 rounded-md transition-opacity hover:opacity-95", className)}
    >
      <Crest size={crestSize} className="ring-2 ring-amber-400/80 shadow-md shadow-amber-950/30" />
      <span className={cn("grid min-w-0 leading-tight", collapsible && "lg:rail:hidden")}>
        <span className={cn(
          "font-brand font-bold tracking-tight text-white dark:text-white",
          size === "lg" ? "text-xl" : size === "sm" ? "text-base" : "text-lg"
        )}>
          THE ESOCS
        </span>
        <span className="text-2xs font-medium tracking-wider text-amber-400 uppercase">
          Administration Portal
        </span>
      </span>
    </Link>
  );
}
