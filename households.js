const base = new p5();
let lens;

let datas = []; //all jsons
let data_families = []; //all families arrays

let stats;
let metadata;

let families = []; //selected family array
let data; //selected json

let YEAR = 1860;
const YEARS = ["1860", "1880", "1900", "1920", "1940", "1960", "1980", "2000", "2020"];
let DISPLAY_SERIAL = false;

const mapF = new Map();

const c_yellow = color("#DDDD00");
const c_gray = color("#9E9E9E");
const c_orange = color("#FF7300");
const c_red = color("#DD0000");
const c_violet = color("#8102A0");
const c_blue = color("#0015AA");
const c_green = color("#067A00");

const m_purple = color("#8800C1");
const f_magenta = color("#CC0255");

const f_width = 1350;
const m_height = 3220;
let f_height = m_height;
//onst f_height = 3600;

const lens_width = 1450;
const lens_height = 230;

const hSpacing = 3.75;
const vSpacing = 20;

let fontBold, fontRegular;
let imgF, imgM;
let imgPride;






function preload() {
    
    stats = loadJSON("data/stats.json");
    metadata = loadTable('data/counts.csv', 'csv', 'header');
    fontBold = loadFont("fonts/Nunito-Black.ttf");
    fontRegular = loadFont("fonts/Nunito-Regular.ttf");
    imgF = loadImage("images/F.svg");
    imgM = loadImage("images/M.svg");
    imgPride = loadImage("images/pride2.png");

    YEARS.forEach((yy) => { datas[yy] = loadJSON(`data/couples_${yy}_web.json`, function(){
        print("Loaded "+ yy );
        data_families[yy] = [];
        for (let d in datas[yy]) {
            data_families[yy].push(new Family(datas[yy][d]));
        }    

    })});
}

function setup() {
    createCanvas(f_width, m_height).parent('base-sketch');
    setYear(YEAR);
    maintenance();
 
    

}

function setYear(y) {
    YEAR = y;
    mapF.clear();
    select("#loading").show();
    select("#loading").html("PROCESSING DATA...")
    
    families = data_families[`${YEAR}`];
    data = datas[`${YEAR}`];
    select("#loading").html("RENDERING...");
    //resizeCanvas(f_width, calculateHeight());
    select("#wrapper").style('height', calculateHeight()) + 'px';
    //print(calculateHeight());
    loop();
    
    updateMeta();
    select("#loading").hide();
   
    function updateMeta(){
        let row = metadata.findRow(`${YEAR}`, "YEAR");
        let meta_percentage = row.getNum("PERCENTAGE");
        let meta_num1 = row.getNum("N_VIZ");
        let meta_num2 = row.getNum("N_COUPLES");
        let meta_sample = row.getNum("SAMPLE");

        select("#meta-percentage").html(nfs(meta_percentage*100, 1, 2) + "%");
        select("#meta-num1").html(nfc(meta_num1));
        if(meta_num2 > 1E6){
            meta_num2 = nfc((meta_num2/1E6), 1)+"M";
        } else {
            meta_num2 = nfc(meta_num2);
        }
        //select("#meta-num2").html(nfc(meta_num2/1E6, 1)+"M");
        select("#meta-num2").html(meta_num2);
        select("#meta-sample").html(meta_sample+"%");
    }

    updateRacesInfo();

    
}

function calculateHeight(){
    let n_ele = int((f_width - 3 * hSpacing) / hSpacing);
    return f_height = ceil(families.length / n_ele) * vSpacing;
}

function draw() {
   
    background(255);
    //text(frameRate(), 30, 30);
    mainGrid(base);
    noLoop();
}

function mouseMoved() {
    let y = mouseY - (mouseY % vSpacing);
    if (y < 0) y = 0;
    select("#lens").position(-(lens_width-f_width)/2, y - lens_height);
    let w = 24 * 2 * hSpacing;
    if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < f_height) {
        select("#marker").position(mouseX - w / 2, y + 5);
        select("#marker").size(24 * 2 * hSpacing, vSpacing);
    }

    if (mouseY < 0 || mouseY > f_height || mouseX < 0 || mouseX > width - 10) {
        select("#marker").hide();
        select("#lens").hide();
    } else {
        select("#marker").show();
        select("#lens").show();

    }

}

function mainGrid(p) {
    let x = hSpacing;
    let y = vSpacing;

    row = new Map();
    mapF.set(y, row);
    for (let f of families) {
        f.draw(p, x, y, 1.25, false);
        row.set(x, f);

        if (x >= f_width - 3 * hSpacing) {

            x = hSpacing;
            y += vSpacing;
            row = new Map();
            mapF.set(y, row);
        } else {
            x += hSpacing;
        }
    }
}

function getFamily(x, y) {
    row = mapF.get(y);
    if (row == undefined) return null;
    return row.get(x);
}

