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
        this.in = [];
        this.out = [];
    }

    addIn(e_in) {
        this.in.push(e_in);
    }

    addOut(e_out) {
        this.out.push(e_out);
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

    // cost(e, lambda) {
    //     if (this.edges.includes(e)) {
    //         console.log(lambda * Math.sqrt((e.end.x - e.start.x) ** 2 + (e.end.y - e.start.y) ** 2) / 100, lambda * this.cp(e))
    //         return lambda * Math.sqrt((e.end.x - e.start.x) ** 2 + (e.end.y - e.start.y) ** 2) / 100;
    //     } else {
    //         let pocket_vertices = [e.start];
    //         let pocket_edges = [];
    //         let current = e.start;
    //         let length_cost = 0;
    //         while (current !== e.end) {
    //             pocket_edges.push(current.out[0])
    //             pocket_vertices.push(current);
    //             length_cost += Math.sqrt((current.x - current.out[0].end.x)**2 + (current.y - current.out[0].end.y)**2);
    //             current = current.out[0].end;
    //         }
    //         pocket_vertices.push(current)
    //         pocket_edges.push(new Line(e.end, e.start));
    //         let pocket = new Polygon(pocket_vertices, pocket_edges);
    //         console.log(lambda * (Math.sqrt((e.end.x - e.start.x) ** 2 + (e.end.y - e.start.y) ** 2) - length_cost) / 100 + (1 - lambda) * pocket.computeArea(), lambda * (this.cp(e)-length_cost/100) + (1 - lambda) * this.ca(e))
    //         return lambda * (Math.sqrt((e.end.x - e.start.x) ** 2 + (e.end.y - e.start.y) ** 2) - length_cost) / 100 + (1 - lambda) * pocket.computeArea();
    //     }
    // }

    cp(e) {

        if (this.edges.includes(e)) {
            return Math.sqrt((e.end.x - e.start.x) ** 2 + (e.end.y - e.start.y) ** 2) / 100;
        } else if (this.shortcuts.includes(e)){
            let current = e.start;
            let length_cost = 0;
            while (current !== e.end) {
                length_cost += Math.sqrt((current.x - current.out[0].end.x) ** 2 + (current.y - current.out[0].end.y) ** 2);
                current = current.out[0].end;
            }
            return (Math.sqrt((e.end.x - e.start.x) ** 2 + (e.end.y - e.start.y) ** 2) - length_cost) / 100;
        } else {return Infinity}
    }

    cA(e) {
        let pocket_vertices = [e.start];
        let pocket_edges = [];
        let current = e.start;
        while (current !== e.end) {
            pocket_edges.push(current.out[0])
            pocket_vertices.push(current);
            current = current.out[0].end;
        }
        pocket_vertices.push(current)
        pocket_edges.push(new Line(e.end, e.start));
        let pocket = new Polygon(pocket_vertices, pocket_edges);
        return pocket.computeArea();
    }

    cost(e, lambda) {
        if (this.edges.includes(e)) {
            return lambda * this.cp(e);
        } else {
            return lambda * this.cp(e) + (1 - lambda) * this.cA(e);
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
            points[i - 1].addOut(l);
            points[i].addIn(l);
        }
    }
    let l = new Line(points[points.length - 1], points[0])
    lines.push(l);
    points[points.length - 1].addOut(l);
    points[0].addIn(l);

    poly = new Polygon(points, lines);

    // Add pre-computed shortcuts to the polygon structure
    for (let i in file.Shortcuts) {
        poly.shortcut = new Line(poly.vertex[file.Shortcuts[i][0]], poly.vertex[file.Shortcuts[i][1]]);

        poly.vertex[file.Shortcuts[i][0]].addOut(poly.shortcuts[i]);
    }

    // Also add each edge to be a possible shortcut
    for (let e of this.poly.edges) {
        poly.shortcut = e;
    }

    return poly;
}

