import "../globals.css";
import { Footer } from "@/components/layouts/Footer";
import StoreNavbar from "@/components/navigation/StoreNavbar";
import { StoreSettingsProvider } from "@/components/providers/store-settings";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StoreSettingsProvider>
      <StoreNavbar />
      {children}
      <Footer />
    </StoreSettingsProvider>
  );
}
