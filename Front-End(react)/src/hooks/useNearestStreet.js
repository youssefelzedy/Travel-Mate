import { useQuery } from "@tanstack/react-query";
import { getNearestStreet } from "../services/reverseGeocoding";

export function useNearestStreet(lat, lng) {
    return useQuery({
        queryKey: ["nearestStreet", lat, lng],
        queryFn: () => getNearestStreet(lat, lng),
        enabled: !!lat && !!lng, // Only fetch if lat and lng are provided
        staleTime: 1000 * 60 * 5, // Cache the result for 5 minutes
    });
}
