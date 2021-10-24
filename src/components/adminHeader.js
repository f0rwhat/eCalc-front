import React from 'react';
import {useStyles} from './adminHeaderStyle'

export default function AdminHeader({sections}){
    const classes = useStyles();
    let sectionsString = '';
    sections.forEach(function(section){
        sectionsString += '/' + section;
    });

    return(
        <div>
            <div style={{textAlign: 'center',}}>
                <div class>
                    <a href="/admin" class={classes.a_fill_div}><h1 style={{fontSize:'3rem',}}>Администрирование <span style={{color: '#3f50b6'}}>eCalc</span><br/></h1></a>
                </div>
                <h2>{sectionsString}</h2>
            </div>
        </div>
    )
}