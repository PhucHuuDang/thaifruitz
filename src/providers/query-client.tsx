"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { useState } from "react";

interface QueryProviderProps {
  children: React.ReactNode;
}

export const QueryProvider = ({ children }: QueryProviderProps) => {
  // const [queryClient] = useState(
  //   (): QueryClient =>
  //     new QueryClient({
  //       defaultOptions: {
  //         // queries: {
  //         //   refetchOnWindowFocus: false
  //         // }
  //         // queries: {
  //         //   staleTime: 60 * 1000,
  //         // }
  //       },
  //     })
  // );

  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
};
