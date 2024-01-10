"use client"

import React, { useEffect, useState } from "react";
import api from "@/services/api";
import ShowInformation from "@/components/ShowInformation";
import ShowDataTable from "@/components/MediaCard";

export default function TastersPage() {
    const [isLoading, setLoading] = useState(false);
    const [wines, setWines] = useState([]);

    const wineHeaders = [
        "Price",
        "Region",
        "Title",
        "Variety",
        "Winery",
        "UpdatedAt",
    ]

    const reviewHeaders = [
        "Price",
        "Region",
        "Title",
        "Variety",
        "Winery",
        "UpdatedAt",
    ]

    useEffect(() => {
        setLoading(true);
        api.get('/wines')
            .then(response => {
                console.log(response.data);
                setWines(response.data.map(wine => ({
                    price: wine.price,
                    region: wine.region, 
                    title: wine.title, 
                    variety: wine.variety,
                    winery: wine.winery, 
                    updatedAt: wine.updatedAt,
                })));
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
                content={{rows: wines, columns: wineHeaders}} 
                aux={{ rows: reviewHeaders, title: "Reviews", errorMessage: "There is no Review of this Wine" }} />
        </main>
    );
}