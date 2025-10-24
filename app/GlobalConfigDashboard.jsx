/*
 * ============================================================================
 * GLOBAL CONFIGURATION DASHBOARD
 * ============================================================================
 *
 * This file demonstrates the critical architectural patterns in Next.js 13+
 * App Router, showcasing the interplay between:
 *
 * 1. SERVER COMPONENTS (Default) - Executed on the server, can fetch data directly
 * 2. CLIENT COMPONENTS ("use client") - Execute in the browser, enable interactivity
 * 3. MIDDLEWARE SIMULATION - Server-side logic that determines initial state
 * 4. DATA FLOW - Server → Client Context → Client Components
 *
 * ============================================================================
 */

'use client';

// ============================================================================
// CLIENT COMPONENT: UserContext
// ============================================================================
// This context manages global user state on the CLIENT side.
// It will be initialized with SERVER-DETERMINED values.
// ============================================================================

import { createContext, useContext, useState } from 'react';

const UserContext = createContext(null);

/**
 * UserProvider - CLIENT COMPONENT
 *
 * This is a Client Component that wraps the application and provides
 * global user state to all child components.
 *
 * CRITICAL PATTERN: While this is a Client Component, it receives its
 * INITIAL STATE from the Server Component that renders it. This demonstrates
 * the SERVER → CLIENT data flow that is fundamental to Next.js architecture.
 *
 * @param {Object} props
 * @param {boolean} props.isLoggedIn - Server-determined login status
 * @param {string} props.currencyCode - Server-determined currency (e.g., 'USD', 'CAD')
 * @param {string} props.userLocation - Server-determined location (e.g., 'US', 'CA')
 * @param {React.ReactNode} props.children - Child components
 */
export function UserProvider({ isLoggedIn, currencyCode, userLocation, children }) {
  // Initialize client-side state with server-determined values
  const [state, setState] = useState({
    isLoggedIn,
    userLocation,
    currencyCode
  });

  /**
   * toggleLocation - CLIENT-SIDE STATE MUTATION
   *
   * This function demonstrates pure client-side state changes.
   * It cycles through different locations and their corresponding currencies.
   */
  const toggleLocation = () => {
    setState(prevState => {
      // Cycle through different regions to demonstrate client-side updates
      const locations = [
        { location: 'US', currency: 'USD' },
        { location: 'CA', currency: 'CAD' },
        { location: 'EU', currency: 'EUR' },
        { location: 'UK', currency: 'GBP' },
        { location: 'JP', currency: 'JPY' }
      ];

      const currentIndex = locations.findIndex(l => l.location === prevState.userLocation);
      const nextIndex = (currentIndex + 1) % locations.length;
      const next = locations[nextIndex];

      return {
        ...prevState,
        userLocation: next.location,
        currencyCode: next.currency
      };
    });
  };

  /**
   * toggleLoginStatus - CLIENT-SIDE STATE MUTATION
   *
   * Demonstrates toggling authentication state on the client.
   */
  const toggleLoginStatus = () => {
    setState(prevState => ({
      ...prevState,
      isLoggedIn: !prevState.isLoggedIn
    }));
  };

  // Context value contains both state and state mutation functions
  const contextValue = {
    ...state,
    toggleLocation,
    toggleLoginStatus
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
}

/**
 * useUserContext - Custom Hook
 *
 * Provides type-safe access to the UserContext.
 * Throws an error if used outside of UserProvider.
 */
export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
}

// ============================================================================
// CLIENT COMPONENT: CurrencyToggle
// ============================================================================
// This component consumes the UserContext and provides interactive controls.
// It demonstrates CLIENT-SIDE interactivity and state mutation.
// ============================================================================

