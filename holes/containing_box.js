const containing_box = function (p) {
    p.setup = function () {
        const canvas = p.createCanvas(400,400);
        canvas.parent("containing_box");

        this.poly = create_polygon(document.getElementById("polygon").value);
        this.box = [new Vertex(0,0),
            new Vertex(canvas.width,0),
            new Vertex(canvas.width, canvas.height),
            new Vertex(0, canvas.height)];
        this.box = new Polygon(this.box);
        this.sliced_donut = new Sliced_donut(this.box, this.poly);

        p.noLoop();
    }

    p.draw = function () {
        p.background(220);
        p.stroke(p.color("black"));

        p.strokeWeight(6);
        for (let v of this.poly.vertex) {
            p.point(v.x, v.y);
        }

        p.strokeWeight(4);
        for (let l of this.poly.edges) {
            p.line(l.start.x, l.start.y, l.end.x, l.end.y);
        }

        for (let l of this.box.edges) {
            p.line(l.start.x, l.start.y, l.end.x, l.end.y);
        }

        p.stroke(p.color("red"));
        p.line(p.sliced_donut.e_star.start.x, p.sliced_donut.e_star.start.y, p.sliced_donut.e_star.end.x, p.sliced_donut.e_star.end.y)
    }

    p.change_poly = change_poly;
}
const box_sketch = new p5(containing_box);
