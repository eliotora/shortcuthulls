class Point {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        if (typeof color === "undefined") {this.color = "black";}
        else {this.color = color;}
    }
}

class Line {
    constructor(p1, p2) {
        this.start = p1;
        this.end = p2;
    }
}

class Vertex {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    setIn(e_in) {
        this.in = e_in
    }

    setOut(e_out) {
        this.out = [e_out]
    }
}

class Polygon {
    constructor(vertex, edges) {
        this.vertex = vertex;
        if (typeof edges !== "undefined") {
            this.edges = edges
        } else {
            this.edges = []
            for (let i=0; i < this.vertex.length-1; i++) {
                this.edges.push(new Line(this.vertex[i], this.vertex[i+1]));
            }
            this.edges.push(new Line(this.vertex[this.vertex.length-1], this.vertex[0]));
            console.warn("Edges were computed manually.");
        }
        this.shortcuts = [];
    }

    set shortcut(c) {
        this.shortcuts.push(c);
    }

    computeArea() {
        // If Polygon is clockwise: the area will be negative, if it was counterclockwise it will be positive
        // Pockets will be counterclockwise
        if (typeof this.area === "undefined") {
            let sum = this.vertex[this.vertex.length - 1].x * this.vertex[0].y - this.vertex[0].x * this.vertex[this.vertex.length - 1].y;
            for (let i = 0; i < this.vertex.length - 1; i++) {
                sum += this.vertex[i].x * this.vertex[i + 1].y - this.vertex[i + 1].x * this.vertex[i].y;
            }
            this.area = Math.abs(sum/2/10000);
        }
        return this.area;
    }

    findShortcutHull(lambda) {
        // Find v_top
        let v_top = this.vertex[0]
        for (let v of this.vertex) {
            if (v.x > v_top.x) {
                v_top = v;
            }
        }

        let sc_hull = [];

        let current_v = v_top;
        let best_e = current_v.out[0];
        while (best_e.end !== v_top) {
            best_e = current_v.out[0];
            let best_e_cost = this.cost(current_v.out[0], lambda)
            for (let e of current_v.out) {
                let ecost = this.cost(e, lambda);
                if (ecost < best_e_cost) {
                    best_e = e;
                    best_e_cost = ecost;
                }
            }
            sc_hull.push(best_e);
            current_v = best_e.end;
        }

        return sc_hull;
    }

    cost(e, lambda) {
        if (this.edges.includes(e)) {
            return lambda * Math.sqrt((e.end.x - e.start.x) ** 2 + (e.end.y - e.start.y) ** 2) / 100;
        } else {
            let pocket_vertices = [e.start];
            let pocket_edges = [];
            let current = e.start;
            let length_cost = 0;
            while (current !== e.end) {
                pocket_edges.push(current.out[0])
                pocket_vertices.push(current);
                length_cost += Math.sqrt((current.x - current.out[0].end.x)**2 + (current.y - current.out[0].end.y)**2);
                current = current.out[0].end;
            }
            pocket_vertices.push(current)
            pocket_edges.push(new Line(e.end, e.start));
            let pocket = new Polygon(pocket_vertices, pocket_edges);
            return lambda * (Math.sqrt((e.end.x - e.start.x) ** 2 + (e.end.y - e.start.y) ** 2) - length_cost) / 100 + (1 - lambda) * pocket.computeArea();
        }
    }
}

function create_polygon(choice_nbr) {
    // Import the polygon
    let file = JSON.parse(polygons[choice_nbr]);
    let points = [];
    let lines = [];

    // Create each vertex and edge of the polygon
    for (let i in file.Points) {
        points.push(new Vertex(file.Points[i][0], file.Points[i][1]));
        if (points.length > 1) {
            let l = new Line(points[i - 1], points[i])
            lines.push(l);
            points[i - 1].setOut(l);
            points[i].setIn(l);
        }
    }
    let l = new Line(points[points.length - 1], points[0])
    lines.push(l);
    points[points.length - 1].setOut(l);
    points[0].setIn(l);

    poly = new Polygon(points, lines);

    // Add pre-computed shortcuts to the polygon structure
    for (let i in file.Shortcuts) {
        poly.shortcut = new Line(poly.vertex[file.Shortcuts[i][0]], poly.vertex[file.Shortcuts[i][1]]);

        poly.vertex[file.Shortcuts[i][0]].out.push(poly.shortcuts[i]);
    }

    // Also add each edge to be a possible shortcut
    for (let e of this.poly.edges) {
        poly.shortcut = e;
    }

    return poly;
}

star = '{"Points":[[390,148],[263,231],[318,372],[200,277],[82,372],[137,231],[10,148],[161,156],[200,10],[239,156]], "Shortcuts":[[0,2],[2,4],[4,6],[6,8],[8,0]]}'
bow = '{"Points":[[10,10],[390,10],[127,127],[10,390]], "Shortcuts":[[1,3]]}'
example1 = '{"Points":[[39,90],[168,76],[90,247],[180,202],[241,253],[262,145],[367,145],[364,313],[29,313]], "Shortcuts":[[1,3],[1,4],[1,5],[1,6],[2,5],[3,5]]}'
example2 = '{"Points":[[64,62],[152,51],[188,146],[133,195],[199,224],[213,166],[278,138],[208,70],[257,40],[328,126],[359,60],[312,236],[251,354],[189,303],[225,276],[136,265],[122,356],[34,340],[73,262],[38,191],[125,126]], "Shortcuts":[[1,5],[1,6],[1,7],[1,8],[2,4],[2,5],[2,6],[2,7],[3,5],[3,6],[5,7],[8,10],[12,15],[12,16],[13,15],[13,16],[17,19],[19,0]]}'

polygons = {"star":star, "bow":bow, "example1":example1, "example2":example2};

const poly_selector = document.getElementById("polygon");
for (const p of Object.keys(polygons)) {
    const opt = document.createElement("option");
    opt.text = p;
    poly_selector.add(opt);
}
poly_selector.selectedIndex = 0;

poly_selector.addEventListener("change", function() {
    polygon_scketch.change_poly();
    shortcut_sketch.change_poly();
    schullsketch.change_poly();
});

function change_poly() {
    this.setup();
    this.draw();
}