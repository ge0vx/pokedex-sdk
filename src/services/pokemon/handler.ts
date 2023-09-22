import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { PokemonClient } from 'pokenode-ts';
import { Pokemon } from "../models/Pokemon";



async function handler(event: APIGatewayProxyEvent, context: Context) {
    const api = new PokemonClient();
    
    if(event.queryStringParameters) {
        if ('pokemon_name' in event.queryStringParameters) {
            const pokemon = event.queryStringParameters['pokemon_name'];
            try {
                const getItemResponse = await api.getPokemonByName(pokemon);

                if (getItemResponse) {
                    const pokemon:Pokemon = {
                        pokemon_id: getItemResponse.id,
                        name: getItemResponse.name,
                        default_sprite: getItemResponse?.sprites?.front_default,
                    }
                    return {
                        statusCode: 200,
                        body: JSON.stringify({results:[pokemon]})
                    }
                } else {
                    return {
                        statusCode: 400,
                        body: JSON.stringify(`${pokemon} not found!`)
                    }
                }
        
            } catch (error) {
                return {
                    statusCode: 200,
                    body: JSON.stringify("error")
                }
            }
        }
    }

    try {
        const res = await api.listPokemons();

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