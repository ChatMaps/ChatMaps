import { Inter } from "next/font/google";
import "../../globals.css";
import { Header, Sidebar } from "./shared"

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ChatMaps",
  description: "ChatMaps: Social Media for College Students",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="grid grid-cols-4 auto-cols-max">
          <div className="col-span-3 h-dvh">
            <Header/>
            {children}
          </div>
          <Sidebar/>
        </div>
        </body>
    </html>
  );
}
