"use client"

import React, { useState } from "react";
import api from "@/services/api";
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

    async function fetchData(page) {
        setLoading(true);

        const response = await api.get(`/wines?page=${page}&pageSize=10`)
            
        setWines(response.data.data.map(wine => ({
            price: wine.price,
            region: wine.region, 
            title: wine.title, 
            variety: wine.variety,
            winery: wine.winery, 
            updatedAt: wine.updatedAt,
        })));

        setLoading(false);

        return response.data.totalPages;
    }

    return (
        <main>
            <ShowDataTable 
                    isLoading={isLoading} 
                    content={{rows: wines, columns: wineHeaders}} 
                    aux={{ rows: reviewHeaders, title: "Reviews", errorMessage: "There is no Review of this Wine" }}
                    onSelectionChanged={(page) => fetchData(page)}
                    />
        </main>
                    
    );
}
