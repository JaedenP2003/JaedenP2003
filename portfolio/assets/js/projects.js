async function loadProjects(){

 const res = await fetch("../projects.json");
 const projects = await res.json();

 window.allProjects = projects;

 renderProjects(projects);
 createFilters(projects);
}

function screenshot(url){
 return `https://api.microlink.io/?url=${url}&screenshot=true&embed=screenshot.url`;
}

function renderProjects(list){

 const container = document.getElementById("projects");
 container.innerHTML="";

 list
 .sort(p=>p.featured?-1:1)
 .forEach(p=>{

   const card=document.createElement("div");

   card.className=`card reveal ${p.featured?"featured":""}`;

   card.innerHTML=`
     <img src="${screenshot(p.url)}">

     <div class="card-content">
       <h3>${p.title}</h3>
       <p>${p.description}</p>

       ${p.tags.map(t=>`<span class="tag">${t}</span>`).join("")}

       <br><br>

       <a href="${p.url}" target="_blank">
         <button class="btn">Visit</button>
       </a>
     </div>
   `;

   container.appendChild(card);
 });

 document.querySelectorAll(".reveal")
 .forEach(el=>observer.observe(el));
}

function createFilters(projects){

 const tags=new Set();

 projects.forEach(p=>p.tags.forEach(t=>tags.add(t)));

 const div=document.getElementById("filters");

 div.innerHTML=`<button class="btn" onclick="filter('All')">All</button>`;

 tags.forEach(t=>{
   div.innerHTML+=
   `<button class="btn" onclick="filter('${t}')">${t}</button>`;
 });
}

function filter(tag){

 if(tag==="All"){
   renderProjects(window.allProjects);
   return;
 }

 renderProjects(
   window.allProjects.filter(p=>p.tags.includes(tag))
 );
}

loadProjects();
