function isInt(n) {
    return n % 1 === 0;
}

function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 1024;

    function charCodeFromCharacter(c) {
        return c.charCodeAt(0);
    }

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);
        var byteNumbers = Array.prototype.map.call(slice, charCodeFromCharacter);
        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, {type: contentType});
}

function DoubleLinkedList() {
    this.length = 0;
    this.first = null;
    this.last = null;
}

DoubleLinkedList.prototype = {
    add: function (value, x, y) {
        var node = {value: value, x: x, y: y, next: null, prev: null};
        if (!this.length) {
            this.first = node;
            this.last = node;
        }
        else {
            var cur = this.first;
            while (cur && (cur.y < node.y || ( cur.y == node.y && cur.x < node.x))) cur = cur.next;
            if (cur) {
                if (cur.prev) {
                    node.prev = cur.prev;
                    node.next = cur;
                    cur.prev.next = node;
                    cur.prev = node;
                } else {
                    node.next = cur;
                    cur.prev = node;
                    this.first = node;
                }
            } else {
                cur = this.last;
                cur.next = node;
                node.prev = cur;
                this.last = node;
            }
        }
        this.length++;
    },
    toArray: function () {
        var cur = this.first, arr = [];
        while (cur) {
            arr.push(cur.value)
            cur = cur.next;
        }
        return arr;
    }
};