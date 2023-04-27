import { SecretValue, Stack, StackProps, Tags } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as iam from "aws-cdk-lib/aws-iam"
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager"

export class ItalyUsers extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);
    const users = `v.serafini@accenture.com
daniele.piergigli@accenture.com
pasquale.di.rienzo@accenture.com
federico.gandini@accenture.com
marasco.mirko@accenture.com
miguel.angel.sepe@accenture.com
michele.benciolini@accenture.com
alessandro.fenoglio@accenture.com
francesco.nicolao@accenture.com
salvatore.trovato@accenture.com
luigi.buondonno@accenture.com`.split('\n')
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