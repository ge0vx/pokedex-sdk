import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { postFavPokemon } from "./postFavPokemon";
import { getFavPokemon } from "./getFavPokemon";


const ddbClient = new DynamoDBClient({});

function addCorsHeader(arg: APIGatewayProxyResult){
    if(!arg.headers) {
        arg.headers = {}
    }
    arg.headers['Access-Control-Allow-Origin'] = "*";
    arg.headers['Access-Control-Allow-Methods'] = "*";
}

async function handler(event:APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

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

        return {
            statusCode: 500,
            body: JSON.stringify(error.message)
        }
    }
    
    addCorsHeader(response)
    return response;
}

export { handler }