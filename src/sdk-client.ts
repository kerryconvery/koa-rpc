import { buildClientSdk } from "./rpc/client-side";
import { stringRouteDefinition } from "./routeDefinition";
import { createHttpClient } from "./rpc/httpClient";

const clientSdk = buildClientSdk(createHttpClient(), 'http://localhost:3000', stringRouteDefinition)

export default clientSdk;
export type ClientSdk = typeof clientSdk