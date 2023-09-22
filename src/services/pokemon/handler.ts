import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { PokemonClient } from 'pokenode-ts';



async function handler(event: APIGatewayProxyEvent, context: Context) {
    const api = new PokemonClient();

    try {
        const res = await api.listPokemons();
        console.log(res);

        return {
            statusCode: 200,
            body: JSON.stringify(res)
        }

    } catch (error) {
        return {
            statusCode: 200,
            body: JSON.stringify("error")
        }
    }
}

export { handler }