import { buildClientSdk } from "./rpc/client-side";
import { createHttpClient } from "./rpc/httpClient";
import { RouterConfig } from "./rpc/types";

export type Environment = 'prod' | 'dev'

export type SdkConfig = {
  [key in Environment]: {
    apiUrl: string
  }
}

export type HeaderGetter = () => Promise<Record<string, string>>

export const createClientSdk = <T extends RouterConfig>(routeDefinition: T, configration: SdkConfig) => {
  return (environment: Environment, getHeaders?: HeaderGetter) => {
    const clientSdk = buildClientSdk(createHttpClient(getHeaders), configration[environment].apiUrl, routeDefinition)

    return clientSdk;
  }
}
