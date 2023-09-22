import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { PokemonClient } from 'pokenode-ts';
import { Pokemon } from "../models/Pokemon";
import { addCorsHeader } from "../helpers";

async function handler(event: APIGatewayProxyEvent) {
    const api = new PokemonClient();
    let response: APIGatewayProxyResult;
    
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
                    response = {
                        statusCode: 200,
                        body: JSON.stringify({results:[pokemon]})
                    }
                } else {
                    response = {
                        statusCode: 400,
                        body: JSON.stringify(`${pokemon} not found!`)
                    }
                }
        
            } catch (error) {
                response = {
                    statusCode: 200,
                    body: JSON.stringify("error")
                }
            }
        }
    }else{
        try {
            const res = await api.listPokemons();
    
            response = {
                statusCode: 200,
                body: JSON.stringify(res)
            }
    
        } catch (error) {
            response = {
                statusCode: 200,
                body: JSON.stringify("error")
            }
        }
    }

    addCorsHeader(response)
    return response;
}

export { handler }