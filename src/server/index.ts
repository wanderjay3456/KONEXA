import { createServer } from 'node:http';
import { loadServerConfig } from './config';
import { createKonexaApp } from './app';
import { JsonFilePlatformRepository } from './repository';

const config = loadServerConfig();
const repository = new JsonFilePlatformRepository(config.dataFile);
const app = createKonexaApp(repository, config);
const server = createServer(app);

server.listen(config.port, () => {
  console.log(`KONEXA API listening on http://localhost:${config.port}`);
});
