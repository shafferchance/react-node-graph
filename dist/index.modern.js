import React, { useState, useRef } from 'react';
import onClickOutside from 'react-onclickoutside';
import Draggable from 'react-draggable';

function computeInOffsetByIndex(x, y, index) {
  let outx = x + 15;
  let outy = y + 47 + index * 20;
  return {
    x: outx,
    y: outy
  };
}
function computeOutOffsetByIndex(x, y, index) {
  let outx = x + 166;
  let outy = y + 49 + index * 22;
  return {
    x: outx,
    y: outy
  };
}

const TrashIcon = ({
  onClick,
  position
}) => {
  const handleClick = e => {
    if (onClick) {
      onClick(e);
    }
  };

  return /*#__PURE__*/React.createElement("g", {
    className: "trash-icon",
    fill: "none",
    stroke: "none",
    strokeWidth: "1",
    transform: `translate(${position.x - 6},${position.y + 15})`,
    onClick: handleClick
  }, /*#__PURE__*/React.createElement("circle", {
    className: "trash-icon-bg",
    cx: 7,
    cy: 7,
    r: "14",
    fill: "#337AB7"
  }), /*#__PURE__*/React.createElement("g", {
    className: "trash-icon-trashcan",
    fill: "#FFFFFF",
    transform: "translate(-336.00000, -192.000000)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M347.999959,195 L350,195 L350,196 L349,196 L349,207.001498 C349,207.552511 348.554265,208 348.004423,208 L338.995577,208 C338.444837,208 338,207.552955 338,207.001498 L338,196 L337,196 L337,195 L338.995577,195 L339.000042,195 L339,194.990631 L339,193.009369 C339,192.443353 339.446616,192 339.997545,192 L347.002455,192 C347.553689,192 348,192.45191 348,193.009369 L348,194.990631 Z M340,194 L340,195 L347,195 L347,194 C347,193.447715 346.552285,193 346,193 L341,193 C340.447715,193 340,193.447715 340,194 Z M339,196 L339,207 L348,207 L348,196 Z M341,197 L342,197 L342,206 L341,206 Z M343,197 L344,197 L344,206 L343,206 Z M345,197 L345,206 L346,206 L346,197 L345,197 Z M345,197",
    id: "Rectangle 159"
  })));
};

const Spline = ({
  mousePos,
  onClick,
  onClickOutside,
  onRemove,
  end,
  start
}) => {
  const [selected, setSelected] = useState(false);
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });

  const bezierCurve = (a, b, cp1x, cp1y, cp2x, cp2y, x, y) => {
    return `M ${a} ${b} C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${x} ${y}`;
  };

  const distance = (a, b) => {
    return Math.sqrt((b[0] - a[0]) * (b[0] - a[0]) + (b[1] - a[1]) * (b[1] - a[1]));
  };

  const handleClick = e => {
    setSelected(old => !old);
    setPosition(old => {
      return { ...old,
        ...mousePos
      };
    });

    if (onClick) {
      onClick(e);
    }
  };

  Spline.handleClickOutside = e => {
    setSelected(false);

    if (onClickOutside) {
      onClickOutside(e);
    }
  };

  const handleRemove = e => {
    setSelected(false);

    if (onRemove) {
      onRemove(e);
    }
  };

  let dist = distance([start.x, start.y], [end.x, end.y]);
  let pathString = bezierCurve(start.x, start.y, start.x + dist * 0.25, start.y, end.x - dist * 0.75, end.y, end.x, end.y);
  let className = `connector ${selected ? ' selected' : ''}`;
  return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("circle", {
    cx: start.x,
    cy: start.y,
    r: "3",
    fill: "#337ab7"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: end.x,
    cy: end.y,
    r: "3",
    fill: "#9191A8"
  }), /*#__PURE__*/React.createElement("path", {
    className: "connector-click-area",
    d: pathString,
    onClick: handleClick
  }), /*#__PURE__*/React.createElement("path", {
    className: className,
    d: pathString,
    onClick: handleClick
  }), selected ? /*#__PURE__*/React.createElement(TrashIcon, {
    position: position,
    onClick: handleRemove
  }) : null);
};

const handleClickConfig = {
  handleClickOutside: () => Spline.handleClickOutside
};
var Spline$1 = onClickOutside(Spline, handleClickConfig);

const NodeInputListItem = ({
  onMouseUp,
  index,
  item
}) => {
  const [hover, setHover] = useState(false);

  const handleOnMouseUp = e => {
    e.stopPropagation();
    e.preventDefault();
    onMouseUp(index);
  };

  const onMouseOver = () => {
    setHover(true);
  };

  const onMouseOut = () => {
    setHover(false);
  };

  const noop = e => {
    e.stopPropagation();
    e.preventDefault();
  };

  return /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    onClick: noop,
    onMouseUp: handleOnMouseUp,
    href: "#"
  }, /*#__PURE__*/React.createElement("i", {
    className: hover ? 'fa fa-circle-o hover' : 'fa fa-circle-o',
    onMouseOver: onMouseOver,
    onMouseOut: onMouseOut
  }), item.name));
};

