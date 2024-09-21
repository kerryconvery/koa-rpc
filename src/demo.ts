import clientSdk from "./sdk-client";
import { Result } from "./rpc/types";
import { CandidateOutput } from "./types";
import { createSdk } from "../candidate-client-sdk";

clientSdk.echo({ value: 'hello' }).then((result) => console.log('echo:', result.data))
clientSdk.split({ value: 'q,w,e,r,t,y', delimiter: ',' }).then((result) => console.log('split:', result.data))




const candidateClientSdk = createSdk('prod')

candidateClientSdk.getCandidate({ candidateId: 1245678 }).then((result: Result<CandidateOutput>) => console.log('get candidate result:', result.data))
candidateClientSdk.updateCandidate({
  candidateId: 12456,
  firstName: 'John',
  lastName: 'Jones',
  emailAddress: 'jj@gg.com'
}).then((result: Result<void>) => console.log('update candidate result:', result))