const sketch2 = function (p) {
    p.points = [];
    p.lines = []
    p.file = JSON.parse(star);
    for (let i in p.file.Points) {
        p.points.push(new Vertex(p.file.Points[i][0], p.file.Points[i][1]));
        if (p.points.length > 1) {
            let l = new Line(p.points[i-1], p.points[i])
            p.lines.push(l);
            p.points[i-1].setOut(l);
            p.points[i].setIn(l);
        }
    }
    l = new Line(p.points[p.points.length-1], p.points[0])
    p.lines.push(l);
    p.points[p.points.length-1].setOut(l);
    p.points[0].setIn(l);

    p.poly = new Polygon(p.points, p.lines);
    for (let i in p.file.Shortcuts) {
        p.poly.shortcut = new Line(p.poly.vertex[p.file.Shortcuts[i][0]], p.poly.vertex[p.file.Shortcuts[i][1]]);
        p.poly.vertex[p.file.Shortcuts[i][0]].out.push(p.poly.shortcuts[i]);
    }
    for (let e of p.poly.edges) {
        p.poly.shortcut = e;
    }
    console.log(p.poly.computeArea());
    console.log(new Polygon([p.poly.vertex[0], p.poly.vertex[1], p.poly.vertex[3]]).computeArea());
    p.setup = function () {
        const canvas2 = p.createCanvas(400, 400);
        canvas2.parent("canvas2");
        canvas2.mousePressed(p.click);
        // findShortcuts(p.poly);
    }

    p.draw = function () {
        p.background(220);
        p.stroke(p.color("black"));
        p.strokeWeight(4)
        for (v of p.poly.vertex) {
            p.point(v.x, v.y);
        }

        p.strokeWeight(2);
        for (l of p.poly.edges) {
            p.line(l.start.x, l.start.y, l.end.x, l.end.y);
        }

        p.stroke(p.color("red"));
        for (let c of p.poly.shortcuts) {
            p.line(c.start.x, c.start.y, c.end.x, c.end.y);
        }
    }

    p.click = function() {
        let sc_hull = p.poly.findShortcutHull(0.5);
        for (let e of sc_hull) {
            console.log(e.start, e.end);
        }
    }
};

// star = '{"Points":[[390,148],[239,156],[200,10],[161,156],[10,148],[137,231],[82,372],[200,277],[318,372],[263,231]]}'
star = '{"Points":[[390,148],[263,231],[318,372],[200,277],[82,372],[137,231],[10,148],[161,156],[200,10],[239,156]], "Shortcuts":[[0,2],[2,4],[4,6],[6,8],[8,0]]}'
bow = '{"Points":[[10,10],[390,10],[127,127],[10,390]], "Shortcuts":[[1,3]]}'

const p5_2 = new p5(sketch2);