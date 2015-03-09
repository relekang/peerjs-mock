var EventEmitter = require("eventemitter3");
var _ = require("lodash");

function DataConnectionMock(peer, provider, options) {
    if ((typeof window !== "undefined" && this === window) || (typeof self !== "undefined" && this === self)) {
        throw new TypeError("Tried to call class DataConnectionMock as a regular function. Classes can only be called with the 'new' keyword.");
    }
    this.options = _.extend({
        'serialization': 'binary',
        'reliable': false
    }, options);
    this.peer = peer;
    this.provider = provider;
    this.id = this.options.connectId || DataConnectionMock._idPrefix + Date.now();
    this.label = this.options.label || this.id;
    this.reliable = this.options.reliable;
    this.serialization = this.options.serialization;
    this.delay = this.options.delay || 0;

    this._buffer = [];
    this._buffering = false;
    this.bufferSize = 0;
}
DataConnectionMock.prototype = Object.create(EventEmitter.prototype);
DataConnectionMock.prototype.open = false;
DataConnectionMock.prototype.type = 'data';
DataConnectionMock.prototype.peer = undefined;
DataConnectionMock.prototype.provider = undefined;
DataConnectionMock.prototype._setRemote = function(connection) {
    this._connection = connection;
    this._connection.on('open', function() {
        if (!this.open) {
            this.open = true;
            this.emit('open');
        }
    });
};
DataConnectionMock.prototype._configureDataChannel = function(mocks) {
    if (!this._connection && this.peer in mocks) {
        this._setRemote(mocks[this.peer]._negotiate(this.provider.id, this));
        this.open = true;
        this.emit('open');
    } else {
        throw new Error('Peer(' + this.peer.id + ') not found');
    }
};
DataConnectionMock.prototype.send = function(message, chunked) {
    if (!this.open) {
        this.emit('error', new Error('Connection is not open. You should listen for the `open` event before sending messages.'));
    }
    var connection = this._connection;
    setTimeout(function() {
        connection.receive(message);
    }, this.delay);
};
DataConnectionMock.prototype.receive = function(message) {
    this.emit('data', message);
};
DataConnectionMock.prototype.close = function() {
    if (!this.open) {
        return;;
    }
    this.open = false;
    this.emit('close');
};

DataConnectionMock._idPrefix = 'dc_';


module.exports = DataConnectionMock;