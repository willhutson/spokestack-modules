/**
 * CRM Deals Page — pipeline view and deal management.
 */

import React from "react";

export function CrmDealsPage() {
  return (
    <div className="crm-deals-page">
      <header className="page-header">
        <h1>Deals</h1>
        <div className="page-actions">
          <button className="btn-primary">New Deal</button>
        </div>
      </header>

      <div className="pipeline-board">
        {["Lead", "Qualified", "Proposal", "Negotiation", "Closed Won", "Closed Lost"].map((stage) => (
          <div key={stage} className="pipeline-column">
            <h3 className="column-header">{stage}</h3>
            <div className="deal-cards">
              <div className="empty-column">No deals</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
