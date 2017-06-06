import {Validator} from "../validator";

export let USERNAME_REGEX = /^[\w\d_-]+$/;
export let ERROR_REGEX = /(?:{\s:\s")(.*?)(?:"\s})/;

export function validateCreateUser(email, username, password, password_confirm){
	const validator = new Validator();

	if(username.length <= 2)
		validator.error("Username must be greater than 2 characters.");

	if(username.length >= 20)
		validator.error("Username must be fewer than 20 characters.");

	if(!USERNAME_REGEX.test(username))
		validator.error("Username can only contain numbers, digits, underscores and dashes");

	if(password.length <= 5)
		validator.error("Password must be at least six characters.");	

	if(password !== password_confirm)
		validator.error("Passwords must match.");	

	return validator;
}


export function translateError(data){
	const validator = new Validator();

	if(typeof data == "string"){
		validator.error(data);
	}
	else if(data.errors){
		for(let field in data.errors){
			validator.error(data.errors[field].message);
		}
	}
	else if(data.code === 11000){
		let errorValue = ERROR_REGEX.exec(data.errmsg)[1];

		for(let field in data.op){
			if(data.op[field] === errorValue){
				validator.error(`The ${field} ${data.op[field]} is already in use.`);
				break;
			}
		}
	}

	return validator;
}


