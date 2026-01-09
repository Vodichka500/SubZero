import "server-only"; // Гарантирует, что этот код не попадет в клиентский бандл

import { headers } from "next/headers";
import { cache } from "react";

import { createCallerFactory, createTRPCContext } from "@/server/trpc";
import { appRouter } from "@/server/root";

const createContext = cache(async () => {
  const heads = new Headers(await headers());
  heads.set("x-trpc-source", "rsc");

  return createTRPCContext({
    headers: heads,
  });
});

export const trpc = createCallerFactory(appRouter)(createContext);