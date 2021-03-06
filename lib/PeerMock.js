"use strict";
var EventEmitter = require("eventemitter3");
var DataConnectionMock = require("./DataConnectionMock");

var mocks = {};

function PeerMock(id, options, config, debug) {
    /* istanbul ignore next */
    if ((typeof window !== "undefined" && this === window) || (typeof self !== "undefined" && this === self)) {
        throw new TypeError("Tried to call class PeerMock as a regular function. Classes can only be called with the 'new' keyword.");
    }
    EventEmitter.call(this);
    this.id = id;
    this.options = options;
    this.config = config;
    this.debug = debug;
    this.connections = {};
    this.disconnected = false;
    this.destroyed = false;
    this.open = false;

    mocks[this.id] = this;
}
PeerMock.prototype = Object.create(EventEmitter.prototype);
PeerMock.prototype.constructor = PeerMock;
PeerMock.prototype.connect = function connect(id, options) {
    var connection = new DataConnectionMock(id, this, options);
    connection._configureDataChannel(mocks);
    this._addConnection(id, connection);
    return connection;
};
PeerMock.prototype.disconnect = function disconnect() {
    this.disconnected = true;
    this.open = false;
    this.emit('disconnected', this.id);
    this._lastServerId = this.id;
    this.id = null;
};
PeerMock.prototype.destroy = function destroy() {
    this.destroyed = true;
    this.emit('destroyed', this.id);
    this.disconnect();
};
PeerMock.prototype._addConnection = function _addConnection(peer, connection) {
    if (!this.connections[peer]) {
        this.connections[peer] = [];
    }
    this.connections[peer].push(connection);
};
PeerMock.prototype._negotiate = function _negotiate(peer, remoteConnection) {
    var localConnection = new DataConnectionMock(peer, this, {});
    localConnection._setRemote(remoteConnection);
    this._addConnection(peer, localConnection);
    this.emit('connection', localConnection);
    return localConnection;
};


module.exports = PeerMock;