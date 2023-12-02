function triangle_tree(donut, e_star, hole) {
    let coord = [];
    for (let v of donut.vertex) {
        coord.push(v.x);
        coord.push(v.y);
    }

    function new_edge_from_triangulation(v1, v2) {
        console.log(v1.x, v1.y, v2.x, v2.y)
        let temp = v1;
        let flag = false;
        while (temp !== v2) {
            temp = temp.out[0].end
            if (temp === e_star) {
                flag = true;
                break;
            }
        }

        let l = flag? new Line(v1, v2) : new Line(v2, v1);
        donut.edges.push(l);
        return l;
    }

    // Do triangulation
    let tri = earcut(coord, hole);
    console.log(tri)
    console.log(donut.vertex[13], donut.vertex[14], donut.vertex[15])
    let triangles = [];

    for (let i = 0; i < tri.length; i+=3) {
        // Triangulation given by a list of triangles [x, y, z] where x, y, z are index of the vertices in coord
        // We need to correspond the edges to the edges we already had
        // Each edge of a triangle can be an edge of the donut, and shortcut of the polygon or a new edge


        // First look into edges of the donut
        let e1 = donut.edges.find(e => (((e.start.x === donut.vertex[tri[i]].x && e.start.y === donut.vertex[tri[i]].y) && (e.end.x === donut.vertex[tri[i+1]].x && e.end.y === donut.vertex[tri[i+1]].y))
                || ((e.start.x === donut.vertex[tri[i+1]].x && e.start.y === donut.vertex[tri[i+1]].y) || (e.end.x === donut.vertex[tri[i]].x && e.end.y === donut.vertex[tri[i]].y)))),
            e2 = donut.edges.find(e => (((e.start.x === donut.vertex[tri[i+1]].x && e.start.y === donut.vertex[tri[i+1]].y) && (e.end.x === donut.vertex[tri[i+2]].x && e.end.y === donut.vertex[tri[i+2]].y))
                || ((e.start.x === donut.vertex[tri[i+2]].x && e.start.y === donut.vertex[tri[i+2]].y) || (e.end.x === donut.vertex[tri[i+1]].x && e.end.y === donut.vertex[tri[i+1]].y)))),
            e3 = donut.edges.find(e => (((e.start.x === donut.vertex[tri[i+2]].x && e.start.y === donut.vertex[tri[i+2]].y) && (e.end.x === donut.vertex[tri[i]].x && e.end.y === donut.vertex[tri[i]].y))
                || ((e.start.x === donut.vertex[tri[i]].x && e.start.y === donut.vertex[tri[i]].y) || (e.end.x === donut.vertex[tri[i+2]].x && e.end.y === donut.vertex[tri[i+2]].y))))
        console.log(e1,e2,e3)
        // Then look into shortcuts
        e1 = e1 ? e1 : donut.shortcuts.find(e => (((e.start.x === donut.vertex[tri[i]].x && e.start.y === donut.vertex[tri[i]].y) && (e.end.x === donut.vertex[tri[i+1]].x && e.end.y === donut.vertex[tri[i+1]].y))
            || ((e.start.x === donut.vertex[tri[i+1]].x && e.start.y === donut.vertex[tri[i+1]].y) || (e.end.x === donut.vertex[tri[i]].x && e.end.y === donut.vertex[tri[i]].y))))
        e2 = e2 ? e2 : donut.shortcuts.find(e => (((e.start.x === donut.vertex[tri[i+1]].x && e.start.y === donut.vertex[tri[i+1]].y) && (e.end.x === donut.vertex[tri[i+2]].x && e.end.y === donut.vertex[tri[i+2]].y))
            || ((e.start.x === donut.vertex[tri[i+2]].x && e.start.y === donut.vertex[tri[i+2]].y) || (e.end.x === donut.vertex[tri[i+1]].x && e.end.y === donut.vertex[tri[i+1]].y))))
        e3 = e3 ? e3 : donut.shortcuts.find(e => (((e.start.x === donut.vertex[tri[i+2]].x && e.start.y === donut.vertex[tri[i+2]].y) && (e.end.x === donut.vertex[tri[i]].x && e.end.y === donut.vertex[tri[i]].y))
            || ((e.start.x === donut.vertex[tri[i]].x && e.start.y === donut.vertex[tri[i]].y) || (e.end.x === donut.vertex[tri[i+2]].x && e.end.y === donut.vertex[tri[i+2]].y))))
        console.log(e1,e2, e3)
        // If no edge was found make a new one

        e1 = e1 ? e1 : new_edge_from_triangulation(donut.vertex[tri[i]], donut.vertex[tri[i+1]])
        e2 = e2 ? e2 : new_edge_from_triangulation(donut.vertex[tri[i+1]], donut.vertex[tri[i+2]])
        e3 = e3 ? e3 : new_edge_from_triangulation(donut.vertex[tri[i+2]], donut.vertex[tri[i]])
        console.log(e1,e2, e3)

        // Create new triangle
        triangles.push(new Triangle([
            donut.vertex[tri[i]],
            donut.vertex[tri[i+1]],
            donut.vertex[tri[i+2]]
            ],
            [e1, e2, e3]
            )
        )
    }

    // Find triangle linked to e_star
    let t = triangles.find((element) => element.vertices.includes(e_star.start) && element.vertices.includes(e_star.end));
    console.log(triangles, e_star)

    let temp = t.edges.slice()
    temp.splice(t.edges.indexOf(e_star), 1)
    let first = new TreeNode(t, e_star, temp)
    console.log(first)
    triangles.splice(triangles.indexOf(t), 1);

    find_children(first, e_star, 0);

    function find_children(current, e_in, i) {
        // console.log("Level: ", i, current)
        // find last point of the current triangle
        let last = current.vertices.find(v => v !== e_in.start && v !== e_in.end);

        // Triangle possibilities on one side
        let possibilitiesL = []
        if (!donut.edges.includes(current.e1)) {
            if (triangles.find(v => v.edges.includes(current.e1))) {
                possibilitiesL.push(triangles.find(v => v.edges.includes(current.e1)));
            }
            for (let s of current.e1.start.out) { // Possibilities outside of triangulation
                let v_inter = s.end;
                if (s !== current.e1) {
                    for (let o of v_inter.out) {
                        if (o.end === current.e1.end &&
                            !(possibilitiesL.find(v => v.edges.includes(o)))) {
                            possibilitiesL.push(new Triangle([current.e1.start, v_inter, current.e1.end], [
                                donut.edges.find(e => (e.start === current.e1.start || e.start === v_inter)
                                    && (e.end === current.e1.start || e.end === v_inter)),
                                donut.edges.find(e => (e.start === v_inter || e.start === current.e1.end)
                                    && (e.end === v_inter || e.end === current.e1.end)),
                                donut.edges.find(e => (e.start === current.e1.start || e.start === current.e1.end)
                                    && (e.end === current.e1.start || e.end === current.e1.end))
                            ]));
                        }
                    }
                }
            }
            // Get rid of the possibility we found
            if (triangles.find(v => v.edges.includes(current.e1))) {
                triangles.splice(triangles.indexOf(triangles.find(v => v.edges.includes(current.e1))), 1);
            }
            // console.log("PossL", possibilitiesL, current);
            for (let left of possibilitiesL) {
                // For each possibility add a node and iterate
                let temp = left.edges.slice()
                temp.splice(left.edges.indexOf(current.e1), 1)
                let child_left = new TreeNode(left, current.e1, temp, current, undefined, undefined, 1);
                find_children(child_left, current.e1, i + 1);
                current.childrenL.push(child_left);
            }
        }
        // On the other side
        let possibilitiesR = [];
        if (!donut.edges.includes(current.e2)) {
            if (triangles.find(v => v.edges.includes(current.e2))) {
                possibilitiesR.push(triangles.find(v => v.edges.includes(current.e2)));
            }
            // console.log(current)
            // console.log(current.e2.start)
            for (let s of current.e2.start.out) { // Possibilities outside of triangulation
                let v_inter = s.end;
                if (v_inter !== e_in.end && v_inter !== e_in.start) {
                    for (let o of v_inter.out) {
                        if (o.end === current.e2.end &&
                            !(possibilitiesR.find(v => v.edges.includes(o)))) {
                            possibilitiesR.push(new Triangle([current.e2.start, v_inter, current.e2.end], [
                                donut.edges.find(e => (e.start === current.e2.start || e.start === v_inter)
                                    && (e.end === current.e2.start || e.end === v_inter)),
                                donut.edges.find(e => (e.start === v_inter || e.start === current.e2.end)
                                    && (e.end === v_inter || e.end === current.e2.end)),
                                donut.edges.find(e => (e.start === current.e2.end || e.start === current.e2.start)
                                    && (e.end === current.e2.end || e.end === current.e2.start))
                            ]));
                        }
                    }
                }
            }
            if (triangles.find(v => v.edges.includes(current.e2))) {
                triangles.splice(triangles.indexOf(triangles.find(v => v.edges.includes(current.e2))), 1);
            }

            // console.log("PossR ", possibilitiesR, current);
            for (let right of possibilitiesR) {
                let temp = right.edges.slice()
                temp.splice(right.edges.indexOf(current.e2), 1)
                let child_right = new TreeNode(right, current.e2, temp, current, undefined, undefined, 0);
                find_children(child_right, current.e2, i + 1);
                current.childrenR.push(child_right);
            }
        }
        // console.log("Level: ", i, current, possibilitiesL, possibilitiesR)
    }

    return first;
}

