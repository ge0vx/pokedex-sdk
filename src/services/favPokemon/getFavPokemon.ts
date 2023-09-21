import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export async function getFavPokemon(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {

    if(event.queryStringParameters) {
        if ('user_id' in event.queryStringParameters) {

            const user_id = event.queryStringParameters['user_id'];
            
            const getItemResponse = await ddbClient.send(new ScanCommand({
                TableName: process.env.TABLE_NAME,
                FilterExpression: "user_id = :user_id",
                ExpressionAttributeValues: {
                    ":user_id": { S: user_id }
                },
            }))
            
            if (getItemResponse) {
                const unmashalledItems = getItemResponse.Items?.map(item => unmarshall(item));

                return {
                    statusCode: 200,
                    body: JSON.stringify({results: unmashalledItems})
                }
            } else {
                return {
                    statusCode: 400,
                    body: JSON.stringify(`Pokemons with user not found!`)
                }
            }

        } else {
            return {
                statusCode: 400,
                body: JSON.stringify('User Id required!')
            }
        }
    }
    
    const result = await ddbClient.send(new ScanCommand({
        TableName: process.env.TABLE_NAME,
    }));

    const unmashalledItems = result.Items?.map(item => unmarshall(item));
    
    return {
        statusCode: 200,
        body: JSON.stringify(unmashalledItems)
    }
}