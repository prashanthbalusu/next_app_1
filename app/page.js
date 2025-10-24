/*
 * ============================================================================
 * MAIN PAGE - SERVER COMPONENT (Default)
 * ============================================================================
 *
 * This is a SERVER COMPONENT (default in Next.js App Router).
 * It demonstrates:
 *
 * 1. MIDDLEWARE SIMULATION: Server-side logic that would typically come from
 *    Next.js Middleware, headers, or environment variables
 *
 * 2. SERVER-SIDE DATA FETCHING: Could include database queries, API calls, etc.
 *
 * 3. SERVER → CLIENT DATA FLOW: Passing server-determined state to Client
 *    Components via props
 *
 * 4. COMPOSITION: Mixing Server Components (StaticHeader) with Client
 *    Components (UserProvider, CurrencyToggle, etc.)
 *
 * ============================================================================
 */

import {
  UserProvider,
  CurrencyToggle,
  FeatureFlags,
  DataFlowVisualization
} from './GlobalConfigDashboard.jsx';

// ============================================================================
// SERVER COMPONENT: StaticHeader
// ============================================================================
// This component demonstrates a pure Server Component that renders static
// content. It does NOT need client-side interactivity, so it remains a
// Server Component for optimal performance.
// ============================================================================

function StaticHeader() {
  // Simulate fetching static data on the server
  // In a real application, this might be a database query or CMS fetch
  const dashboardMetadata = {
    title: 'Global Configuration Dashboard',
    version: '2.0.0',
    lastUpdated: new Date().toISOString().split('T')[0],
    environment: process.env.NODE_ENV || 'development'
  };

  return (
    <div style={styles.header}>
      <div style={styles.headerContent}>
        <h1 style={styles.title}>
          ⚙️ {dashboardMetadata.title}
        </h1>
        <p style={styles.subtitle}>
          Enterprise-grade demonstration of Next.js 13+ Server/Client Component Architecture
        </p>

        <div style={styles.metadata}>
          <span style={styles.metadataItem}>
            <strong>Version:</strong> {dashboardMetadata.version}
          </span>
          <span style={styles.metadataItem}>
            <strong>Environment:</strong> {dashboardMetadata.environment}
          </span>
          <span style={styles.metadataItem}>
            <strong>Last Updated:</strong> {dashboardMetadata.lastUpdated}
          </span>
        </div>

        <div style={styles.architectureNote}>
          <p style={styles.architectureNoteText}>
            <strong>💡 Architecture Note:</strong> This StaticHeader is a <em>Server Component</em>.
            It executes ONLY on the server, has access to server-side resources (like process.env),
            and delivers pre-rendered HTML to the client. No JavaScript is shipped to the browser
            for this component, resulting in optimal performance.
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SERVER COMPONENT: ServerStatsCard
// ============================================================================
// Another example of a Server Component that could fetch server-side data
// ============================================================================

function ServerStatsCard() {
  // Simulate server-side computation or data fetching
  // In production, this might query a database or call an internal API
  const serverStats = {
    requestTimestamp: new Date().toISOString(),
    serverRegion: process.env.SERVER_REGION || 'us-east-1',
    nodeVersion: process.version,
    platform: process.platform
  };

  return (
    <div style={styles.card}>
      <h3 style={styles.cardTitle}>🖥️ Server-Side Information</h3>

      <div style={styles.statsGrid}>
        <div style={styles.statItem}>
          <span style={styles.statLabel}>Request Timestamp:</span>
          <span style={styles.statValue}>{serverStats.requestTimestamp}</span>
        </div>

        <div style={styles.statItem}>
          <span style={styles.statLabel}>Server Region:</span>
          <span style={styles.statValue}>{serverStats.serverRegion}</span>
        </div>

        <div style={styles.statItem}>
          <span style={styles.statLabel}>Node Version:</span>
          <span style={styles.statValue}>{serverStats.nodeVersion}</span>
        </div>

        <div style={styles.statItem}>
          <span style={styles.statLabel}>Platform:</span>
          <span style={styles.statValue}>{serverStats.platform}</span>
        </div>
      </div>

      <div style={styles.explanation}>
        <p style={styles.explanationText}>
          <strong>💡 Architecture Note:</strong> This is a <em>Server Component</em> with
          access to server-side APIs like <code>process</code>. This data is computed once
          on the server and sent as HTML. No client-side JavaScript is needed.
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// SERVER COMPONENT: Main Page Export
// ============================================================================
// This is the MAIN SERVER COMPONENT that orchestrates the entire page.
// It simulates middleware logic and passes initial state to Client Components.
// ============================================================================

export default function GlobalConfigurationPage() {
  // ========================================================================
  // MIDDLEWARE SIMULATION
  // ========================================================================
  // In a real Next.js application, these values would come from:
  // - Middleware (examining headers, cookies, etc.)
  // - Environment variables
  // - Edge functions
  // - Server-side API calls
  //
  // For this demonstration, we simulate these server-determined values.
  // ========================================================================

  // Simulate reading from request headers or middleware
  // In production: const authToken = cookies().get('auth_token')
  const AUTH_TOKEN = true; // Simulate authenticated user

  // Simulate geo-location from request headers
  // In production: const geoCode = headers().get('x-vercel-ip-country')
  const GEO_COUNTRY_CODE = 'CA'; // Simulate Canadian user

  // ========================================================================
  // SERVER-SIDE BUSINESS LOGIC
  // ========================================================================
  // Compute initial state based on server-determined values
  // This logic runs ONLY on the server
  // ========================================================================

  // Determine currency based on geographic location
  const currencyCode = GEO_COUNTRY_CODE === 'CA' ? 'CAD' : 'USD';

  // Determine login status from auth token
  const isLoggedIn = Boolean(AUTH_TOKEN);

  // User location from geo code
  const userLocation = GEO_COUNTRY_CODE;

  // Package server initial data for visualization
  const serverInitialData = {
    AUTH_TOKEN,
    GEO_COUNTRY_CODE,
    isLoggedIn,
    currencyCode,
    userLocation
  };

  console.log('🖥️  SERVER COMPONENT EXECUTION:');
  console.log('   Simulated AUTH_TOKEN:', AUTH_TOKEN);
  console.log('   Simulated GEO_COUNTRY_CODE:', GEO_COUNTRY_CODE);
  console.log('   Computed isLoggedIn:', isLoggedIn);
  console.log('   Computed currencyCode:', currencyCode);
  console.log('   Computed userLocation:', userLocation);

  // ========================================================================
  // COMPONENT COMPOSITION
  // ========================================================================
  // This demonstrates the critical pattern of composing Server and Client
  // Components together. The Server Component (this page) wraps Client
  // Components and passes down server-determined state via props.
  // ========================================================================

  return (
    <div style={styles.page}>
      {/*
        SERVER COMPONENT: StaticHeader
        Renders on server, no client-side JS needed
      */}
      <StaticHeader />

      <div style={styles.container}>
        {/*
          SERVER COMPONENT: ServerStatsCard
          Shows server-side information
        */}
        <ServerStatsCard />

        {/*
          CLIENT COMPONENT BOUNDARY
          ========================
          UserProvider is a Client Component ("use client" directive).
          We pass SERVER-DETERMINED initial state as props.

          This demonstrates the SERVER → CLIENT data flow pattern.
          The server computes the initial state, and the client can
          then mutate it without server round-trips.
        */}
        <UserProvider
          isLoggedIn={isLoggedIn}
          currencyCode={currencyCode}
          userLocation={userLocation}
        >
          {/*
            All components inside UserProvider can access the context.
            Some are interactive (Client Components), others could be
            Server Components that just read the context.
          */}

          <CurrencyToggle />

          <FeatureFlags />

          <DataFlowVisualization serverInitialData={serverInitialData} />

        </UserProvider>

        {/* Architecture Overview Section */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>📚 Architecture Overview</h3>

          <div style={styles.architectureOverview}>
            <div style={styles.architectureSection}>
              <h4 style={styles.architectureSectionTitle}>🖥️ Server Components (Default)</h4>
              <ul style={styles.architectureList}>
                <li><strong>StaticHeader</strong>: Renders static dashboard title and metadata</li>
                <li><strong>ServerStatsCard</strong>: Displays server-side runtime information</li>
                <li><strong>GlobalConfigurationPage (this)</strong>: Main orchestrator with middleware simulation</li>
              </ul>
              <p style={styles.architectureDescription}>
                These components execute ONLY on the server. They can access server-side
                resources, perform database queries, and deliver pre-rendered HTML. No
                JavaScript for these components is sent to the browser.
              </p>
            </div>

            <div style={styles.architectureSection}>
              <h4 style={styles.architectureSectionTitle}>💻 Client Components ("use client")</h4>
              <ul style={styles.architectureList}>
                <li><strong>UserProvider</strong>: Manages global user state context</li>
                <li><strong>CurrencyToggle</strong>: Interactive controls for location/currency</li>
                <li><strong>FeatureFlags</strong>: Context-driven feature enablement</li>
                <li><strong>DataFlowVisualization</strong>: Visual representation of data flow</li>
              </ul>
              <p style={styles.architectureDescription}>
                These components execute in the browser and enable interactivity. They can
                use React hooks (useState, useEffect, etc.) and respond to user events.
                They receive initial state from Server Components via props.
              </p>
            </div>

            <div style={styles.architectureSection}>
              <h4 style={styles.architectureSectionTitle}>🔄 Data Flow Pattern</h4>
              <ol style={styles.architectureList}>
                <li>
                  <strong>Server:</strong> Middleware simulates AUTH_TOKEN and GEO_COUNTRY_CODE
                </li>
                <li>
                  <strong>Server:</strong> Business logic computes isLoggedIn, currencyCode, userLocation
                </li>
                <li>
                  <strong>Server → Client:</strong> Initial state passed as props to UserProvider
                </li>
                <li>
                  <strong>Client:</strong> UserProvider initializes context with server values
                </li>
                <li>
                  <strong>Client:</strong> Child components consume and mutate context as needed
                </li>
              </ol>
              <p style={styles.architectureDescription}>
                This unidirectional data flow ensures that the server has full control over
                the initial state while allowing the client to manage subsequent mutations
                without server round-trips.
              </p>
            </div>

            <div style={styles.architectureSection}>
              <h4 style={styles.architectureSectionTitle}>🎯 Enterprise Benefits</h4>
              <ul style={styles.architectureList}>
                <li><strong>Performance:</strong> Server Components reduce client-side bundle size</li>
                <li><strong>Security:</strong> Sensitive logic stays on the server</li>
                <li><strong>SEO:</strong> Pre-rendered HTML improves search engine indexing</li>
                <li><strong>Data Fetching:</strong> Direct database/API access from Server Components</li>
                <li><strong>Code Splitting:</strong> Automatic optimization of Client Components</li>
                <li><strong>Streaming:</strong> Progressive page rendering as data becomes available</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <p style={styles.footerText}>
            Built with Next.js 13+ App Router • Server Components • Client Components • React Server Components
          </p>
          <p style={styles.footerText}>
            This dashboard demonstrates enterprise-grade architectural patterns for modern web applications.
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f3f4f6'
  },
  header: {
    backgroundColor: '#1f2937',
    color: '#ffffff',
    padding: '32px 0',
    marginBottom: '32px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  },
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 24px'
  },
  title: {
    margin: '0 0 8px 0',
    fontSize: '36px',
    fontWeight: '700',
    color: '#ffffff'
  },
  subtitle: {
    margin: '0 0 24px 0',
    fontSize: '16px',
    color: '#9ca3af',
    lineHeight: '1.5'
  },
  metadata: {
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap',
    marginBottom: '24px',
    paddingBottom: '24px',
    borderBottom: '1px solid #374151'
  },
  metadataItem: {
    fontSize: '14px',
    color: '#d1d5db'
  },
  architectureNote: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: '8px',
    padding: '16px',
    borderLeft: '4px solid #3b82f6'
  },
  architectureNoteText: {
    margin: 0,
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#e5e7eb'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 24px 48px 24px'
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    border: '1px solid #e5e7eb'
  },
  cardTitle: {
    margin: '0 0 20px 0',
    fontSize: '20px',
    fontWeight: '600',
    color: '#111827',
    borderBottom: '2px solid #3b82f6',
    paddingBottom: '12px'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px',
    marginBottom: '20px'
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '12px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px'
  },
  statLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  statValue: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Monaco, Consolas, "Courier New", monospace'
  },
  explanation: {
    backgroundColor: '#eff6ff',
    borderRadius: '8px',
    padding: '16px',
    borderLeft: '4px solid #3b82f6'
  },
  explanationText: {
    margin: 0,
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#1e40af'
  },
  architectureOverview: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  architectureSection: {
    padding: '20px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    borderLeft: '4px solid #3b82f6'
  },
  architectureSectionTitle: {
    margin: '0 0 12px 0',
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827'
  },
  architectureList: {
    margin: '0 0 12px 0',
    paddingLeft: '20px',
    color: '#4b5563'
  },
  architectureDescription: {
    margin: 0,
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#6b7280',
    fontStyle: 'italic'
  },
  footer: {
    textAlign: 'center',
    paddingTop: '24px',
    marginTop: '24px',
    borderTop: '1px solid #e5e7eb'
  },
  footerText: {
    margin: '8px 0',
    fontSize: '14px',
    color: '#6b7280'
  }
};
