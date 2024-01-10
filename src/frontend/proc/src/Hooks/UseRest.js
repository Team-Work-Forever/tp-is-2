import apiProc from "../services/api";
import { useQuery } from "react-query";

export default function UseRest(key, request) {
    const { data, isLoading, error, refetch } = useQuery(key, async () => {
        const response = await apiProc.get(request);
        return response?.data;
    });

    return { data: data ?? [], isLoading, error, refetch };
}