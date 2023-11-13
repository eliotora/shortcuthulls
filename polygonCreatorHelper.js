const sketch1 = function (p) {
    p.points = [];
    p.lines = [];
    p.buildingPoly = true;

    p.setup = function () {
        const canvas1 = p.createCanvas(400, 400);
        canvas1.parent("canvas1");
        canvas1.mousePressed(p.click);
    }

    p.draw = function () {
        p.background(220);
        p.strokeWeight(4)
        for (po in p.points) {
            p.point(p.points[po].x, p.points[po].y);
            p.text("(" + p.round(p.points[po].x) + ", " + p.round(p.points[po].y) + ")", p.points[po].x + 10, p.points[po].y - 10);
        }

        p.strokeWeight(2)
        for (l in p.lines) {
            p.line(p.lines[l].start.x, p.lines[l].start.y, p.lines[l].end.x, p.lines[l].end.y)
        }

        p.strokeWeight(1);
        p.text("(" + p.round(p.mouseX) + ", " + p.round(p.mouseY) + ")", p.mouseX + 10, p.mouseY - 10);
    }

    p.click = function () {
        if (p.buildingPoly) {
            if (
                p.points.length > 1 &&
                p.abs(p.points[0].x - p.mouseX) <= 20 &&
                p.abs(p.points[0].y - p.mouseY) <= 20
            ) {
                p.lines.push(new Line(p.points[p.points.length - 1], p.points[0]));
                p.buildingPoly = false;
                console.log("End of polygon")
            } else {
                p.points.push(new Point(p.mouseX, p.mouseY));
                if (p.points.length > 1) {
                    p.lines.push(new Line(p.points[p.points.length - 2], p.points[p.points.length - 1]))
                }
            }
        }
    }
};

const p5_1 = new p5(sketch1);



