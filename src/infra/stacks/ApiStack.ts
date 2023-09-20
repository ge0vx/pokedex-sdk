import { Stack, StackProps } from "aws-cdk-lib";
import { Cors, LambdaIntegration, ResourceOptions, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";

interface ApiStackProps extends StackProps {
    favPokemonIntegration: LambdaIntegration
}

export class ApiStack extends Stack {

    constructor(scope: Construct, id: string, props?: ApiStackProps){
        super(scope, id, props);

        const api = new RestApi(this, 'favPokemonApi');

        const optionsWithCors: ResourceOptions = {
            defaultCorsPreflightOptions: {
                allowOrigins: Cors.ALL_ORIGINS,
                allowMethods: Cors.ALL_METHODS,
            }
        }

        const favPokemonResource = api.root.addResource('favPokemon', optionsWithCors);
        favPokemonResource.addMethod('GET', props.favPokemonIntegration)
        favPokemonResource.addMethod('POST', props.favPokemonIntegration)
        
    }
}