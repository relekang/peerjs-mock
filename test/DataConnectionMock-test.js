var __module_chai = require("chai");
var PeerMock = require("../lib/PeerMock");
var DataConnectionMock = require("../lib/DataConnectionMock");
var expect = __module_chai.expect;


describe('DataConnectionMock', function() {
    var remote = null;
    var local = null;

    beforeEach(function() {
        var localPeer = new PeerMock('local');
        var remotePeer = new PeerMock('remote');
        local = new DataConnectionMock('remote', localPeer);
        remote = new DataConnectionMock('local', remotePeer);
        local._connection = remote;
        remote._connection = local;
    });

    it('should emit close on close', function(done) {
        local.open = true;
        local.on('close', function() {
            return done();
        });
        local.close();
    });

    it('should receive what is sent', function(done) {
        remote.on('data', function(message) {
            expect(message).to.equal('hi there!');
            done();
        });
        local.send('hi there!');
    });
});


module.exports = {
    'PeerMock': PeerMock,
    'DataConnectionMock': DataConnectionMock,
    'expect': expect
};