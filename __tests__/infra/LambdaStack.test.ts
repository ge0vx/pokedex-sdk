import { App } from "aws-cdk-lib";
import { LambdaStack } from "../../src/infra/stacks/LambdaStack";
import { Template } from "aws-cdk-lib/assertions";
import { DataStack } from "../../src/infra/stacks/DataStack";

describe('Initial test suite', ()=>{

    let lambdaStackTemplate: Template;

    beforeAll(()=>{
        const testApp = new App({
            outdir: 'cdk.out'
        })

        const dataStack = new DataStack(testApp, 'DataStackFavPokemon');
        const lambdaStack = new LambdaStack(testApp, 'LambdaStackFavPokemon', {
            favPokemonTable : dataStack.favPokemonTable
        });

        lambdaStackTemplate = Template.fromStack(lambdaStack);
    })


    test('lambda properties', ()=>{
        lambdaStackTemplate.hasResourceProperties('AWS::Lambda::Function', {
            Handler: "index.handler",
            Runtime: "nodejs18.x"
        })
    });

    test('IAM Role snapshot', ()=>{
        const iamRole = lambdaStackTemplate.findResources('AWS::IAM::Role')
        expect(iamRole).toMatchSnapshot();
    });

    test('IAM Policy snapshot', ()=>{
        const iamPolicy = lambdaStackTemplate.findResources('AWS::IAM::Role')
        expect(iamPolicy).toMatchSnapshot();
    });

    test('Lambda service snapshot', ()=>{
        const lambda = lambdaStackTemplate.findResources('AWS::Lambda::Function')
        expect(lambda).toMatchSnapshot();
    });
});