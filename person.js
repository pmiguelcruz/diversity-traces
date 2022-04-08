class Person {

    json;

    constructor(json) {
        this.json = json;
    }

    getAge() {
        let a = this.json.AGE;
        return sqrt(a);
    }

    getRace() {
        return this.json.RACE;
    }

    getSex() {
        return this.json.SEX;
    }

    getRaceAggregated() {
        //let h = this.getHispan();
        //if (h == 1) return 5;
        return this.getRaceAggregated_();
    }

    getRaceAggregated_() {
        let r = this.json.RACE;
        switch (r) {
            case 1:
                return 1;
            case 2:
                return 2;
            case 3:
                return 3;
            case 4:
                return 4;
            case 5:
                return 4;
            case 6:
                return 4;
            case 7:
                return 7;
            case 8:
                return 7;
            case 9:
                return 7;
            default:
                //println("nada "+r);
                return 1;
        }
    }

    getHispan() {
        let h = this.json.HISPAN;
        if (h == 0 || h == 9) return 0;
        else return 1;
    }

    getRaceString() {
        switch (this.getRaceAggregated_()) {
            case 1:
                return "W";
            case 2:
                return "B";
            case 3:
                return "N";
            case 4:
                return "A";
            case 7:
                return "+";
        }

        return "";
    }

    getRaceFullString() {
        switch (this.getRaceAggregated()) {
            case 1:
                return "WHITE";
            case 2:
                return "BLACK";
            case 3:
                return "NATIVE";
            case 4:
                return "ASIAN";
            case 5:
                return "HISPAN."
            case 7:
                return "MULT.";
        }
        return "";
    }

    getSexString() {
        if (this.getSex() == 1) return "M";
        else return "F";
    }


    getColor() {
        let c = 0;

        switch (this.getRaceAggregated()) {
            case 1: //white
                c = c_yellow;
                break;
            case 2: //black
                c = c_red;
                break;
            case 3: //native
                c = c_green;
                break;
            case 4: //asian
                c = c_violet;
                break;
            case 5: //hispanic
                c = c_orange;
                break;
            case 7: //many or nec
                c = c_blue;
                break;
            default:
                c = 0;
        }

        return c;
    }

    getSexColor() {
        return 0;
    }

    getSexColor(p) {
        if (this.getSex() == p.getSex()) return 0;
        else return color(100);
    }


    getAgeRaw() {
        return this.json.AGE;
    }


}