class Triangle {
    constructor(vertices, edges) {
        this.vertices = vertices;
        this.edges = edges;
    }

}

class TreeNode {
    constructor(data, e_in, e_out, predecessor, childrenL, childrenR, L) {
        this.x_cost = L;
        this.y_cost = undefined;
        this.edges = data.edges;
        this.vertices = data.vertices;
        this.e = e_in;
        this.e1 = e_out[0];
        this.e2 = e_out[1];
        if (predecessor !== undefined) {
            this.predecessor = predecessor;
        } else {
            this.predecessor = []
        }
        if (childrenL !== undefined) {
            this.childrenL = childrenL;
        } else {
            this.childrenL = []
        }
        if (childrenR !== undefined) {
            this.childrenR = childrenR;
        } else {
            this.childrenR = []
        }
        this.active = false
    }

    print(lvl=0) {
        console.log(this, lvl);
        for (let c of this.childrenL) {
            console.log("Left");
            c.print(lvl+1);
        }
        for (let c of this.childrenR) {
            console.log("Right");
            c.print(lvl+1);
        }
    }

    draw(p, lvl) {
        if (this.active) {
            p.triangle(this.vertices[0].x, this.vertices[0].y, this.vertices[1].x, this.vertices[1].y, this.vertices[2].x, this.vertices[2].y);
        } else if (this.x_cost === Infinity && this.y_cost === Infinity) {
            p.fill("orange")
            p.triangle(this.vertices[0].x, this.vertices[0].y, this.vertices[1].x, this.vertices[1].y, this.vertices[2].x, this.vertices[2].y);
            p.fill(124,185,232)
        } else if (this.x_cost === 0 && this.y_cost === 0) {
            p.fill("green")
            p.triangle(this.vertices[0].x, this.vertices[0].y, this.vertices[1].x, this.vertices[1].y, this.vertices[2].x, this.vertices[2].y);
            p.fill(124,185,232)
        } else if ((this.x_cost === 0 || this.x_cost === Infinity) && (this.y_cost === 0 && this.y_cost === Infinity)) {
            p.fill("yellow")
            p.triangle(this.vertices[0].x, this.vertices[0].y, this.vertices[1].x, this.vertices[1].y, this.vertices[2].x, this.vertices[2].y);
            p.fill(124,185,232)
        }

        p.text("(" + Math.round(this.x_cost) + "," + Math.round(this.y_cost) + ")", (this.vertices[0].x + this.vertices[1].x + this.vertices[2].x)/3, (this.vertices[0].y + this.vertices[1].y + this.vertices[2].y)/3)

        for (let c of this.childrenL) {
            c.draw(p, lvl+1)
        }
        for (let c of this.childrenR) {
            c.draw(p, lvl+1)
        }
    }


