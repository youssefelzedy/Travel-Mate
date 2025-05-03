import { useMutation } from "@tanstack/react-query";
import { getApiTaxi } from "../services/apiPath";
import toast from "react-hot-toast";

export function useTaxi() {
    const {
        isLoading,
        mutate: getTaxi,
        data,
    } = useMutation({
        mutationFn: ({ location, destination }) =>
            getApiTaxi({ location, destination }),
        mutationKey: ["taxi", "location", "destination"],
        onMutate: () => {
            toast.loading("Finding road...");
        },
        onSuccess: () => {
            toast.success("Road found successfully");
        },
        onError: error => {
            toast.error("Road not found");
            console.error("Error:", error);
        },
    });

    return { isLoading, getTaxi, data };
}
