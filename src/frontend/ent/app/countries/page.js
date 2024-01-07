"use client"

import React, { useEffect, useState } from "react";
import api from "@/services/api";
import ShowDataTable from "@/components/MediaCard";

export default function CountriesPage() {
    const [isLoading, setLoading] = useState(false);
    const [countries, setCountries] = useState([]);

    const countryHeaders = [
        "Id",
        "Name",
        "Created At",
        "Updated At",
    ]

    const regionHeaders = [
        "Id",
        "Name",
        "Province",
        "CreatedAt"
    ]

    useEffect(() => {
        setLoading(true);
        api.get('/countries')
            .then(response => {
                setCountries(response.data.map(country => ({
                    id: country.id,
                    name: country.name,
                    regions: country.regions.map(region => ({
                        id: region.id,
                        name: region.name,
                        province: region.province,
                        createdAt: region.createdAt,
                    })),
                    createdAt: country.createdAt,
                    updatedAt: country.updatedAt
                })));
                console.log(response.data);
            })
            .catch(error => {
                console.log(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <main>
            <ShowDataTable 
                isLoading={isLoading} 
                content={{rows: countries, columns: countryHeaders}} 
                aux={{ rows: regionHeaders, title: "Regions", errorMessage: "There is no Regions on this country" }} />
        </main>
    );
}
