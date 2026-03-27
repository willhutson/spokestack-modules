/**
 * CRM Overview Page — main landing page for the CRM module.
 */

import React from "react";

export function CrmOverviewPage() {
  return (
    <div className="crm-overview-page">
      <header className="page-header">
        <h1>CRM</h1>
        <p>Manage contacts, track deals, and build relationships.</p>
      </header>

      <div className="overview-grid">
        <section className="overview-card">
          <h2>Contacts</h2>
          <p className="stat-placeholder">--</p>
          <p>Total contacts</p>
        </section>

        <section className="overview-card">
          <h2>Open Deals</h2>
          <p className="stat-placeholder">--</p>
          <p>Active opportunities</p>
        </section>

        <section className="overview-card">
          <h2>Pipeline Value</h2>
          <p className="stat-placeholder">$--</p>
          <p>Total pipeline value</p>
        </section>

        <section className="overview-card">
          <h2>This Week</h2>
          <p className="stat-placeholder">--</p>
          <p>Interactions logged</p>
        </section>
      </div>
    </div>
  );
}
