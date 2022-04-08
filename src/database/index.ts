import Knex from 'knex';
import { loadConfig } from "./knexfile";

export const getDatabase = async (): Promise<any> => {
    const config = await loadConfig();
    return Knex(config);
}