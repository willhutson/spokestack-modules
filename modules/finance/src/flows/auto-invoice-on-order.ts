import type { FlowHandler } from '../../../../sdk/types/flow-handler';

export const autoInvoiceOnOrder: FlowHandler = {
  id: 'FINANCE:createInvoiceDraft',
  description: 'Auto-generate a draft invoice when a new order is created',
  trigger: { entityType: 'Order', action: 'created' },

  async execute(event, context) {
    const res = await fetch(`${context.coreApiUrl}/api/v1/orders/${event.entityId}`, {
      headers: context.headers,
    });
    if (!res.ok) return { success: false, error: `Failed to fetch order: ${res.status}` };
    const order = await res.json();

    const invoiceRes = await fetch(`${context.coreApiUrl}/api/v1/invoices`, {
      method: 'POST',
      headers: { ...context.headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        organizationId: event.organizationId,
        clientId: order.clientId,
        orderId: order.id,
        status: 'DRAFT',
        items: order.items?.map((item: any) => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })) ?? [],
      }),
    });

    if (!invoiceRes.ok) return { success: false, error: `Failed to create invoice: ${invoiceRes.status}` };
    const invoice = await invoiceRes.json();

    return {
      success: true,
      created: [{ entityType: 'Invoice', entityId: invoice.id }],
      message: `Draft invoice ${invoice.id} created for order ${order.id}`,
    };
  },
};
