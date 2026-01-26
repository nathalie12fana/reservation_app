import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from '../components/Navbar'
import Footer from '../components/Footer';
import { ThemeProvider } from "next-themes";
import { AuthProvider } from '@/lib/auth'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Location Appartement - Trouvez votre appartement idéal",
  description: "Plateforme de location d'appartements au Cameroun",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class" 
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Navbar />
            {children}
            <Footer/>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}