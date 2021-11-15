/*************************************************
 Copyright © 2021 Ennio Marke
 ____    ____  ____  ____   ______   _________
 |_   \  /   _||_  _||_  _|.' ____ \ |  _   _  |
 |   \/   |    \ \  / /  | (___ \_||_/ | | \_|
 | |\  /| |     \ \/ /    _.____`.     | |
 _| |_\/_| |_    _|  |_   | \____) |   _| |_
 |_____||_____|  |______|   \______.'  |_____|

 vCar = vertical Car
 hCar = horizontal Car
 how to use input var: input[line][letterIndex]
 *************************************************/
//#region Main
document.addEventListener("DOMContentLoaded", () => {

  //#region darkmode
  //get toggleSwitch from DOM and currentTheme from Local storage
  const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
  const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;

  //check if localstorage theme is darkmode
  if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);

    if (currentTheme == 'dark') {
        toggleSwitch.checked = true;
    }
  }

  //switch theme to dark or lightmode
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
  
  //add event listener for the theme switch
  toggleSwitch.addEventListener('change', switchTheme, false);
  //#endregion

  //#region vars
  //Regex to check if input is letter
  var letterRegex = /[a-zA-Z]+/;
  //Regex to check if input is number
  var numberRegex = /[1-26]/;
  //define input variable
  var input;
  //define get DOM output element
  const dOutput = document.getElementById("doutput")
  //#endregion

  //#region functions
  //#region tools

  //find duplicates in an array
  const findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) != index)

  //function from other code (may come in usefull later)
  function searchPageObj(toFind) {
    return Object.values(Pages).find((obj) => {
            return obj.psw == toFind
    });
  }

  //log input to DOM output element
  //data: input to log to output
  //color: color of output text (defined in ../css/style.css:60-68)
  //noLN(no line number): when true not show line of calling function after output
  function dlog(data, color, noLN) {
    //check if noLN got defined. If not set it to false
    var noLN = noLN || false
    //generate new error message to get line from calling function
    var e = new Error();
    //modify output to only show line number
    var frame = e.stack.split("\n")[2].split(":");
    var lineNumber = frame[1] == "///C" ? frame[3]:frame[1];
    //check if input is object. When input is object stingify it to be able to log it
    if(typeof data == "string" || typeof data == "number" || typeof data == "boolean" || typeof data == "array") {
      //add input to output elemnt with params
      dOutput.innerHTML = `${dOutput.innerHTML}<p class="p${color}">${data}${noLN == true? "":` (${lineNumber})` }<br>`
    } else if(typeof data == "object") {
      //add strinified input to output elemnt with params
      dOutput.innerHTML = dOutput.innerHTML + '<p class="p' + color + '">' + JSON.stringify(data) + ' (' + lineNumber + ')' + "<br>"
    }
  }

  //return the position of a given number in alphabet
  function alphabetPos(letter) {
    if (!letterRegex.test(letter)) return 0;
    return letter.toUpperCase().charCodeAt(0) - 64;
  }

  //check alphabet letter of given number(can be 1-26)
  function alphabetLetter(number) {
    //if(alphabetLetter > 0 && alphabetLetter < 27)
    //if (!numberRegex.test(number)) return 0;
    return String.fromCharCode(number+64);
  }

  //save array to local storage
  function setInptArrayLs(array) {
    localStorage.setItem("InputTxt", JSON.stringify(array));
  }

  //get array from local storage
  function getInptArrayLs() {
    return JSON.parse(localStorage.getItem("InputTxt"));
  }
  //#endregion

  //#region Input
  //check if array has been previousley saved to local storage or array has been uploaded using input.
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

  //read a file as string (unexpected XD)
  function readFileAsString(files, type) {
    //check 
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

  //prc txt input
  function prcInput(input) {

    //bad code to get the number of horizontal Cars
    var hCarsNum = ( (alphabetPos(input[0][1]) ? alphabetPos(input[0][1]):alphabetPos(input[0][2])) > alphabetPos(input[0][0]) ?
      alphabetPos(input[0][1] == " " ? input[0][2]:input[0][1]) - alphabetPos(input[0][0]) + 1:
      alphabetPos(input[0][0]) - alphabetPos(input[0][1] == " " ? input[0][2]:input[0][1]) + 1
    );
    //good to Code to get number of horizontal Cars
    var vCarsNum = input.length - 2;

    //define the class for the vertical Car
    class vCar {
      constructor(id, pos) {
        this.id = id;
        this.pos = pos;
      }
    };
    //define the vertical Cars Array, where all vertical cars are getting stored
    var vCars = [];
    //push every vertical Car from input txt to vertical car object
    for (let i = 0; i < vCarsNum; i++) {
      var car = new vCar(input[i + 2][0], input[i + 2][1] == " " ? input[i+2].slice(2, input[i+2].length):input[i+2].slice(1, input[i+2].length));
      vCars.push(car);
    }
    //check for Errors in input file
    var Errors = checkError(hCarsNum, vCars);
    //log the Errors to DOM output
    dlog(Errors, "red")
    //log the Errors to console
    if(Errors.length > 0) {
      console.error("Errors occured: \n" + Errors)
    }
    //generate steps vertical cars need to take to free horizontal cars
    generateOutput(hCarsNum, vCars)
  }
  //#endregion

  //#region Output

  var steps;
  //generate which cars to move where
  function generateOutput(hCarsNum, vCars) {
    var vCarsPos = [];
    vCars.map((item)=>{vCarsPos.push(item.pos)});
    vCarsPos = vCarsPos.map((item)=>{ return parseInt(item) }).sort((a, b) => a - b)

    //generate vCars Ids
    dlog(vCars)
    var vCarsIds = []
    vCars.map(item=>vCarsIds.push(item.id))
    
    //generate hCars Ids
    dlog(hCarsNum)
    var hCarsIds = [];
    for (let i = 0; i < hCarsNum; i++) {
      hCarsIds.push(alphabetLetter(i+1))
    }

    //generate steps for every car to free a car
    dlog(hCarsIds)
    for (let i = 0; i < hCarsIds.length; i++) {
      generateSteps(hCarsIds[i], i, vCarsPos)
    }
  }

  //generate steps for a cars need to move to get another car out
  function generateSteps(id, idPos, vCarsPos) {
    steps = []
    //check if Car is in front of other Car
    if(vCarsPos.filter((item)=>{return (idPos - item)>=0 && (idPos - item)<2 }).length > 0) {
      canMoveCar("left", vCarsPos, idPos)
      steps.push("!")
    } 

    dlog(id + ": " + steps, undefined, 1)
  }

  //check if car front or back is at vCarPos
  function checkCarSide(vCarsPos, vCarPos) {

  }

  //check if car can move
  function canMoveCar(direction,  vCarsPos, vCarPos, times) {
    times = times ?? 1
    switch (direction) {
      case "left":
        console.log(vCarPos)
        vCarsPos.find(e => e == vCarPos) == undefined ? vCarPos -= 1:""
        
        break;
      case "right":

        break;
    }
    var vCarsPosErrors = [];
    vCarsPos = vCarsPos.map((item)=>{ return parseInt(item) }).sort((a, b) => a - b)
    vCarsPosErrors = vCarsPos.filter((pos, i)=>{ return vCarsPos[i+1]-pos < 2})
    for (let i = 0; i < vCarsPos.length; i++) {
      if(vCarsPos[i+1] - i < 2) vCarsPosErrors.push(i+1)

    }
    if(vCarsPosErrors.length > 0)
    return 0
    else
    return 1
  }

  function logStep(step) {
    steps.push(step)
  }

  //#endregion

  //#region Error checking
  //#region Errorcodes
  /*
  101 = Range of Alphabet (First line)
  102 = Number of vCars (Second line)
  103 = Too many vCars (Third to last line)
  104 = Double vCar Ids (Third to last line)
  105 = Double vCar Pos (Third to last line)
  */
  //#endregion
  //#region Main
  //check for Errors
  function checkError(hCarsNum, vCars) {
    var Errors = [];
    pushErrors(checkErrorL1(), Errors)
    pushErrors(checkErrorL2(hCarsNum), Errors)
    pushErrors(checkErrorVCars(vCars), Errors)
    return Errors;
  }

  //push Errors to Error array
  function pushErrors(ErrorsTP, Errors) {
    if(!ErrorsTP) return 
    for(let i = 0; i < ErrorsTP.length; i++) {
      Errors.push(ErrorsTP[i])
    }
  }
  //#endregion

  //#region L1
  //check for Errors in Line 1
  function checkErrorL1() {
    if (alphabetPos(input[0][0]) < 1 || input[0][1] != " " ? (alphabetPos(input[0][1]) < 1):(alphabetPos(input[0][2]) < 1)) {
      dlog(alphabetPos(input[0][0]), "red")
      return ["101"]
    }
  }
  //#endregion

  //#region L2
  //check for Errors in Line 2
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
  //check for Errors in the vertical Cars
  function checkErrorVCars(vCars) {
    var vCarErrors = []
    vCarErrors.push(checkDoubleIdVCars(vCars))
    vCarErrors.push(checkDoublePosVCars(vCars)) 
    for (let i = 0; i < vCarErrors.length; i++) {
      if(vCarErrors[i] == undefined || vCarErrors[i] == null){
        vCarErrors.splice(i,i+1)
        i--
      }
    }
    return vCarErrors
  }
  //#endregion

  //#region vCars Double Errors
  //check for Double vCar Ids
  function checkDoubleIdVCars(vCars) {
    var valueArr = vCars.map(function(item){ return item.id });
    if(valueArr.some(function(item, idx){ 
      return valueArr.indexOf(item) != idx 
    })) return "104"
  }

  //check if one vCar is in another
  function checkDoublePosVCars(vCars) {
    var vCarsPos = []
    var vCarsPosErrors = []
    vCars.map((item)=>{vCarsPos.push(item.pos)});
    vCarsPos = vCarsPos.map((item)=>{ return parseInt(item) }).sort((a, b) => a - b)
    vCarsPosErrors = vCarsPos.filter((pos, i)=>{ return vCarsPos[i+1]-pos < 2})
    for (let i = 0; i < vCarsPos.length; i++) {
      if(vCarsPos[i+1] - i < 2) vCarsPosErrors.push(i+1)

    }
    if(vCarsPosErrors.length > 0)
    return "105"
  }
  //#endregion
  
  //#endregion

  //#endregion

  //#region eventListener
  //add event listener to check if files got inputed
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