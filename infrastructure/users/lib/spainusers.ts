import { SecretValue, Stack, StackProps, Tags } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as iam from "aws-cdk-lib/aws-iam"
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager"

export class SpainUsers extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);
    const users = `david.urdiales.nieto@accenture.com
alfredo.alcala.paz@pragsis.com
r.rodriguez.salazar@pragsis.com
sara.a.aparicio@accenture.com
jose.pazos.ameneiro@accenture.com
francisco.luque@accenture.com
j.venegas.gordillo@accenture.com
juan.bejarano.bueno@accenture.com
david.f.bernad@accenture.com
e.mittendorfer@accenture.com
p.raigada.romero@accenture.com
ladislao.rueda@accenture.com
r.cobos.castillo@accenture.com
liling.qu@accenture.com`.split('\n')

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