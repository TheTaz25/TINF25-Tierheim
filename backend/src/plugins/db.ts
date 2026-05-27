import fp from "fastify-plugin";
import { DatabaseSync } from "node:sqlite";
import path from "node:path";

export default fp((fastify) => {
  const dbLocation = path.join(process.cwd(), "db", "store.db");
  const db = new DatabaseSync(dbLocation);

  // Initial table setup
  db.exec(`CREATE TABLE IF NOT EXISTS appointments(
    id INTEGER PRIMARY KEY,
    visitor TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    animal INTEGER NOT NULL,
    date INTEGER NOT NULL
    ) STRICT`);

  fastify.decorate("db", db);
});

declare module "fastify" {
  export interface FastifyInstance {
    db: DatabaseSync;
  }
}
