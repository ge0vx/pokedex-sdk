import { Stack, StackProps } from "aws-cdk-lib";
import { AttributeType, ITable, Table } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

export class DataStack extends Stack {

    public readonly favPokemonTable: ITable;

    constructor(scope: Construct, id: string, props?: StackProps){
        super(scope, id, props)

        this.favPokemonTable = new Table(this, 'favPokemonTable', {
            partitionKey : {
                name: 'id',
                type: AttributeType.STRING
            },
            tableName : 'favPokemonTable'
        })
    }
}