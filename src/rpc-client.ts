import { buildClientSdk } from "./rpc/client-side";
import { routeDefinition } from "./routeDefinition";

const clientSdk = buildClientSdk('http://localhost:3000', routeDefinition)

export default clientSdk;
export type ClientSdk = typeof clientSdk