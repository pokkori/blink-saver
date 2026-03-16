import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "👁️ Blink Saver | Don't you dare blink!",
  description: "How long can you go without blinking? AI watches your eyes. One blink and it's over!",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
