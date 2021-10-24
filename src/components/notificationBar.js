import React from "react";
import ReactNotification, {store} from 'react-notifications-component'

export default class NotificationBar extends React.Component {
    constructor(props) {
        super(props);
    }



    render() {
        return (
            <ReactNotification/>
        );
    }
}