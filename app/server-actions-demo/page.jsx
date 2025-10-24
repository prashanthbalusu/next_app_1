/*
 * ============================================================================
 * SERVER ACTIONS & FEATURE FLAGS DEMO
 * ============================================================================
 *
 * This application demonstrates advanced Next.js patterns including:
 *
 * 1. SIMULATED DATABASE: Global mutable object acting as server-side cache
 * 2. SERVER ACTIONS: Data mutation with revalidatePath cache invalidation
 * 3. FEATURE FLAGS: Server-side configuration controlling client features
 * 4. SERVER COMPONENTS: Data fetching and passing feature flags to client
 * 5. CLIENT COMPONENTS: Interactive forms with loading states (useFormStatus)
 * 6. CACHE INVALIDATION: Complete re-fetch after mutations via revalidatePath
 *
 * DATA FLOW:
 * 1. Server Component fetches data from db (e.g., currency: 'USD')
 * 2. Server passes feature flags to Client Component
 * 3. Client Component renders form (if feature enabled)
 * 4. User submits form → Server Action mutates db
 * 5. Server Action calls revalidatePath('/server-actions-demo')
 * 6. Next.js re-renders Server Component with fresh data
 *
 * ============================================================================
 */

import { revalidatePath } from 'next/cache';
import { PreferencesManager } from './client-components';

// ============================================================================
// SIMULATED SERVER DATABASE (GLOBAL MUTABLE OBJECT)
// ============================================================================
// This simulates a server-side database or cache that persists between
// requests. In production, this would be Redis, PostgreSQL, MongoDB, etc.
//
// IMPORTANT: This object exists OUTSIDE React components and persists across
// requests in the Node.js server runtime.
//
// STRUCTURE:
// - USER_PREFERENCES: Stores user settings (currency, theme, etc.)
// - FEATURE_FLAGS: Controls which features are enabled/disabled
// ============================================================================

const db = {
  USER_PREFERENCES: {
    currency: 'USD',
    theme: 'light'
  },
  FEATURE_FLAGS: {
    currencyToggleEnabled: true
  }
};

// ============================================================================
// SERVER-SIDE DATA FETCHING FUNCTION
// ============================================================================
// This function simulates fetching data from a database.
// It runs ONLY on the server and returns the current state.
//
// In production, this would be:
// - Database query: SELECT * FROM user_preferences WHERE user_id = ?
// - Cache lookup: redis.get('user:123:preferences')
// - API call: fetch('https://api.example.com/preferences')
// ============================================================================

async function getServerPreferences() {
  // Simulate database query latency (100ms)
  await new Promise(resolve => setTimeout(resolve, 100));

  console.log('🔍 [SERVER] Fetching preferences from database:', {
    currency: db.USER_PREFERENCES.currency,
    theme: db.USER_PREFERENCES.theme,
    currencyToggleEnabled: db.FEATURE_FLAGS.currencyToggleEnabled
  });

  return {
    currency: db.USER_PREFERENCES.currency,
    theme: db.USER_PREFERENCES.theme,
    currencyToggleEnabled: db.FEATURE_FLAGS.currencyToggleEnabled
  };
}

// ============================================================================
// SERVER ACTION: Update User Currency
// ============================================================================
// This is a Server Action that mutates the database and invalidates the cache.
//
// CRITICAL PATTERN: After mutation, it calls revalidatePath to force Next.js
// to re-fetch data for the Server Component, demonstrating cache invalidation.
//
// SECURITY: Server Actions run securely on the server with full access to
// databases and APIs. They cannot be manipulated by client-side code.
//
// FLOW:
// 1. Receives FormData from client form submission
// 2. Extracts currency value from FormData
// 3. Mutates the global db object (simulating database write)
// 4. Calls revalidatePath to invalidate Next.js cache
// 5. Server Component re-executes on next render with fresh data
// ============================================================================

async function updateUserCurrency(formData) {
  'use server';

  const newCurrency = formData.get('currency');

  console.log('💾 [SERVER ACTION] Updating currency:', {
    from: db.USER_PREFERENCES.currency,
    to: newCurrency
  });

  // Simulate database write latency (500ms)
  // In production: await db.query('UPDATE user_preferences SET currency = ?', [newCurrency])
  await new Promise(resolve => setTimeout(resolve, 500));

  // MUTATE THE DATABASE
  db.USER_PREFERENCES.currency = newCurrency;

  console.log('✅ [SERVER ACTION] Database updated:', db.USER_PREFERENCES);

  // CRITICAL: Invalidate the cache for this route
  // This forces Next.js to re-execute the Server Component on the next render
  // Without this, the UI would show stale data
  revalidatePath('/server-actions-demo');

  console.log('🔄 [SERVER ACTION] Cache invalidated via revalidatePath');
}

