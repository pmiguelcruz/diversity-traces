class Family {

  json;
  children = [];
  couple = [];
  p1;
  p2;

  constructor(json) {
    this.json = json;
    for (let o of json.children) {
      this.children.push(new Person(o));
    }

    this.p1 = new Person(json.couple[0]);
    this.p2 = new Person(json.couple[1]);

    this.couple.push(this.p1);
    this.couple.push(this.p2);

    this.ran = random(0, 10);
    //max(this.children.length - ((this.p1.getAge() + this.p2.getAge())/2)/10, 0);
    this.cx = 0;

  }

  dev_x() {
    return map(noise(this.ran + this.cx), 0, 1, -0.5, 0.2);
  }

  update() {
    this.cx += 0.05;
  }

  /*getAgeP1() {
    return couple[0].getAge();
  }
 
 
  getAgeP2() {
    return couple.get(1).getAge();
  }*/

  draw(p, xx, yy, s, draw_i) {
    this.update();

    p.textFont(fontBold);
    p.push();
    p.translate(xx, yy);


    p.strokeWeight(1 * s);




    if (draw_i) {
      p.push();
      p.translate(0, 0.5);
      this.drawInfo(p);
      p.pop();
    }


    /* RIGHT ONE */
    p.push();
    p.translate(1.25, 0);
    p.stroke(this.p2.getColor());

    p.beginShape();
    p.curveVertex(0, 0);
    p.curveVertex(0, 0);
    p.curveVertex(-0.25 - this.dev_x(), -this.p2.getAge() / 2);
    p.curveVertex(0, -this.p2.getAge());
    p.curveVertex(0, -this.p2.getAge());
    p.endShape();

    /* H for hispanics */
    if(this.p2.getHispan()){
      p.textSize(0.5);
      p.textAlign(CENTER);
      p.noStroke();
      p.fill(50);
      p.text("L", 0, -this.p2.getAge()-0.75);
    }

    p.pop();

   

    /* LEFT ONE */
    p.stroke(this.p1.getColor());
  
    p.beginShape();
    p.curveVertex(0, 0);
    p.curveVertex(0, 0);
    p.curveVertex(0.25 + this.dev_x(), -this.p1.getAge() / 2);
    p.curveVertex(0, -this.p1.getAge());
    p.curveVertex(0, -this.p1.getAge());
    p.endShape();

    /* H for hispanics */
    if(this.p1.getHispan()){
      p.textSize(0.5);
      p.textAlign(CENTER);
      p.noStroke();
      p.fill(50);
      p.text("L", 0, -this.p1.getAge()-0.75);
    }

    /* HEAD */
    p.stroke(255, 150);
    p.point(0, -this.p1.getAge());

    /*children */
    for (let child of this.children) {
      let age = child.getAge();
      let c = child.getColor();
      p.stroke(red(c), green(c), blue(c), 150);
      p.noFill();
      p.strokeWeight(0.5 * s);
      drawChild(age, this);

      p.stroke(255, 50);
      p.strokeWeight(0.5 * s / 5);
      drawChild(age, this);
    }

    function drawChild(age, a) {
      p.beginShape();
      p.curveVertex(-0.5, -age);
      p.curveVertex(-0.5, -age);
      p.curveVertex(0.625, -age + 0.25 + a.dev_x());
      p.curveVertex(1.75, -age);
      p.curveVertex(1.75, -age);
      p.endShape();

    }


    /*for (let child of this.children) {
        let age = child.getAge();
        p.strokeWeight(0.1 * s);
        p.stroke(255);
        //p.line(0.5, -age+0.25, 0.75, -age+0.25);
    }*/


    p.pop();

  }


  drawInfo(p) {
    p.textFont(fontBold);
    p.imageMode(CENTER);
    p.push();
    p.textSize(0.8);
    p.noStroke();

    /* the races */
    p.textAlign(CENTER);
    p.strokeWeight(0.2);
    p.stroke(255);
    p.fill(this.p1.getColor());
    p.text(this.p1.getRaceString(), 0, 1);
    p.fill(this.p2.getColor());
    p.text(this.p2.getRaceString(), 1, 1);
    
    /* the gay flag */
    if(this.p1.getSexString() == this.p2.getSexString()){
      p.stroke(0);
      p.image(imgPride, 0.5, 3.25, 0.7, 0.25);
      
    }

    /* le sex */
    p.noStroke();
    let img = this.p1.getSexString() == "M" ? imgM : imgF;
    //print("1 "+imgF.width / 30 + " " + imgF.height / 30);
    //print(img);
    p.image(imgM, 0, 1.75, 0.5, 0.66667);
    img = this.p2.getSexString() == "M" ? imgM : imgF;
    //print("2 "+imgF.width / 30 + " " + imgF.height / 30);
    p.image(img, 1, 1.75, 0.5, 0.66667);

    
    /* the ages */
    p.textFont(fontRegular);
    p.fill(100);
    p.push();
    p.textSize(0.6);
    p.text(this.p1.getAgeRaw(), 0, 3);
    p.text(this.p2.getAgeRaw(), 1, 3);
    p.pop();

    p.pop();
  }


  /*getChildrenString() {
    switch (this.children.length) {
      case 0: return "";
      case 1: return "¹";
      case 2: return "²";
      case 3: return "³";
      case 4: return "⁴";
      case 5: return "⁵";
      case 6: return "⁶";
      case 7: return "⁷";
      case 8: return "⁸";
      case 9: return "⁹";
      default: return "⁹⁺";
    }
  }*/

  /*
  boolean sameRace(){
    return p1.getRaceAggregated() == p2.getRaceAggregated();
  }
 
 
  String getCompareString() {
 
    
    String s1 = getCompareRaceString();
 
    String s2 = ""+children.size();
 
 
    String s3 = int(((p1.getAge() + p2.getAge())/2f))+"";
 
 
 
 
    return s1+s2+s3;
  }
  
  String getCompareRaceString(){
    int c1 = p1.getRaceAggregated()*10 + p2.getRaceAggregated();
    int c2 = p2.getRaceAggregated()*10 + p1.getRaceAggregated();
    int f = min(c1, c2);
    return f+"";
  }
 
  int compareTo(Family f) {
    return this.getCompareString().compareTo(f.getCompareString());
  }*/

  getRaceLabel(){
    let p1s = this.p1.getRaceFullString();
    let p2s = this.p2.getRaceFullString();
    let s1 = p1s < p2s ? p1s : p2s;
    let s2 = p1s > p2s ? p1s : p2s;

    return s1 + "\n" + s2;
  }

  getSerial(){
    return this.json.serial;
  }
}