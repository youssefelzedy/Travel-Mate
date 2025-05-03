export async function getApiPath({ location, destination }) {
    try {
        const response = await fetch(
            "http://127.0.0.1:2030/api/v1/journeys/search-microbus/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    location: location,
                    destination: destination,
                }),
            }
        );
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}
