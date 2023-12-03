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
        // this.triangles.print()
        // p.noLoop();
        p.mouseClicked = function () {max_lvl++;}
    }

    p.draw = function () {
        p.background(220);

        p.stroke(p.color("blue"));
        p.strokeWeight(4)
        p.fill(124,185,232)
        let triangletodraw = [this.triangles];
        while (triangletodraw.length > 0) {
            let t = triangletodraw.pop()
            for (let c of t.childrenL) {triangletodraw.push(c)}
            for (let c of t.childrenR) {triangletodraw.push(c)}
            p.triangle(t.vertices[0].x, t.vertices[0].y, t.vertices[1].x, t.vertices[1].y, t.vertices[2].x, t.vertices[2].y)
        }
        // this.triangles.draw(p, 0);
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
        // p.strokeWeight(1);
        // p.text("(" + p.round(p.mouseX) + ", " + p.round(p.mouseY) + ")", p.mouseX + 10, p.mouseY - 10);

        p.strokeWeight(4);
        p.stroke(p.color("red"));
        p.line(p.sliced_donut.e_star.start.x, p.sliced_donut.e_star.start.y, p.sliced_donut.e_star.end.x, p.sliced_donut.e_star.end.y)

        // p.strokeWeight(2);
        // p.stroke(p.color("gray"));
        // for (let s of this.poly.shortcuts) {
        //     p.line(s.start.x, s.start.y, s.end.x, s.end.y);
        // }

        // p.ellipse(this.sliced_donut.vertex[this.sliced_donut.vertex.length-1].x, this.sliced_donut.vertex[this.sliced_donut.vertex.length-1].y, 100)
        // p.ellipse(this.sliced_donut.vertex[12].x, this.sliced_donut.vertex[12].y, 100)
    }

    p.change_poly = change_poly;
}
const triangulation_sketch = new p5(triangulation);