import { APIGatewayAuthorizerEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { PokemonClient } from 'pokenode-ts';


async function handler(event: APIGatewayAuthorizerEvent, context: Context  ) {
    const api = new PokemonClient();
    const res = await api
        .listPokemons()
        .then((data) => console.log(data))
        .catch((error) => console.error(error));
    
    const response:APIGatewayProxyResult = {
        statusCode: 200,
        body: JSON.stringify(res)
    }

    return response;
};

export {handler};