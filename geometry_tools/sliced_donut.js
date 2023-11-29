class Sliced_donut {
    constructor(box, poly) {
        this.polygon = poly;

        // Find top most vertex of poly
        let top_v = poly.vertex[0];
        for (let v of poly.vertex) {
            if (v.y < top_v.y) {
                top_v = v;
            }
        }

        // First the box
        this.vertex = box.vertex;
        this.edges = box.edges;
        this.vertex.push(box.vertex[0]);
        // Ingoing link with polygon
        this.edges.push(new Line(box.vertex[0], top_v));
        // Polygon but backward
        this.vertex.push(top_v);
        this.edges.push(top_v.in[0]);
        let currentv = top_v.in[0].start;
        while (currentv !== top_v) {
            this.vertex.push(currentv);
            this.edges.push(currentv.in[0])
            currentv = currentv.in[0].start;
        }
        this.vertex.push(top_v);
        // Outgoing link with polygon
        this.edges.push(new Line(top_v, box.vertex[0]));

        this.hole = [5, this.vertex.length-1]
        this.poly = new Polygon(this.vertex, this.edges);
        // this.e_star = this.edges[this.edges.length-1];
        this.e_star = this.edges[4];
        for (let s of poly.shortcuts) {
            this.edges.push(s);
        }
    }
}

function create_box(width, height) {
    let vertices = [
        new Vertex(0, 0),
        new Vertex(width, 0),
        new Vertex(width, height),
        new Vertex(0, height)
    ]
    let edges = [
        new Line(vertices[0], vertices[1]),
        new Line(vertices[1], vertices[2]),
        new Line(vertices[2], vertices[3]),
        new Line(vertices[3], vertices[0])
    ]
    vertices[0].in = [edges[3]];
    vertices[1].in = [edges[0]];
    vertices[2].in = [edges[1]];
    vertices[3].in = [edges[2]];
    vertices[0].out = [edges[0]];
    vertices[1].out = [edges[1]];
    vertices[2].out = [edges[2]];
    vertices[3].out = [edges[3]];

    return new Polygon(vertices, edges);
}