star = '{"Points":[[390,148],[263,231],[318,372],[200,277],[82,372],[137,231],[10,148],[161,156],[200,10],[239,156]], "Shortcuts":[[0,2],[2,4],[4,6],[6,8],[8,0]]}'
bow = '{"Points":[[10,10],[390,10],[127,127],[10,390]], "Shortcuts":[[1,3]]}'
complexPolygon1 = '{"Points":[[39,90],[168,76],[90,247],[180,202],[241,253],[262,145],[367,145],[364,313],[29,313]], "Shortcuts":[[1,3],[1,4],[1,5],[1,6],[2,5],[3,5]]}'
complexPolygon2 = '{"Points":[[64,62],[152,51],[188,146],[133,195],[199,224],[213,166],[278,138],[208,70],[257,40],[328,126],[359,60],[312,236],[251,354],[189,303],[225,276],[136,265],[122,356],[34,340],[73,262],[38,191],[125,126]], "Shortcuts":[[1,5],[1,6],[1,7],[1,8],[2,4],[2,5],[2,6],[2,7],[3,5],[3,6],[5,7],[8,10],[12,15],[12,16],[13,15],[13,16],[17,19],[19,0]]}'
tree = '{"Points":[[200, 200],[200, 100],[160, 100],[120, 100],[120, 140],[120, 200],[120, 220],[120, 200],[ 80, 200],[120, 200],[120, 140],[ 40, 140],[ 40, 180],[ 20, 180],[ 40, 180],[ 40, 140],[120, 140],[120, 100],[160, 100],[160,  60],[140,  60],[ 60,  60],[ 60, 100],[ 20, 100],[ 20,  20],[ 20, 100],[ 60, 100],[ 60,  60],[140,  60],[140,  20],[100,  20],[140,  20],[140,  60],[160,  60],[160, 100],[200, 100],[200,  60],[300,  60],[300, 100],[340, 100],[340,  60],[340,  20],[300,  20],[340,  20],[340,  60],[380,  60],[380,  20],[380,  60],[340,  60],[340, 100],[380, 100],[340, 100],[340, 140],[340, 180],[380, 180],[340, 180],[340, 140],[260, 140],[260, 180],[260, 140],[340, 140],[340, 100],[300, 100],[300,  60],[200,  60],[200, 100],[200, 200],[200, 260],[280, 260],[280, 220],[360, 220],[360, 300],[360, 220],[280, 220],[280, 260],[280, 340],[360, 340],[280, 340],[280, 260],[200, 260],[140, 260],[140, 340],[200, 340],[200, 380],[200, 340],[140, 340],[ 80, 340],[ 80, 380],[ 80, 340],[ 40, 340],[ 40, 380],[ 40, 340],[  0, 340],[ 40, 340],[ 80, 340],[ 80, 300],[ 40, 300],[ 80, 300],[ 80, 340],[140, 340],[140, 260],[100, 260],[140, 260],[200, 260],[200, 200]], ' +
     '"Shortcuts":[[0,2],[0,3],[0,4],[0,5],[0,6],[1,4],[1,5],[1,6],[2,4],[2,5],[2,6],[6,8],[6,12],[6,13],[8,10],[8,11],[8,12],[8,13],[9,11],[9,12],[9,13],[10,12],[13,15],[13,22],[13,23],[14,23],[15,17],[15,19],[15,20],[15,22],[15,23],[16,21],[16,22],[16,23],[17,19],[17,20],[17,21],[17,22],[18,20],[18,21],[19,22],[20,22],[24,26],[24,27],[24,28],[24,30],[25,27],[25,30],[27,29],[27,30],[28,30],[31,33],[31,35],[31,36],[31,37],[31,40],[31,42],[32,42],[33,35],[33,36],[33,41],[33,42],[34,36],[36,41],[36,42],[37,39],[37,40],[37,41],[37,42],[38,40],[38,41],[39,42],[40,42],[43,45],[44,46],[47,49],[47,50],[48,50],[50,52],[50,53],[50,54],[51,54],[52,54],[54,69],[54,70],[54,71],[54,66],[55,66],[55,69],[55,70],[56,69],[56,70],[57,69],[57,70],[58,64],[58,65],[58,66],[58,67],[58,68],[58,69],[58,70],[59,61],[59,62],[59,63],[59,64],[59,65],[59,66],[59,67],[60,62],[60,64],[60,65],[62,64],[62,65],[62,66],[63,65],[63,66],[64,68],[64,69],[65,68],[65,69],[66,68],[66,69],[66,70],[67,69],[71,73],[71,74],[71,75],[71,76],[72,74],[72,75],[73,76],[73,76],[74,76],[76,83],[77,79],[77,80],[77,82],[77,83],[78,81],[78,82],[78,83],[79,81],[79,82],[80,82],[83,85],[83,86],[83,87],[83,90],[84,87],[85,87],[87,89],[87,90],[88,90],[90,92],[92,95],[92,96],[93,95],[93,96],[94,96],[96,100],[96,101],[97,99],[97,100],[97,101],[98,100],[98,101],[99,101],[101,104],[101,0],[102,0],[101,1],[102,1],[102,2],[103,2],[104,2],[102,3],[103,3],[104,3],[102,4],[103,4],[104,4],[102,5],[103,5],[104,5],[92,6],[96,6],[97,6],[101,6],[102,6],[103,6],[104,6],[92,7],[96,7],[97,7],[101,7],[92,8],[96,8],[97,8],[101,8],[102,8],[97,11],[99,11],[101,11],[92,12],[93,12],[96,12],[97,12],[99,12],[101,12],[92,13],[93,13],[96,13],[97,13],[99,13],[101,13],[102,13],[103,13]]}'

polygons = {"Star":star, "Bow":bow, "Complex Polygon 1":complexPolygon1, "Complex Polygon 2":complexPolygon2, "Tree":tree};

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
    triangulation_sketch.change_poly();
    shortcuthullholes_sketch.change_poly();
    box_sketch.change_poly()
});

function change_poly() {
    this.setup();
    this.draw();
}