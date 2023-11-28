function findShortcuts(p) {
    for (const v1 of p.vertex) {
        for (const v2 of p.vertex) {
            if (v1 !== v2) {
                let l = new Line(v1, v2);
                for (const e of p.edges) {
                    if (!segmentIntersection(v1, v2, e.start, e.end) && v1 !== e.start && v1 !== e.end && v2 !== e.start && v2 !== e.end) {
                        p.shortcut = l;
                    }
                }
            }
        }
    }
}

function orientationDeterminant(a, b, c) {
    return (b.x - a.x) * (c.y - b.y) - (b.y - a.y) * (c.x - b.x);
}

function insideTriangle(t1, t2, t3, p) {
    let apb = orientationDeterminant(t1, p, t2);
    let bpc = orientationDeterminant(t2, p, t3);
    let cpa = orientationDeterminant(t3, p, t1);

    return apb * bpc >= 0 && bpc * cpa >= 0 && apb * cpa >= 0;
}

function segmentIntersection(a, b, c, d) {
    return orientationDeterminant(a, b, c) * orientationDeterminant(a, b, d) < 0 &&
        !insideTriangle(b, c, d, a) &&
        !insideTriangle(a, c, d, b);
}