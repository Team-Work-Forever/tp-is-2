import React from "react";

import Landscape from '@mui/icons-material/Landscape';
import Title from '@mui/icons-material/Title';
import Wallet from '@mui/icons-material/Wallet';
import WineBar from '@mui/icons-material/WineBar';
import Description from '@mui/icons-material/Description';
import MenuBook from '@mui/icons-material/MenuBook';

import { Avatar, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { Marker, Popup } from 'react-leaflet';
import { icon as leafletIcon, point } from "leaflet";

const LIST_PROPERTIES = [
    { "key": "price", label: "Price", Icon: Wallet },
    { "key": "title", label: "Title", Icon: Title },
    { "key": "region", label: "Region", Icon: Landscape },
    { "key": "winery", label: "Winery", Icon: WineBar },
    { "key": "variety", label: "Variety", Icon: MenuBook },
    { "key": "designation", label: "Designation", Icon: Description },
];

export function ObjectMarker({ geoJSON }) {
    const properties = geoJSON?.properties;
    const { name } = properties;
    const coordinates = geoJSON?.geometry?.coordinates;

    const imgUrl = "https://github.com/DiogoCC7.png"

    return (
        <Marker
            position={coordinates}
            icon={leafletIcon({
                iconUrl: imgUrl,
                iconRetinaUrl: imgUrl,
                iconSize: point(50, 50),
            })}
        >
            <Popup>
                <List dense={true}>
                    <ListItem>
                        <ListItemIcon>
                            <Avatar alt={name} src={imgUrl} />
                        </ListItemIcon>
                        <ListItemText primary={name} />
                    </ListItem>
                    {
                        LIST_PROPERTIES
                            .map(({ key, label, Icon }) =>
                                <ListItem key={key}>
                                    <ListItemIcon>
                                        <Icon style={{ color: "black" }} />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={<span>
                                            {properties[key]}<br />
                                            <label style={{ fontSize: "xx-small" }}>({label})</label>
                                        </span>}
                                    />
                                </ListItem>
                            )
                    }

                </List>

            </Popup>
        </Marker>
    )
}