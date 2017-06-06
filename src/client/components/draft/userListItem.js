import React from "react";
import PropTypes from 'prop-types';

export const UserListItem = ({name, color}) => {
	return(
		<li>
			<span className="name" style={{color: color}}>{name}</span>
		</li>
	);
};

UserListItem.propTypes = {
	name: PropTypes.string.isRequired,
	color: PropTypes.string.isRequired
};
