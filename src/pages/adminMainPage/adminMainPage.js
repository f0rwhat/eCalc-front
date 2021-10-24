import React from "react";
import AdminHeader from "./../../components/adminHeader";
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import GlassTypeTable from "../../components/glassAdministration/glassTypeTable";

export default function AdminMainPage() {
    const history = useHistory();

    const glassButtonClick=()=>
    {
        let path = `/glass`;
        history.push(path);
    }

    const managersButtonClick=()=>
    {
        let path = `/managers`;
        history.push(path);
    }

        return(
            <div>
                <AdminHeader sections = {['Главная']}/>
                <div style={{justifyContent:'center', alignItems:'center', display: 'block', marginLeft: 'auto', marginRight: 'auto'}}>
                    <Button variant="contained" style={{display: 'block',margin:'auto', marginTop:'10px', marginBottom:'10px'}} onClick={glassButtonClick}>Стекло</Button>
                    <Button variant="contained" style={{display: 'block',margin:'auto', marginTop:'10px', marginBottom:'10px'}} onClick={managersButtonClick}>Менеджеры</Button>
                    <Button variant="contained" style={{display: 'block',margin:'auto', marginTop:'10px', marginBottom:'10px'}}>Компоненты</Button>
                </div>
            </div>
        )
}