// ============================================================================
// SERVER ACTION: Toggle Feature Flag
// ============================================================================
// Additional Server Action to demonstrate feature flag toggling.
// This allows runtime configuration changes without code deployment.
//
// ENTERPRISE PATTERN: Feature flags enable:
// - Gradual rollouts (enable for 10% of users, then 50%, then 100%)
// - A/B testing (show variant A to 50%, variant B to other 50%)
// - Kill switches (instantly disable broken features)
// - Runtime configuration (change behavior without redeploying)
// ============================================================================

async function toggleFeatureFlag(formData) {
  'use server';

  const flagName = formData.get('flagName');

  console.log('🚩 [SERVER ACTION] Toggling feature flag:', flagName);

  // Simulate database write
  await new Promise(resolve => setTimeout(resolve, 300));

  // Toggle the feature flag
  db.FEATURE_FLAGS[flagName] = !db.FEATURE_FLAGS[flagName];

  console.log('✅ [SERVER ACTION] Feature flag updated:', {
    [flagName]: db.FEATURE_FLAGS[flagName]
  });

  // Revalidate to refresh the UI
  revalidatePath('/server-actions-demo');

  console.log('🔄 [SERVER ACTION] Cache invalidated for feature flag change');
}

// ============================================================================
// SERVER COMPONENT: Main Page (Root Component)
// ============================================================================
// This is the ROOT SERVER COMPONENT that orchestrates the entire page.
//
// RESPONSIBILITIES:
// 1. Fetches data from the database via getServerPreferences()
// 2. Passes feature flags and data to the Client Component
// 3. Re-executes whenever revalidatePath is called
// 4. Renders static content and server-side information
//
// CRITICAL PATTERN: This component has NO 'use client' directive, making it
// a Server Component by default. It can access server-side resources and
// executes ONLY on the server.
// ============================================================================