export function CurrencyToggle() {
  const { currencyCode, userLocation, isLoggedIn, toggleLocation, toggleLoginStatus } = useUserContext();

  return (
    <div style={styles.card}>
      <h3 style={styles.cardTitle}>🌍 User Configuration (Client State)</h3>

      <div style={styles.infoGrid}>
        <div style={styles.infoItem}>
          <span style={styles.label}>Location:</span>
          <span style={styles.value}>{userLocation}</span>
        </div>

        <div style={styles.infoItem}>
          <span style={styles.label}>Currency:</span>
          <span style={styles.valueCurrency}>{currencyCode}</span>
        </div>

        <div style={styles.infoItem}>
          <span style={styles.label}>Login Status:</span>
          <span style={{
            ...styles.value,
            color: isLoggedIn ? '#10b981' : '#ef4444',
            fontWeight: 'bold'
          }}>
            {isLoggedIn ? '✓ Logged In' : '✗ Logged Out'}
          </span>
        </div>
      </div>

      <div style={styles.buttonGroup}>
        <button
          onClick={toggleLocation}
          style={styles.button}
          onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
        >
          🔄 Cycle Location/Currency
        </button>

        <button
          onClick={toggleLoginStatus}
          style={{
            ...styles.button,
            backgroundColor: isLoggedIn ? '#dc2626' : '#16a34a'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = isLoggedIn ? '#b91c1c' : '#15803d'}
          onMouseOut={(e) => e.target.style.backgroundColor = isLoggedIn ? '#dc2626' : '#16a34a'}
        >
          {isLoggedIn ? '🔓 Log Out' : '🔒 Log In'}
        </button>
      </div>

      <div style={styles.explanation}>
        <p style={styles.explanationText}>
          <strong>💡 Architecture Note:</strong> This component is a <em>Client Component</em>.
          It uses the <code>useUserContext</code> hook to access and mutate client-side state.
          The buttons demonstrate pure client-side interactivity without server round-trips.
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// CLIENT COMPONENT: FeatureFlags
// ============================================================================
// Demonstrates another consumer of the UserContext with conditional rendering.
// ============================================================================

export function FeatureFlags() {
  const { isLoggedIn, currencyCode } = useUserContext();

  const features = [
    {
      name: 'Premium Dashboard',
      enabled: isLoggedIn,
      description: 'Access to advanced analytics and reporting'
    },
    {
      name: 'Multi-Currency Support',
      enabled: ['EUR', 'GBP', 'JPY'].includes(currencyCode),
      description: 'International payment processing'
    },
    {
      name: 'Regional Promotions',
      enabled: currencyCode !== 'USD',
      description: 'Location-specific offers and discounts'
    },
    {
      name: 'Guest Checkout',
      enabled: !isLoggedIn,
      description: 'Quick purchase without account creation'
    }
  ];

  return (
    <div style={styles.card}>
      <h3 style={styles.cardTitle}>⚡ Feature Flags (Context-Driven)</h3>

      <div style={styles.featureList}>
        {features.map((feature, index) => (
          <div
            key={index}
            style={{
              ...styles.featureItem,
              borderLeft: feature.enabled ? '4px solid #10b981' : '4px solid #6b7280'
            }}
          >
            <div style={styles.featureHeader}>
              <span style={styles.featureName}>{feature.name}</span>
              <span style={{
                ...styles.featureStatus,
                backgroundColor: feature.enabled ? '#d1fae5' : '#f3f4f6',
                color: feature.enabled ? '#065f46' : '#4b5563'
              }}>
                {feature.enabled ? '✓ Enabled' : '✗ Disabled'}
              </span>
            </div>
            <p style={styles.featureDescription}>{feature.description}</p>
          </div>
        ))}
      </div>

      <div style={styles.explanation}>
        <p style={styles.explanationText}>
          <strong>💡 Architecture Note:</strong> This <em>Client Component</em> consumes
          the same context as CurrencyToggle, demonstrating how multiple components
          can reactively respond to the same global state changes.
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// CLIENT COMPONENT: DataFlowVisualization
// ============================================================================
// Visual representation of the Server → Client data flow.
// ============================================================================

export function DataFlowVisualization({ serverInitialData }) {
  const currentClientState = useUserContext();

  return (
    <div style={styles.card}>
      <h3 style={styles.cardTitle}>🔄 Data Flow Visualization</h3>

      <div style={styles.flowContainer}>
        <div style={styles.flowStep}>
          <div style={styles.flowStepHeader}>
            <span style={styles.flowStepNumber}>1️⃣</span>
            <span style={styles.flowStepTitle}>Server Component</span>
          </div>
          <div style={styles.flowStepContent}>
            <p style={styles.flowStepText}>
              <strong>Middleware Simulation:</strong><br/>
              Determines initial state based on headers/environment
            </p>
            <div style={styles.codeBlock}>
              <pre style={styles.code}>
{`// Server-determined values:
AUTH_TOKEN: ${serverInitialData.AUTH_TOKEN}
GEO_CODE: ${serverInitialData.GEO_COUNTRY_CODE}

// Computed values:
isLoggedIn: ${serverInitialData.isLoggedIn}
currency: ${serverInitialData.currencyCode}
location: ${serverInitialData.userLocation}`}
              </pre>
            </div>
          </div>
        </div>

        <div style={styles.flowArrow}>
          ⬇️ <span style={styles.flowArrowText}>Props Passed to Client</span> ⬇️
        </div>

        <div style={styles.flowStep}>
          <div style={styles.flowStepHeader}>
            <span style={styles.flowStepNumber}>2️⃣</span>
            <span style={styles.flowStepTitle}>Client Context Provider</span>
          </div>
          <div style={styles.flowStepContent}>
            <p style={styles.flowStepText}>
              <strong>Initialization:</strong><br/>
              Receives server data as props, initializes client state
            </p>
            <div style={styles.codeBlock}>
              <pre style={styles.code}>
{`// Client state initialized with:
isLoggedIn: ${serverInitialData.isLoggedIn}
userLocation: ${serverInitialData.userLocation}
currencyCode: ${serverInitialData.currencyCode}`}
              </pre>
            </div>
          </div>
        </div>

        <div style={styles.flowArrow}>
          ⬇️ <span style={styles.flowArrowText}>Context Consumed</span> ⬇️
        </div>

        <div style={styles.flowStep}>
          <div style={styles.flowStepHeader}>
            <span style={styles.flowStepNumber}>3️⃣</span>
            <span style={styles.flowStepTitle}>Client Components</span>
          </div>
          <div style={styles.flowStepContent}>
            <p style={styles.flowStepText}>
              <strong>Current State (After Client Mutations):</strong><br/>
              State may differ from server initial values
            </p>
            <div style={styles.codeBlock}>
              <pre style={styles.code}>
{`// Current client state:
isLoggedIn: ${currentClientState.isLoggedIn}
userLocation: ${currentClientState.userLocation}
currencyCode: ${currentClientState.currencyCode}

${JSON.stringify(serverInitialData) !== JSON.stringify({
  isLoggedIn: currentClientState.isLoggedIn,
  userLocation: currentClientState.userLocation,
  currencyCode: currentClientState.currencyCode
}) ? '⚠️  State has been modified client-side!' : '✓ State matches server initial values'}`}
              </pre>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.explanation}>
        <p style={styles.explanationText}>
          <strong>💡 Architecture Note:</strong> This visualization shows the one-way
          data flow from Server Components to Client Components. The server determines
          the initial state, which flows down through props to the Client Context,
          where it can be mutated without server round-trips.
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// INLINE STYLES
// ============================================================================
// Comprehensive styling for the dashboard components
// ============================================================================

const styles = {
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
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '20px'
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  value: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827'
  },
  valueCurrency: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#3b82f6'
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    marginBottom: '20px'
  },
  button: {
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#3b82f6',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
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
  featureList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '20px'
  },
  featureItem: {
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    padding: '16px',
    transition: 'all 0.2s'
  },
  featureHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  featureName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827'
  },
  featureStatus: {
    fontSize: '12px',
    fontWeight: '600',
    padding: '4px 12px',
    borderRadius: '12px'
  },
  featureDescription: {
    margin: 0,
    fontSize: '14px',
    color: '#6b7280',
    lineHeight: '1.5'
  },
  flowContainer: {
    marginBottom: '20px'
  },
  flowStep: {
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '12px'
  },
  flowStepHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px'
  },
  flowStepNumber: {
    fontSize: '24px'
  },
  flowStepTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827'
  },
  flowStepContent: {
    paddingLeft: '36px'
  },
  flowStepText: {
    margin: '0 0 12px 0',
    fontSize: '14px',
    color: '#4b5563',
    lineHeight: '1.5'
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
  flowArrow: {
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: '600',
    color: '#3b82f6',
    margin: '12px 0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px'
  },
  flowArrowText: {
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  }
};
