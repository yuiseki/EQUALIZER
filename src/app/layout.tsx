import "./globals.css";

export const metadata = {
  title: "EQUALIZER",
  description: "EQUALIZER",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
