const triangulation = function (p) {
    let max_lvl = 0
    p.setup = function () {
        max_lvl = -1
        const canvas = p.createCanvas(400,400);
        canvas.parent("triangulation");

        this.poly = create_polygon(document.getElementById("polygon").value);
        this.box = create_box(canvas.width, canvas.height);
        this.sliced_donut = new Sliced_donut(this.box, this.poly);

        this.triangles = triangle_tree(this.sliced_donut);
        this.triangles.print()
        // p.noLoop();
        p.mouseClicked = function () {max_lvl++;}
    }

    p.draw = function () {
        p.background(220);

        p.stroke(p.color("red"));
        p.strokeWeight(4)
        p.fill(124,185,232)
        this.triangles.draw(p, 0, max_lvl);
        p.noFill();

        p.stroke(p.color("black"));
        p.strokeWeight(6);
        for (let v of this.poly.vertex) {
            p.point(v.x, v.y);
        }
        p.strokeWeight(4);
        for (let l of this.poly.edges) {
            p.line(l.start.x, l.start.y, l.end.x, l.end.y);
        }

        p.strokeWeight(2);
        p.stroke(p.color("gray"));
        for (let s of this.poly.shortcuts) {
            p.line(s.start.x, s.start.y, s.end.x, s.end.y);
        }

        // p.ellipse(this.sliced_donut.vertex[this.sliced_donut.vertex.length-1].x, this.sliced_donut.vertex[this.sliced_donut.vertex.length-1].y, 100)
        // p.ellipse(this.sliced_donut.vertex[12].x, this.sliced_donut.vertex[12].y, 100)
    }

    p.change_poly = change_poly;
}
const triangulation_sketch = new p5(triangulation);