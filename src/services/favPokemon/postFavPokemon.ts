import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { v4 } from "uuid";
import { marshall } from "@aws-sdk/util-dynamodb";

export async function postFavPokemon(event:APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {
    
    const item = JSON.parse(event.body);
    item.pokemon_id = item.pokemon_id;
    item.name = item.name;
    item.default_sprite = item.default_sprite;
    item.types = item.types;
    item.user_id = item.user_id;
    item.id = v4();

    await ddbClient.send(new PutItemCommand({
        TableName: process.env.TABLE_NAME,
        Item: marshall(item)
    }));

    return {
        statusCode: 200,
        body: JSON.stringify({item})
    }
}
