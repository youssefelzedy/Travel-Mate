import Openrouteservice from "openrouteservice-js";

const ors = new Openrouteservice.Directions({
    api_key: "5b3ce3597851110001cf6248f1712e0786d74c90a111089c7819590f",
});

export function optimizationRoad(directions) {
    const newDirections = directions.map(coord => [coord[1], coord[0]]);
    ors.calculate({
        coordinates: newDirections,
        profile: "driving-car",
        format: "geojson",
    })
        .then(result => {
            console.log("good");
            return result.metadata.query.coordinates;
        })
        .catch(err => {
            console.error(err);
        });
}