    compute_costs(polygon, A, I, lambda) {

        if (!(A.has(this.e1))) {
            if (!polygon.shortcuts.includes(this.e1)) {
                A.set(this.e1, Infinity);
            } else if (this.childrenL.length === 0) {
                A.set(this.e1, (1 - lambda) * polygon.cA(this.e1));
            } else {
                console.log("Bah si ça arrive")
                let min_x = Infinity;
                for (let t of this.childrenL) {
                    t.compute_costs(polygon, A, I, lambda);
                    if (t.x_cost < min_x) {
                        min_x = t.x_cost;
                    }
                }
                A.set(this.e1, min_x + (1 - lambda) * polygon.cA(this.e1));
            }

        }
        if (!(I.has(this.e1))) {
            if (polygon.shortcuts.includes(this.e1) && this.childrenL.length === 0) {
                I.set(this.e1, Infinity);
            } else {
                // console.log("Childs: ", this.childrenL.length)
                let min_y = Infinity;
                for (let t of this.childrenL) {
                    t.compute_costs(polygon, A, I, lambda);
                    if (t.y_cost < min_y) {
                        min_y = t.y_cost
                    }
                }
                I.set(this.e1, min_y);
            }

        }
        if (!(A.has(this.e2))) {
            if (!polygon.shortcuts.includes(this.e2)) {
                A.set(this.e2, Infinity);
            } else if (this.childrenR.length === 0) {
                A.set(this.e2, (1 - lambda) * polygon.cA(this.e2));
            } else {
                console.log("Bah si ça arrive")
                let min_x = Infinity;
                for (let t of this.childrenR) {
                    t.compute_costs(polygon, A, I, lambda);
                    if (t.x_cost < min_x) {
                        min_x = t.x_cost;
                    }
                }
                A.set(this.e2, min_x + (1 - lambda) * polygon.cA(this.e2));
            }
        }

        if (!(I.has(this.e2))) {
            if (polygon.shortcuts.includes(this.e2) && this.childrenR.length === 0) {
                I.set(this.e2, Infinity);
            } else {
                // console.log("Childs: ", this.childrenR.length)

                let min_y = Infinity;
                for (let t of this.childrenR) {
                    t.compute_costs(polygon, A, I, lambda);
                    if (t.y_cost < min_y) {
                        min_y = t.y_cost;
                    }
                }
                I.set(this.e2, min_y);
            }
        }

        // this.childrenL.sort((a, b) => a.x_value > b.x_value)
        // let best_aL = this.childrenL[0]
        // this.childrenL.sort((a, b) => a.y_value > b.y_value)
        // let best_iL = this.childrenL[0]
        // this.childrenR.sort((a, b) => a.x_value > b.x_value)
        // let best_aR = this.childrenR[0]
        // this.childrenR.sort((a, b) => a.y_value > b.y_value)
        // let best_iR = this.childrenR[0]

        this.x_cost = Math.min(A.get(this.e1), I.get(this.e1) + lambda * polygon.cp(this.e1))
            + Math.min(A.get(this.e2), I.get(this.e2) + lambda * polygon.cp(this.e2))
            // + (1 - lambda) * polygon.cA(this.e)
        this.y_cost = Math.min(A.get(this.e1) + lambda * polygon.cp(this.e1), I.get(this.e1))
            + Math.min(A.get(this.e2) + lambda * polygon.cp(this.e2), I.get(this.e2))

        console.log(A.get(this.e1), I.get(this.e1) + lambda * polygon.cp(this.e1), A.get(this.e2), I.get(this.e2) + lambda * polygon.cp(this.e2))

        // A.set(this.e, [
        //     A.get(this.e),
        //     A.get(this.e1) < I.get(this.e1) + lambda * polygon.cp(this.e1) ? [A, best_aL] : [I, best_iL],
        //     A.get(this.e2) < I.get(this.e2) + lambda * polygon.cp(this.e2) ? [A, best_aR] : [I, best_iR]
        // ])

        // I.set(this.e, [
        //     I.get(this.e),
        //     I.get(this.e1) < A.get(this.e1) + lambda * polygon.cp(this.e1) ? [I, best_iL] : [A, best_aL],
        //     I.get(this.e2) < A.get(this.e2) + lambda * polygon.cp(this.e2) ? [I, best_iR] : [A, best_aR]
        // ])

    }



    activate(lambda, polygon) {
        if (this.childrenL.length > 0) {
            let c = this.childrenL[0];
            if (this.active) {
                // console.log(c.x_cost, c.y_cost)
                c.active = c.x_cost <= c.y_cost + lambda * polygon.cp(c.e)
            } else {
                // console.log(c.x_cost, c.y_cost)
                c.active = c.x_cost + lambda * polygon.cp(c.e) < c.y_cost
            }
            c.activate(lambda, polygon)

        }
        if (this.childrenR.length > 0) {
            let c = this.childrenR[0];
            if (this.active) {
                // console.log(c.x_cost, c.y_cost)
                c.active = c.x_cost <= c.y_cost + lambda * polygon.cp(c.e)
            } else {
                // console.log(c.x_cost, c.y_cost)
                c.active = c.x_cost + lambda * polygon.cp(c.e) < c.y_cost
            }
            c.activate(lambda, polygon)
        }
    }
}