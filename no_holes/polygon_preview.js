const polygon_preview = function (p) {
    p.setup = function() {
        // Create canvas
        const canvas2 = p.createCanvas(400, 400);
        canvas2.parent("polygon_preview");

        this.poly = create_polygon(document.getElementById("polygon").value);
        p.noLoop();
    }

    p.draw = function() {
        // Draw base of the canvas
        p.background(220);
        p.stroke(p.color("black"));

        // Draw each vertex of the polygon
        p.strokeWeight(6)
        for (let v of this.poly.vertex) {
            p.point(v.x, v.y);
        }

        // Draw each edge if the polygon
        p.strokeWeight(4);
        for (let l of this.poly.edges) {
            p.line(l.start.x, l.start.y, l.end.x, l.end.y);
        }
    }

    p.change_poly = change_poly;
}

star = '{"Points":[[390,148],[263,231],[318,372],[200,277],[82,372],[137,231],[10,148],[161,156],[200,10],[239,156]], "Shortcuts":[[0,2],[2,4],[4,6],[6,8],[8,0]]}'
bow = '{"Points":[[10,10],[390,10],[127,127],[10,390]], "Shortcuts":[[1,3]]}'
example1 = '{"Points":[[39,90],[168,76],[90,247],[180,202],[241,253],[262,145],[367,145],[364,313],[29,313]], "Shortcuts":[[1,3],[1,4],[1,5],[1,6],[2,5],[3,5]]}'
example2 = '{"Points":[[64,62],[152,51],[188,146],[133,195],[199,224],[213,166],[278,138],[208,70],[257,40],[328,126],[359,60],[312,236],[251,354],[189,303],[225,276],[136,265],[122,356],[34,340],[73,262],[38,191],[125,126]], "Shortcuts":[[1,5],[1,6],[1,7],[1,8],[2,4],[2,5],[2,6],[2,7],[3,5],[3,6],[5,7],[8,10],[12,15],[12,16],[13,15],[13,16],[17,19],[19,0]]}'


const polygon_scketch = new p5(polygon_preview);