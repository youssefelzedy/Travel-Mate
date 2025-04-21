import { useMutation } from "@tanstack/react-query";
import { getApiPath } from "../services/apiPath";

export function usePath() {
    const {
        isLoading,
        mutate: getPath,
        data,
    } = useMutation({
        mutationFn: ({ location, destination }) =>
            getApiPath({ location, destination }),
        mutationKey: ["path"],
        onSuccess: data => {
            console.log("Data fetched successfully:", data);
        },
        onError: error => {
            console.error("Error fetching data:", error);
        },
    });

    return { isLoading, getPath, data };
}
