import { App } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { DataStack } from "../../src/infra/stacks/DataStack";

describe('Initial test suite', ()=>{

    let dataStackTemplate: Template;

    beforeAll(()=>{
        const testApp = new App({
            outdir: 'cdk.out'
        })

        const dataStack = new DataStack(testApp, 'DataStackFavPokemon');
        dataStackTemplate = Template.fromStack(dataStack);
    })


    test('DynamoDB properties', ()=>{
        dataStackTemplate.hasResourceProperties('AWS::DynamoDB::Table', {
            TableName: "favPokemonTable"
        })
    });

    test('DynamoDB Table snapshot', ()=>{
        const dynamoTable = dataStackTemplate.findResources('AWS::DynamoDB::Table')
        expect(dynamoTable).toMatchSnapshot();
    });

    test('CDK Metadata snapshot', ()=>{
        const cdkMetadata = dataStackTemplate.findResources('AWS::CDK::Metadata')
        expect(cdkMetadata).toMatchSnapshot();
    });
});