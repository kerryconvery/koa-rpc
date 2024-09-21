import { buildClientSdk } from "./rpc/client-side";
import { RouterConfig } from "./rpc/types";

export type Environment = 'prod' | 'dev'

export type SdkConfig = {
  [key in Environment]: {
    apiUrl: string
  }
}

export const createClientSdk = <T extends RouterConfig>(routeDefinition: T, configration: SdkConfig) => {
  return (environment: Environment) => {
    const clientSdk = buildClientSdk(configration[environment].apiUrl, routeDefinition)

    return clientSdk;
  }
}
