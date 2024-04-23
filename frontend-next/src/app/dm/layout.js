import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ChatMaps: DM",
  description: "ChatMaps: Social Media for College Students",
};

export default function RootLayout({ children }) {
  return (
    <main className={inter.className}>
      {children}
    </main>
  );
}

