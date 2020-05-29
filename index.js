import React, { useState, useRef, useReducer, useEffect } from 'react';
import { computeOutOffsetByIndex, computeInOffsetByIndex } from './lib/Util';
// import { SVGComponent } from './lib-hooks/svgComp-hooks';
import Spline from './lib/Spline';
import DragNode from './lib/Node';
import { initPanState, pan, panReducer, startPan, zoom } from './lib/pan-zoom';

export const UnctrlNodeGraph = ({
    data,
    onNodeDeselect,
    onNodeMove,
    onNodeStartMove,
    onNodeSelect,
    onNewConnector,
    onRemoveConnector,
    className
}) => {
    const [dataS, setDataS] = useState({ connections: data.connections, nodes: data.nodes });
    const [source, setSource] = useState([]);
    const [dragging, setDragging] = useState(false);
    const [panning, setPanning] = useState(false);

    const [mousePos, setMousePos] = useState({x: 0, y: 0});
    const [{translateX, translateY, scale},
                                setPanState] = useReducer(panReducer, initPanState);

    const divParent = useRef();
    const svgRef = useRef();

    useEffect(() => setDataS({ connections: data.connections, nodes: data.nodes }), [data]);

    const onMouseMove = e => {
        if (panning) {
            e.preventDefault();
            setPanState(pan(e));
        } else {
            let [pX, pY] = [e.clientX, e.clientY];
            e.stopPropagation();
            // e.preventDefault();

            const svgRect = svgRef.current.getBoundingClientRect();
            // console.log(svgRect);
            setMousePos(old => {
                return {
                    ...old,
                    ...{x: pX - svgRect.left, y: pY - svgRect.top}
                }
            });
        }
    }

    const onMouseUp = e => {
        if (dragging) setDragging(false);
        if (panning) setPanning(false);
    }

    const onMouseWheel = e => {
        if (e.deltaY !== 0 && divParent.current) {
            const contain = divParent.current.getBoundingClientRect();
            setPanState(zoom(e, contain));
        }
    }

    const handleNodeMove = (idx, pos) => {
        let dataT = dataS;
        dataT.nodes[idx].x = pos.x;
        dataT.nodes[idx].y = pos.y;

        // console.log(dataT);
        // console.log({...dataS,...dataT});
        setDataS(old => {
            return {
                ...old, 
                ...dataT
            }
        });
    }

    const handleNodeStart = nid => {
        onNodeStartMove(nid);
    }

    const handleNodeStop = (nid, pos) => {
        onNodeMove(nid, pos);
    }

    const handleStartConnector = (nid, outputIdx) => {
        let newSrc = [nid, outputIdx];

        setDragging(true);
        setSource(newSrc); // Not sure if this will work...
    }

    const handleCompleteConnector = (nid, inputIdx) => {
        if (dragging) {
            let fromNode = getNodeById(data.nodes, source[0]);
            let fromPinName = fromNode.fields.out[source[1]].name;
            let toNode = getNodeById(data.nodes, nid);
            let toPinName = toNode.fields.in[inputIdx].name;

            onNewConnector(fromNode.nid, fromPinName, toNode.nid, toPinName);
        }
        setDragging(false);
    }

    const handleRemoveConnector = connector => {
        if (onRemoveConnector) {
            onRemoveConnector(connector);
        }
    }

    const handleNodeSelect = nid => {
        if (onNodeSelect) {
            onNodeSelect(nid);
        }
    }

    const handleNodeDeselect = nid => {
        if (onNodeDeselect) {
            onNodeDeselect(nid);
        }
    }

    const computePinIdxfromLabel = (pins, pinLabel) => {
        let reval = 0;

        for (let pin of pins) {
            if (pin.name === pinLabel) {
                return reval;
            } else {
                reval++;
            }
        }
    }

    const getNodeById = (nodes, nid) => {
        let reval = 0;

        for(const node of nodes) {
            if (node.nid === nid) {
                return nodes[reval];
            } else {
                reval++;
            }
        }
    }

    const onDownDetectMove = e => {
        const target = e.target.nodeName === "svg" ? e.target.parentElement : e.target;
        console.log(target);
        if (target.getAttribute("data-pan") === null) {
            return;
        } else {
            setPanning(true);
            setPanState(startPan(e));
        }
    }

    let newConn = null;
    let i = 0;

    // console.log(dragging);
    if (dragging) {
        let sourceNode = getNodeById(dataS.nodes, source[0]);
        let connectorStart = computeOutOffsetByIndex(sourceNode.x, sourceNode.y, source[1]);
        let connectorEnd = {
            x: mousePos.x,
            y: mousePos.y
        };

        // console.log(mousePos);
        newConn = <Spline
                    start={connectorStart}
                    end={connectorEnd}
                  />
    }

    let splineIdx = 0;

    // console.log(translateX, translateY, scale);

    return (
        <div className={dragging ? 'dragging' : ''} 
            onMouseDown={onDownDetectMove}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            ref={divParent}
            style={{transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
                    width: '100%', height: '100%'}}
            data-pan={true}
        >
            {dataS.nodes.map(node => {
                // console.log(node);
                return <DragNode
                            index={i++}
                            nid={node.nid}
                            title={node.type}
                            inputs={node.fields.in}
                            outputs={node.fields.out}
                            pos={{x: node.x, y: node.y}}
                            key={node.nid}

                            onNodeStart={nid => handleNodeStart(nid)}
                            onNodeStop={(nid, pos) => handleNodeStop(nid, pos)}
                            onNodeMove={(idx, pos) => handleNodeMove(idx, pos)}

                            onStartConnector={(nid, outputIdx) => handleStartConnector(nid, outputIdx)}
                            onCompleteConnector={(nid, inputIdx) => handleCompleteConnector(nid, inputIdx)}

                            onNodeSelect={nid => handleNodeSelect(nid)}
                            onNodeDeselect={nid => handleNodeDeselect(nid)}
                    />
            })}
            <svg style={{position: 'absolute', height: "100%", width: "100%", zIndex: 9000}} 
                ref={svgRef}>
                {dataS.connections.map(connector => {
                    // console.log(data);
                    // console.log(connector);
                    let fromNode = getNodeById(data.nodes, connector.from_node);
                    let toNode = getNodeById(data.nodes, connector.to_node);

                    let splinestart = computeOutOffsetByIndex(fromNode.x, fromNode.y, computePinIdxfromLabel(fromNode.fields.out, connector.from));
                    let splineend = computeInOffsetByIndex(toNode.x, toNode.y, computePinIdxfromLabel(toNode.fields.in, connector.to));

                    return <Spline
                            start={splinestart}
                            end={splineend}
                            key={splineIdx++}
                            mousePos={mousePos}
                            onRemove={() => handleRemoveConnector(connector)}
                    />
                })}
                {newConn}
            </svg>
        </div>
    );
}

