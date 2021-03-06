'use strict';

const assert = require('assert');
const Denque = require('../');

describe('Denque.prototype.constructor', function () {
  it("should take no argument", function () {
    const a = new Denque();
    assert(a._capacityMask === 3);
    assert(a._list.length === 4);
    assert(a.size() === 0);
    assert(a.length === 0);
  });

  it("should take array argument", function () {
    const a = new Denque([1, 2, 3, 4]);
    const b = new Denque([]);

    assert(a.length >= 4);
    assert.deepEqual(a.toArray(), [1, 2, 3, 4]);
    assert(b.length === 0);
    assert.deepEqual(b.toArray(), []);
  });

  it("should handle a high volume with no out of memory exception", function () {
    this.timeout(20000);
    const denque = new Denque();
    let l = 250000;

    while (--l) {
      denque.push(l);
      denque.unshift(l);
    }

    l = 125000;
    while (--l) {
      const a = denque.shift();
      denque.pop();
      denque.shift();
      denque.push(a);
      denque.shift();
      denque.shift();
    }

    // console.log(denque._list.length);
    // console.log(denque.length);
    // console.log(denque._head);
    // console.log(denque._tail);

    denque.clear();
    l = 100000;

    while (--l) {
      denque.push(l);
    }

    l = 100000;
    while (--l) {
      denque.shift();
      denque.shift();
      denque.shift();
      if (l=== 25000) denque.clear();
      denque.pop();
      denque.pop();
      denque.pop();
    }

    // console.log(denque._list.length);
    // console.log(denque.length);
    // console.log(denque._head);
    // console.log(denque._tail);

  });
});

describe('Denque.prototype.toArray', function () {
  it("should return an array", function () {
    const a = new Denque([1, 2, 3, 4]);
    assert.deepEqual(a.toArray(), [1, 2, 3, 4]);
  });
});

