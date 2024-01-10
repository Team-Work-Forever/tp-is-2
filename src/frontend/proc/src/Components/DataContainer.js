import React from "react";

import { CircularProgress, Container } from "@mui/material";
import DisplayTable from "../Components/DisplayTable";

export default function DataContainer(headers, restData, graphqlData) {
    const { restLoading, rest } = restData || {};
    const { graphQlLoading, graphql } = graphqlData || {};

    function displayData(loading, data) {
        return loading ?
            <CircularProgress />
            :
            <DisplayTable headers={[headers || []]} data={data || []} />
    }

    return (
        <Container maxWidth="100%" sx={{
            backgroundColor: 'info.dark',
            padding: "2rem",
            marginTop: "2rem",
            borderRadius: "1rem",
            color: "white"
        }}>
            <h2>Results <small>(PROC)</small></h2>
            {
                displayData(restLoading, rest)
            }
            <h2>Results <small>(GraphQL)</small></h2>
            {
                displayData(graphQlLoading, graphql)
            }
        </Container>
    )
}