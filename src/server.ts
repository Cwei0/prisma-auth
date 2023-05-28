import { env } from "process";
import startServer from "./utils";
import log from "./utils/logger";
import "dotenv/config";

const Port = env.PORT;

const server = startServer();

server.listen(Port, () => {
  log.info(`Server running on ${Port}`);
});
