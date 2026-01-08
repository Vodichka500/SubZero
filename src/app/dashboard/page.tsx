"use client";

import { api } from "@/app/_providers/trpc-provider";
import Link from "next/link";

export default function DashboardPage() {
  const { data: subscriptions, isLoading } = api.subscription.getAll.useQuery();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <Link
          href="/dashboard/add"
          className="bg-zinc-100 text-black px-4 py-2 rounded hover:bg-zinc-200 font-medium cursor-pointer"
        >
          + Add New
        </Link>
      </div>

      {isLoading ? (
        <div className="text-zinc-500 animate-pulse">Scanning database...</div>
      ) : subscriptions?.length === 0 ? (
        <div className="p-10 border border-dashed border-zinc-800 rounded text-center text-zinc-500">
          No subscriptions found.
        </div>
      ) : (
        <div className="grid gap-4">
          {subscriptions?.map((sub) => (
            <div key={sub.id} className="p-4 bg-zinc-900 border border-zinc-800 rounded flex justify-between">
              <span className="font-bold">{sub.name}</span>
              <span className="text-cyan-500">${sub.price}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}