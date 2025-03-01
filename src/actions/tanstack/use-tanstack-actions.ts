import {
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

const BASE_URL = process.env.NEXT_PUBLIC_URL_API;

const handleParams = (params: Record<string, any>, endpoint: string) => {
  const url = new URL(`${BASE_URL}${endpoint}`);
  if (params) {
    Object.keys(params).forEach((key) =>
      url.searchParams.append(key, params[key])
    );
  }
  return url.toString();
};

const fetching = async (endpoint: string, params?: Record<string, any>) => {
  try {
   

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_API}${endpoint}`
    );
    // console.log(response)
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in fetching data:", error);
    throw error;
  }
};

// Custom hook for fetching data
export const useFetch = <T>(
  endpoint: string,
  queryKey: string[] = [],
  params?: Record<string, any>,
  options?: Omit<UseQueryOptions<T, Error>, "queryKey" | "queryFn">
) => {
  return useQuery<T, Error>({
    queryKey: params ? [...queryKey, params] : [...queryKey],
    queryFn: async () => await fetching(endpoint, params),
    ...options,
  });
};

// export const useMutate = <T, D = any>(
//   endpoint: string,
//   method: "create" | "update" | "remove" = "create",
//   options?: Omit<UseMutationOptions<T, Error, D>, "mutationFn">
// ) => {
//   return useMutation<T, Error, D>({
//     mutationFn: async (data: D): Promise<any> => {
//       try {
//         switch (method) {
//           case "create":
//             return await interactApi.create(endpoint, data);
//           case "update":
//             return await interactApi.update(endpoint, data);
//           case "remove":
//             return await interactApi.remove(endpoint);
//           default:
//             throw new Error(`Unsupported method: ${method}`);
//         }
//       } catch (error) {
//         console.error(
//           `Error performing ${method.toUpperCase()} on ${endpoint}:`,
//           error
//         );
//         throw error;
//       }
//     },

//     ...options,
//   });
// };
