all: lib/PeerMock.js test/PeerMock-test.js 

lib/PeerMock.js: lib/PeerMock.bs lib/DataConnectionMock.bs
	bailey -c lib

test/PeerMock-test.js: test/PeerMock-test.bs test/DataConnectionMock-test.bs
	bailey -c test

test: lib/PeerMock.js test/PeerMock-test.js
	npm test

.PHONY: test
