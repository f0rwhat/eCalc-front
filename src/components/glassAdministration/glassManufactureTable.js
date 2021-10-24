import React, {useEffect} from 'react';
import  {useState} from "react";
import {
    apiAddGlassManufacture,
    apiDeleteGlassManufacture,
    apiGetGlassManufacturesList,
    apiUpdateGlassManufacture,
} from "../../api/api";
import {store} from "react-notifications-component";
import {DataGrid} from "@mui/x-data-grid";
import Button from "@material-ui/core/Button";


export default function GlassManufactureTable() {
    const [columns] = useState([
        { field: 'name', headerName: 'Название обработки', width: '300', height:'50', editable: true },
    ]);
    const [selectedRow, setSelectedRow] = useState(0);
    const [lastEditModel, setLastEditModel] = useState({});
    const [data, setData] = useState([]);
    useEffect(() => {
        apiGetGlassManufacturesList().then((response)=>{
            updateTable(response.data);
        });
    }, [])

    let addEmptyRow = () => {
        let _glassManufactures = [...data];
        _glassManufactures.push({
            id: _glassManufactures.length + 1,
            dbId : 0,
            name: '',
        });
        setData(_glassManufactures);
    };

    let handleEditing = (editedModel, event) => {
        setLastEditModel(editedModel);
    };

    let handleStopEditing = (rowModel) => {
        let editedModel = {id:rowModel.id,
            dbId:rowModel.row.dbId,
            name:lastEditModel[rowModel.id].name.value,
        };
        if (rowModel.row.dbId === 0)
        {
            addGlassManufacture(editedModel);
        }
        else
        {
            updateGlassManufacture(editedModel);
        }
    };

    let addGlassManufacture = (addedGlassManufacture) => {
        apiAddGlassManufacture(addedGlassManufacture.name).then((response)=>{
            updateTable(response.data);
//<<<<<<< HEAD
            sendNotification("Новая обработка стекла успешно создана!", "Ура!", "success");
//=======
//            sendNotification("Новая обработка стекла успешно сОзДаНа!", "Ура!", "success");
//>>>>>>> test_branch2
        }).catch(err=>{
            sendNotification("Не удалось добавить обработку стекла в базу данных!", `${err.response.data.msg}`, "danger");
        });
    }

    let updateGlassManufacture = (editedGlassManufacture) => {
        data.forEach(oldGlassManufacture => {
            if (oldGlassManufacture.id === editedGlassManufacture.id) {
                let hasChanges = oldGlassManufacture.name !== editedGlassManufacture.name;
                if (hasChanges)
                {
                    apiUpdateGlassManufacture(editedGlassManufacture.dbId,
                        editedGlassManufacture.name).then((response)=>{
                        updateTable(response.data);
                        sendNotification("Данные об обработке стекла успешно иЗмЕнЕнА!", "Ура!", "success");
                    }).catch(err=>{
                        sendNotification("Не удалось изменить данные об обработке стекла!", `${err.response.data.msg}`, "danger");
                    });
                }
            }
        });
    }

    let deleteGlassManufacture = () => {
        data.forEach(glass_manufacture => {
            if (glass_manufacture.id === selectedRow)
            {
                apiDeleteGlassManufacture(glass_manufacture.dbId).then((response)=>{
                    updateTable(response.data);
                    sendNotification("Обработка стекла успешно удалена!", "Ура!", "success");
                }).catch(err=>{
                    sendNotification("Не удалось удалить обработку стекла!", `${err.response.data.msg}`, "danger");
                    console.log(err);
                });
            }
        });
    }

    let updateTable = (glass_manufactures) => {
        let _glass_manufactures = [];
        glass_manufactures.forEach(glass_manufacture => {
            _glass_manufactures.push({id: _glass_manufactures.length + 1,
                dbId : glass_manufacture.id,
                name: glass_manufacture.name,
            });
        });
        setData(_glass_manufactures);
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
            <h2>Обработка стекла</h2>
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
                <Button variant="contained" style={{margin:'7px'}} onClick={deleteGlassManufacture}>Удалить тип стекла</Button>
            </div>
        </div>
    )
}