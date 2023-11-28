function triangle_tree(donut) {
    let coord = [];
    for (let v of donut.vertex) {
        coord.push(v.x);
        coord.push(v.y);
    }

    let tri = earcut(coord, donut.hole);
    let triangles = []
    for (let i = 0; i < tri.length; i+=3) {
        triangles.push([
            donut.vertex[tri[i]],
            donut.vertex[tri[i+1]],
            donut.vertex[tri[i+2]]
        ])
        console.log(tri[i], tri[i+1], tri[i+2])
    }

    console.log(triangles.find((element)  => element.includes(donut.vertex[0]) && element.includes(donut.vertex[1])));
    let t = triangles.find((element) => element.includes(donut.vertex[0]) && element.includes(donut.vertex[1]));
    let first = new TreeNode(t)
    triangles.splice(triangles.indexOf(t), 1);

    find_children(first, donut.vertex[0], donut.vertex[1], 0);

    function find_children(current, e1, e2, i) {
        console.log("Level "+i);
        // find last point of the current triangle
        let last = current.data.find(e => e !== e1 && e !== e2);

        // Triangle possibilities on one side
        let possibilitiesL = []
        if (triangles.find(e => e.includes(e1) && e.includes(last))) {
            possibilitiesL.push(triangles.find(e => e.includes(e1) && e.includes(last)));
        }

        for (let s of e1.out) { // Possibilities outside of triangulation
            let e_inter = s.end;
            if (e_inter !== last) {
                for (let o of e_inter.out) {
                    if (o.end === last &&
                        !(triangles.find(e => e.includes(e1) && e.includes(last) && e.includes(e_inter)))) {
                        console.log("Triangle added");
                        console.log([e1, e_inter, last]);
                        possibilitiesL.push([e1, e_inter, last]);
                    }
                }
            }
        }
        // Get rid of the possibility we found
        if (triangles.find(e => e.includes(e1) && e.includes(last))) {
            console.log("Suppressed 1 left");
            triangles.splice(triangles.indexOf(triangles.find(e => e.includes(e1) && e.includes(last))), 1);
        }
        for (let left of possibilitiesL) {
            // For each possibility add a node and iterate
            console.log("left")
            console.log(left)
            let child_left = new TreeNode(left, current);
            find_children(child_left, e1, last, i+1);
            current.childrenL.push(child_left);
        }

        // On the other side
        let possibilitiesR = [];
        if (triangles.find(e => e.includes(e2) && e.includes(last))) {
            possibilitiesR.push(triangles.find(e => e.includes(e2) && e.includes(last)));
        }
        for (let s of last.out) { // Possibilities outside of triangulation
            let e_inter = s.end;
            if (e_inter !== e2) {
                for (let o of e_inter.out) {
                    if (o.end === e2 &&
                        !(triangles.find(e => e.includes(e2) && e.includes(last) && e.includes(e_inter)))) {
                        console.log("Triangle added");
                        console.log([last, e_inter, e2]);
                        possibilitiesL.push([last, e_inter, e2]);
                    }
                }
            }
        }
        if (triangles.find(e => e.includes(e2) && e.includes(last))) {
            console.log("Suppressed 1 right");
            triangles.splice(triangles.indexOf(triangles.find(e => e.includes(e2) && e.includes(last))), 1);
        }
        for (let right of possibilitiesR) {
            console.log("right")
            console.log(right)
            let child_right = new TreeNode(right, current);
            find_children(child_right, last, e2, i+1);
            current.childrenR.push(child_right);
        }
    }


    return first;
}

class TreeNode {
    constructor(data, predecessor, childrenL, childrenR) {
        this.data = data
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
    }

    print(lvl=0) {
        console.log(this.data, lvl);
        for (let c of this.childrenL) {
            console.log("Left");
            c.print(lvl+1);
        }
        for (let c of this.childrenR) {
            console.log("Right");
            c.print(lvl+1);
        }
    }

    draw(p, lvl, max_lvl) {
        p.triangle(this.data[0].x, this.data[0].y, this.data[1].x, this.data[1].y, this.data[2].x, this.data[2].y);
        if (lvl < max_lvl) {
            for (let c of this.childrenL) {
                c.draw(p, lvl+1, max_lvl)
            }
            for (let c of this.childrenR) {
                c.draw(p, lvl+1, max_lvl)
            }
        }

    }
}