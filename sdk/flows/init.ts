/**
 * Flow Initialization — registers all cross-module flow handlers.
 */

import { registerFlow } from './registry';
import { autoInvoiceOnOrder } from '../../modules/finance/src/flows/auto-invoice-on-order';
import { projectInvoiceOnComplete } from '../../modules/finance/src/flows/project-invoice-on-complete';
import { initClientRecord } from '../../modules/crm/src/flows/init-client-record';
import { updateMilestoneProgress } from './handlers/update-milestone-progress';
import { createBriefTasks } from './handlers/create-brief-tasks';
import { refreshDashboardOnSync } from '../../modules/analytics/src/flows/refresh-on-sync';
import { checkDeliverablesOnBriefComplete } from './handlers/check-deliverables';

export function initializeFlows() {
  registerFlow(autoInvoiceOnOrder);
  registerFlow(projectInvoiceOnComplete);
  registerFlow(initClientRecord);
  registerFlow(updateMilestoneProgress);
  registerFlow(createBriefTasks);
  registerFlow(refreshDashboardOnSync);
  registerFlow(checkDeliverablesOnBriefComplete);
}
