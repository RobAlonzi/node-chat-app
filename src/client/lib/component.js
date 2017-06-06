import {Component} from "react";

import * as services from "./services";

export class ContainerBase extends Component {

	constructor(props){
		super(props);
		this._disposeFunctions = [];
		this._server = services.server;
	}

	subscribe(observable$, callback){
		const sub = observable$.subscribe(callback);
		this._disposeFunctions.push(() => sub.unsubscribe());
		return sub;
	}

	componentWillUnmount(){
		this._disposeFunctions.forEach(d => d());
		this._disposeFunctions = [];
	}

}