/*
 * ============================================================================
 * ROOT LAYOUT - SERVER COMPONENT (Default)
 * ============================================================================
 *
 * This is the root layout for the Next.js application.
 * It wraps all pages and provides the HTML structure.
 *
 * SERVER COMPONENT: Executes on the server during build/request time.
 * ============================================================================
 */

export const metadata = {
  title: 'Global Configuration Dashboard',
  description: 'Enterprise-grade demonstration of Next.js Server/Client Component architecture',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{
        margin: 0,
        padding: 0,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        backgroundColor: '#f3f4f6',
        color: '#111827'
      }}>
        {children}
      </body>
    </html>
  )
}
