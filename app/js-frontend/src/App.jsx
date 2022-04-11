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

    const [todos, setTodos] = useState([]);

    useEffect(  () => {
        const load = async () => {
            const res = await listTodos();
            setTodos(res.data.listTodos);
            console.log(todos);
        }
        
        load();
    }, []);

    //TODO: Implement markAsComplete Function from ./graphql then
    // refresh the list from the server
    const handleComplete = async (id) => {

    }

    // TODO: Open Add Dialog
    // See: https://mui.com/components/dialogs/
    const handleAddDialog = () => {

    }

    return <Card sx={{ margin: '40px auto', maxWidth: 400 }}>
        <CardHeader title={'todo'} />
        <CardContent>
            <List>
                {todos.map( ({title, status, id}) =>
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => handleComplete(id)}>
                            <ListItemIcon>
                                <Checkbox checked={status === 'complete'}/>
                            </ListItemIcon>
                            <ListItemText primary={title} />
                        </ListItemButton>
                    </ListItem>
                )}
            </List>
        </CardContent>
    </Card>
}
