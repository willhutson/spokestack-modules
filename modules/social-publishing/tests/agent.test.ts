import { describe, it, expect } from "vitest";
import { socialPublishingAgent } from "../src/agent/social-publishing-agent";
import { allToolNames } from "../src/tools/index";
import * as accounts from "../src/tools/accounts";
import * as posts from "../src/tools/posts";
import * as scheduling from "../src/tools/scheduling";
import * as campaigns from "../src/tools/campaigns";

describe("Social Publishing Agent Definition", () => {
  it("has a valid name", () => {
    expect(socialPublishingAgent.name).toBe("social_publishing_agent");
  });

  it("has a non-empty system_prompt", () => {
    expect(socialPublishingAgent.system_prompt.length).toBeGreaterThan(100);
  });

  it("tool_names is a non-empty array", () => {
    expect(socialPublishingAgent.tool_names).toBeInstanceOf(Array);
    expect(socialPublishingAgent.tool_names.length).toBe(24);
  });

  it("all tool_names are present in allToolNames export", () => {
    for (const name of socialPublishingAgent.tool_names) {
      expect(allToolNames).toContain(name);
    }
  });

  it("all exported tool handlers return non-null data", async () => {
    const tools = [
      accounts.connectAccount, accounts.listAccounts, accounts.disconnectAccount, accounts.getAccountSpecs,
      posts.createPost, posts.listPosts, posts.getPost, posts.updatePost, posts.deletePost,
      scheduling.schedulePost, scheduling.publishNow, scheduling.listScheduled, scheduling.cancelScheduled,
      scheduling.getPublishLog, scheduling.listPublishJobs,
      campaigns.trackCampaign, campaigns.addCampaignActivity, campaigns.manageCampaignMembers, campaigns.analyzeEngagement,
    ];

    for (const tool of tools) {
      const result = await tool.handler({
        orgId: "org_test", clientId: "client_test", platform: "INSTAGRAM",
        accountName: "test", postId: "post_test", scheduledFor: new Date().toISOString(),
        jobId: "job_test", campaignId: "camp_test", action: "create",
        activityType: "note", description: "test", monitorId: "mon_test",
        accountId: "sa_test", title: "Test", caption: "Test caption",
        platforms: ["INSTAGRAM"], contentType: "IMAGE", firstName: "Test",
      });
      expect(result).not.toBeNull();
      expect(result).not.toBeUndefined();
    }
  });

  it("system_prompt references all tool names", () => {
    for (const name of allToolNames) {
      expect(socialPublishingAgent.system_prompt).toContain(name);
    }
  });

  it("no tool handler returns accessToken or refreshToken", async () => {
    const result = await accounts.connectAccount.handler({
      orgId: "org_test", clientId: "client_test", platform: "INSTAGRAM", accountName: "test",
    });
    expect(result.accessToken).toBeUndefined();
    expect(result.refreshToken).toBeUndefined();

    const list = await accounts.listAccounts.handler({ orgId: "org_test" });
    for (const account of list) {
      expect(account.accessToken).toBeUndefined();
      expect(account.refreshToken).toBeUndefined();
    }
  });
});
