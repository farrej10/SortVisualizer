var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
cX = c.width;
cY = c.height;

const black = "#fffff"
const red = "#FF0000"
const green = "#00FF00"

function wait(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(ms)
        }, ms)
    })
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



class Graph {
    constructor(ctx, numberofNodes, delta) {
        this.bars = []
        this.animation = []
        let offset = 5
        this.delta = delta
        for (var i = 0; i < numberofNodes; i++) {
            this.bars.push(new Bar(ctx, offset + i * 10, 0, 10, 20 + i * 5, black))
            offset += 5
        }
    }
    draw() {

        ctx.clearRect(0, 0, c.width, c.height)
        for (var i = 0; i < this.bars.length; i++) {
            this.bars[i].draw()
        }
    }
    shuffle() {
        var currentIndex = this.bars.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = this.bars[currentIndex].height;
            this.bars[currentIndex].height = this.bars[randomIndex].height;
            this.bars[randomIndex].height = temporaryValue;
            this.bars[currentIndex].color = black
        }

    }
    isSorted() {
        for (var i = 0; i < this.bars.length - 1; i++) {
            if (this.bars[i].height > this.bars[i + 1].height) {
                return false;
            }
        }
        return true
    }
    async selectionSort() {
        let n = this.bars.length;

        for (let i = 0; i < n; i++) {
            // Finding the smallest number in the subarray
            let min = i;
            for (let j = i + 1; j < n; j++) {

                if (this.bars[j].height < this.bars[min].height) {
                    min = j;
                }
                if (this.bars[j].color != green) {
                    this.bars[j].color = red
                    this.bars[min].color = red
                }


                this.draw()
                await wait(this.delta)
                if (this.bars[j].color != green) {
                    this.bars[j].color = black
                    this.bars[min].color = black
                }


            }

            if (min != i) {
                // Swapping the elements
                let tmp = this.bars[i].height;
                this.bars[i].height = this.bars[min].height;
                this.bars[min].height = tmp;

                this.bars[i].color = green
                this.draw()

            }
            else if (min == i) {
                this.bars[i].color = green
                this.draw()
            }

        }
        this.draw();
    }
    async bubbleSort() {
        let n = this.bars.length;
        let swapped = false;

        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - i - 1; j++) {


                this.bars[j].color = red
                this.bars[j + 1].color = red



                this.draw()
                await wait(this.delta)

                this.bars[j].color = black
                this.bars[j + 1].color = black

                if (this.bars[j].height > this.bars[j + 1].height) {
                    let tmp = this.bars[j].height;
                    this.bars[j].height = this.bars[j + 1].height;
                    this.bars[j + 1].height = tmp;
                    swapped = true
                }
            }

            this.bars[n - i - 1].color = green
            if (!swapped) {
                break;
            }
        }
        this.bars[0].color = green
        this.draw();
    }
    async mergeSort() {
        this.bars = await this.mergesplit(this.bars)
    }
    async mergesplit(array) {
        if (array.length < 2) return array
        const middle = Math.floor(array.length / 2)
        const leftArr = array.slice(0, middle)
        const rightArr = array.slice(middle, array.length)
        const sorted_l = await this.mergesplit(leftArr)
        const sorted_r = await this.mergesplit(rightArr)
        return await this.merge(sorted_l, sorted_r)

    }
    async merge(leftArr, rightArr) {

        const c = []
        while (leftArr.length && rightArr.length) {

            if (leftArr[0].height > rightArr[0].height) {


                let tmp = rightArr.shift()


                tmp.x = c.length * 15 + 5
                this.animation.push(tmp)
                //await wait(this.delta)


                c.push(tmp)
            }
            else {
                let tmp = leftArr.shift()

                tmp.x = c.length * 15 + 5
                this.animation.push(tmp)



                //await wait(this.delta)

                c.push(tmp)
            }

        }


        //if we still have values, let's add them at the end of `c`
        while (leftArr.length) {

            let tmp = leftArr.shift()

            tmp.x = c.length * 15 + 5
            this.animation.push(tmp)

            //await wait(this.delta)

            c.push(tmp)
        }
        while (rightArr.length) {

            let tmp = rightArr.shift()

            tmp.x = c.length * 15 + 5
            this.animation.push(tmp)

            //await wait(this.delta)

            c.push(tmp)
        }
        return c
    }
}



let slider = document.getElementById("myRange");
graph = new Graph(ctx, 54, 99 - slider.value)
graph.shuffle()
graph.draw()

document.getElementById("shuffle").onclick = function () {
    slider = document.getElementById("myRange");
    graph = new Graph(ctx, 54, 99 - slider.value)
    graph.shuffle()
    graph.draw()
};

slider.oninput = function () {
    graph.delta = 99 - slider.value
}

document.getElementById("sort").onclick = async function () {

    let e = document.getElementById("algo");
    slider = document.getElementById("myRange");
    graph.delta = 99 - slider.value
    if (!graph.isSorted()) {

        if (e.value == "Bubble")
            await graph.bubbleSort();

        if (e.value == "Selection")
            await graph.selectionSort();

        if (e.value == "Merge")
            await graph.mergeSort();


        //ctx.clearRect(0, 0, c.width, c.height)

        for (var i = 0; i < 54; i++) {
            await wait(graph.delta)
            graph.animation[i].draw()
            console.log(graph.animation[i])
            graph.animation.shift()
        }

    }
    //graph.draw();

};