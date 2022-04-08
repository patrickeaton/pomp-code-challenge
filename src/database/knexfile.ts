import { SecretsManager } from 'aws-sdk';

const loadDbConfigFromSecrets = async () => {
  const client = new SecretsManager({region: 'us-west-2'});

  const data = await client.getSecretValue({SecretId: process.env.DATABASE_CREDENTIALS || ''}).promise();

  if(!data.SecretString) return {};

  return JSON.parse(data.SecretString);
}

export const loadConfig = async () => {
  const config = await loadDbConfigFromSecrets();

  console.log(config);

  return {
    client: 'pg',
    connection: {
      host: config.host,
      port: config.port,
      user: config.username,
      password: config.password,
      database: config.dbname,
    },
    migrations: {
      directory: './migrations'
    },
    seeds: {
      directory: './seeds'
    }
  }
}

module.exports = loadConfig;