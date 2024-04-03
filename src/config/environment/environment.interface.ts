export interface IEnvironmentVariables {
  getNodeEnv(): string;
  getPort(): string;
  getAwsEndpoint(): string;
  getAwsRegion(): string;
  getAwsAccessKeyId(): string;
  getAwsSecretAccessKey(): string;
}
