function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var onClickOutside = _interopDefault(require('react-onclickoutside'));
var Draggable = _interopDefault(require('react-draggable'));

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _createForOfIteratorHelperLoose(o) {
  var i = 0;

  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
    if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) return function () {
      if (i >= o.length) return {
        done: true
      };
      return {
        done: false,
        value: o[i++]
      };
    };
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  i = o[Symbol.iterator]();
  return i.next.bind(i);
}

function computeInOffsetByIndex(x, y, index) {
  var outx = x + 15;
  var outy = y + 47 + index * 20;
  return {
    x: outx,
    y: outy
  };
}
function computeOutOffsetByIndex(x, y, index) {
  var outx = x + 166;
  var outy = y + 49 + index * 22;
  return {
    x: outx,
    y: outy
  };
}

var TrashIcon = function TrashIcon(_ref) {
  var onClick = _ref.onClick,
      position = _ref.position;

  var handleClick = function handleClick(e) {
    if (onClick) {
      onClick(e);
    }
  };

  return /*#__PURE__*/React__default.createElement("g", {
    className: "trash-icon",
    fill: "none",
    stroke: "none",
    strokeWidth: "1",
    transform: "translate(" + (position.x - 6) + "," + (position.y + 15) + ")",
    onClick: handleClick
  }, /*#__PURE__*/React__default.createElement("circle", {
    className: "trash-icon-bg",
    cx: 7,
    cy: 7,
    r: "14",
    fill: "#337AB7"
  }), /*#__PURE__*/React__default.createElement("g", {
    className: "trash-icon-trashcan",
    fill: "#FFFFFF",
    transform: "translate(-336.00000, -192.000000)"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M347.999959,195 L350,195 L350,196 L349,196 L349,207.001498 C349,207.552511 348.554265,208 348.004423,208 L338.995577,208 C338.444837,208 338,207.552955 338,207.001498 L338,196 L337,196 L337,195 L338.995577,195 L339.000042,195 L339,194.990631 L339,193.009369 C339,192.443353 339.446616,192 339.997545,192 L347.002455,192 C347.553689,192 348,192.45191 348,193.009369 L348,194.990631 Z M340,194 L340,195 L347,195 L347,194 C347,193.447715 346.552285,193 346,193 L341,193 C340.447715,193 340,193.447715 340,194 Z M339,196 L339,207 L348,207 L348,196 Z M341,197 L342,197 L342,206 L341,206 Z M343,197 L344,197 L344,206 L343,206 Z M345,197 L345,206 L346,206 L346,197 L345,197 Z M345,197",
    id: "Rectangle 159"
  })));
};

var Spline = function Spline(_ref) {
  var mousePos = _ref.mousePos,
      onClick = _ref.onClick,
      onClickOutside = _ref.onClickOutside,
      onRemove = _ref.onRemove,
      end = _ref.end,
      start = _ref.start;

  var _useState = React.useState(false),
      selected = _useState[0],
      setSelected = _useState[1];

  var _useState2 = React.useState({
    x: 0,
    y: 0
  }),
      position = _useState2[0],
      setPosition = _useState2[1];

  var bezierCurve = function bezierCurve(a, b, cp1x, cp1y, cp2x, cp2y, x, y) {
    return "M " + a + " " + b + " C " + cp1x + " " + cp1y + " " + cp2x + " " + cp2y + " " + x + " " + y;
  };

  var distance = function distance(a, b) {
    return Math.sqrt((b[0] - a[0]) * (b[0] - a[0]) + (b[1] - a[1]) * (b[1] - a[1]));
  };

  var handleClick = function handleClick(e) {
    setSelected(function (old) {
      return !old;
    });
    setPosition(function (old) {
      return _extends(_extends({}, old), mousePos);
    });

    if (onClick) {
      onClick(e);
    }
  };

  Spline.handleClickOutside = function (e) {
    setSelected(false);

    if (onClickOutside) {
      onClickOutside(e);
    }
  };

  var handleRemove = function handleRemove(e) {
    setSelected(false);

    if (onRemove) {
      onRemove(e);
    }
  };

  var dist = distance([start.x, start.y], [end.x, end.y]);
  var pathString = bezierCurve(start.x, start.y, start.x + dist * 0.25, start.y, end.x - dist * 0.75, end.y, end.x, end.y);
  var className = "connector " + (selected ? ' selected' : '');
  return /*#__PURE__*/React__default.createElement("g", null, /*#__PURE__*/React__default.createElement("circle", {
    cx: start.x,
    cy: start.y,
    r: "3",
    fill: "#337ab7"
  }), /*#__PURE__*/React__default.createElement("circle", {
    cx: end.x,
    cy: end.y,
    r: "3",
    fill: "#9191A8"
  }), /*#__PURE__*/React__default.createElement("path", {
    className: "connector-click-area",
    d: pathString,
    onClick: handleClick
  }), /*#__PURE__*/React__default.createElement("path", {
    className: className,
    d: pathString,
    onClick: handleClick
  }), selected ? /*#__PURE__*/React__default.createElement(TrashIcon, {
    position: position,
    onClick: handleRemove
  }) : null);
};

