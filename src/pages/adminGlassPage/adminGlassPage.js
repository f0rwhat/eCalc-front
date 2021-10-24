import React from "react";
import AdminHeader from "./../../components/adminHeader";
import GlassTypeTable from "../../components/glassAdministration/glassTypeTable";
import GlassManufactureTable from "../../components/glassAdministration/glassManufactureTable";
import GlassManufacturePriceTable from "../../components/glassAdministration/glassManufacturePriceTable";


export default function AdminGlass() {
        return(
            <div>
                <AdminHeader sections = {['Главная', 'Стекло']}/>
                <div style={{ margin: 'auto', display: 'block', justifyContent:'center', alignItems:'center', textAlign:'center', width:'66%'}}>
                    <div style={{ margin: 'auto', display: 'flex', justifyContent:'center', alignItems:'center'}}>
                        <GlassTypeTable/>
                        <GlassManufactureTable/>
                    </div>
                    <GlassManufacturePriceTable/>
                </div>
            </div>
        )
}