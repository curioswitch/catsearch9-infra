import { GoogleBetaProvider } from "@cdktf/provider-google-beta/lib/provider/index.js";
import { GoogleProvider } from "@cdktf/provider-google/lib/provider/index.js";
import { CurioStack } from "@curioswitch/cdktf-constructs";
import { GcsBackend, TerraformStack } from "cdktf";
import type { Construct } from "constructs";

export interface CatSearchConfig {
  environment: string;
  project: string;
  domain: string;
}

export class CatSearchStack extends TerraformStack {
  constructor(scope: Construct, config: CatSearchConfig) {
    super(scope, config.environment);

    new GcsBackend(this, {
      bucket: `${config.project}-tfstate`,
    });

    new GoogleProvider(this, "google", {
      project: config.project,
      region: "us-central1",
      userProjectOverride: true,
    });

    const googleBeta = new GoogleBetaProvider(this, "google-beta", {
      project: config.project,
      region: "us-central1",
      userProjectOverride: true,
    });

    new CurioStack(this, {
      project: config.project,
      location: "us-central1",
      domain: config.domain,
      githubRepo: "curioswitch/catsearch9",
      githubEnvironment: config.environment,
      googleBeta,
    });
  }
}
