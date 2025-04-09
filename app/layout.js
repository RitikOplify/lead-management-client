import { Poppins } from "next/font/google";
import "./globals.css";
import Wrapper from "@/wrapper/wrapper";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Leads Management System",
  description: "Leads Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className} antialiased`}
        suppressHydrationWarning={true}
      >
        <Wrapper>{children}</Wrapper>
      </body>
    </html>
  );
}
