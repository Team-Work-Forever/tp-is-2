import React, {useEffect, useState} from "react";
import {Box, CircularProgress, Container, FormControl, InputLabel, MenuItem, Select} from "@mui/material";

import apiProc from "../services/api";
import apiGraphQl from "../services/graphql";

import DisplayTable from "../Components/DisplayTable";

export default function GetCountryRegions() {
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState("");

    const [procData, setProcData] = useState(null);
    const [gqlData, setGQLData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (selectedCountry) {
                const response = await apiProc.get(`/countries/${selectedCountry}`);

                setProcData(response.data);
            }
        }

        fetchData();
    }, [selectedCountry])

    useEffect(() => {
        const fetchData = async () => {
            const response = await apiProc.get("/countries");

            setCountries(response.data);
        }

        const fetchDataGraph = async () => {
            const response = await apiGraphQl.post("/graphql", {
                query: `
                    {
                        countryRegions
                    }
                `
            });
            
            setGQLData(response.data.data);
        }

        fetchData();
        fetchDataGraph();
    }, []);

    function displayData(loading, data) {
        return !loading ?
        <DisplayTable headers={["Regions"]} data={data} />
        :
        <CircularProgress />
    }

    return (
        <>
            <h1>Country Regions Overview</h1>

            <Container maxWidth="100%"
                sx={{ backgroundColor: 'background.default', padding: "2rem", borderRadius: "1rem" }}>
                <Box>
                    <h2 style={{ color: "white" }}>Options</h2>
                    <FormControl fullWidth>
                        <InputLabel id="countries-select-label">Country</InputLabel>
                        <Select
                            labelId="countries-select-label"
                            id="demo-simple-select"
                            value={selectedCountry}
                            label="Country"
                            onChange={(e, v) => {
                                setSelectedCountry(e.target.value)
                            }}
                        >
                            <MenuItem value={""}><em>None</em></MenuItem>
                            {
                                countries.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)
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
                    displayData(procData !== undefined, procData)
                }
                <h2>Results <small>(GraphQL)</small></h2>
                {
                    // displayData(gqlData?.countryRegions !== undefined, gqlData?.countryRegions)
                }
            </Container>
        </>
    );
}