// DOM Methods

let title = document.getElementById("title");
let buttons = document.getElementsByTagName("button");
let inputs = document.getElementsByClassName("input");
let image = document.querySelector("#productImg");
let list = document.querySelectorAll("li");

// Theme Switch
document.getElementById("themeBtn").onclick = function(){
    document.body.classList.toggle("dark");
};

// Change Image
document.getElementById("changeImage").onclick = function(){

    image.src="D:\\Subjects\\ITUS102_WTF\\test_code\\test\\dept.png";
};

// Key Events
let nameBox=document.getElementById("name");

nameBox.onkeydown=function(){
    document.getElementById("message").innerHTML="Typing...";
};

nameBox.onkeyup=function(){
    document.getElementById("message").innerHTML=
    "Welcome "+nameBox.value;
};

// Change Event
document.getElementById("category").onchange=function(){

document.getElementById("categoryText").innerHTML=
"Selected : "+this.value;

};

// Mouse Events
image.onmouseover=function(){

image.style.border="5px solid red";

};

image.onmouseout=function(){

image.style.border="2px solid black";

};

// Double Click Event
title.ondblclick=function(){

title.innerHTML="Welcome to ShopEase!";

};

// Create Element
document.getElementById("addItem").onclick=function(){

let item=document.createElement("li");

item.innerHTML="New Product";

document.getElementById("productList").appendChild(item);

};

// Remove Element
document.getElementById("removeItem").onclick=function(){

let list=document.getElementById("productList");

if(list.lastElementChild){

list.removeChild(list.lastElementChild);

}

};