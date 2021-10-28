import React, {useEffect} from 'react';
import  {useState} from "react";
import {
    apiAddGlassType,
    apiDeleteGlassType,
    apiGetGlassManufacturesList,
    apiGetGlassTypesList,
    apiUpdateGlassType
} from "../../api/api";
import {store} from "react-notifications-component";
import {DataGrid} from "@mui/x-data-grid";
import Button from "@material-ui/core/Button";


export default function GlassTypeTable() {
    const [columns] = useState([
        { field: 'name', headerName: 'Стекло', width: '200', height:'50', editable: true },
        { field: 'discount', headerName: 'Скидка', width: '200', editable: true },
        { field: 'markup', headerName: 'Наценка', width: '200', editable: true },
    ]);
    const [selectedRow, setSelectedRow] = useState(0);
    const [lastEditModel, setLastEditModel] = useState({});
    const [data, setData] = useState([]);
    const [ws] = useState(() => {
        let socket = new WebSocket(`ws://${process.env.REACT_APP_BACK_ADDR}:8000/ws/glass/type`)
        socket.onmessage = (ev) => {
            let message = JSON.parse(ev.data)
            console.log(message)
            if (message.message_type === 'get') {
                updateTable(message.data)
            }

            if (message.message_type === 'notification') {
                let notification_type = ''
                if (message.data.notification_type === 'success') {
                    notification_type = 'success'
                }
                if (message.data.notification_type === 'error') {
                    notification_type = 'danger'
                }
                sendNotification(message.data.header, message.data.message, notification_type);
            }
        }
        return socket
    })

    useEffect(() => {
        apiGetGlassTypesList().then((response)=>{
            updateTable(response.data);
        });
    }, [])

    let addEmptyRow = () => {
        let _glassTypes = [...data];
        _glassTypes.push({
            id: _glassTypes.length + 1,
            dbId : 0,
            name: '',
            discount: '',
            markup: ''
        });
        setData(_glassTypes);
    };

    let handleEditing = (editedModel, event) => {
        setLastEditModel(editedModel);
    };

    let handleStopEditing = (rowModel) => {
        let editedModel = {id:rowModel.row.id,
            dbId:rowModel.row.dbId,
            name:lastEditModel[rowModel.row.id].name.value,
            discount:lastEditModel[rowModel.row.id].discount.value,
            markup:lastEditModel[rowModel.row.id].markup.value
        };
        if (rowModel.row.dbId === 0)
        {
            addGlassType(editedModel);
        }
        else
        {
            updateGlassType(editedModel);
        }
    };

    let addGlassType = (addedGlassType) => {
        let request = {
            message_type: "add",
            data: {
                name: addedGlassType.name,
                discount: addedGlassType.discount,
                markup: addedGlassType.markup,
            }
        }
        let request_json = JSON.stringify(request)
        console.log(request_json)
        ws.send(request_json)
    }

    let updateGlassType = (editedGlassType) => {
        data.forEach(oldGlassType => {
            if (oldGlassType.id === editedGlassType.id) {
                let hasChanges = editedGlassType.name !== oldGlassType.name
                    || editedGlassType.discount !== oldGlassType.discount
                    || editedGlassType.markup !== oldGlassType.markup;
                if (hasChanges)
                {
                    let request = {
                        message_type: "update",
                        data: {
                            id: editedGlassType.dbId,
                            name: editedGlassType.name,
                            discount: editedGlassType.discount,
                            markup: editedGlassType.markup,
                        }
                    }
                    let request_json = JSON.stringify(request)
                    console.log(request_json)
                    ws.send(request_json)
                }
            }
        });
    }

    let deleteGlassType = () => {
        data.forEach(glass_type => {
            if (glass_type.id === selectedRow)
            {
                let request = {
                    message_type: "delete",
                    data: {
                        id: glass_type.dbId,
                    }
                }
                let request_json = JSON.stringify(request)
                console.log(request)
                console.log(request_json)
                console.log(glass_type)
                console.log(selectedRow)
                ws.send(request_json)
            }
        });
    }

    let updateTable = (glass_types) => {
        let _glass_types = [];
        glass_types.forEach(glass_type => {
            _glass_types.push({id: _glass_types.length + 1,
                dbId : glass_type.id,
                name: glass_type.name,
                discount: glass_type.discount,
                markup: glass_type.markup,
            });
        });
        setData(_glass_types);
    }

    let sendNotification = (title, message, type) => {
        store.addNotification({
            title: title,
            message: message,
            type: type,
            insert: "top",
            container: "top-right",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
                duration: 5000,
                onScreen: true
            }
        });
    }
    return (
        <div style={{ margin: 'auto', display: 'block', justifyContent:'center', alignItems:'center', textAlign:'center', width:'640px'}}>
            <h2>Тип стекла</h2>
            <DataGrid  editMode="row" rows={data} columns={columns}
                       onSelectionModelChange={(selectionModel)=>{
                           setSelectedRow(selectionModel[0]);
                       }}
                       onEditRowsModelChange={handleEditing}
                       onRowEditStop={handleStopEditing}
                       style={{ margin: '10px', height: '50vh' }}
            />
            <div style={{display: 'flex', justifyContent:'center', alignItems:'center' }}>
                <Button variant="contained" style={{margin:'7px'}} onClick={addEmptyRow}>Добавить тип стекла</Button>
                <Button variant="contained" style={{margin:'7px'}} onClick={deleteGlassType}>Удалить тип стекла</Button>
            </div>
        </div>
    )
}