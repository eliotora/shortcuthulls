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

    addOut(e) {
        this.out.push(e);
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
            this.area = Math.abs(sum/2);
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
            return lambda * Math.sqrt((e.end.x - e.start.x)**2 + (e.end.y - e.start.y)**2);
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
            return lambda * (Math.sqrt((e.end.x - e.start.x)**2 + (e.end.y - e.start.y)**2) - length_cost) + (1 - lambda) * pocket.computeArea();
        }
    }
}