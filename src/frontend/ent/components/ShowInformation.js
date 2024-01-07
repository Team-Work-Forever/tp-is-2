import React from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';


export default function ShowInformation({ isLoading = true, columns, data }) {
    return (
        <>
            {
                isLoading ?
                    <Box sx={{ width: '100%' }}>
                        <LinearProgress />
                    </Box>
                    :
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    {
                                        columns.map((element, index) => (
                                            <TableCell key={index} align="left">{element}</TableCell>
                                        ))
                                    }
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    data.map((data, index) => (
                                        <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                            {
                                                Object.keys(data).map((key, columnIndex) => (
                                                    <TableCell key={columnIndex} align="left">{data[key]}</TableCell>
                                                ))
                                            }
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
            }
        </>
    )
}