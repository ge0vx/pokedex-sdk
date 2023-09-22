import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { postFavPokemon } from "./postFavPokemon";
import { getFavPokemon } from "./getFavPokemon";
import { addCorsHeader } from "../helpers";


const ddbClient = new DynamoDBClient({});

async function handler(event:APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {

    let response: APIGatewayProxyResult;

    try {
        switch (event.httpMethod) {
            case 'GET':
                const getResponse = await getFavPokemon(event, ddbClient);
                response = getResponse;
                break;
            case 'POST':
                const postResponse = await postFavPokemon(event, ddbClient);
                response = postResponse;
                break;
            default:
                break;
        }
    } catch(error) {

        response = {
            statusCode: 500,
            body: JSON.stringify(error.message)
        }
    }
    
    addCorsHeader(response)
    return response;
}

export { handler }