import React from "react";
import { CircularProgress, Container } from "@mui/material";

import UseRest from "../Hooks/UseRest";
import UseGrapqhQl from "../Hooks/UseGraphQl";
import DisplayTable from "../Components/DisplayTable";

export default function GetNumberOfReviewBtTasters() {
    const { data: rest, isLoading: isLoadingRest, refetch: refetchRest } = UseRest("review.taster.rest", `/reviews/by_tasters`);
    const { data: graphQl, isLoading: isLoadingGraph, refetch: refetchGraph } = UseGrapqhQl("review.taster.graph", `
        {
            numberReviewByTaster {
                taster,
                numberOfReviews
            }
        }
    `);

    function displayData(loading, data) {
        return loading ?
            <CircularProgress />
            :
            <DisplayTable headers={["Taster", "Number Of Reviews"]} data={data} />
    }

    return (
        <>
            <h1>Get Reviews by Tasters</h1>

            <Container maxWidth="100%" sx={{
                backgroundColor: 'info.dark',
                padding: "2rem",
                marginTop: "2rem",
                borderRadius: "1rem",
                color: "white"
            }}>
                <h2>Results <small>(PROC)</small></h2>
                {
                    displayData(isLoadingRest, rest)
                }
                <h2>Results <small>(GraphQL)</small></h2>
                {
                    displayData(isLoadingGraph, graphQl?.numberReviewByTaster)
                }
            </Container>
        </>
    );
}