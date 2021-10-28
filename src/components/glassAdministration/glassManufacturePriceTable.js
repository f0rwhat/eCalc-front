import React, {useEffect} from 'react';
import  {useState} from "react";
import {
    apiAddGlassManufacture, apiAddGlassManufacturePrice,
    apiDeleteGlassManufacture, apiDeleteGlassManufacturePrice, apiGetGlassManufacturePriceList,
    apiGetGlassManufacturesList, apiGetGlassTypesList,
    apiUpdateGlassManufacture, apiUpdateGlassManufacturePrice,
} from "../../api/api";
import {store} from "react-notifications-component";
import {DataGrid} from "@mui/x-data-grid";


export default function GlassManufacturePriceTable() {
    const [columns, setColumns] = useState([
        { field: 'type_name', headerName: 'Тип стекла', width: '300', height:'50', editable: true },
    ]);
    const [rows, setRows] = useState([]);
    const [lastEditModel, setLastEditModel] = useState({});
    const [priceData, setPriceData] = useState([]);
    const [typeData, setTypeData] = useState([]);
    const [manufactureData, setManufactureData] = useState([]);
    const [priceWS] = useState(() => {
        let socket = new WebSocket(`ws://${process.env.REACT_APP_BACK_ADDR}:8000/ws/glass/price`)
        socket.onmessage = (ev) => {
            let message = JSON.parse(ev.data)
            if (message.message_type === 'get') {
                setPriceData(message.data)
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
    const [typeWS] = useState(() => {
        let socket = new WebSocket(`ws://${process.env.REACT_APP_BACK_ADDR}:8000/ws/glass/type`)
        socket.onmessage = (ev) => {
            let message = JSON.parse(ev.data)
            if (message.message_type === 'get') {
                setTypeData(message.data)
            }
        }
        return socket
    })
    const [manufactureWS] = useState(() => {
        let socket = new WebSocket(`ws://${process.env.REACT_APP_BACK_ADDR}:8000/ws/glass/manufacture`)
        socket.onmessage = (ev) => {
            let message = JSON.parse(ev.data)
            console.log(message)
            if (message.message_type === 'get') {
                console.log(message.data)
                setManufactureData(message.data)
            }
        }
        return socket
    })


    useEffect(() => {
        apiGetGlassManufacturePriceList().then((manufacturePriceResponse)=>{
            setPriceData(manufacturePriceResponse.data);
        });
        apiGetGlassManufacturesList().then((manufactureResponse)=>{
            setManufactureData(manufactureResponse.data);

        });
        apiGetGlassTypesList().then((glassTypeResponse)=>{
            setTypeData(glassTypeResponse.data);
        });
    }, []);

    useEffect(() => {
        let columns = [{ field: 'type_name', headerName: 'Тип стекла', width: '300', height:'50', editable: false }];
        manufactureData.forEach(manufacture =>{
            columns.push({ field: `${manufacture.id}`, headerName: `${manufacture.name}`, width: '300', height:'50', editable: true });
        });
        console.log('TYPE DATA')
        console.log(typeData)
        let _rows = [];
        typeData.forEach(type => {
            let row = {id:_rows.length+1, type_name: type.name, type_db_id: type.id };
            priceData.forEach(priceCell => {
                if (priceCell.glass_id === row.type_db_id) {
                    row[priceCell.manufacture_id] = priceCell.price;
                }
            });
            _rows.push(row);
        });

        setColumns(columns);
        setRows(_rows);
    },[manufactureData, typeData, priceData]);

    let handleEditing = (editedModel, event) => {
        setLastEditModel(editedModel);
    };

    let handleStopEditing = (rowModel) => {

        let editedModel = {
            id:rowModel.row.id,
            type_id: rowModel.row.type_db_id,
            manufacture_id: rowModel.field,
            price: lastEditModel[rowModel.row.id][rowModel.field].value === undefined ? null : lastEditModel[rowModel.row.id][rowModel.field].value
        };

        if (editedModel.price !== '') {
            let isEditedCellExistInData = false
            priceData.forEach(priceCell => {
                if (priceCell.glass_id === rowModel.row.type_db_id && priceCell.manufacture_id === rowModel.row.id){
                    isEditedCellExistInData = true
                    console.log('found!')
                    return;
                }
            })
            if (isEditedCellExistInData === false) {
                addGlassManufacturePrice(editedModel.type_id, editedModel.manufacture_id, editedModel.price)
            } else {
                updateGlassManufacturePrice(editedModel.type_id, editedModel.manufacture_id, editedModel.price)
            }
        } else {
            deleteManufacturePrice(editedModel.type_id, editedModel.manufacture_id);
        }
    };

    let addGlassManufacturePrice = (type_id, manufacture_id, price) => {
        let request = {
            message_type: "add",
            data: {
                glass_type_id: type_id,
                glass_manufacture_id: manufacture_id,
                price: price
            }
        }
        let request_json = JSON.stringify(request)
        console.log(request_json)
        priceWS.send(request_json)
    }

    let updateGlassManufacturePrice = (type_id, manufacture_id, price) => {
        let request = {
            message_type: "update",
            data: {
                glass_type_id: type_id,
                glass_manufacture_id: manufacture_id,
                price: price
            }
        }
        let request_json = JSON.stringify(request)
        console.log(request_json)
        priceWS.send(request_json)
    }

    let deleteManufacturePrice = (type_id, manufacture_id) => {
        let request = {
            message_type: "delete",
            data: {
                glass_type_id: type_id,
                glass_manufacture_id: manufacture_id
            }
        }
        let request_json = JSON.stringify(request)
        console.log(request_json)
        priceWS.send(request_json)
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
        <div>
            <h2>Цена на обработанное стекло м<sup>2</sup></h2>
            <DataGrid  rows={rows} columns={columns}
                onEditRowsModelChange={handleEditing}
                onCellEditStop={handleStopEditing}
                style={{ margin: '10px', height: '50vh' }}
            />
        </div>
    )
}