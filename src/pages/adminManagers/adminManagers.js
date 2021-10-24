import React from "react";
import AdminHeader from "./../../components/adminHeader";
import {apiGetManagersList, apiDeleteManager, apiAddManager, apiUpdateManager} from "../../api/api"
import { DataGrid } from '@mui/x-data-grid';
import Button from '@material-ui/core/Button';
import { store } from 'react-notifications-component';

export default class AdminManagers extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            managers: [],
            columns: [
                { field: 'name', headerName: 'Имя', width: '200', height:'50', editable: true },
                { field: 'phone', headerName: 'Телефон', width: '200', editable: true },
                { field: 'secondPhone', headerName: 'Второй телефон', width: '200', editable: true },
                { field: 'identifier', headerName: 'Идентификатор', width: '200', editable: true },
            ],
            selectedRow: 0,
            lasEditModel: {}
        }
        this.handleEditing = this.handleEditing.bind(this);
        this.handleStopEditing = this.handleStopEditing.bind(this);
        this.deleteManager = this.deleteManager.bind(this);
        this.addManager = this.addManager.bind(this);
        this.addEmptyRow = this.addEmptyRow.bind(this);
        this.updateManager = this.updateManager.bind(this);
    }

    async componentDidMount(){
        apiGetManagersList().then((response)=>{
            this.updateTable(response.data)
        }).catch(err=>{
            console.log(err);
        });

    }

    async addEmptyRow() {
        let _managers = [...this.state.managers];
        _managers.push({
            id: _managers.length + 1,
            dbId : 0,
            name: '',
            phone: '',
            secondPhone: '',
            identifier: ''
        });
        this.setState({
            managers:_managers
        });
    }

    async handleEditing(editedModel, event){
        this.setState({lastEditModel: editedModel});
    }

    async handleStopEditing(rowModel) {
        let editedModel = {id:rowModel.row.id,
            dbId:rowModel.row.dbId,
            name:this.state.lastEditModel[rowModel.row.id].name.value,
            phone:this.state.lastEditModel[rowModel.row.id].phone.value,
            secondPhone:this.state.lastEditModel[rowModel.row.id].secondPhone.value,
            identifier:this.state.lastEditModel[rowModel.row.id].identifier.value
        };
        if (rowModel.row.dbId === 0)
        {
            this.addManager(editedModel);
        }
        else
        {
            this.updateManager(editedModel);
        }
    }

    addManager(addedManager) {
        apiAddManager(addedManager.name,
                      addedManager.phone,
                      addedManager.secondPhone,
                      addedManager.identifier).then((response)=>{
            this.updateTable(response.data)
            this.sendNotification("Новый менеджер успешно добавлен!", "Ура!", "success");
        }).catch(err=>{
            this.sendNotification("Не удалось добавить менеджера в базу данных!", `${err.response.data.detail[0].msg}`, "danger");
            console.log('Couldnt add user');
        });
    }

    updateManager(editedManager) {
        console.log(editedManager)
        this.state.managers.forEach(oldManager => {
            if (oldManager.id === editedManager.id) {
                let hasChanges = editedManager.name !== oldManager.name
                                || editedManager.phone !== oldManager.phone
                                || editedManager.secondPhone !== oldManager.secondPhone
                                || editedManager.identifier !== oldManager.identifier;
                if (hasChanges)
                {
                    apiUpdateManager(editedManager.dbId,
                                     editedManager.name,
                                     editedManager.phone,
                                     editedManager.secondPhone,
                                     editedManager.identifier).then((response)=>{
                        this.updateTable(response.data);
                        this.sendNotification("Данные о менеджере успешно обновлены!", "Ура!", "success");
                    }).catch(err=>{
                        this.sendNotification("Не удалось обновить данные о менеджере!", `${err.response.data.detail[0].msg}`, "danger");
                        console.log('Couldnt update user');
                    });
                }
            }
        });
    }

    async deleteManager() {
        this.state.managers.forEach(manager => {
            if (manager.id === this.state.selectedRow)
            {
                apiDeleteManager(manager.dbId).then((response)=>{
                    this.updateTable(response.data);
                    this.sendNotification("Менеджер успешно удален!", "Ура!", "success");
                }).catch(err=>{
                    this.sendNotification("Не удалось удалить менеджера!", `${err.response.data.msg}`, "danger");
                    console.log(err);
                });
            }
        });
    }

    sendNotification(title, message, type){
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

    updateTable(managers) {
        let _managers = [];
        managers.forEach(manager => {
            _managers.push({id: _managers.length + 1,
                            dbId : manager.id,
                            name: manager.name,
                            phone: manager.phone,
                            secondPhone: manager.secondPhone != null ? manager.secondPhone : '',
                            identifier: manager.identifier
            });
        });
        this.setState({
            managers:_managers
        });
    }

    render(){
        return(
            <div>
                <AdminHeader sections = {['Главная', 'Менеджеры']}/>
                <div style={{ margin: 'auto', display: 'block', justifyContent:'center', alignItems:'center', height: '74vh', width: '805px' }}>
                    <DataGrid  editMode="row" rows={this.state.managers} columns={this.state.columns}
                               onSelectionModelChange={(selectionModel)=>{
                                    this.setState({selectedRow:selectionModel[0]});
                               }}
                               onEditRowsModelChange={this.handleEditing}
                               onRowEditStop={this.handleStopEditing}
                    />
                <div style={{display: 'flex', justifyContent:'center', alignItems:'center' }}>
                    <Button variant="contained" style={{margin:'10px'}} onClick={this.addEmptyRow}>Добавить менеджера</Button>
                    <Button variant="contained" style={{margin:'10px'}} onClick={this.deleteManager}>Удалить менеджера</Button>
                </div>
                </div>
            </div>
        )
    }
}