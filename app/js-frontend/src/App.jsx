import React, { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    Checkbox,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText
} from "@mui/material";
import { listTodos } from './graphql';

export const App = () => {

    const [todos, setTodos] = useState();

    useEffect(  () => {
        const load = async () => {
            const res = await listTodos();
            console.log(res)
        }

        load();
    }, [])

    return <Card sx={{ margin: '40px auto', maxWidth: 400 }}>
        <CardHeader title={'todo'} />
        <CardContent>
            <List>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <Checkbox />
                        </ListItemIcon>
                        <ListItemText primary="Inbox" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <Checkbox />
                        </ListItemIcon>
                        <ListItemText primary="Drafts" />
                    </ListItemButton>
                </ListItem>
            </List>
        </CardContent>
    </Card>
}
