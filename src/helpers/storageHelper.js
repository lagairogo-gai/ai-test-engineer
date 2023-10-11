import { properties } from "@forge/api";

export const storageGetHelper = async (issueKey) =>
  await properties.onJiraIssue(issueKey).get("test_gen");

export const storageSetHelper = async (issueKey, record) =>
  await properties.onJiraIssue(issueKey).set("test_gen", record);
