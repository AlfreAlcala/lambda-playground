import { SecretValue, Stack, StackProps, Tags } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as iam from "aws-cdk-lib/aws-iam"
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager"

export class InfraUsers extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);
    const users = ["lukas.fruntke", "frank.kouokam.tagne", "michal.morvay", "ondrej.rimovsky", "dominik.wagenknecht", "florin.zamfir"]

    const adminAccess = iam.ManagedPolicy.fromManagedPolicyArn(this, "admin", "arn:aws:iam::aws:policy/AdministratorAccess")
    for (let userName of users) {
      const user = new iam.User(this, userName, {
        userName,
        managedPolicies: [adminAccess]
      })
      const accessKey = new iam.AccessKey(this, `${userName}-AccessKey`, { user });
      const secret = new secretsmanager.Secret(this, `${userName}-Secret`, {
        secretStringValue: SecretValue.unsafePlainText(`[default]
aws_access_key_id = ${accessKey.accessKeyId}
aws_secret_access_key = ${accessKey.secretAccessKey.unsafeUnwrap()}`),
    });
      Tags.of(user).add("Type", "AppID")
    }
    }
}