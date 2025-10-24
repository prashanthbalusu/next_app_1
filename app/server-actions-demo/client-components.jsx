/*
 * ============================================================================
 * CLIENT COMPONENTS - Interactive UI with useFormStatus
 * ============================================================================
 *
 * This file contains all Client Components that:
 * 1. Receive data and feature flags from Server Component (via props)
 * 2. Render interactive forms that trigger Server Actions
 * 3. Use useFormStatus for real-time loading states
 * 4. Implement feature-gated UI based on server configuration
 *
 * ============================================================================
 */

'use client';

import { useFormStatus } from 'react-dom';

// ============================================================================
// CLIENT COMPONENT: Submit Button with Loading State
// ============================================================================
// This component uses useFormStatus to show loading state during submission.
//
// CRITICAL PATTERN: useFormStatus must be called from a component that is
// a child of the <form> element. It provides real-time submission status.
// ============================================================================

function SubmitButton({ label = 'Save', loadingLabel = 'Saving...' }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        ...styles.submitButton,
        opacity: pending ? 0.6 : 1,
        cursor: pending ? 'not-allowed' : 'pointer'
      }}
    >
      {pending ? loadingLabel : label}
    </button>
  );
}

// ============================================================================
// CLIENT COMPONENT: PreferencesManager
// ============================================================================
// This is the main Client Component wrapper that:
// 1. Receives data and feature flags from Server Component (via props)
// 2. Renders forms that trigger Server Actions
// 3. Uses feature flags to conditionally render UI
//
// DATA FLOW:
// Server Component → Props → Client Component → Server Action → revalidatePath
// ============================================================================

export function PreferencesManager({
  currency,
  theme,
  currencyToggleEnabled,
  updateUserCurrency,
  toggleFeatureFlag
}) {
  return (
    <div style={styles.clientWrapper}>
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>💰 Currency Preferences</h3>

        <div style={styles.currentValue}>
          <span style={styles.label}>Current Currency:</span>
          <span style={styles.valueLarge}>{currency}</span>
        </div>

        <div style={styles.currentValue}>
          <span style={styles.label}>Current Theme:</span>
          <span style={styles.value}>{theme}</span>
        </div>

        {/* FEATURE-GATED FORM */}
        {/* This form only renders if currencyToggleEnabled feature flag is true */}
        {/* This demonstrates server-side configuration of client features */}
        {currencyToggleEnabled ? (
          <div style={styles.formSection}>
            <h4 style={styles.sectionTitle}>Change Currency</h4>

            {/* Form that triggers Server Action */}
            <form action={updateUserCurrency} style={styles.form}>
              <div style={styles.radioGroup}>
                <label style={styles.radioLabel}>
                  <input
                    type="radio"
                    name="currency"
                    value="USD"
                    defaultChecked={currency === 'USD'}
                    style={styles.radio}
                  />
                  <span style={styles.radioText}>🇺🇸 USD - US Dollar</span>
                </label>

                <label style={styles.radioLabel}>
                  <input
                    type="radio"
                    name="currency"
                    value="EUR"
                    defaultChecked={currency === 'EUR'}
                    style={styles.radio}
                  />
                  <span style={styles.radioText}>🇪🇺 EUR - Euro</span>
                </label>

                <label style={styles.radioLabel}>
                  <input
                    type="radio"
                    name="currency"
                    value="GBP"
                    defaultChecked={currency === 'GBP'}
                    style={styles.radio}
                  />
                  <span style={styles.radioText}>🇬🇧 GBP - British Pound</span>
                </label>

                <label style={styles.radioLabel}>
                  <input
                    type="radio"
                    name="currency"
                    value="JPY"
                    defaultChecked={currency === 'JPY'}
                    style={styles.radio}
                  />
                  <span style={styles.radioText}>🇯🇵 JPY - Japanese Yen</span>
                </label>

                <label style={styles.radioLabel}>
                  <input
                    type="radio"
                    name="currency"
                    value="CAD"
                    defaultChecked={currency === 'CAD'}
                    style={styles.radio}
                  />
                  <span style={styles.radioText}>🇨🇦 CAD - Canadian Dollar</span>
                </label>
              </div>

              {/* Submit button with loading state via useFormStatus */}
              {/* This MUST be a child component of the form to access useFormStatus */}
              <SubmitButton label="Update Currency" loadingLabel="Updating..." />
            </form>

            <div style={styles.explanation}>
              <p style={styles.explanationText}>
                <strong>💡 Pattern:</strong> This form triggers a <em>Server Action</em> that
                mutates the database and calls <code>revalidatePath()</code>. The entire
                Server Component re-executes, fetching fresh data from the updated database.
                The submit button uses <code>useFormStatus()</code> to show loading state.
              </p>
            </div>
          </div>
        ) : (
          <div style={styles.disabledFeature}>
            <p style={styles.disabledFeatureText}>
              🔒 <strong>Feature Disabled:</strong> Currency toggle is currently disabled
              by the feature flag. Enable it below to access this functionality.
            </p>
          </div>
        )}
      </div>

      {/* Feature Flag Control Section */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>⚙️ Feature Flag Controls</h3>

        <div style={styles.featureFlagStatus}>
          <span style={styles.label}>Currency Toggle Feature:</span>
          <span style={{
            ...styles.badge,
            backgroundColor: currencyToggleEnabled ? '#d1fae5' : '#fee2e2',
            color: currencyToggleEnabled ? '#065f46' : '#991b1b'
          }}>
            {currencyToggleEnabled ? '✓ Enabled' : '✗ Disabled'}
          </span>
        </div>

        <form action={toggleFeatureFlag} style={styles.form}>
          <input type="hidden" name="flagName" value="currencyToggleEnabled" />
          <SubmitButton
            label={currencyToggleEnabled ? 'Disable Feature' : 'Enable Feature'}
            loadingLabel="Toggling..."
          />
        </form>

        <div style={styles.explanation}>
          <p style={styles.explanationText}>
            <strong>💡 Pattern:</strong> Feature flags are stored server-side and control
            client UI rendering. Toggle this flag to see how the currency form above
            appears/disappears. This demonstrates runtime configuration without code deployment.
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
  clientWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
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
  currentValue: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '12px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    marginBottom: '12px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#6b7280'
  },
  value: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827'
  },
  valueLarge: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#3b82f6',
    fontFamily: 'Monaco, Consolas, "Courier New", monospace'
  },
  formSection: {
    marginTop: '24px',
    paddingTop: '24px',
    borderTop: '2px solid #e5e7eb'
  },
  sectionTitle: {
    margin: '0 0 16px 0',
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  radioGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: '2px solid transparent'
  },
  radio: {
    width: '18px',
    height: '18px',
    cursor: 'pointer'
  },
  radioText: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#111827'
  },
  submitButton: {
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#3b82f6',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    alignSelf: 'flex-start'
  },
  disabledFeature: {
    marginTop: '24px',
    padding: '20px',
    backgroundColor: '#fef2f2',
    borderRadius: '8px',
    border: '2px solid #fecaca'
  },
  disabledFeatureText: {
    margin: 0,
    fontSize: '14px',
    color: '#991b1b',
    lineHeight: '1.6'
  },
  featureFlagStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '12px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    marginBottom: '16px'
  },
  badge: {
    fontSize: '12px',
    fontWeight: '600',
    padding: '6px 12px',
    borderRadius: '12px'
  },
  explanation: {
    backgroundColor: '#eff6ff',
    borderRadius: '8px',
    padding: '16px',
    borderLeft: '4px solid #3b82f6',
    marginTop: '16px'
  },
  explanationText: {
    margin: 0,
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#1e40af'
  }
};
