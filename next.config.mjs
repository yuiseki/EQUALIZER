/** @type {import('next').NextConfig} */
const nextConfig = {
  // `next build`'s webpack pass resolves @prisma/client's conditional
  // exports using Node's defaults (pulling in the native query engine
  // binary), before wrangler's own esbuild bundling - which does respect
  // the "workerd" condition and would otherwise pick the wasm/driver-adapter
  // build - ever gets a chance to. Leaving these packages external keeps the
  // require() unresolved until wrangler's bundling step.
  serverExternalPackages: ["@prisma/client", ".prisma/client"],
}

export default nextConfig
