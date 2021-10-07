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

  //#region vars
  var letterRegex = /[a-zA-Z]+/;
  var input;
  const dOutput = document.getElementById("doutput")
  //#endregion

  //#region functions
  //#region tools
  const findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) != index)

  function dlog(data) {
    console.log(typeof data)
    if(typeof data == "string" || typeof data == "number" || typeof data == "boolean" || typeof data == "array") {
      console.log("S1")
      dOutput.innerHTML = dOutput.innerHTML + data + "<br>"
    } else if(typeof data == "object") {
      dOutput.innerHTML = dOutput.innerHTML + JSON.stringify(data) + "<br>"
    }
  }

  //A B C D E F G H I J  K  L  M  N  O  P  Q  R  S  T  U  V  W  X  Y  Z  
  //1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26
  function alphabetPos(letter) {
    if (!letterRegex.test(letter)) return;
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
      dlog('No file is selected');
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
    dlog(input[0][0] + " alphabetPos: " + alphabetPos(input[0][0]))
    input[0][1] == " " ? dlog(input[0][2] + " alphabetPos: " + alphabetPos(input[0][2])):dlog(input[0][1] + " alphabetPos: " + alphabetPos(input[0][1]));

    var hCarsNum = ( (alphabetPos(input[0][1]) ? alphabetPos(input[0][1]):alphabetPos(input[0][2])) > alphabetPos(input[0][0]) ?
      alphabetPos(input[0][1] == " " ? input[0][2]:input[0][1]) - alphabetPos(input[0][0]) + 1:
      alphabetPos(input[0][0]) - alphabetPos(input[0][1] == " " ? input[0][2]:input[0][1]) + 1
    );
    dlog(hCarsNum);
    var vCarsNum = input.length - 2;
    dlog(vCarsNum);

    class vCar {
      constructor(id, pos) {
        this.id = id;
        this.pos = pos;
      }
    };
    var vCars = [];
    for (let i = 0; i < vCarsNum; i++) {
      var car = new vCar(input[i + 2][0], input[i + 2][1] == " " ? input[i + 2][2]:input[i + 2][1]);
      vCars.push(car);
    }
    dlog(vCars)
    if (checkError(vCars)) {
      dlog(checkError(vCars));
    }
  }

  function checkArrayforDoubles(array) {

  }
  //#endregion

  //#region Error checking
  //#region 
  /*
  Errorcodes:
  101 = Range
  */
  //#endregion
  //#region Main
  function checkError(vCars) {
    var Errors = [];
    var L1Errors = checkErrorL1(vCars);
    if (L1Errors)
      if (L1Errors.length > 1)
        for (let i = 0; i < L1Errors.length; i++) {
          Errors.push(L1Errors[i]);
        }

    return 0
  }
  //#endregion

  //#region L1
  function checkErrorL1() {
    if (alphabetPos(input[0][0]) < 2 || alphabetPos(input[0][1]) < 2) return 101
  }
  //#endregion

  //#region L2
  function checkErrorL2() {

  }
  //#endregion

  //#region vCars
  function checkErrorVCars(vCars) {
    var vCarsIds = [];
    for (let i = 0; i < vCars.length; i++) {
      vCarsIds.push(vCars[i].id);
    }
    if (findDuplicates(vCarsIds)[0] != undefined) return 101;
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