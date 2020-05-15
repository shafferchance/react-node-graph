import React, { useState } from 'react';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const NodeInputListItem = ({
    onMouseUp,
    index,
    item
}) => {
    const [hover, setHover] = useState(false);

    const handleOnMouseUp = e => {
        e.stopPropagation();
        e.preventDefault();

        onMouseUp(index);
    }

    const onMouseOver = () => {
        setHover(true);
    }

    const onMouseOut = () => {
        setHover(false);
    }

    const noop = e => {
        e.stopPropagation();
        e.preventDefault();
    }

    return (
        <li>
            <a onClick={noop} onMouseUp={handleOnMouseUp} href={"#"}>
                <i className={hover ? 'hover' : null}>
                    <FontAwesomeIcon 
                        icon={faCircle}
                        onMouseOver={onMouseOver}
                        onMouseOut={onMouseOut}
                    />
                </i>
                { item.name }
            </a>
        </li>
    );
}