var handleClickConfig = {
  handleClickOutside: function handleClickOutside() {
    return Spline.handleClickOutside;
  }
};
var Spline$1 = onClickOutside(Spline, handleClickConfig);

var NodeInputListItem = function NodeInputListItem(_ref) {
  var onMouseUp = _ref.onMouseUp,
      index = _ref.index,
      item = _ref.item;

  var _useState = React.useState(false),
      hover = _useState[0],
      setHover = _useState[1];

  var handleOnMouseUp = function handleOnMouseUp(e) {
    e.stopPropagation();
    e.preventDefault();
    onMouseUp(index);
  };

  var onMouseOver = function onMouseOver() {
    setHover(true);
  };

  var onMouseOut = function onMouseOut() {
    setHover(false);
  };

  var noop = function noop(e) {
    e.stopPropagation();
    e.preventDefault();
  };

  return /*#__PURE__*/React__default.createElement("li", null, /*#__PURE__*/React__default.createElement("a", {
    onClick: noop,
    onMouseUp: handleOnMouseUp,
    href: "#"
  }, /*#__PURE__*/React__default.createElement("i", {
    className: hover ? 'fa fa-circle-o hover' : 'fa fa-circle-o',
    onMouseOver: onMouseOver,
    onMouseOut: onMouseOut
  }), item.name));
};

var NodeInputList = function NodeInputList(_ref) {
  var items = _ref.items,
      onCompleteConnector = _ref.onCompleteConnector;

  var _onMouseUp = function onMouseUp(i) {
    onCompleteConnector(i);
  };

  var i = 0;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "nodeInputWrapper"
  }, /*#__PURE__*/React__default.createElement("ul", {
    className: "nodeInputList"
  }, items.map(function (item) {
    return /*#__PURE__*/React__default.createElement(NodeInputListItem, {
      onMouseUp: function onMouseUp(i) {
        return _onMouseUp(i);
      },
      key: i,
      index: i++,
      item: item
    });
  })));
};

var NodeOutputListItem = function NodeOutputListItem(_ref) {
  var onMouseDown = _ref.onMouseDown,
      index = _ref.index,
      item = _ref.item;

  var handleOnMouseDown = function handleOnMouseDown(e) {
    e.stopPropagation();
    e.preventDefault();
    onMouseDown(index);
  };

  var noop = function noop(e) {
    e.stopPropagation();
    e.preventDefault();
  };

  return /*#__PURE__*/React__default.createElement("li", {
    onMouseDown: handleOnMouseDown
  }, /*#__PURE__*/React__default.createElement("a", {
    href: "#",
    onClick: noop
  }, item.name, /*#__PURE__*/React__default.createElement("i", {
    className: "fa fa-circle-o"
  })));
};

var NodeOutputList = function NodeOutputList(_ref) {
  var onStartConnector = _ref.onStartConnector,
      items = _ref.items;

  var _onMouseDown = function onMouseDown(i) {
    onStartConnector(i);
  };

  var i = 0;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "nodeOutputWrapper"
  }, /*#__PURE__*/React__default.createElement("ul", {
    className: "nodeOutputList"
  }, items.map(function (item) {
    return /*#__PURE__*/React__default.createElement(NodeOutputListItem, {
      onMouseDown: function onMouseDown(i) {
        return _onMouseDown(i);
      },
      key: i,
      index: i++,
      item: item
    });
  })));
};

