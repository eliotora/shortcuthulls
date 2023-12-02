const shortcuthullholes = function (p) {
    const lambda_slider = document.getElementById("lambdasketch");
    const lambda_out = document.getElementById("lambdaval");
    let lambda = 0.5;

    lambda_slider.oninput = function() {
        lambda_out.innerHTML = "Lambda = " + this.value;
        lambda = this.value;
        p.click();
    }

    p.setup = function () {
        const canvas = p.createCanvas(400,400);
        canvas.parent("shortcuthullholes");

        this.poly = create_polygon(document.getElementById("polygon").value);
        this.box = create_box(canvas.width, canvas.height);
        // this.sliced_donut = new Sliced_donut(this.box, this.poly);
        let donut_e_hole = make_sliced_donut(this.box, this.poly);
        this.sliced_donut = donut_e_hole[0];
        this.e_star = donut_e_hole[1];
        this.hole = donut_e_hole[2];

        this.triangles = triangle_tree(this.sliced_donut, this.e_star, this.hole);

        // this.triangles.print()
        p.noLoop();
    }

    p.draw = function () {
        p.background(220);

        p.stroke(p.color("red"));
        p.strokeWeight(4)
        p.fill(124,185,232)
        this.triangles.draw(p, 0);
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

    p.click = function () {
        let A = new Map(), I = new Map()
        this.triangles.compute_costs(this.poly, A, I, lambda);
        this.triangles.active = false
        this.triangles.activate(lambda, this.poly)
        this.draw();
    }

    p.change_poly = change_poly;
}
const shortcuthullholes_sketch = new p5(shortcuthullholes);