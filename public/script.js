const socket = io();
room= JSON.parse(room);
let user;
let textarea = document.querySelector('#textarea');
let messagearea = document.querySelector('.message_area')
do{
    user = prompt('Please enter your name');
     user=user.trim();
    if(user){
    socket.emit('joined',room.room ,user)
    }
}while(!user)
var  audio =new Audio('ting.mp3');
socket.emit('join-room',room.room);
textarea.addEventListener('keyup' , e=>{

     socket.emit('typing',room.room,{user :user , message : "typing..." });
    if(e.key === 'Enter')
    {    let v =textarea.value;
        e.preventDefault;
        textarea.value='';
        sendmessage(v);
    }
 
})
function sendmessage(message){
    let msg = {
        user : user,
        message : message.trim()
    }
     socket.emit('message' , room.room,msg);
    appendmessage(msg,'outgoing');
    scrolltobotoom();
  
}

async function appendmessage(msg ,type){
    if(type === 'outgoing')
      { 
          msg.user = 'You'; }
          if(msg.message !== ''){
    let main_div =document.createElement('div');
    main_div.classList.add(type ,'message');
    let markup = `<h4>${msg.user}</h4>
    <p> ${msg.message}</p>`
    main_div.innerHTML = markup;
    messagearea.appendChild(main_div);
      if(type ==='typing')
      {    scrolltobotoom();
        await setTimeout(()=>{main_div.remove();},1000);
         scrolltobotoom();
      }
}
}

socket.on('message', async msg=>{

     if(msg.message !== '')
    {appendmessage(msg,'incoming');
    await audio.play();
    scrolltobotoom();}
})
time =Date.now();
socket.on('typing', msg=>{
    let o =Date.now();
    if(o-1000> time)
    {   time =Date.now();
        appendmessage(msg,'typing');}
})
socket.on('left',async system =>{
         if(system.message !== '')
    {appendmessage(system,'incoming');
    await audio.play();
    scrolltobotoom();}
})
socket.on('join', async system =>{
         if(system.message !== '')
    {appendmessage(system,'incoming');
    await audio.play();
    scrolltobotoom();}
})

function scrolltobotoom(){
    messagearea.scrollTop =messagearea.scrollHeight;
}