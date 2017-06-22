/*jshint esversion: 6 */
window.PixelPainter = (function(){

  let paint = {};
  const doc = document;
  const body = document.querySelector('body');
  let currentColor = "color";
  let e = event;
  let flag = false;

  paint.getProps = function(props){

    let paletteProps = {};
    paletteProps.idNo = 1;
    paletteProps.columns = 2;
    paletteProps.rows = 30;
    paletteProps.divName = "palette";
    paletteProps.className = "box ";
    paletteProps.fill =  ["black", "white", "brown", "gray", "red", "orange", "yellow", "green", "blue", "indigo", "violet", "purple"];

    let canvasProps = {};
    canvasProps.idNo = 2;
    canvasProps.columns = 50;
    canvasProps.rows = 50;
    canvasProps.divName = "canvas";
    canvasProps.className = "grid ";
    canvasProps.fill = ["white"];

    let eraseButtonProps = {};
    eraseButtonProps.name = "Erase";

    let clearButtonProps = {};
    clearButtonProps.name = "Clear";

    switch (props){
      case "palette":
        return paletteProps;
      case "canvas":
        return  canvasProps;
      case "erase":
        return  eraseButtonProps;
      case "clear":
        return clearButtonProps;
    }
  };

  paint.createButton = function(props){
    let f = function(){};
    if (props[name] == "Erase"){
      f = PixelPainter.erase;
    }
    if (props[name] == "Clear"){
      f = PixelPainter.clear;
    }
    let newButton = doc.createElement("button");
    newButton.setAttribute("id", props.name);
    newButton.innerHTML = props.name;
    newButton.addEventListener("click", f);
    return newButton;
  };


  paint.createGrid = function(props){
    let f = function(){};
    if (props.divName === "palette"){
      f = PixelPainter.loadColor;
    }
    if (props.divName === "canvas"){
      f = PixelPainter.paint;
    }

    let colorNo = 0;
    let propID = props.divName;
    let mainDiv = doc.createElement("div");
    mainDiv.setAttribute("class", propID);
    for (var i = 1; i <= props.rows; i++) {
      let rowDiv = document.createElement("section");
      let cn = props.className + "row " + i;
      rowDiv.setAttribute("class", cn);
      idn = cn.replace(/\s/gi, "_");
      rowDiv.setAttribute("id", idn);


      for (var j = 1; j <= props.columns; j++){
          let colDiv = document.createElement("div");
          let cn = props.className + "row " + i + " col " + j;
          colDiv.setAttribute("class", cn);
          idn = cn.replace(/\s/gi, "_");
          colDiv.setAttribute("id", idn);

          var myColor = "";
          if (props.fill[colorNo] === undefined && props.idNo === 1) {
            myColor = generateColor();
          }
          else if (props.idNo === 1) {
            myColor = props.fill[colorNo];
          }
          else {
            myColor = "white";
          }

          colDiv.setAttribute("style", "background-color:" + myColor);
          let func = "";
          if (propID === "palette") {
            let f = this.assignColor;
            colDiv.addEventListener("click", f);
          }
          if (propID === "canvas") {
            let f = this.paint;
            colDiv.addEventListener("mousedown", f);
            colDiv.addEventListener("mousemove", f);
            colDiv.addEventListener("mouseup", f);
          }
          rowDiv.append(colDiv);
          colorNo++;
        }
      mainDiv.append(rowDiv);
    }
    return mainDiv;
  };

  paint.setColor = function(color){
    console.log(color);
    currentColor = color;
  };

  paint.getColor = function(){
    return currentColor;
  };

  paint.loadColor = function(e){
        currentColor = e.currentTarget.style.getPropertyValue("background-color");
        PixelPainter.setColor(currentColor);
  };

  paint.paint = function(e){
    if (e.type == "mousedown"){
      console.log("Mouse Down");
      e.target.style.setProperty("background-color", PixelPainter.getColor());
      flag = true;
    } else if (e.type == "mousemove") {
      console.log("Mouse Move");
      if (flag) { e.target.style.setProperty("background-color", PixelPainter.getColor()); }
    } else if (e.type == "mouseup"){
      console.log("Mouse Up");
      flag = false;
    }
  };

  paint.clear = function(e){
    var gridDivs = doc.getElementsByClassName("grid");
    i = gridDivs.length;
    while (i--){
      gridDivs[i].style.backgroundColor = "white";
    }
  };

  paint.erase = function(e){
    PixelPainter.setColor("white");
  };

  function generateColor() {
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);
    return "rgb(" + r + "," + g + "," + b + ")";
  }

  return paint;

})();

let myButton = PixelPainter.createButton(PixelPainter.getProps("erase"));
document.body.appendChild(myButton);
myButton = PixelPainter.createButton(PixelPainter.getProps("clear"));
document.body.appendChild(myButton);
document.body.appendChild(PixelPainter.createGrid(PixelPainter.getProps("palette")));
document.body.appendChild(PixelPainter.createGrid(PixelPainter.getProps("canvas")));