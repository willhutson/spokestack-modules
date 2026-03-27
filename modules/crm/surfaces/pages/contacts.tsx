/**
 * CRM Contacts Page — contact list and management.
 */

import React from "react";

export function CrmContactsPage() {
  return (
    <div className="crm-contacts-page">
      <header className="page-header">
        <h1>Contacts</h1>
        <div className="page-actions">
          <button className="btn-primary">Add Contact</button>
        </div>
      </header>

      <div className="contacts-filters">
        <input type="search" placeholder="Search contacts..." className="search-input" />
        <select className="status-filter">
          <option value="">All Statuses</option>
          <option value="lead">Lead</option>
          <option value="active">Active</option>
          <option value="customer">Customer</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <table className="contacts-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Company</th>
            <th>Status</th>
            <th>Score</th>
            <th>Last Contact</th>
          </tr>
        </thead>
        <tbody>
          <tr className="empty-state">
            <td colSpan={6}>No contacts found. Add your first contact to get started.</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
