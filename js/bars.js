var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
cX = c.width;
cY = c.height;

let black = "#fffff"
let red = "#FF0000"

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex].height;
        array[currentIndex].height = array[randomIndex].height;
        array[randomIndex].height = temporaryValue;
    }

    return array;
}

function selectionSort(inputArr) {
    let n = inputArr.length;

    for (let i = 0; i < n; i++) {
        // Finding the smallest number in the subarray
        let min = i;
        for (let j = i + 1; j < n; j++) {

            if (inputArr[j].height < inputArr[min].height) {
                min = j;
            }
        }

        if (min != i) {
            // Swapping the elements
            let tmp = inputArr[i].height;
            inputArr[i].height = inputArr[min].height;
            inputArr[min].height = tmp;
        }
        
    }
    return inputArr;
}

class Bar {
    constructor(ctx, x, y, width, height, color) {
        this.ctx = ctx;
        this.x = x;
        this.y = y + cY;
        this.width = width;
        this.height = height;
        this.color = color;
    }
    draw() {
        this.ctx.save();
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, this.width, -this.height);
        this.ctx.restore();
    }
}





var bars = []
var offset = 0
for (var i = 0; i < 40; i++) {
    bars.push(new Bar(ctx, offset + i * 10, 0, 10, 20 + i * 5, black))
    bars[i].draw()
    offset += 5
}


var array = shuffle(bars)
ctx.clearRect(0, 0, c.width, c.height)
for (var i = 0; i < array.length; i++) {
    array[i].draw()
}

var sorted = selectionSort(array)
ctx.clearRect(0, 0, c.width, c.height)
for (var i = 0; i < sorted.length; i++) {
    sorted[i].draw()
}