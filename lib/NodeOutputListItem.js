import React from 'react';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const NodeOutputListItem = ({
    onMouseDown,
    index,
    item
}) => {
    const handleOnMouseDown = e => {
        e.stopPropagation();
        e.preventDefault();

        onMouseDown(index);
    }

    const noop = e => {
        e.stopPropagation();
        e.preventDefault();
    }

    return (
        <li onMouseDown={handleOnMouseDown}>
            <a href={"#"} onClick={noop}>
                { item.name }
                <i>
                    <FontAwesomeIcon
                        icon={faCircle}
                    />
                </i>
            </a>
        </li>
    )
}