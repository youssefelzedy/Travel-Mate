import { useMutation } from "@tanstack/react-query";
import { getApiMicrobus } from "../services/apiPath";
import toast from "react-hot-toast";

export function useMicroBus() {
    const {
        isLoading,
        mutate: getMicrobus,
        data,
    } = useMutation({
        mutationFn: ({ location, destination }) =>
            getApiMicrobus({ location, destination }),
        mutationKey: ["microbus", "location", "destination"],
        onMutate: () => {
            toast.loading("Finding road...");
        },
        onSuccess: data => {
            toast.success("Road found successfully");
            console.log("Data:", data);
        },
        onError: error => {
            toast.error("Road not found");
            console.error("Error:", error);
        },
    });

    return { isLoading, getMicrobus, data };
}
