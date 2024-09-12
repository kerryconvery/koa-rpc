import { buildClientSdk } from "./rpc/client-side";
import { routeDefinition } from "./routeDefinition";
import { Result } from "./rpc/types";
import { CandidateOutput } from "./types";

const clientSdk = buildClientSdk('http://localhost:3000', routeDefinition)

export default clientSdk;
export type ClientSdk = typeof clientSdk

clientSdk.echo({ value: 'hello' }).then((result) => console.log('echo:', result.data))
clientSdk.split({ value: 'q,w,e,r,t,y', delimiter: ',' }).then((result) => console.log('split:', result.data))
clientSdk.getCandidate({ candidateId: 1245678 }).then((result: Result<CandidateOutput>) => console.log(result.data))