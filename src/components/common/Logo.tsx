import Image from "next/image";
import { getR2KeyUrl } from "@/lib/r2/url";

type LogoProps = {
  width?: number;
  height?: number;
  /** R2 object key for the logo image (from CMS). If empty/missing, falls back to `/logo.webp`. */
  src?: string | null;
};

export default function Logo({
  width = 70,
  height = 70,
  src,
}: LogoProps) {
  const resolved = src ? getR2KeyUrl(src) : "";
  const imageUrl = resolved || "/logo.webp";

  return (
    <Image
      src={imageUrl}
      alt="Logo"
      width={width}
      height={height}
      className="rounded-2xl opacity-70"
    />
  );
}
