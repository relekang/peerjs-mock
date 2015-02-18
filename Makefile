all: lib/PeerMock.js test/PeerMock-test.js

lib/PeerMock.js: lib/PeerMock.bs
	bailey -c lib

test/PeerMock-test.js: test/PeerMock-test.bs
	bailey -c test

test: lib/PeerMock.js test/PeerMock-test.js
	touch test
	npm test
