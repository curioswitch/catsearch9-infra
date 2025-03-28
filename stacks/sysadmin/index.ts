import { GithubProvider } from "@cdktf/provider-github/lib/provider/index.js";
import { TeamMembers } from "@cdktf/provider-github/lib/team-members/index.js";
import { GoogleBetaProvider } from "@cdktf/provider-google-beta/lib/provider/index.js";
import { DataGoogleBillingAccount } from "@cdktf/provider-google/lib/data-google-billing-account/index.js";
import { DataGoogleOrganization } from "@cdktf/provider-google/lib/data-google-organization/index.js";
import { GoogleProvider } from "@cdktf/provider-google/lib/provider/index.js";
import { RandomProvider } from "@cdktf/provider-random/lib/provider/index.js";
import { Bootstrap } from "@curioswitch/cdktf-constructs";
import { GcsBackend, TerraformStack } from "cdktf";
import type { Construct } from "constructs";

export class SysadminStack extends TerraformStack {
  constructor(scope: Construct) {
    super(scope, "sysadmin");

    new GithubProvider(this, "github", {
      owner: "curioswitch",
    });

    new GoogleProvider(this, "google", {
      project: "catsearch9-sysadmin",
      region: "us-central1",
    });

    new RandomProvider(this, "random", {});

    const googleBeta = new GoogleBetaProvider(this, "google-beta", {
      project: "catsearch9-sysadmin",
      region: "us-central1",
    });

    const org = new DataGoogleOrganization(this, "curioswitch-org", {
      domain: "curioswitch.org",
    });

    const billing = new DataGoogleBillingAccount(this, "curioswitch-billing", {
      displayName: "curioswitch-billing",
    });

    const bootstrap = new Bootstrap(this, {
      name: "catsearch9",
      organizationId: org.orgId,
      billingAccountId: billing.id,
      githubOrg: "curioswitch",
      domain: "catsearch9.curioswitch.org",
      appRepositoryConfig: {
        description: "A cat searcher",
        hasIssues: true,
        hasProjects: true,
        hasWiki: false,
        homepageUrl: "https://catsearch.curioswitch.org",
      },
      googleBeta,
    });

    new TeamMembers(this, "github-admins", {
      teamId: bootstrap.githubAdmins.id,
      members: [
        {
          role: "maintainer",
          username: "chokoswitch",
        },
      ],
    });

    if (false) {
      new GcsBackend(this, {
        bucket: bootstrap.sysadminProject.tfstateBucketName,
      });
    }
  }
}
