import apiGraphQl from "../services/graphql";
import { useQuery } from "react-query";

export default function UseGrapqhQl(key, request) {
    const { data, isLoading, error, refetch } = useQuery(key, async () => {
        const response = await apiGraphQl.post('/graphql',
            { query: request }
        );

        return response?.data?.data;
    });

    return { data: data ?? {}, isLoading, error, refetch };
}