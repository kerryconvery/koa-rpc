import { config } from "./config";
import { createClientSdk } from "./src/client-sdk-builder";
import { candidateRouteDefinition } from "./src/routeDefinition";

export const createSdk = createClientSdk(candidateRouteDefinition, config);