function lensSketch(p) {
    let renderer;

    p.setup = function () {
        renderer = p.createCanvas(lens_width, lens_height);
    }

    p.draw = function () {
        p.clear();
        p.translate((lens_width-f_width)/2, 0);

        p.noStroke();

        p.push();
        let lx = mouseX;
        if (mouseX < hSpacing) lx = hSpacing;
        if (mouseX > lens_width - hSpacing) lx = lens_width - hSpacing;
        p.translate(lx - lens_width / 2, 0);
        p.drawZoom();
        p.pop();

        //p.fill(0);
        //p.text(p.round(p.frameRate()), 20, 20);
    }

    p.drawZoom = function () {

        let x = mouseX - mouseX % hSpacing;
        if (mouseX < hSpacing) x = hSpacing;
        if (mouseX > lens_width - 2 * hSpacing) x = lens_width - 2 * hSpacing;
        let y = mouseY + vSpacing - (mouseY % vSpacing);

        let s = 15;
        let n = 24;

        /* draw families left and right */
        p.push();
        p.scale(s);
        p.translate(lens_width / 2 / s - 1.25 / 2, 11);
        for (let c = -n; c <= n; c++) {
            let xx = x + (hSpacing * c);
            f = getFamily(xx, y);

            if (f != null) {
                p.push();
                p.translate(c * hSpacing, 0);
                f.draw(p, 0, 0, 1, true);
                p.pop();
            } 

        }
        p.pop();

        /* let's get the one at the center */
        let mf = getFamily(x, y);
        if (mf != null) {
            p.fill(0);
            p.textSize(10);
            p.textAlign(LEFT);
            p.textFont(fontBold);

            p.stroke(255);
            p.strokeWeight(4);

            /* races label */
            p.fill(100);
            p.textLeading(11);
            p.text(mf.getRaceLabel() , lens_width / 2 - 20, 15);

            /* kids */
            p.textAlign(LEFT);
            p.fill(100);
            p.strokeWeight(4);
            p.textFont(fontRegular);
            p.stroke(255);
            let child_string;
            if(mf.children.length == 0) child_string = "";
            if(mf.children.length == 1) child_string = "1 chld.";
            if(mf.children.length > 1) child_string = mf.children.length+" chld.";
            p.text(child_string, lens_width / 2 - 20, 42);

            /* serial no. */
            if(DISPLAY_SERIAL){
                p.text(mf.getSerial(), lens_width / 2 - 20, 56);
            }

            /* age grid */
            /*p.stroke(0);
            p.strokeWeight(1);
            //p.ellipse(lens_width/2, 0, )
            p.line(lens_width/2 - 35, 175, lens_width/2 - 35, 30);
            */

        } else {
            return; //exits so that it doesn't draw the bars below when there aren't any families hovered

        }

        /* bottom and top bars */
        p.rectMode(CENTER);
        p.fill(50);
        p.noStroke();
        p.rect(lens_width / 2, 30, 40, 3, 2, 2);
        p.rect(lens_width / 2, lens_height - 4, 40, 3, 2, 2);
    }

}

lens = new p5(lensSketch, "lens");


function maintenance() {
    let el = selectAll(".button-years");
    for(let e of el){
        e.mousePressed(yearClick);
    }
    /*select("#y1860").mousePressed(yearClick);
    //select("#y1860").mousePressed(() => setYear(1860));
    select("#y1880").mousePressed(yearClick);
    select("#y1900").mousePressed(yearClick);
    select("#y1920").mousePressed(() => setYear(1920));
    select("#y1940").mousePressed(() => setYear(1940));
    select("#y1960").mousePressed(() => setYear(1960));
    select("#y1980").mousePressed(() => setYear(1980));
    select("#y2000").mousePressed(() => setYear(2000));
    select("#y2020").mousePressed(() => setYear(2020));*/
}

function yearClick(){
    let el = selectAll(".button-years");
    for(let e of el){
        e.class("button-years");
    }
    let y = int(this.html());
    this.class("button-years selected");
    setYear(y);
}



function keyPressed(){
    if(key == "s") DISPLAY_SERIAL = !DISPLAY_SERIAL;
}

/* race stats */

function updateRacesInfo(){
    selectAll(".race-info").forEach( (e) => e.remove());
    let keys = Object.keys(stats[YEAR]);
    keys.sort( (a, b) => stats[YEAR][a] - stats[YEAR][b]);
    let total = metadata.findRow(`${YEAR}`, "YEAR").getNum("N_VIZ");
    let papi = select("#races-holder");
    for(let rr of keys){
        let info = createDiv().parent(papi).class("race-info");
        let name = unwrap(rr);
        let no = nfs(stats[YEAR][rr]/total * 100, 1, 2)+"%";
        info.html(name + "<br/>" + no);
    }
    function unwrap([...XX]){
        return equiv(XX[0]) + "<br/>" + equiv(XX[1]);

        function equiv(X){
            switch(X){
                case "W": return "White"
                case "N": return "Native"
                case "B": return "Black"
                case "+": return "Mult."
                case "A": return "Asian";
                default: return X;
            }
        }

    }
}






