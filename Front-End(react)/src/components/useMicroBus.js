import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getApiMicrobus } from "../services/apiPath";
import toast from "react-hot-toast";

export function useMicroBus({ location, destination }) {
    const queryClient = useQueryClient();
    const {
        isLoading,
        mutate: getMicrobus,
        data,
    } = useMutation({
        mutationFn: ({ location, destination }) =>
            getApiMicrobus({ location, destination }),
        mutationKey: ["microbus", location, destination],
        onMutate: () => {
            toast.loading("Finding road...");
        },
        onSuccess: data => {
            // Save the data in the query cache
            queryClient.setQueryData(["microbus", location, destination], data);
            toast.success("Road found successfully");
        },
        onError: error => {
            toast.error("Road not found");
            console.error("Error:", error);
        },
    });

    return { isLoading, getMicrobus, data };
}