const NodeInputList = ({
  items,
  onCompleteConnector
}) => {
  const onMouseUp = i => {
    onCompleteConnector(i);
  };

  let i = 0;
  return /*#__PURE__*/React.createElement("div", {
    className: "nodeInputWrapper"
  }, /*#__PURE__*/React.createElement("ul", {
    className: "nodeInputList"
  }, items.map(item => {
    return /*#__PURE__*/React.createElement(NodeInputListItem, {
      onMouseUp: i => onMouseUp(i),
      key: i,
      index: i++,
      item: item
    });
  })));
};

const NodeOutputListItem = ({
  onMouseDown,
  index,
  item
}) => {
  const handleOnMouseDown = e => {
    e.stopPropagation();
    e.preventDefault();
    onMouseDown(index);
  };

  const noop = e => {
    e.stopPropagation();
    e.preventDefault();
  };

  return /*#__PURE__*/React.createElement("li", {
    onMouseDown: handleOnMouseDown
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: noop
  }, item.name, /*#__PURE__*/React.createElement("i", {
    className: "fa fa-circle-o"
  })));
};

const NodeOutputList = ({
  onStartConnector,
  items
}) => {
  const onMouseDown = i => {
    onStartConnector(i);
  };

  let i = 0;
  return /*#__PURE__*/React.createElement("div", {
    className: "nodeOutputWrapper"
  }, /*#__PURE__*/React.createElement("ul", {
    className: "nodeOutputList"
  }, items.map(item => {
    return /*#__PURE__*/React.createElement(NodeOutputListItem, {
      onMouseDown: i => onMouseDown(i),
      key: i,
      index: i++,
      item: item
    });
  })));
};

const DragNode = ({
  onNodeDeselect,
  onNodeSelect,
  onNodeStart,
  onNodeStop,
  onNodeMove,
  onStartConnector,
  onCompleteConnector,
  index,
  inputs,
  outputs,
  nid,
  pos,
  title
}) => {
  const [selected, setSelected] = useState(false);

  const handleDragStart = (eve, ui) => {
    onNodeStart(nid, ui);
  };

  const handleDragStop = (eve, ui) => {
    onNodeStop(nid, {
      x: ui.x,
      y: ui.y
    });
  };

  const handleDrag = (eve, ui) => {
    onNodeMove(index, {
      x: ui.x,
      y: ui.y
    });
  };

  const handleOnStartConnector = idx => {
    onStartConnector(nid, idx);
  };

  const handleOnCompleteConnector = idx => {
    onCompleteConnector(nid, idx);
  };

  const handleClick = e => {
    setSelected(true);

    if (onNodeSelect) {
      onNodeSelect(nid);
    }
  };

  DragNode.handleClickOutside = () => {
    if (onNodeDeselect && selected) {
      onNodeDeselect(nid);
    }

    setSelected(false);
  };

  let nodeClass = `node ${selected ? ' selected' : ''}`;
  return /*#__PURE__*/React.createElement("div", {
    onDoubleClick: e => handleClick()
  }, /*#__PURE__*/React.createElement(Draggable, {
    position: {
      x: pos.x,
      y: pos.y
    },
    handle: ".node-header",
    onStart: (eve, ui) => handleDragStart(eve, ui),
    onStop: (eve, ui) => handleDragStop(eve, ui),
    onDrag: (eve, ui) => handleDrag(eve, ui)
  }, /*#__PURE__*/React.createElement("section", {
    className: nodeClass,
    style: {
      zIndex: 10000
    }
  }, /*#__PURE__*/React.createElement("header", {
    className: "node-header"
  }, /*#__PURE__*/React.createElement("span", {
    className: "node-title"
  }, title)), /*#__PURE__*/React.createElement("div", {
    className: "node-content"
  }, /*#__PURE__*/React.createElement(NodeInputList, {
    items: inputs,
    onCompleteConnector: idx => handleOnCompleteConnector(idx)
  }), /*#__PURE__*/React.createElement(NodeOutputList, {
    items: outputs,
    onStartConnector: idx => handleOnStartConnector(idx)
  })))));
};

const handleClickConfig$1 = {
  handleClickOutside: () => DragNode.handleClickOutside
};
var DragNode$1 = onClickOutside(DragNode, handleClickConfig$1);

