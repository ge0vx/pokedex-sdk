import { App } from "aws-cdk-lib";
import { LambdaStack } from "../../src/infra/stacks/LambdaStack";
import { Template } from "aws-cdk-lib/assertions";
import { DataStack } from "../../src/infra/stacks/DataStack";
import { ApiStack } from "../../src/infra/stacks/ApiStack";

describe('Initial test suite', ()=>{

    let apiStackTemplate: Template;

    beforeAll(()=>{
        const testApp = new App({
            outdir: 'cdk.out'
        })

        const dataStack = new DataStack(testApp, 'DataStackFavPokemon');
        const lambdaStack = new LambdaStack(testApp, 'LambdaStackFavPokemon', {
            favPokemonTable : dataStack.favPokemonTable
        });
        const apiStack = new ApiStack(testApp, 'ApiStackFavPokemon', {
            favPokemonIntegration: lambdaStack.favPokemonIntegration,
            pokemonLambdaIntegration: lambdaStack.pokemonLamdaIntegration
        })

        apiStackTemplate = Template.fromStack(apiStack);
    })

    test('ApiGateway properties', ()=>{
        apiStackTemplate.hasResourceProperties('AWS::ApiGateway::RestApi', {
            Name: "favPokemonApi"
        })
    });

    test('ApiGateway Rest API service snapshot', ()=>{
        expect(apiStackTemplate.toJSON()).toMatchSnapshot();
    })
    
});