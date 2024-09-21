import { buildClientSdk } from "./rpc/client-side";
import { stringRouteDefinition } from "./routeDefinition";

const clientSdk = buildClientSdk('http://localhost:3000', stringRouteDefinition)

export default clientSdk;
export type ClientSdk = typeof clientSdk