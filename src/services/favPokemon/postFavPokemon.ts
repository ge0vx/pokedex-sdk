import { DynamoDBClient, PutItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { v4 } from "uuid";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

export async function postFavPokemon(event:APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {
    
    const item = JSON.parse(event.body);
    item.pokemon_id = item.pokemon_id;
    item.name = item.name;
    item.default_sprite = item.default_sprite;
    item.types = item.types;
    item.user_id = item.user_id;
    item.id = v4();

    if(!item.name || !item.user_id){
        return {
            statusCode: 200,
            body: JSON.stringify(`Pokemon name and user is required!`)
        }
    }else{

        const getItemResponse = await ddbClient.send(new ScanCommand({
            TableName: process.env.TABLE_NAME,
            FilterExpression: "user_id = :user_id",
            ExpressionAttributeValues: {
                ":user_id": { S: item.user_id }
            },
        }))

        const unmashalledItems = getItemResponse.Items?.map(item => unmarshall(item));
        const filterData = unmashalledItems.filter((i)=>i.name===item.name)
        if(filterData.length>0){
            return {
                statusCode: 400,
                body: JSON.stringify(`Pokemon ${item.name} added for this user`)
            }
        }
    }

    await ddbClient.send(new PutItemCommand({
        TableName: process.env.TABLE_NAME,
        Item: marshall(item)
    }));

    return {
        statusCode: 200,
        body: JSON.stringify({item})
    }
}
