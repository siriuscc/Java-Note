
window.onload=function(){


    var olmg=document.getElementsByTagName('img');
    for(var i=0;i<olmg.length;++i){
        if(olmg[i].parentElement.localName=="p"){
            olmg[i].parentElement.style.textAlign="center";

            var item=document.createElement("span");
            item.innerText=olmg[i].getAttribute("alt");
            item.setAttribute("class","s-img-alt");  
            olmg[i].parentElement.append(item);
        }
    }
    
}
