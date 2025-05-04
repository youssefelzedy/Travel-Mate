export async function getNearestStreet(lat, lng) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Failed to fetch street name");
    }
    const data = await response.json();
    return data.address.road || "Unknown Street";
}