var DragNode = function DragNode(_ref) {
  var onNodeDeselect = _ref.onNodeDeselect,
      onNodeSelect = _ref.onNodeSelect,
      onNodeStart = _ref.onNodeStart,
      onNodeStop = _ref.onNodeStop,
      onNodeMove = _ref.onNodeMove,
      onStartConnector = _ref.onStartConnector,
      onCompleteConnector = _ref.onCompleteConnector,
      index = _ref.index,
      inputs = _ref.inputs,
      outputs = _ref.outputs,
      nid = _ref.nid,
      pos = _ref.pos,
      title = _ref.title;

  var _useState = React.useState(false),
      selected = _useState[0],
      setSelected = _useState[1];

  var handleDragStart = function handleDragStart(eve, ui) {
    onNodeStart(nid, ui);
  };

  var handleDragStop = function handleDragStop(eve, ui) {
    onNodeStop(nid, {
      x: ui.x,
      y: ui.y
    });
  };

  var handleDrag = function handleDrag(eve, ui) {
    onNodeMove(index, {
      x: ui.x,
      y: ui.y
    });
  };

  var handleOnStartConnector = function handleOnStartConnector(idx) {
    onStartConnector(nid, idx);
  };

  var handleOnCompleteConnector = function handleOnCompleteConnector(idx) {
    onCompleteConnector(nid, idx);
  };

  var handleClick = function handleClick(e) {
    setSelected(true);

    if (onNodeSelect) {
      onNodeSelect(nid);
    }
  };

  DragNode.handleClickOutside = function () {
    if (onNodeDeselect && selected) {
      onNodeDeselect(nid);
    }

    setSelected(false);
  };

  var nodeClass = "node " + (selected ? ' selected' : '');
  return /*#__PURE__*/React__default.createElement("div", {
    onDoubleClick: function onDoubleClick(e) {
      return handleClick();
    }
  }, /*#__PURE__*/React__default.createElement(Draggable, {
    position: {
      x: pos.x,
      y: pos.y
    },
    handle: ".node-header",
    onStart: function onStart(eve, ui) {
      return handleDragStart(eve, ui);
    },
    onStop: function onStop(eve, ui) {
      return handleDragStop(eve, ui);
    },
    onDrag: function onDrag(eve, ui) {
      return handleDrag(eve, ui);
    }
  }, /*#__PURE__*/React__default.createElement("section", {
    className: nodeClass,
    style: {
      zIndex: 10000
    }
  }, /*#__PURE__*/React__default.createElement("header", {
    className: "node-header"
  }, /*#__PURE__*/React__default.createElement("span", {
    className: "node-title"
  }, title)), /*#__PURE__*/React__default.createElement("div", {
    className: "node-content"
  }, /*#__PURE__*/React__default.createElement(NodeInputList, {
    items: inputs,
    onCompleteConnector: function onCompleteConnector(idx) {
      return handleOnCompleteConnector(idx);
    }
  }), /*#__PURE__*/React__default.createElement(NodeOutputList, {
    items: outputs,
    onStartConnector: function onStartConnector(idx) {
      return handleOnStartConnector(idx);
    }
  })))));
};

var handleClickConfig$1 = {
  handleClickOutside: function handleClickOutside() {
    return DragNode.handleClickOutside;
  }
};
var DragNode$1 = onClickOutside(DragNode, handleClickConfig$1);

