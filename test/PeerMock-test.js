var __module_chai = require("chai");
var PeerMock = require("../lib/PeerMock");
var expect = __module_chai.expect;


describe('PeerMock', function() {
    var instance = null;

    var testEventCallback = function(done) {
        return function(id) {
            expect(id).to.equal(instance.id);
            done();
        };
    };

    beforeEach(function() {
        instance = new PeerMock('some-id');
    });

    describe('.on(event)', function() {
        it('should emit "disconnected" event on disconnect', function(done) {
            instance.on('disconnected', testEventCallback(done));
            instance.disconnect();
        });

        it('should emit "disconnected" event on destroyed', function(done) {
            instance.on('disconnected', testEventCallback(done));
            instance.destroy();
        });

        it('should emit "destroyed" event on destroyed', function(done) {
            instance.on('destroyed', testEventCallback(done));
            instance.destroy();
        });
    });

    describe('.connect()', function() {
        var local = null;
        var remote = null;

        beforeEach(function() {
            local = instance;
            remote = new PeerMock('id');
        });

        it('local should connect to the remote', function(done) {
            remote.on('connection', function() {
                return done();
            });
            local.connect('id');
        });

        it('should receive message that is sent', function(done) {
            remote.on('connection', function(conn) {
                conn.on('data', function(message) {
                    expect(message).to.equal('hi there!');
                    done();
                });
            });

            var connection = local.connect('id');
            connection.send('hi there!');
        });
    });
});


module.exports = {
    'PeerMock': PeerMock,
    'expect': expect
};