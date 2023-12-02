const containing_box_and_donut = function (p) {
    p.setup = function () {
        const canvas = p.createCanvas(400,400);
        canvas.parent("containing_box_and_donut");

        this.poly = create_polygon(document.getElementById("polygon").value);
        this.box = [new Vertex(0,0),
                    new Vertex(canvas.width,0),
                    new Vertex(canvas.width, canvas.height),
                    new Vertex(0, canvas.height)];
        this.box = new Polygon(this.box);
        let donut_e_hole = make_sliced_donut(this.box, this.poly);
        this.sliced_donut = donut_e_hole[0];
        this.e_star = donut_e_hole[1];
        this.hole = donut_e_hole[2];

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

        p.stroke(p.color("yellow"));
        p.strokeWeight(6);

        for (let v of this.sliced_donut.vertex) {
            p.point(v.x, v.y);
        }
        p.strokeWeight(4);

        for (let l of this.sliced_donut.edges) {
            p.line(l.start.x, l.start.y, l.end.x, l.end.y);
        }
        for (let l of this.sliced_donut.shortcuts) {
            p.line(l.start.x, l.start.y, l.end.x, l.end.y);
        }

        p.stroke(p.color("red"));
        p.line(this.e_star.start.x, this.e_star.start.y, this.e_star.end.x, this.e_star.end.y)
    }

    p.change_poly = change_poly;
}
const box_donut_sketch = new p5(containing_box_and_donut);