const ReactNodeGraphHook = ({
  data,
  setData,
  onNodeDeselect,
  onNodeMove,
  onNodeStartMove,
  onNodeSelect,
  onNewConnector,
  onRemoveConnector
}) => {
  const [source, setSource] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [mousePos, setMousePos] = useState({
    x: 0,
    y: 0
  });
  const svgRef = useRef();

  const onMouseMove = e => {
    let [pX, pY] = [e.clientX, e.clientY];
    e.stopPropagation();
    e.preventDefault();
    const svgRect = svgRef.current.getBoundingClientRect();
    setMousePos(old => {
      return { ...old,
        ...{
          x: pX - svgRect.left,
          y: pY - svgRect.top
        }
      };
    });
  };

  const onMouseUp = e => {
    setDragging(false);
  };

  const handleNodeStart = nid => {
    onNodeStartMove(nid);
  };

  const handleNodeStop = (nid, pos) => {
    onNodeMove(nid, pos);
  };

  const handleNodeMove = (idx, pos) => {
    let dataT = data;
    dataT.nodes[idx].x = pos.x;
    dataT.nodes[idx].y = pos.y;
    setData(old => {
      return { ...old,
        ...dataT
      };
    });
  };

  const handleStartConnector = (nid, outputIdx) => {
    let newSrc = [nid, outputIdx];
    setDragging(true);
    setSource(newSrc);
  };

  const handleCompleteConnector = (nid, inputIdx) => {
    if (dragging) {
      let fromNode = getNodeById(data.nodes, source[0]);
      let fromPinName = fromNode.fields.out[source[1]].name;
      let toNode = getNodeById(data.nodes, nid);
      let toPinName = toNode.fields.in[inputIdx].name;
      onNewConnector(fromNode.nid, fromPinName, toNode.nid, toPinName);
    }

    setDragging(false);
  };

  const handleRemoveConnector = connector => {
    if (onRemoveConnector) {
      onRemoveConnector(connector);
    }
  };

  const handleNodeSelect = nid => {
    if (onNodeSelect) {
      onNodeSelect(nid);
    }
  };

  const handleNodeDeselect = nid => {
    if (onNodeDeselect) {
      onNodeDeselect(nid);
    }
  };

  const computePinIdxfromLabel = (pins, pinLabel) => {
    let reval = 0;

    for (let pin of pins) {
      if (pin.name === pinLabel) {
        return reval;
      } else {
        reval++;
      }
    }
  };

  const getNodeById = (nodes, nid) => {
    let reval = 0;

    for (const node of nodes) {
      if (node.nid === nid) {
        return nodes[reval];
      } else {
        reval++;
      }
    }
  };

  let newConn = null;
  let i = 0;

  if (dragging) {
    let sourceNode = getNodeById(data.nodes, source[0]);
    let connectorStart = computeOutOffsetByIndex(sourceNode.x, sourceNode.y, source[1]);
    let connectorEnd = {
      x: mousePos.x,
      y: mousePos.y
    };
    newConn = /*#__PURE__*/React.createElement(Spline$1, {
      start: connectorStart,
      end: connectorEnd
    });
  }

  let splineIdx = 0;
  return /*#__PURE__*/React.createElement("div", {
    className: dragging ? 'dragging' : '',
    onMouseMove: onMouseMove,
    onMouseUp: onMouseUp
  }, data.nodes.map(node => {
    return /*#__PURE__*/React.createElement(DragNode$1, {
      index: i++,
      nid: node.nid,
      title: node.type,
      inputs: node.fields.in,
      outputs: node.fields.out,
      pos: {
        x: node.x,
        y: node.y
      },
      key: node.nid,
      onNodeStart: nid => handleNodeStart(nid),
      onNodeStop: (nid, pos) => handleNodeStop(nid, pos),
      onNodeMove: (idx, pos) => handleNodeMove(idx, pos),
      onStartConnector: (nid, outputIdx) => handleStartConnector(nid, outputIdx),
      onCompleteConnector: (nid, inputIdx) => handleCompleteConnector(nid, inputIdx),
      onNodeSelect: nid => handleNodeSelect(nid),
      onNodeDeselect: nid => handleNodeDeselect(nid)
    });
  }), /*#__PURE__*/React.createElement("svg", {
    style: {
      position: 'absolute',
      height: "100%",
      width: "100%",
      zIndex: 9000
    },
    ref: svgRef
  }, data.connections.map(connector => {
    let fromNode = getNodeById(data.nodes, connector.from_node);
    let toNode = getNodeById(data.nodes, connector.to_node);
    let splinestart = computeOutOffsetByIndex(fromNode.x, fromNode.y, computePinIdxfromLabel(fromNode.fields.out, connector.from));
    let splineend = computeInOffsetByIndex(toNode.x, toNode.y, computePinIdxfromLabel(toNode.fields.in, connector.to));
    return /*#__PURE__*/React.createElement(Spline$1, {
      start: splinestart,
      end: splineend,
      key: splineIdx++,
      mousePos: mousePos,
      onRemove: () => handleRemoveConnector(connector)
    });
  }), newConn));
};

export { ReactNodeGraphHook };
//# sourceMappingURL=index.modern.js.map
