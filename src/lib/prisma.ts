import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";

// The D1 binding is only available per-request (via Workers' `env` param),
// not at module top level - a module-scope `new PrismaClient()` would
// evaluate before any request's env is available. getCloudflareContext()
// reads the current request's bindings, so PrismaClient must be constructed
// inside each route handler via this helper instead.
export const getPrisma = async (): Promise<PrismaClient> => {
  const { env } = await getCloudflareContext({ async: true });
  const adapter = new PrismaD1(env.DB);
  return new PrismaClient({ adapter });
};