export const CtrlNodeGraph = ({
    data,
    setData,
    onNodeDeselect,
    onNodeMove,
    onNodeStartMove,
    onNodeSelect,
    onNewConnector,
    onRemoveConnector,
    className
}) => {
    const [source, setSource] = useState([]);
    const [dragging, setDragging] = useState(false);
    const [panning, setPanning] = useState(false);

    const [mousePos, setMousePos] = useState({x: 0, y: 0});
    const [{translateX, translateY, scale},
                                setPanState] = useReducer(panReducer, initPanState);

    const divParent = useRef();
    const svgRef = useRef();

    const onMouseMove = e => {
        if (panning) {
            e.preventDefault();
            setPanState(pan(e));
        } else {
            let [pX, pY] = [e.clientX, e.clientY];
            e.stopPropagation();
            // e.preventDefault();

            const svgRect = svgRef.current.getBoundingClientRect();
            // console.log(svgRect);
            setMousePos(old => {
                return {
                    ...old,
                    ...{x: pX - svgRect.left, y: pY - svgRect.top}
                }
            });
        }
    }

    const onMouseUp = e => {
        if (dragging) setDragging(false);
        if (panning) setPanning(false);
    }

    const onMouseWheel = e => {
        if (e.deltaY !== 0 && divParent.current) {
            const contain = divParent.current.getBoundingClientRect();
            setPanState(zoom(e, contain));
        }
    }

    const handleNodeMove = (idx, pos) => {
        let dataT = data;
        dataT.nodes[idx].x = pos.x;
        dataT.nodes[idx].y = pos.y;

        // console.log(dataT);
        // console.log({...dataS,...dataT});
        setData(old => {
            return {
                ...old, 
                ...dataT
            }
        });
    }

    const handleNodeStart = nid => {
        onNodeStartMove(nid);
    }

    const handleNodeStop = (nid, pos) => {
        onNodeMove(nid, pos);
    }

    const handleStartConnector = (nid, outputIdx) => {
        let newSrc = [nid, outputIdx];

        setDragging(true);
        setSource(newSrc); // Not sure if this will work...
    }

    const handleCompleteConnector = (nid, inputIdx) => {
        if (dragging) {
            let fromNode = getNodeById(data.nodes, source[0]);
            let fromPinName = fromNode.fields.out[source[1]].name;
            let toNode = getNodeById(data.nodes, nid);
            let toPinName = toNode.fields.in[inputIdx].name;

            onNewConnector(fromNode.nid, fromPinName, toNode.nid, toPinName);
        }
        setDragging(false);
    }

    const handleRemoveConnector = connector => {
        if (onRemoveConnector) {
            onRemoveConnector(connector);
        }
    }

    const handleNodeSelect = nid => {
        if (onNodeSelect) {
            onNodeSelect(nid);
        }
    }

    const handleNodeDeselect = nid => {
        if (onNodeDeselect) {
            onNodeDeselect(nid);
        }
    }

    const computePinIdxfromLabel = (pins, pinLabel) => {
        let reval = 0;

        for (let pin of pins) {
            if (pin.name === pinLabel) {
                return reval;
            } else {
                reval++;
            }
        }
    }

    const getNodeById = (nodes, nid) => {
        let reval = 0;

        for(const node of nodes) {
            if (node.nid === nid) {
                return nodes[reval];
            } else {
                reval++;
            }
        }
    }

    const onDownDetectMove = e => {
        const target = e.target.nodeName === "svg" ? e.target.parentElement : e.target;
        console.log(target);
        if (target.getAttribute("data-pan") === null) {
            return;
        } else {
            setPanning(true);
            setPanState(startPan(e));
        }
    }

    let newConn = null;
    let i = 0;

    // console.log(dragging);
    if (dragging) {
        let sourceNode = getNodeById(dataS.nodes, source[0]);
        let connectorStart = computeOutOffsetByIndex(sourceNode.x, sourceNode.y, source[1]);
        let connectorEnd = {
            x: mousePos.x,
            y: mousePos.y
        };

        // console.log(mousePos);
        newConn = <Spline
                    start={connectorStart}
                    end={connectorEnd}
                  />
    }

    let splineIdx = 0;

    // console.log(translateX, translateY, scale);

    return (
        <div className={dragging ? 'dragging' : ''} 
            onMouseDown={onDownDetectMove}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            ref={divParent}
            style={{transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
                    width: '100%', height: '100%'}}
            data-pan={true}
        >
            {data.nodes.map(node => {
                // console.log(node);
                return <DragNode
                            index={i++}
                            nid={node.nid}
                            title={node.type}
                            inputs={node.fields.in}
                            outputs={node.fields.out}
                            pos={{x: node.x, y: node.y}}
                            key={node.nid}

                            onNodeStart={nid => handleNodeStart(nid)}
                            onNodeStop={(nid, pos) => handleNodeStop(nid, pos)}
                            onNodeMove={(idx, pos) => handleNodeMove(idx, pos)}

                            onStartConnector={(nid, outputIdx) => handleStartConnector(nid, outputIdx)}
                            onCompleteConnector={(nid, inputIdx) => handleCompleteConnector(nid, inputIdx)}

                            onNodeSelect={nid => handleNodeSelect(nid)}
                            onNodeDeselect={nid => handleNodeDeselect(nid)}
                    />
            })}
            <svg style={{position: 'absolute', height: "100%", width: "100%", zIndex: 9000}} 
                ref={svgRef}>
                {data.connections.map(connector => {
                    // console.log(data);
                    // console.log(connector);
                    let fromNode = getNodeById(data.nodes, connector.from_node);
                    let toNode = getNodeById(data.nodes, connector.to_node);

                    let splinestart = computeOutOffsetByIndex(fromNode.x, fromNode.y, computePinIdxfromLabel(fromNode.fields.out, connector.from));
                    let splineend = computeInOffsetByIndex(toNode.x, toNode.y, computePinIdxfromLabel(toNode.fields.in, connector.to));

                    return <Spline
                            start={splinestart}
                            end={splineend}
                            key={splineIdx++}
                            mousePos={mousePos}
                            onRemove={() => handleRemoveConnector(connector)}
                    />
                })}
                {newConn}
            </svg>
        </div>
    );
}