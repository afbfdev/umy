import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CookieConsent } from "@/components/consent/cookie-consent";
import { Analytics } from "@/components/analytics/analytics";
import { CurrencyProvider } from "@/components/currency/currency-provider";
import { getRates } from "@/lib/rates";

export default async function ShopLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const rates = await getRates();

  return (
    <CurrencyProvider rates={rates}>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <CookieConsent />
      <Analytics />
    </CurrencyProvider>
  );
}
