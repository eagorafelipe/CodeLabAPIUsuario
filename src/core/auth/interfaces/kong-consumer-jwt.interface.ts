export interface IKongJWTCredential {
  id: string;
  key: string;
}

export interface IKongConsumerJWT {
  data: IKongJWTCredential[];
}