var ReactNodeGraphHook = function ReactNodeGraphHook(_ref) {
  var data = _ref.data,
      setData = _ref.setData,
      onNodeDeselect = _ref.onNodeDeselect,
      onNodeMove = _ref.onNodeMove,
      onNodeStartMove = _ref.onNodeStartMove,
      onNodeSelect = _ref.onNodeSelect,
      onNewConnector = _ref.onNewConnector,
      onRemoveConnector = _ref.onRemoveConnector;

  var _useState = React.useState([]),
      source = _useState[0],
      setSource = _useState[1];

  var _useState2 = React.useState(false),
      dragging = _useState2[0],
      setDragging = _useState2[1];

  var _useState3 = React.useState({
    x: 0,
    y: 0
  }),
      mousePos = _useState3[0],
      setMousePos = _useState3[1];

  var svgRef = React.useRef();

  var onMouseMove = function onMouseMove(e) {
    var _ref2 = [e.clientX, e.clientY],
        pX = _ref2[0],
        pY = _ref2[1];
    e.stopPropagation();
    e.preventDefault();
    var svgRect = svgRef.current.getBoundingClientRect();
    setMousePos(function (old) {
      return _extends(_extends({}, old), {
        x: pX - svgRect.left,
        y: pY - svgRect.top
      });
    });
  };

  var onMouseUp = function onMouseUp(e) {
    setDragging(false);
  };

  var handleNodeStart = function handleNodeStart(nid) {
    onNodeStartMove(nid);
  };

  var handleNodeStop = function handleNodeStop(nid, pos) {
    onNodeMove(nid, pos);
  };

  var handleNodeMove = function handleNodeMove(idx, pos) {
    var dataT = data;
    dataT.nodes[idx].x = pos.x;
    dataT.nodes[idx].y = pos.y;
    setData(function (old) {
      return _extends(_extends({}, old), dataT);
    });
  };

  var handleStartConnector = function handleStartConnector(nid, outputIdx) {
    var newSrc = [nid, outputIdx];
    setDragging(true);
    setSource(newSrc);
  };

  var handleCompleteConnector = function handleCompleteConnector(nid, inputIdx) {
    if (dragging) {
      var fromNode = getNodeById(data.nodes, source[0]);
      var fromPinName = fromNode.fields.out[source[1]].name;
      var toNode = getNodeById(data.nodes, nid);
      var toPinName = toNode.fields["in"][inputIdx].name;
      onNewConnector(fromNode.nid, fromPinName, toNode.nid, toPinName);
    }

    setDragging(false);
  };

  var handleRemoveConnector = function handleRemoveConnector(connector) {
    if (onRemoveConnector) {
      onRemoveConnector(connector);
    }
  };

  var handleNodeSelect = function handleNodeSelect(nid) {
    if (onNodeSelect) {
      onNodeSelect(nid);
    }
  };

  var handleNodeDeselect = function handleNodeDeselect(nid) {
    if (onNodeDeselect) {
      onNodeDeselect(nid);
    }
  };

  var computePinIdxfromLabel = function computePinIdxfromLabel(pins, pinLabel) {
    var reval = 0;

    for (var _iterator = _createForOfIteratorHelperLoose(pins), _step; !(_step = _iterator()).done;) {
      var pin = _step.value;

      if (pin.name === pinLabel) {
        return reval;
      } else {
        reval++;
      }
    }
  };

  var getNodeById = function getNodeById(nodes, nid) {
    var reval = 0;

    for (var _iterator2 = _createForOfIteratorHelperLoose(nodes), _step2; !(_step2 = _iterator2()).done;) {
      var node = _step2.value;

      if (node.nid === nid) {
        return nodes[reval];
      } else {
        reval++;
      }
    }
  };

  var newConn = null;
  var i = 0;

  if (dragging) {
    var sourceNode = getNodeById(data.nodes, source[0]);
    var connectorStart = computeOutOffsetByIndex(sourceNode.x, sourceNode.y, source[1]);
    var connectorEnd = {
      x: mousePos.x,
      y: mousePos.y
    };
    newConn = /*#__PURE__*/React__default.createElement(Spline$1, {
      start: connectorStart,
      end: connectorEnd
    });
  }

  var splineIdx = 0;
  return /*#__PURE__*/React__default.createElement("div", {
    className: dragging ? 'dragging' : '',
    onMouseMove: onMouseMove,
    onMouseUp: onMouseUp
  }, data.nodes.map(function (node) {
    return /*#__PURE__*/React__default.createElement(DragNode$1, {
      index: i++,
      nid: node.nid,
      title: node.type,
      inputs: node.fields["in"],
      outputs: node.fields.out,
      pos: {
        x: node.x,
        y: node.y
      },
      key: node.nid,
      onNodeStart: function onNodeStart(nid) {
        return handleNodeStart(nid);
      },
      onNodeStop: function onNodeStop(nid, pos) {
        return handleNodeStop(nid, pos);
      },
      onNodeMove: function onNodeMove(idx, pos) {
        return handleNodeMove(idx, pos);
      },
      onStartConnector: function onStartConnector(nid, outputIdx) {
        return handleStartConnector(nid, outputIdx);
      },
      onCompleteConnector: function onCompleteConnector(nid, inputIdx) {
        return handleCompleteConnector(nid, inputIdx);
      },
      onNodeSelect: function onNodeSelect(nid) {
        return handleNodeSelect(nid);
      },
      onNodeDeselect: function onNodeDeselect(nid) {
        return handleNodeDeselect(nid);
      }
    });
  }), /*#__PURE__*/React__default.createElement("svg", {
    style: {
      position: 'absolute',
      height: "100%",
      width: "100%",
      zIndex: 9000
    },
    ref: svgRef
  }, data.connections.map(function (connector) {
    var fromNode = getNodeById(data.nodes, connector.from_node);
    var toNode = getNodeById(data.nodes, connector.to_node);
    var splinestart = computeOutOffsetByIndex(fromNode.x, fromNode.y, computePinIdxfromLabel(fromNode.fields.out, connector.from));
    var splineend = computeInOffsetByIndex(toNode.x, toNode.y, computePinIdxfromLabel(toNode.fields["in"], connector.to));
    return /*#__PURE__*/React__default.createElement(Spline$1, {
      start: splinestart,
      end: splineend,
      key: splineIdx++,
      mousePos: mousePos,
      onRemove: function onRemove() {
        return handleRemoveConnector(connector);
      }
    });
  }), newConn));
};

exports.ReactNodeGraphHook = ReactNodeGraphHook;
//# sourceMappingURL=index.js.map
