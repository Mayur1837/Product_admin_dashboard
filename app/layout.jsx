import "./globals.css";
export const metadata = {
  title: "Product Admin",
  description: "Product administration dashboard",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
