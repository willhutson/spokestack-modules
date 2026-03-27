/**
 * CRM Dashboard Widgets — placeholder React components.
 * In production, these are dynamically loaded by spokestack-core's
 * surface renderer based on the registry.
 */

import React from "react";

// ---------------------------------------------------------------------------
// Pipeline Overview Widget
// ---------------------------------------------------------------------------
interface PipelineStage {
  name: string;
  count: number;
  value: number;
}

interface PipelineWidgetProps {
  stages?: PipelineStage[];
  totalValue?: number;
  weightedForecast?: number;
}

export function CrmPipelineWidget({ stages = [], totalValue = 0, weightedForecast = 0 }: PipelineWidgetProps) {
  return (
    <div className="crm-pipeline-widget">
      <div className="pipeline-header">
        <h3>Pipeline Overview</h3>
        <div className="pipeline-totals">
          <span className="total-value">${totalValue.toLocaleString()}</span>
          <span className="weighted-forecast">Forecast: ${weightedForecast.toLocaleString()}</span>
        </div>
      </div>
      <div className="pipeline-stages">
        {stages.map((stage) => (
          <div key={stage.name} className="pipeline-stage">
            <div className="stage-name">{stage.name}</div>
            <div className="stage-count">{stage.count} deals</div>
            <div className="stage-value">${stage.value.toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Recent Contacts Widget
// ---------------------------------------------------------------------------
interface RecentContact {
  id: string;
  name: string;
  email?: string;
  company?: string;
  status: string;
  createdAt: string;
}

interface RecentContactsProps {
  contacts?: RecentContact[];
}

export function CrmRecentContacts({ contacts = [] }: RecentContactsProps) {
  return (
    <div className="crm-recent-contacts">
      <h3>Recent Contacts</h3>
      <ul className="contacts-list">
        {contacts.map((contact) => (
          <li key={contact.id} className="contact-item">
            <div className="contact-name">{contact.name}</div>
            {contact.company && <div className="contact-company">{contact.company}</div>}
            <div className="contact-status">{contact.status}</div>
          </li>
        ))}
        {contacts.length === 0 && <li className="empty-state">No contacts yet</li>}
      </ul>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Quick Add Contact Card
// ---------------------------------------------------------------------------
export function CrmQuickAddCard() {
  return (
    <div className="crm-quick-add-card">
      <h4>Quick Add Contact</h4>
      <p>Say "add contact" to your agent to quickly create a new CRM contact.</p>
    </div>
  );
}
