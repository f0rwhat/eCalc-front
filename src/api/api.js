import axios from "axios";

const backAddr = process.env.REACT_APP_BACK_ADDR;

export function apiGetManagersList(){
    return axios({
        method: 'GET',
        url: `http://${backAddr}:8000/manager/all`,
    })
}

export function apiDeleteManager(manager_id){
    return axios({
        method: 'DELETE',
        url: `http://${backAddr}:8000/manager/${manager_id}`,
    })
}

export function apiAddManager(manager_name, manager_phone, manager_secondPhone, manager_identifier){
    let data = {};
    data.name = manager_name;
    data.phone = manager_phone;
    if (manager_secondPhone !== '') {
        data.secondPhone = manager_secondPhone;
    }
    data.identifier = manager_identifier;
    return axios({
        method: 'POST',
        url: `http://${backAddr}:8000/manager/add`,
        data: data
    })
}

export function apiUpdateManager(manager_id, manager_name, manager_phone, manager_secondPhone, manager_identifier){
    let data = {};
    data.name = manager_name;
    data.phone = manager_phone;
    if (manager_secondPhone !== ''){
        data.secondPhone = manager_secondPhone;
    }
    data.identifier = manager_identifier;
    return axios({
        method: 'PUT',
        url: `http://${backAddr}:8000/manager/${manager_id}`,
        data: data
    })
}

export function apiGetGlassTypesList(){
    return axios({
        method: 'GET',
        url: `http://${backAddr}:8000/glass/type/all`,
    })
}

export function apiDeleteGlassType(glass_type_id){
    return axios({
        method: 'DELETE',
        url: `http://${backAddr}:8000/glass/type/${glass_type_id}`,
    })
}

export function apiAddGlassType(glass_type_name, glass_type_discount, glass_type_markup){
    return axios({
        method: 'POST',
        url: `http://${backAddr}:8000/glass/type/add`,
        data: {
            name:glass_type_name,
            discount:glass_type_discount,
            markup:glass_type_markup
        }
    })
}

export function apiUpdateGlassType(glass_type_id, glass_type_name, glass_type_discount, glass_type_markup){
    return axios({
        method: 'PUT',
        url: `http://${backAddr}:8000/glass/type/${glass_type_id}`,
        data: {
            name:glass_type_name,
            discount:glass_type_discount,
            markup:glass_type_markup
        }
    })
}

export function apiGetGlassManufacturesList(){
    return axios({
        method: 'GET',
        url: `http://${backAddr}:8000/glass/manufacture/all`,
    })
}

export function apiDeleteGlassManufacture(glass_manufacture_id){
    return axios({
        method: 'DELETE',
        url: `http://${backAddr}:8000/glass/manufacture/${glass_manufacture_id}`,
    })
}

export function apiAddGlassManufacture(glass_manufacture_name){
    return axios({
        method: 'POST',
        url: `http://${backAddr}:8000/glass/manufacture/add`,
        data: {
            name:glass_manufacture_name,
        }
    })
}

export function apiUpdateGlassManufacture(glass_manufacture_id, glass_manufacture_name){
    return axios({
        method: 'PUT',
        url: `http://${backAddr}:8000/glass/manufacture/${glass_manufacture_id}`,
        data: {
            name:glass_manufacture_name
        }
    })
}

export function apiGetGlassManufacturePriceList(){
    return axios({
        method:'GET',
        url: `http://${backAddr}:8000/glass/price/all`,
    })
}

export function apiDeleteGlassManufacturePrice(glass_type_id, glass_manufacture_id){
    return axios({
        method:'DELETE',
        url: `http://${backAddr}:8000/glass/price/${glass_type_id}/${glass_manufacture_id}`,
    })
}

export function apiAddGlassManufacturePrice(glass_type_id, glass_manufacture_id, price){
    let _data = { }
    if (price !== '') {
        _data.price = parseInt(price)
    }
    return axios({
        method:'POST',
        url: `http://${backAddr}:8000/glass/price/${glass_type_id}/${glass_manufacture_id}`,
        data: _data
    })
}

export function apiUpdateGlassManufacturePrice(glass_type_id, glass_manufacture_id, price){
    let _data = { }
    if (price !== '') {
        _data.price = parseInt(price)
    }
    return axios({
        method:'POST',
        url: `http://${backAddr}:8000/glass/price/${glass_type_id}/${glass_manufacture_id}`,
        data: _data
    })
}