import { Stack, StackProps, CfnOutput, Duration, Expiration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as appsync from '@aws-cdk/aws-appsync-alpha';
import * as iam from 'aws-cdk-lib/aws-iam';

export class PompCodeChallengeStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create the AppSync API
    const api = new appsync.GraphqlApi(this, 'api', {
      name: 'pomp-challenge-appsync-api',
      schema: appsync.Schema.fromAsset('lib/graphql/schema.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: Expiration.after(Duration.days(365))
          }
        },
      },
    });

    // Creates a VPC to allow/restrict access to our database
    const vpc = new ec2.Vpc(this, 'vpc', {
      natGateways: 0,
      subnetConfiguration: [
        { name: 'public', cidrMask: 24, subnetType: ec2.SubnetType.PUBLIC },
      ]});

    // Setup the security group
    const databaseSG = new ec2.SecurityGroup(this, 'database-sg', {
      vpc,
      allowAllOutbound: true,
    });

    // Allow traffic on port 5432
    databaseSG.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(5432),
      'allow pSQL traffic from anywhere',
    );

    // Creates a database cluster where we can save our todos
    const database = new rds.DatabaseCluster(this, `database`, {
      engine: rds.DatabaseClusterEngine.auroraPostgres({ version: rds.AuroraPostgresEngineVersion.VER_12_8 }),
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MEDIUM),
        vpc,
        vpcSubnets: {
          subnetType: ec2.SubnetType.PUBLIC
        },
        securityGroups: [ databaseSG ],
      },
      defaultDatabaseName: 'pomp'
    });

    database.connections.allowFromAnyIpv4(ec2.Port.tcp(5432));

    // Create the Lambda function that will map GraphQL operations into Postgres
    const datasource = new lambda.Function(this, 'datasource', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: new lambda.AssetCode('dist/'),
      handler: 'index.handler',
      memorySize: 512,
      timeout: Duration.minutes(3),
      environment: {
        DATABASE_CREDENTIALS: database.secret?.secretName || '',
        DB_NAME: 'pomp',
        AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1'
      },
    });

    // Add lambda as a data source to process the results from AppSync
    const lambdaDs = api.addLambdaDataSource('lambdaDatasource', datasource);

    // Map the resolvers to the Lambda function
    lambdaDs.createResolver({
      typeName: 'Query',
      fieldName: 'listTodos'
    });
    lambdaDs.createResolver({
      typeName: 'Mutation',
      fieldName: 'createTodo'
    });
    lambdaDs.createResolver({
      typeName: 'Mutation',
      fieldName: 'markTodoAsComplete'
    });


    // 👇 create a policy statement
    const policy = new iam.PolicyStatement({
      actions: ['secretsmanager:*'],
      resources: [database.secret?.secretArn ?? ''],
    });

    // 👇 add the policy to the Function's role
    datasource.role?.attachInlinePolicy(
      new iam.Policy(this, 'secrets-manager-policy', {
        statements: [policy],
      }),
    );

    new CfnOutput(this, 'api-url', {
      value: api.graphqlUrl
    });

    new CfnOutput(this, 'api-key', {
      value: api.apiKey || ''
    });

    new CfnOutput(this, 'database-secret', {
      value: database.secret?.secretName ?? ''
    });
  }
}
