import { Stack, StackProps } from "aws-cdk-lib";
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";

interface LambdaStackProps extends StackProps {
    favPokemonTable: ITable
}

export class LambdaStack extends Stack {

    public readonly favPokemonIntegration: LambdaIntegration;

    constructor(scope: Construct, id: string, props?: LambdaStackProps){
        super(scope, id, props);

        const favPokemonLambda = new NodejsFunction(this, 'favPokemonLambda',{
            runtime: Runtime.NODEJS_18_X,
            handler: 'handler',
            entry: join(__dirname, '..', '..', 'services', 'favPokemon', 'handler.ts'),
            environment: {
                TABLE_NAME: props.favPokemonTable.tableName
            }
        })

        favPokemonLambda.addToRolePolicy(new PolicyStatement({
            effect: Effect.ALLOW,
            resources: [props.favPokemonTable.tableArn],
            actions:[
                'dynamodb:PutItem',
                'dynamodb:Scan'
            ]
        }))
        
        this.favPokemonIntegration = new LambdaIntegration(favPokemonLambda)
    }
}