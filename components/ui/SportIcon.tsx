const isImage = (icon: string) => /^(https?:)?\/\//.test(icon) || icon.startsWith("/") || icon.startsWith("data:image/");

/** Emoji icons can go inside plain text such as <option>; image icons can't. */
export const iconText = (icon?: string) => (icon && !isImage(icon) ? icon : "");

/** A sport's icon: an emoji is shown as text, a URL as an image. Renders nothing without an icon. */
export function SportIcon({ icon, className = "" }: { icon?: string; className?: string }) {
  if (!icon) return null;
  if (isImage(icon)) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={icon} alt="" className={`h-4 w-4 shrink-0 rounded-sm object-contain ${className}`} onError={(e) => (e.currentTarget.style.display = "none")} />;
  }
  return (
    <span aria-hidden className={`shrink-0 leading-none ${className}`}>
      {icon}
    </span>
  );
}
