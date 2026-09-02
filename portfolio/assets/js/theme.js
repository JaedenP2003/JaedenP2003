const toggle = document.getElementById("themeToggle");

const saved = localStorage.getItem("theme");

if(saved){
 document.documentElement.setAttribute("data-theme", saved);
}

toggle?.addEventListener("click",()=>{

 const current = document.documentElement.getAttribute("data-theme");

 if(current==="dark"){
   document.documentElement.removeAttribute("data-theme");
   localStorage.setItem("theme","light");
 }else{
   document.documentElement.setAttribute("data-theme","dark");
   localStorage.setItem("theme","dark");
 }

});
