import React, { useReducer, useRef } from 'react';

export const initPanState = {
    translateX: 0,
    translateY: 0,
    prevMouseX: 0,
    prevMouseY: 0,
    scale: 1
}

// Made from: https://jkettmann.com/jr-to-sr-refactoring-react-pan-and-zoom-image-component/

// Reducer
export const panReducer = (state, action) => {
    switch(action.type) {
        case types.PAN_START:
            return {
                ...state,
                prevMouseX: action.clientX,
                prevMouseY: action.clientY,
            }
        case types.PAN:
            const dMouseX = action.clientX - state.prevMouseX;
            const dMouseY = action.clientY - state.prevMouseY;
            return {
                ...state,
                translateX: state.translateX + dMouseX,
                translateY: state.translateY + dMouseY,
                prevMouseX: action.clientX,
                prevMouseY: action.clientY
            }
        case types.ZOOM:
            const scaledTrans = getScaledTrans(state, action.zoomFactor);
            const mousePosScreen = {
                x: action.clientX,
                y: action.clientY
            }
            const zoomOffset = getZoomOffset(action.containRect, mousePosScreen, action.zoomFactor);
            return {
                ...state,
                scale: state.scale * action.zoomFactor,
                translateX: scaledTrans.x + zoomOffset.x,
                translateY: scaledTrans.y + zoomOffset.y
            }
        default:
            return state;
    }
}

export const getZoomOffset = (rect, mousePosScrn, zoomFactor) => {
    const zoomOrigin = {
        x: mousePosScrn.x - rect.left,
        y: mousePosScrn.y - rect.top
    }

    const currDisCtr = {
        x: rect.width / 2 - zoomOrigin.x,
        y: rect.height / 2 - zoomOrigin.y
    }

    const scaledDisCtr = {
        x: currDisCtr.x * zoomFactor,
        y: currDisCtr.y * zoomFactor
    }

    const zoomOffset = {
        x: currDisCtr.x - scaledDisCtr.x,
        y: currDisCtr.y - scaledDisCtr.y
    }

    return zoomOffset;
}

export const getScaledTrans = (state, zoomFactor) => ({
    x: state.translateX * zoomFactor,
    y: state.translateY * zoomFactor
})

// Actions
const ZOOM_FACTOR = 0.1;
const ZOOM_FACTOR_IN = 1 + ZOOM_FACTOR;
const ZOOM_FACTOR_OUT = 1 - ZOOM_FACTOR;

const types = {
    PAN: 'PAN',
    PAN_START: 'PAN_START',
    ZOOM: 'ZOOM'
};

export const startPan = e => ({
    type: types.PAN_START,
    clientX: e.clientX,
    clientY: e.clientY
});

export const pan = e => ({
    type: types.PAN,
    clientX: e.clientX,
    clientY: e.clientY
});

export const zoom = (e, rect) => ({
    type: types.ZOOM,
    zoomFactor: event.deltaY < 0 ? ZOOM_FACTOR_IN : ZOOM_FACTOR_OUT,
    clientX: e.clientX,
    clientY: e.clientY,
    containRect: rect
});

export const usePanAndZoom = () => {
    const [state, dispatch] = useReducer(panReducer, initPanState);

    const containRect = useRef(null);

    const onMouseWindowMove = e => {
        e.preventDefault();
        dispatch(pan(e));
    }

    const onMouseWindowUp = () => {
        window.removeEventListener('mouseup', onMouseWindowUp);
        window.removeEventListener('mousemove', onMouseWindowMove);
    }

    const onMouseDown = e => {
        dispatch(startPan(e));
        window.addEventListener('mouseup', onMouseWindowUp);
        window.addEventListener('mousemove', onMouseWindowMove);
    }

    const onWheel = e => {
        if (e.deltaY !== 0 && containRect.current) {
            const contain = containRect.current.getBoundingClientRect();
            dispatch(zoom(event, contain));
        }
    }

    return {
        ...state,
        containRect,
        onMouseDown,
        onWheel
    }
}

export const PanZoomContainer = ({ className, children }) => {
    const {
        containerRef,
        onMouseDown,
        onWheel,
        translateX,
        translateY,
        scale,
      } = usePanAndZoom();
    
    return (
        <div
          className={className}
          ref={containerRef}
          onMouseDown={onMouseDown}
          onWheel={onWheel}
        >
            <div style={{transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`}}>
                {children}
            </div>
        </div>
    );
}