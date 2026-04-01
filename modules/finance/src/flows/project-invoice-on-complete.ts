import type { FlowHandler } from '../../../../sdk/types/flow-handler';

export const projectInvoiceOnComplete: FlowHandler = {
  id: 'FINANCE:generateProjectInvoice',
  description: 'Generate final invoice when a project completes',
  trigger: {
    entityType: 'Project',
    action: 'status_changed',
    conditions: { toStatus: 'COMPLETED' },
  },

  async execute(event, context) {
    const res = await fetch(`${context.coreApiUrl}/api/v1/projects/${event.entityId}`, {
      headers: context.headers,
    });
    if (!res.ok) return { success: false, error: `Failed to fetch project: ${res.status}` };
    const project = await res.json();

    if (!project.clientId) {
      return { success: true, message: 'Project has no client — skipping invoice generation' };
    }

    const invoiceRes = await fetch(`${context.coreApiUrl}/api/v1/invoices`, {
      method: 'POST',
      headers: { ...context.headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        organizationId: event.organizationId,
        clientId: project.clientId,
        projectId: project.id,
        status: 'DRAFT',
        metadata: { source: 'project_completion', projectName: project.name },
      }),
    });

    if (!invoiceRes.ok) return { success: false, error: `Failed to create invoice: ${invoiceRes.status}` };
    const invoice = await invoiceRes.json();

    return {
      success: true,
      created: [{ entityType: 'Invoice', entityId: invoice.id }],
    };
  },
};
