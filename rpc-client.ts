import { createRpcClient } from "./src/client-builder";
import { routerDef } from "./types";

const rpcClient = createRpcClient('', routerDef)

export default rpcClient;
export type RpcClient = typeof rpcClient