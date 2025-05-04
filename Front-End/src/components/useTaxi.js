import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getApiTaxi } from "../services/apiPath";
import toast from "react-hot-toast";

export function useTaxi({ location, destination }) {
    const queryClient = useQueryClient();
    const {
        isLoading,
        mutate: getTaxi,
        data,
    } = useMutation({
        mutationFn: ({ location, destination }) =>
            getApiTaxi({ location, destination }),
        mutationKey: ["taxi", location, destination],
        onMutate: () => {
            toast.loading("Finding road...");
        },
        onSuccess: data => {
            queryClient.setQueryData(["taxi"], data);
            toast.success("Road found successfully");
        },
        onError: error => {
            toast.error("Road not found");
            console.error("Error:", error);
        },
    });

    return { isLoading, getTaxi, data };
}
