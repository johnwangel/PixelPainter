/*jshint esversion: 6 */
window.PixelPainter = (function(doc){

  let paint = {};
  const body = document.querySelector('body');
  let currentColor = "color";
  let flag = false;


  paint.setColor = function(color){
    console.log(color);
    currentColor = color;
  };

  paint.getColor = function(){
    return currentColor;
  };

  let getProps = function(props){

    const paletteProps = {
      idNo : 1,
      columns : 2,
      rows : 30,
      divName : "palette",
      className : "box ",
      fill : ["black", "white", "brown", "gray", "red", "orange", "yellow", "green", "blue", "indigo", "violet", "purple"],
      listener : function(e) {
         currentColor = e.currentTarget.style.getPropertyValue("background-color");
         paint.setColor(currentColor);
        }
      };

    const canvasProps = {
      idNo : 2,
      columns : 50,
      rows : 50,
      divName : "canvas",
      className : "grid ",
      fill : ["white"],
      listener :  function(e){
        if (e.type == "mousedown"){
          console.log("Mouse Down");
          e.target.style.setProperty("background-color", paint.getColor());
          flag = true;
        } else if (e.type == "mousemove") {
          console.log("Mouse Move");
          if (flag) { e.target.style.setProperty("background-color", paint.getColor()); }
        } else if (e.type == "mouseup"){
          console.log("Mouse Up");
          flag = false;
        }
      }
    };

    const eraseButtonProps = {
      name : "Erase",
      listener : function(e){
        paint.setColor("white");
      }
    };

    const clearButtonProps = {
      name : "Clear",
      listener :  function(e){
        var gridDivs = doc.getElementsByClassName("grid");
        i = gridDivs.length;
        while (i--){
          gridDivs[i].style.backgroundColor = "white";
        }
      }
    };

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

  let createButton = function(props){
    let f = function(){};
    if (props[name] == "Erase"){
      f = this.erase;
    }
    if (props[name] == "Clear"){
      f = this.clear;
    }
    let newButton = doc.createElement("button");
    newButton.setAttribute("id", props.name);
    newButton.innerHTML = props.name;
    newButton.addEventListener("click", props.listener);
    return newButton;
  };

  let createGrid = function(props){
    let f = function(){};
    if (props.divName === "palette"){
      f = this.loadColor;
    }
    if (props.divName === "canvas"){
      f = this.paint;
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
            colDiv.addEventListener("click", props.listener);
          }
          if (propID === "canvas") {
            let f = this.paint;
            colDiv.addEventListener("mousedown", props.listener);
            colDiv.addEventListener("mousemove", props.listener);
            colDiv.addEventListener("mouseup", props.listener);
          }
          rowDiv.append(colDiv);
          colorNo++;
        }
      mainDiv.append(rowDiv);
    }
    return mainDiv;
  };

  let myButton = createButton(getProps("erase"));
  document.body.appendChild(myButton);
  myButton = createButton(getProps("clear"));
  document.body.appendChild(myButton);
  document.body.appendChild(createGrid(getProps("palette")));
  document.body.appendChild(createGrid(getProps("canvas")));


  function generateColor() {
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);
    return "rgb(" + r + "," + g + "," + b + ")";
  }

  return paint;

})(document);
