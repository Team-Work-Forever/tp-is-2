import { Avatar, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import Landscape from '@mui/icons-material/Landscape';
import Flag from '@mui/icons-material/Flag';
import React from "react";
import { Marker, Popup } from 'react-leaflet';
import { icon as leafletIcon, point } from "leaflet";

const LIST_PROPERTIES = [
    { "key": "province", label: "Province", Icon: Landscape },
    { "key": "country_name", label: "Country", Icon: Flag },
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