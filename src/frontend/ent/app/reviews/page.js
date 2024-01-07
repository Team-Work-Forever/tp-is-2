"use client"

import React, { useEffect, useState } from "react";
import api from "@/services/api";
import ShowDataTable from "@/components/MediaCard";

export default function ReviewsPage() {
    const [isLoading, setLoading] = useState(false);
    const [reviews, setReviews] = useState([]);

    const reviewHeaders = [
        "Id",
        "Points",
        "Description",
        "TwitterHandle",
        "CreatedAt",
    ]

    useEffect(() => {
        setLoading(true);
        api.get('/reviews')
            .then(response => {
                setReviews(response.data.map(review => ({
                    id: review.id,
                    points: review.points,
                    description: review.description,
                    twitterHandle: review.twitterHandle,
                    createdAt: review.createdAt,
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
                content={{rows: reviews, columns: reviewHeaders}} />
        </main>
    );
}
