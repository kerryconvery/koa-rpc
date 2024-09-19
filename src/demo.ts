import clientSdk from "./rpc-client";
import { Result } from "./rpc/types";
import { CandidateOutput } from "./types";

clientSdk.echo({ value: 'hello' }).then((result) => console.log('echo:', result.data))
clientSdk.split({ value: 'q,w,e,r,t,y', delimiter: ',' }).then((result) => console.log('split:', result.data))
clientSdk.getCandidate({ candidateId: 1245678 }).then((result: Result<CandidateOutput>) => console.log('get candidate result:', result.data))
clientSdk.updateCandidate({
  candidateId: 12456,
  firstName: 'John',
  lastName: 'Jones',
  emailAddress: 'jj@gg.com'
}).then((result: Result<void>) => console.log('update candidate result:', result))