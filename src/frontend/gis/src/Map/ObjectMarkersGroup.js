import React, {useEffect, useState} from 'react';
import {LayerGroup, useMap} from 'react-leaflet';
import {ObjectMarker} from "./ObjectMarker";

import apiGis from "../services/api";

function ObjectMarkersGroup() {
    const map = useMap();
    const [geom, setGeom] = useState([]);
    const [bounds, setBounds] = useState(map.getBounds());

    useEffect(() => {
        const cb = () => {
            setBounds(map.getBounds());
        }
        map.on('moveend', cb);

        return () => {
            map.off('moveend', cb);
        }
    }, []);

    async function fetchGeoJsonGis() {
        let response;
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();

        try {
            response = await apiGis
            .get(`/tile?neLat=${ne.lat}&swLat=${sw.lat}&neLon=${ne.lng}&swLon=${sw.lng}`)

        } catch (error) {
            console.error(error);
        }

        setGeom(response?.data?.features ?? []);
    }

    useEffect(() => {
       fetchGeoJsonGis();
    }, [bounds])

    return (
        <LayerGroup>
            {
                geom.map(geoJSON => <ObjectMarker key={geoJSON.id} geoJSON={geoJSON}/>)
            }
        </LayerGroup>
    );
}

export default ObjectMarkersGroup;
