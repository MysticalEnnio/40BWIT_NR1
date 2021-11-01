/*************************************************
 Copyright © 2021 Ennio Marke
 ____    ____  ____  ____   ______   _________
 |_   \  /   _||_  _||_  _|.' ____ \ |  _   _  |
 |   \/   |    \ \  / /  | (___ \_||_/ | | \_|
 | |\  /| |     \ \/ /    _.____`.     | |
 _| |_\/_| |_    _|  |_   | \____) |   _| |_
 |_____||_____|  |______|   \______.'  |_____|
 *************************************************/
//#region Main
document.addEventListener("DOMContentLoaded", () => {

  //#region darkmode
  const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
  const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;

  if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);

    if (currentTheme == 'dark') {
        toggleSwitch.checked = true;
    }
  }

  function switchTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark'); //add this
    }
    else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light'); //add this
    }    
  }
  
  toggleSwitch.addEventListener('change', switchTheme, false);
  //#endregion

  //#region vars
  var letterRegex = /[a-zA-Z]+/;
  var input;
  const dOutput = document.getElementById("doutput")
  //#endregion

  //#region functions
  //#region tools

  const findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) != index)

  function dlog(data, color) {
    if(typeof data == "string" || typeof data == "number" || typeof data == "boolean" || typeof data == "array") {
      dOutput.innerHTML = dOutput.innerHTML + '<p class="p' + color + '">' + data + '<br>'
    } else if(typeof data == "object") {
      dOutput.innerHTML = dOutput.innerHTML + '<p class="p' + color + '">' + JSON.stringify(data) + "<br>"
    }
  }

  //A B C D E F G H I J  K  L  M  N  O  P  Q  R  S  T  U  V  W  X  Y  Z  
  //1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26
  function alphabetPos(letter) {
    if (!letterRegex.test(letter)) return 0;
    return letter.toUpperCase().charCodeAt(0) - 64;
  }

  function setInptArrayLs(array) {
    localStorage.setItem("InputTxt", JSON.stringify(array));
  }

  function getInptArrayLs() {
    return JSON.parse(localStorage.getItem("InputTxt"));
  }
  //#endregion

  //#region Input
  function getInput() {
    if(localStorage.getItem("InputTxt") == null) {
      if(this.files) {
        readFileAsString(this.files)
      }
    } else {
      if(this.files) {
        readFileAsString(this.files)
      } else {
        input = getInptArrayLs();
        prcInput(input);
      }
    }
  }

  function readFileAsString(files, type) {
    if (files.length === 0) {
      dlog('No file is selected', "red");
      return;
    }

    var reader = new FileReader();

    reader.onload = function (event) {
      input = event.target.result.split('\n')
      setInptArrayLs(input);
      prcInput(input);
    };
    reader.readAsText(files[0]);
  }

  function prcInput(input) {
    //log letter and their position
    dlog(input[0][0] + " alphabetPos: " + alphabetPos(input[0][0]), "green")
    input[0][1] == " " ? dlog(input[0][2] + " alphabetPos: " + alphabetPos(input[0][2]), "green"):dlog(input[0][1] + " alphabetPos: " + alphabetPos(input[0][1]), "green");

    var hCarsNum = ( (alphabetPos(input[0][1]) ? alphabetPos(input[0][1]):alphabetPos(input[0][2])) > alphabetPos(input[0][0]) ?
      alphabetPos(input[0][1] == " " ? input[0][2]:input[0][1]) - alphabetPos(input[0][0]) + 1:
      alphabetPos(input[0][0]) - alphabetPos(input[0][1] == " " ? input[0][2]:input[0][1]) + 1
    );
    dlog("hCarsNum: " + hCarsNum, "green");
    var vCarsNum = input.length - 2;
    dlog("vCarsNum: " + vCarsNum, "green");

    class vCar {
      constructor(id, pos) {
        this.id = id;
        this.pos = pos;
      }
    };
    var vCars = [];
    for (let i = 0; i < vCarsNum; i++) {
      //how to use input var: input[line][letterIndex]
      var car = new vCar(input[i + 2][0], input[i + 2][1] == " " ? input[i + 2][2]:input[i + 2][1]);
      vCars.push(car);
    }
    dlog(vCars, "green")
    if(dlog(checkError(hCarsNum, vCars), "red")) {
      console.log("Errors occured!")
    }
  }

  function checkArrayforDoubles(array) {

  }
  //#endregion

  //#region Error checking
  //#region 
  /*
  Errorcodes:
  101 = Range of Alphabet
  102 = Number of vCars
  103 = Too many vCars
  104 = Double vCar Ids
  105 = Double vCar Pos
  */
  //#endregion
  //#region Main
  function checkError(hCarsNum, vCars) {
    var Errors = [];
    pushErrors(checkErrorL1(), Errors)
    pushErrors(checkErrorL2(hCarsNum), Errors)
    pushErrors(checkErrorVCars(vCars), Errors)
    return Errors;
  }

  function pushErrors(ErrorsTP, Errors) {
    if(!ErrorsTP) return 
    for(let i = 0; i < ErrorsTP.length; i++) {
      Errors.push(ErrorsTP[i])
    }
  }
  //#endregion

  //#region L1
  function checkErrorL1() {
    if (alphabetPos(input[0][0]) < 1 || input[0][1] != " " ? (alphabetPos(input[0][1]) < 1):(alphabetPos(input[0][2]) < 1)) {
      dlog(alphabetPos(input[0][0]), "red")
      
      return ["101"]
    }
  }
  //#endregion

  //#region L2
  function checkErrorL2(hCarsNum) {
    var L2Errors = [];
    if (input[1][0] != input.length - 2) {
      L2Errors.push("102")
    }
    if (hCarsNum < (input[1][0] * 2)) {
      L2Errors.push("103") 
    }
    return L2Errors
  }
  //#endregion

  //#region vCars
  function checkErrorVCars(vCars) {
    var vCarErrors = []
    vCarErrors.push(checkDoubleIdVCars(vCars))
    vCarErrors.push(checkDoublePosVCars(vCars))
    for (let i = 0; i < vCarErrors.length; i++) {
      if(vCarErrors[i] == undefined || vCarErrors[i] == null){
        vCarErrors.splice(i,i+1)
      }
    }
    return vCarErrors
  }
  //#endregion

  //#region vCars Double Errors
  function checkDoubleIdVCars(vCars) {
    var valueArr = vCars.map(function(item){ return item.id });
    if(valueArr.some(function(item, idx){ 
      return valueArr.indexOf(item) != idx 
    })) return "104"
  }

  function checkDoublePosVCars(vCars) {
    var vCarsPos = []
    vCars.map(function(item){ vCarsPos.push(item.pos) });
    dlog(vCarsPos)
    return "105"
  }
  //#endregion
  
  //#endregion

  //#endregion

  //#region eventListener
  document.getElementById('fInput').addEventListener('change', getInput)
  getInput()
  //#endregion

})
//#endregion
/*********************************
       :\     /;               _
      ;  \___/  ;             ; ;
     ,:-"'   `"-:.            / ;
    /,---.   ,---.\         _; /
   ((  |  ) (  |  ))    ,-""_,"
    \`````   `````/""""",-""
     '-.._ v _..-'      )
       / ___   ____,..  \
      / /   | |   | ( \. \
     / /    | |    | |  \ \
     `"     `"     `"    `"
*********************************/