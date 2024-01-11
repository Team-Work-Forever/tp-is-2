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

    async function fetchData(page) {
        setLoading(true);
        const response = await api.get(`/reviews?page=${page}&pageSize=10`)

        setReviews(response.data.data.map(review => ({
            id: review.id,
            points: review.points,
            description: review.description,
            twitterHandle: review.twitterHandle,
            createdAt: review.createdAt,
        })));

        setLoading(false);
        return response.data.totalPages;
    }

    return (
        <main>
             <ShowDataTable 
                isLoading={isLoading} 
                content={{rows: reviews, columns: reviewHeaders}} 
                onSelectionChanged={(page) => fetchData(page)}
                />
        </main>
    );
}
