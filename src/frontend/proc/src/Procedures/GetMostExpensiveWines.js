import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Container, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";

import UseRest from "../Hooks/UseRest";
import UseGrapqhQl from "../Hooks/UseGraphQl";
import DisplayTable from "../Components/DisplayTable";

export default function GetMostExpensiveWines() {
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState("");
    const [limit, setLimit] = useState(10);
    const [order, setOrder] = useState("desc");

    const { data: rest, isLoading: isLoadingRest, refetch: refetchRest } = UseRest("most.rest", `/wines/most_expensive?limit=${limit}&order=${order}`);
    const { data: graphQl, isLoading: isLoadingGraph, refetch: refetchGraph } = UseGrapqhQl("most.graph", `
        {
            mostExpensiveWines(limit:${limit}, order:"${order}") {
                id,
                winery,
                designation,
                variety,
                price
            }
        }
    `);

    useEffect(() => {
        refetchRest();
        refetchGraph();
    }, [limit, order]);

    function displayData(loading, data) {
        return loading ?
            <CircularProgress />
            :
            <DisplayTable headers={["Id", "Winery", "Designation", "Variaty", "Price"]} data={data} />
    }

    return (
        <>
            <h1>Country Regions Overview</h1>

            <Container maxWidth="100%" sx={{ backgroundColor: 'background.default', padding: "2rem", borderRadius: "1rem" }}>
                <h2 style={{ color: "white" }}>Options</h2>
                <Box sx={{ display: "flex", flexDirection: "row" }}>
                    <TextField
                        id="filled-number"
                        label="Number"
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="filled"
                        inputProps={{
                            min: 0,
                        }}
                        onChange={(e) => {
                            setLimit(parseInt(e.target.value, 10));
                        }}
                    />
                    <FormControl fullWidth>
                        <InputLabel id="countries-select-label">Country</InputLabel>
                        <Select
                            labelId="countries-select-label"
                            id="demo-simple-select-2"
                            value={order}
                            label="Order"
                            onChange={(e, v) => {
                                setOrder(e.target.value)
                            }}
                        >
                            {
                                ["desc", "asc"].map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)
                            }
                        </Select>
                    </FormControl>
                </Box>
            </Container>
            
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
                    displayData(isLoadingGraph, graphQl?.mostExpensiveWines)
                }
            </Container>
        </>
    );
}