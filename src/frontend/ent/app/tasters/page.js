"use client"

import React, { useEffect, useState } from "react";
import api from "@/services/api";
import ShowDataTable from "@/components/MediaCard";

export default function TastersPage() {
    const [isLoading, setLoading] = useState(false);
    const [tasters, setTasters] = useState([]);

    const tasterHeaders = [
        "Id",
        "Name",
        "Twitter Handle"
    ]

    useEffect(() => {
        setLoading(true);
        api.get('/tasters')
            .then(response => {
                console.log(response.data);
                setTasters(response.data.map(taster => ({
                    id: taster.id,
                    name: taster.name,
                    twitterHandle: taster.twitterHandle,
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
                content={{rows: tasters, columns: tasterHeaders}} />
        </main>
    );
}
