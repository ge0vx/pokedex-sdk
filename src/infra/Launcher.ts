import { App } from "aws-cdk-lib";
import { DataStack } from "./stacks/DataStack";
import { LambdaStack } from "./stacks/LambdaStack";
import { ApiStack } from "./stacks/ApiStack";

const app = new App();
const dataStack = new DataStack(app, 'DataStackFavPokemon');
const lambdaStack = new LambdaStack(app, 'LambdaStackFavPokemon', {
    favPokemonTable : dataStack.favPokemonTable
});

new ApiStack(app, 'ApiStackFavPokemon', {
    favPokemonIntegration: lambdaStack.favPokemonIntegration,
    pokemonLambdaIntegration: lambdaStack.pokemonLamdaIntegration
})