describe('Denque.prototype.push', function () {
  it("Should do nothing if no arguments", function () {
    const a = new Denque();
    const before = a.length;
    const ret = a.push();
    assert(ret === before);
    assert(a.length === ret);
    assert(ret === 0);
  });

  it("Should add single argument - plenty of capacity", function () {
    const a = new Denque([1, 2, 3, 4, 5]);
    assert(a._list.length - a.length > 1);
    const before = a.length;
    const ret = a.push(1);
    assert(ret === before + 1);
    assert(a.length === ret);
    assert(ret === 6);
    assert.deepEqual(a.toArray(), [1, 2, 3, 4, 5, 1]);
  });

  it("Should add single argument - exact capacity", function () {
    const a = new Denque([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
    assert(a._list.length - a.length === 1);
    const before = a.length;
    const ret = a.push(1);
    assert(ret === before + 1);
    assert(a.length === ret);
    assert(ret === 16);
    assert.deepEqual(a.toArray(), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 1]);
  });

  it("Should add single argument - over capacity", function () {
    const a = new Denque([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
    assert(a._list.length / a.length === 2);
    const before = a.length;
    const ret = a.push(1);
    assert(ret === before + 1);
    assert(a.length === ret);
    assert(ret === 17);
    assert.deepEqual(a.toArray(), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 1]);
  });

});

describe('Denque.prototype.unshift', function () {

  it("Should do nothing if no arguments", function () {
    const a = new Denque();
    const before = a.length;
    const ret = a.unshift();
    assert(ret === before);
    assert(a.length === ret);
    assert(ret === 0);
  });

  it("Should add single argument - plenty of capacity", function () {
    const a = new Denque([1, 2, 3, 4, 5]);
    assert(a._list.length - a.length > 1);
    const before = a.length;
    const ret = a.unshift(1);
    assert(ret === before + 1);
    assert(a.length === ret);
    assert(ret === 6);
    assert.deepEqual(a.toArray(), [1, 1, 2, 3, 4, 5]);
  });

  it("Should add single argument - exact capacity", function () {
    const a = new Denque([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
    assert(a._list.length - a.length === 1);
    const before = a.length;
    const ret = a.unshift(1);
    assert(ret === before + 1);
    assert(a.length === ret);
    assert(ret === 16);
    assert.deepEqual(a.toArray(), [1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
  });

  it("Should add single argument - over capacity", function () {
    const a = new Denque([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
    assert(a._list.length / a.length === 2);
    const before = a.length;
    const ret = a.unshift(1);
    assert(ret === before + 1);
    assert(a.length === ret);
    assert(ret === 17);
    assert.deepEqual(a.toArray(), [1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
  });

});

describe('Denque.prototype.pop', function () {
  it("Should return undefined when empty denque", function () {
    const a = new Denque();
    assert(a.length === 0);
    assert(a.pop() === void 0);
    assert(a.pop() === void 0);
    assert(a.length === 0);
  });

  it("Should return the item at the back of the denque", function () {
    const a = new Denque([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const b = [];

    b.push(1, 2, 3, 4, 5, 6, 7, 8, 9);

    assert(a.pop() === 9);
    assert(a.pop() === 8);
    b.pop();
    b.pop();
    assert.deepEqual(a.toArray(), b);
    a.unshift(5);
    a.unshift(4);
    a.unshift(3);
    a.unshift(2);
    a.unshift(1);
    a.push(1);
    a.push(2);
    a.push(3);
    a.push(4);
    a.push(5);
    a.unshift(3);
    a.unshift(2);
    a.unshift(1);
    a.pop();
    b.unshift(1, 2, 3, 4, 5);
    b.push(1, 2, 3, 4, 5);
    b.unshift(1, 2, 3);
    b.pop();
    assert.deepEqual(a.toArray(), b);
    assert(a.pop() === b.pop());
    assert.deepEqual(a.toArray(), b);
  });
});

describe('Deque.prototype.shift', function () {
  it("Should return undefined when empty denque", function () {
    const a = new Denque();
    assert(a.length === 0);
    assert(a.shift() === void 0);
    assert(a.shift() === void 0);
    assert(a.length === 0);
  });

  it("Should return the item at the front of the denque", function () {
    const a = new Denque([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const b = [];

    b.push(1, 2, 3, 4, 5, 6, 7, 8, 9);

    assert(a.shift() === 1);
    assert(a.shift() === 2);
    b.shift();
    b.shift();
    assert.deepEqual(a.toArray(), b);
    a.unshift(5);
    a.unshift(4);
    a.unshift(3);
    a.unshift(2);
    a.unshift(1);
    a.push(1);
    a.push(2);
    a.push(3);
    a.push(4);
    a.push(5);
    a.unshift(3);
    a.unshift(2);
    a.unshift(1);
    a.shift();
    b.unshift(1, 2, 3, 4, 5);
    b.push(1, 2, 3, 4, 5);
    b.unshift(1, 2, 3);
    b.shift();
    assert.deepEqual(a.toArray(), b);
    assert(a.shift() === b.shift());
    assert.deepEqual(a.toArray(), b);
  });
});

describe('Denque.prototype.get', function () {
  it("should return undefined on nonsensical argument", function () {
    const a = new Denque([1, 2, 3, 4]);
    assert(a.get(-5) === void 0);
    assert(a.get(-100) === void 0);
    assert(a.get(void 0) === void 0);
    assert(a.get("1") === void 0);
    assert(a.get(NaN) === void 0);
    assert(a.get(Infinity) === void 0);
    assert(a.get(-Infinity) === void 0);
    assert(a.get(1.5) === void 0);
    assert(a.get(4) === void 0);
  });

  it("should support positive indexing", function () {
    const a = new Denque([1, 2, 3, 4]);
    assert(a.get(0) === 1);
    assert(a.get(1) === 2);
    assert(a.get(2) === 3);
    assert(a.get(3) === 4);
  });

  it("should support negative indexing", function () {
    const a = new Denque([1, 2, 3, 4]);
    assert(a.get(-1) === 4);
    assert(a.get(-2) === 3);
    assert(a.get(-3) === 2);
    assert(a.get(-4) === 1);
  });
});

describe('Denque.prototype.isEmpty', function () {
  it("should return true on empty denque", function () {
    const a = new Denque();
    assert(a.isEmpty());
  });

  it("should return false on denque with items", function () {
    const a = new Denque([1]);
    assert(!a.isEmpty());
  });
});

describe('Denque.prototype.peekFront', function () {
  it("Should return undefined when queue is empty", function() {
    const a = new Denque();
    assert(a.length === 0);
    assert(a.peekFront() === void 0);
    assert(a.peekFront() === void 0);
    assert(a.length === 0);
  });

  it("should return the item at the front of the denque", function () {
    const a = new Denque([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    assert(a.peekFront() === 1);

    let l = 5;
    while (l--) a.pop();

    assert.deepEqual(a.toArray(), [1, 2, 3, 4]);

    assert(a.peekFront() === 1);
  });
});

describe('Denque.prototype.peekBack', function () {
  it("Should return undefined when queue is empty", function() {
    const a = new Denque();
    assert(a.length === 0);
    assert(a.peekBack() === void 0);
    assert(a.peekBack() === void 0);
    assert(a.length === 0);
  });

  it("should return the item at the back of the denque", function () {
    const a = new Denque([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    assert(a.peekBack() === 9);

    let l = 5;
    while (l--) a.pop();

    assert.deepEqual(a.toArray(), [1, 2, 3, 4]);

    assert(a.peekBack() === 4);
  });
});


describe('Denque.prototype.clear', function () {
  it("should clear the denque", function () {
    const a = new Denque([1, 2, 3, 4]);
    assert(!a.isEmpty());
    a.clear();
    assert(a.isEmpty());
  });
});