export default async function ServerActionsDemoPage() {
  // Fetch current preferences from the database
  // This runs on EVERY request after revalidatePath is called
  const preferences = await getServerPreferences();

  console.log('🖥️  [SERVER COMPONENT] Rendering with preferences:', preferences);

  return (
    <div style={styles.page}>
      {/* Header Section */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>⚡ Server Actions & Feature Flags Demo</h1>
          <p style={styles.subtitle}>
            Enterprise patterns for data mutation, caching, and server-driven client configuration
          </p>
        </div>
      </div>

      <div style={styles.container}>
        {/* Server-Side Information Card */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>🖥️ Server Component Status</h3>

          <div style={styles.statusGrid}>
            <div style={styles.statusItem}>
              <span style={styles.statusLabel}>Render Time:</span>
              <span style={styles.statusValue}>{new Date().toISOString()}</span>
            </div>

            <div style={styles.statusItem}>
              <span style={styles.statusLabel}>Database Currency:</span>
              <span style={styles.statusValue}>{db.USER_PREFERENCES.currency}</span>
            </div>

            <div style={styles.statusItem}>
              <span style={styles.statusLabel}>Database Theme:</span>
              <span style={styles.statusValue}>{db.USER_PREFERENCES.theme}</span>
            </div>

            <div style={styles.statusItem}>
              <span style={styles.statusLabel}>Feature Flag:</span>
              <span style={styles.statusValue}>
                {db.FEATURE_FLAGS.currencyToggleEnabled ? 'ENABLED' : 'DISABLED'}
              </span>
            </div>
          </div>

          <div style={styles.explanation}>
            <p style={styles.explanationText}>
              <strong>💡 Architecture Note:</strong> This is a <em>Server Component</em> that
              fetches data from the simulated database on every render. When a Server Action
              calls <code>revalidatePath()</code>, this component re-executes with fresh data.
              Notice the render timestamp updates after each mutation.
            </p>
          </div>
        </div>

        {/* CLIENT COMPONENT BOUNDARY */}
        {/* Pass server-fetched data, feature flags, and Server Actions as props */}
        {/* This demonstrates the critical Server → Client data flow pattern */}
        <PreferencesManager
          currency={preferences.currency}
          theme={preferences.theme}
          currencyToggleEnabled={preferences.currencyToggleEnabled}
          updateUserCurrency={updateUserCurrency}
          toggleFeatureFlag={toggleFeatureFlag}
        />

        {/* Data Flow Visualization */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>🔄 Complete Data Flow</h3>

          <div style={styles.flowContainer}>
            <div style={styles.flowStep}>
              <div style={styles.flowStepNumber}>1️⃣</div>
              <div style={styles.flowStepContent}>
                <h4 style={styles.flowStepTitle}>Initial Server Render</h4>
                <p style={styles.flowStepText}>
                  Server Component executes <code>getServerPreferences()</code> and
                  fetches data from the global <code>db</code> object.
                </p>
                <div style={styles.codeBlock}>
                  <pre style={styles.code}>{`// Database state:
db.USER_PREFERENCES.currency = '${db.USER_PREFERENCES.currency}'
db.USER_PREFERENCES.theme = '${db.USER_PREFERENCES.theme}'
db.FEATURE_FLAGS.currencyToggleEnabled = ${db.FEATURE_FLAGS.currencyToggleEnabled}`}</pre>
                </div>
              </div>
            </div>

            <div style={styles.flowArrow}>⬇️</div>

            <div style={styles.flowStep}>
              <div style={styles.flowStepNumber}>2️⃣</div>
              <div style={styles.flowStepContent}>
                <h4 style={styles.flowStepTitle}>Props Passed to Client</h4>
                <p style={styles.flowStepText}>
                  Server Component passes data, feature flags, and Server Actions to the
                  Client Component <code>PreferencesManager</code> via props.
                </p>
                <div style={styles.codeBlock}>
                  <pre style={styles.code}>{`<PreferencesManager
  currency="${preferences.currency}"
  theme="${preferences.theme}"
  currencyToggleEnabled={${preferences.currencyToggleEnabled}}
  updateUserCurrency={updateUserCurrency}
  toggleFeatureFlag={toggleFeatureFlag}
/>`}</pre>
                </div>
              </div>
            </div>

            <div style={styles.flowArrow}>⬇️</div>

            <div style={styles.flowStep}>
              <div style={styles.flowStepNumber}>3️⃣</div>
              <div style={styles.flowStepContent}>
                <h4 style={styles.flowStepTitle}>Client Renders Form</h4>
                <p style={styles.flowStepText}>
                  Client Component uses feature flag to conditionally render the currency
                  form. If <code>currencyToggleEnabled</code> is true, the form is displayed
                  with current values. Otherwise, a "Feature Disabled" message is shown.
                </p>
              </div>
            </div>

            <div style={styles.flowArrow}>⬇️</div>

            <div style={styles.flowStep}>
              <div style={styles.flowStepNumber}>4️⃣</div>
              <div style={styles.flowStepContent}>
                <h4 style={styles.flowStepTitle}>User Interaction</h4>
                <p style={styles.flowStepText}>
                  User selects a new currency (e.g., EUR) and submits the form.
                  <code>useFormStatus()</code> hook provides the submit button with
                  real-time status, showing "Updating..." during submission.
                </p>
              </div>
            </div>

            <div style={styles.flowArrow}>⬇️</div>

            <div style={styles.flowStep}>
              <div style={styles.flowStepNumber}>5️⃣</div>
              <div style={styles.flowStepContent}>
                <h4 style={styles.flowStepTitle}>Server Action Executes</h4>
                <p style={styles.flowStepText}>
                  <code>updateUserCurrency(formData)</code> runs on the server, mutates
                  the database, and calls <code>revalidatePath('/server-actions-demo')</code>.
                </p>
                <div style={styles.codeBlock}>
                  <pre style={styles.code}>{`// Server Action execution:
const newCurrency = formData.get('currency')
db.USER_PREFERENCES.currency = newCurrency
revalidatePath('/server-actions-demo')`}</pre>
                </div>
              </div>
            </div>

            <div style={styles.flowArrow}>⬇️</div>

            <div style={styles.flowStep}>
              <div style={styles.flowStepNumber}>6️⃣</div>
              <div style={styles.flowStepContent}>
                <h4 style={styles.flowStepTitle}>Cache Invalidation & Re-render</h4>
                <p style={styles.flowStepText}>
                  Next.js invalidates the cache for this route. The Server Component
                  re-executes, fetching the updated data (EUR) from the database.
                  The entire page re-renders with fresh data. The render timestamp
                  updates, confirming the Server Component re-executed.
                </p>
              </div>
            </div>
          </div>

          <div style={styles.explanation}>
            <p style={styles.explanationText}>
              <strong>💡 Key Insight:</strong> This pattern demonstrates how Server Actions
              enable full-stack data mutations while maintaining server-side data integrity.
              The <code>revalidatePath()</code> call ensures the UI always reflects the
              current database state after mutations, eliminating stale data issues.
            </p>
          </div>
        </div>

        {/* Technical Architecture Section */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>📚 Technical Architecture</h3>

          <div style={styles.architectureGrid}>
            <div style={styles.architectureSection}>
              <h4 style={styles.architectureSectionTitle}>🗄️ Simulated Database</h4>
              <p style={styles.architectureText}>
                The global <code>db</code> object persists across requests in the Node.js
                runtime, simulating a real database or cache layer (Redis, PostgreSQL,
                MongoDB, etc.). In production, replace with actual database queries.
              </p>
            </div>

            <div style={styles.architectureSection}>
              <h4 style={styles.architectureSectionTitle}>⚡ Server Actions</h4>
              <p style={styles.architectureText}>
                Functions marked with <code>'use server'</code> that can mutate server-side
                state and invalidate caches. They run securely on the server with access
                to databases and APIs. No API routes needed!
              </p>
            </div>

            <div style={styles.architectureSection}>
              <h4 style={styles.architectureSectionTitle}>🔄 Cache Invalidation</h4>
              <p style={styles.architectureText}>
                <code>revalidatePath(path)</code> forces Next.js to re-fetch data for a route,
                ensuring the UI stays synchronized with database changes after mutations.
                This is the key to maintaining data consistency.
              </p>
            </div>

            <div style={styles.architectureSection}>
              <h4 style={styles.architectureSectionTitle}>🚩 Feature Flags</h4>
              <p style={styles.architectureText}>
                Server-side flags control client UI rendering, enabling gradual rollouts,
                A/B testing, and runtime configuration without code deployments. Toggle
                the flag above to see instant UI changes.
              </p>
            </div>

            <div style={styles.architectureSection}>
              <h4 style={styles.architectureSectionTitle}>⏳ Loading States</h4>
              <p style={styles.architectureText}>
                <code>useFormStatus()</code> hook provides real-time submission state,
                enabling responsive UI feedback during Server Action execution. No manual
                state management required!
              </p>
            </div>

            <div style={styles.architectureSection}>
              <h4 style={styles.architectureSectionTitle}>🎯 Enterprise Benefits</h4>
              <p style={styles.architectureText}>
                This pattern reduces API complexity, improves security by keeping mutations
                server-side, enables progressive enhancement, and provides seamless full-stack
                data flow without separate API layers.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <p style={styles.footerText}>
            Built with Next.js Server Actions • Feature Flags • revalidatePath • useFormStatus
          </p>
          <p style={styles.footerText}>
            This demo showcases enterprise-grade patterns for data mutation and caching.
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
    margin: '0',
    fontSize: '16px',
    color: '#9ca3af',
    lineHeight: '1.5'
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
  statusGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px',
    marginBottom: '20px'
  },
  statusItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '12px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px'
  },
  statusLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  statusValue: {
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
  flowContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '20px'
  },
  flowStep: {
    display: 'flex',
    gap: '16px',
    padding: '16px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    borderLeft: '4px solid #3b82f6'
  },
  flowStepNumber: {
    fontSize: '24px',
    flexShrink: 0
  },
  flowStepContent: {
    flex: 1
  },
  flowStepTitle: {
    margin: '0 0 8px 0',
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827'
  },
  flowStepText: {
    margin: '0 0 12px 0',
    fontSize: '14px',
    color: '#4b5563',
    lineHeight: '1.6'
  },
  flowArrow: {
    textAlign: 'center',
    fontSize: '24px',
    margin: '4px 0'
  },
  codeBlock: {
    backgroundColor: '#1f2937',
    borderRadius: '6px',
    padding: '12px',
    overflow: 'auto'
  },
  code: {
    margin: 0,
    fontSize: '12px',
    color: '#10b981',
    fontFamily: 'Monaco, Consolas, "Courier New", monospace',
    lineHeight: '1.6'
  },
  architectureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '16px'
  },
  architectureSection: {
    padding: '16px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    borderLeft: '4px solid #3b82f6'
  },
  architectureSectionTitle: {
    margin: '0 0 12px 0',
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827'
  },
  architectureText: {
    margin: 0,
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#4b5563'
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
