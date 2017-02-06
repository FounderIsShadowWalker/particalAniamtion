var basicUnit = 10,
    BasicUnitWidth = 20,
    BasicUnitHeight = 20;

var container = document.getElementById('container'),
    button = document.getElementsByTagName('button')[0],
    img = document.getElementsByTagName('img')[0],
    domArray = [],

    containerWidth = getCssNoUnit(container, "width") ,
    widthNum = containerWidth / BasicUnitWidth,
    containerHeight = getCssNoUnit(container, "height"),
    heightNum = containerHeight / BasicUnitHeight,
    containerTop = container.getBoundingClientRect().top,
    containerLeft = container.getBoundingClientRect().left,
    center = {
        x:  containerWidth / 2,
        y:  containerHeight / 2,
    },
    centerArray = [];


    function getCss(elem, attr){
        return window.getComputedStyle(elem, null)[attr];
    }

    function getCssNoUnit(elem, attr){
        return window.getComputedStyle(elem, null)[attr].replace(/[a-zA-Z]/g, "") * 1;
    }

    function getUnitBackgroundPositionAndCenter(num, widthNum, heightNum){
        var top = Math.floor(num / widthNum);
        var left = num % widthNum;

        centerArray.push({
            left: left * BasicUnitWidth + BasicUnitWidth / 2,
            top:  top * BasicUnitHeight + BasicUnitHeight / 2,
            k: (top - center.y) / (left - center.x),
        })
        return {
            top : -1 * top * BasicUnitHeight,
            left: -1 * left * BasicUnitWidth
        }
    }
    function  insertNewUnit(){
        var  num = widthNum * heightNum;
        var frx = document.createDocumentFragment();
        for(var i=0; i<num; i++){
            var tempoDiv = document.createElement('div');
            var position = getUnitBackgroundPositionAndCenter(i, widthNum, heightNum);
            tempoDiv.className = "inner";
            tempoDiv.style.width = BasicUnitWidth + "px";
            tempoDiv.style.height = BasicUnitHeight + "px";
            tempoDiv.style.backgroundPosition = "" + position.left + "px " + position.top + "px";

            domArray.push(tempoDiv);
            frx.appendChild(tempoDiv);
        }
        container.appendChild(frx);
    }


function shuffle(){
    var aArr = domArray;
    var iLength = aArr.length,
        i = iLength,
        mTemp,
        iRandom;

    while(i--){
        if(i !== (iRandom = Math.floor(Math.random() * iLength))){
            mTemp = aArr[i];
            aArr[i] = aArr[iRandom];
            aArr[iRandom] = mTemp;
        }
    }

    return aArr;
}

   button.onclick = function() {
       img.parentNode.removeChild(img);
       insertNewUnit();

       console.log(centerArray[0]);
       console.log(center);


       shuffle();

       domArray.forEach(function(item , index) {
               //if (index == 295) {
                   var count = 0,
                       tempDom = domArray[index],
                       left = tempDom.offsetLeft,
                       top = tempDom.offsetTop,
                       k = centerArray[index].k,
                       xDirection,
                       yDirection,
                       allDistance = 0,
                       allOpacity = 1;

                   if(left < center.x){
                       xDirection = 1;
                   }else{
                       xDirection = -1;
                   }
                   if(top < center.y){
                       yDirection = 1;
                   }else{
                       yDirection = -1;
                   }

                   var flag = setInterval(function () {

                       var distance = Math.round(Math.random() * 30),
                           randomDirection = 1;

                       var randomOpacity = Math.random() / 1.5;

                       tempDom.style.transform = "scale(" + randomOpacity * 3 + ")";
                       allDistance += distance;
                       allOpacity -= randomOpacity;

                       left = 0 - allDistance * xDirection * randomDirection;
                       top = 0 - allDistance * yDirection * randomDirection;

                       tempDom.style.left = left + "px";
                       tempDom.style.top = top + 'px';
                       tempDom.style.opacity = allOpacity;
                       count ++;
                       if (allOpacity < 0 || tempDom.getBoundingClientRect().left <= 0 || tempDom.getBoundingClientRect().top <= 0) {
                           flag = null || clearInterval(flag);
                       }
                   }, 2);
               }
           //}
       )
   }

