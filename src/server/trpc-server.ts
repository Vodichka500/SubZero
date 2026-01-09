import "server-only"; // Гарантирует, что этот код не попадет в клиентский бандл

import { headers } from "next/headers";
import { cache } from "react";

import { createCallerFactory, createTRPCContext } from "@/server/trpc";
import { appRouter } from "@/server/root";

/**
 * Создает контекст для каждого запроса.
 * Используем React cache, чтобы не создавать контекст несколько раз за один рендер.
 */
const createContext = cache(async () => {
  const heads = new Headers(await headers());
  heads.set("x-trpc-source", "rsc");

  return createTRPCContext({
    headers: heads,
  });
});

/**
 * Это и есть наш "api" или "trpc" объект для серверных компонентов.
 * Он позволяет вызывать процедуры как обычные функции: await trpc.terms.getActualTerms()
 */
export const trpc = createCallerFactory(appRouter)(createContext);