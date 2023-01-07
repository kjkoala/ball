(()=>{"use strict";var e,i={418:(e,i,s)=>{const t=s.p+"img/bc41b2c558b848184bf3.png",a=s.p+"img/e957a99c1239d974565e.png";class h{constructor(e,i,s){this.game=e,this.image=new Image,this.image.src=t,this.coinShadow=new Image,this.coinShadow.src=a,this.frameSize=16,this.coinY=this.game.cubeSize*s+this.frameSize,this.x=i,this.y=s,this.angle=0,this.va=.35,this.markedForDelete=!1}update(){this.angle+=this.va,this.coinY+=Math.sin(this.angle)}draw(e){const i=this.game.cubeSize*this.x+this.frameSize,s=this.game.cubeSize*this.y+this.frameSize;e.drawImage(this.coinShadow,i,s),e.drawImage(this.image,i,this.coinY)}}const r="ArrowDown",n="ArrowUp",o="ArrowLeft",l="ArrowRight",m=[r,n,o,l,"Enter"];class y{constructor(e){this.game=e,this.keys=new Set,window.addEventListener("keydown",(e=>{m.includes(e.key)&&!this.keys.has(e.key)&&(this.keys.add(e.key),this.game.socket.emit("keypress",{key:e.key,x:this.game.player.x,y:this.game.player.y}))})),window.addEventListener("keyup",(e=>{m.includes(e.key)&&(this.keys.delete(e.key),this.game.socket.emit("keyup",{key:e.key,x:this.game.player.x,y:this.game.player.y}))}))}}const c=s.p+"img/ff9475fb4e1003ea33cc.png",d=s.p+"img/38759158159257bf1c21.png",p={minX:0,maxX:12,minY:3,maxY:10,blockedSpaces:["6x3","7x5","8x5","9x5","3x6","4x6","5x6","6x8","7x8","8x8","11x9","0x10"]};class u{constructor(e,i,s,t,a,h){this.game=e,this.userID=a,this.image=new Image,this.image.src=c,this.shadowImage=new Image,this.shadowImage.src=d,this.frameSize=16,this.frameX=16,this.frameY=16*h,this.x=s,this.y=t,this.pixelX=this.game.cubeSize*this.x+this.frameSize,this.pixelY=this.game.cubeSize*this.y+this.frameSize,this.movingPixelsX=this.game.cubeSize*this.x+this.frameSize,this.movingPixelsY=this.game.cubeSize*this.y+this.frameSize,this.playerCoins=0,this.playerDisplay=this.userNameDisplay(),this.playerName=i,this.serverPlayerKey={keys:new Set}}update(e){e&&this.move(e),this.moveOtherPlayer(),this.pixelX<this.movingPixelsX?this.pixelX+=this.game.speed:this.pixelX>this.movingPixelsX&&(this.pixelX-=this.game.speed),this.pixelY<this.movingPixelsY?this.pixelY+=this.game.speed:this.pixelY>this.movingPixelsY&&(this.pixelY-=this.game.speed)}moveOtherPlayer(e,i){"keypress"===e?(this.x=i.x,this.y=i.y,this.serverPlayerKey.keys.add(i.key)):"keyup"===e&&this.serverPlayerKey.keys.delete(i.key),this.move(this.serverPlayerKey)}move(e){e.keys.has(l)&&this.pixelX===this.movingPixelsX&&(this.checkCollision("x",this.x+1),this.frameX=this.frameSize),e.keys.has(o)&&this.pixelX===this.movingPixelsX&&(this.checkCollision("x",this.x-1),this.frameX=0),e.keys.has(r)&&this.pixelY===this.movingPixelsY&&this.checkCollision("y",this.y+1),e.keys.has(n)&&this.pixelY===this.movingPixelsY&&this.checkCollision("y",this.y-1)}checkCollision(e,i){if(p.blockedSpaces.includes("x"===e?`${i}x${this.y}`:`${this.x}x${i}`))return!1;"x"===e&&i<=p.maxX&&i>=p.minX&&(this.movingPixelsX=this.game.cubeSize*i+this.frameSize,this.x=i),"y"===e&&i<=p.maxY&&i>=p.minY&&(this.movingPixelsY=this.game.cubeSize*i+this.frameSize,this.y=i)}checkCoinsCollision(){this.game.coins.forEach((e=>{e.x===this.x&&e.y===this.y&&(e.markedForDelete=!0,this.playerCoins+=1)}))}userNameDisplay(){const e=document.createElement("div");return e.className="player_display",document.body.append(e),e}delete(){this.playerDisplay.remove()}draw(e){this.playerDisplay.innerHTML=`<div><span>${this.playerName}: </span><span class="player_coin">${this.playerCoins}</span></div>`,this.playerDisplay.style.transform=`translate(${this.pixelX}px, ${this.pixelY}px)`,e.drawImage(this.shadowImage,this.pixelX,this.pixelY+2),e.drawImage(this.image,this.frameX,this.frameY,this.frameSize,this.frameSize,this.pixelX,this.pixelY,this.frameSize,this.frameSize)}}const x=()=>{const e={x:Math.round(Math.random()*p.maxX+p.minX),y:Math.floor(Math.random()*(p.maxY-p.minY+1)+p.minY)};return p.blockedSpaces.includes(`${e.x}x${e.y}`)?x():e};const g=(0,s(992).io)("https://diglav.ru",{autoConnect:!1}),f=prompt("Enter Username");if(f){const{x:e,y:i}=x();g.auth={username:f,x:e,y:i},g.connect(),g.on("user disconnected",(e=>{console.log("userID",e)}))}const v=document.createElement("canvas"),k=v.getContext("2d");document.body.append(v);const w=new class{constructor(e,i){this.width=e,this.height=i,this.speed=2,v.width=e,v.height=i,this.fps=59,this.frameInterval=1e3/this.fps,this.frameTimer=0,this.cubeSize=16,this.socket=g,this.keys=new y(this),this.player=null,this.players=new Set,this.coins=new Set}addNewPlayer(e){this.player=new u(this,e.username,e.x,e.y,e.userID,0)}userMove(e,i){this.players.forEach((s=>{s.userID===i.userID&&s.moveOtherPlayer(e,i)}))}addPlayer(e){this.players.add(new u(this,e.username,e.x,e.y,e.userID,1))}addPlayers(e){e.forEach((e=>{this.players.add(new u(this,e.username,e.x,e.y,e.userID,1))}))}disconnectPlayer(e){this.players.forEach((i=>{i.userID===e&&(i.delete.call(i),this.players.delete(i))}))}addCoin({x:e,y:i}){this.coins.add(new h(this,e,i))}update(e){this.player&&this.player.update(this.keys),this.players.forEach((e=>e.update())),this.coins.forEach((i=>{i.markedForDelete&&this.coins.delete(i),i.update(e)}))}draw(e){this.coins.forEach((i=>i.draw(e))),this.player&&this.player.draw(e),this.players.forEach((i=>i.draw(e)))}}(240,208);g.on("user connected",w.addPlayer.bind(w)),g.on("users",(e=>{w.addPlayers(e),w.addNewPlayer({username:g.auth.username,x:g.auth.x,y:g.auth.y,userID:g.id})})),g.on("usermove",w.userMove.bind(w,"keypress")),g.on("userkeyup",w.userMove.bind(w,"keyup")),g.on("coin add",w.addCoin.bind(w)),g.on("user disconnected",w.disconnectPlayer.bind(w)),function e(i){const s=i-0;k.clearRect(0,0,w.width,w.height),w.update(s),w.draw(k),requestAnimationFrame(e)}(0)}},s={};function t(e){var a=s[e];if(void 0!==a)return a.exports;var h=s[e]={exports:{}};return i[e](h,h.exports,t),h.exports}t.m=i,e=[],t.O=(i,s,a,h)=>{if(!s){var r=1/0;for(m=0;m<e.length;m++){for(var[s,a,h]=e[m],n=!0,o=0;o<s.length;o++)(!1&h||r>=h)&&Object.keys(t.O).every((e=>t.O[e](s[o])))?s.splice(o--,1):(n=!1,h<r&&(r=h));if(n){e.splice(m--,1);var l=a();void 0!==l&&(i=l)}}return i}h=h||0;for(var m=e.length;m>0&&e[m-1][2]>h;m--)e[m]=e[m-1];e[m]=[s,a,h]},t.d=(e,i)=>{for(var s in i)t.o(i,s)&&!t.o(e,s)&&Object.defineProperty(e,s,{enumerable:!0,get:i[s]})},t.o=(e,i)=>Object.prototype.hasOwnProperty.call(e,i),t.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.p="",(()=>{var e={179:0};t.O.j=i=>0===e[i];var i=(i,s)=>{var a,h,[r,n,o]=s,l=0;if(r.some((i=>0!==e[i]))){for(a in n)t.o(n,a)&&(t.m[a]=n[a]);if(o)var m=o(t)}for(i&&i(s);l<r.length;l++)h=r[l],t.o(e,h)&&e[h]&&e[h][0](),e[h]=0;return t.O(m)},s=self.webpackChunk=self.webpackChunk||[];s.forEach(i.bind(null,0)),s.push=i.bind(null,s.push.bind(s))})();var a=t.O(void 0,[992],(()=>t(418)));a=t.O(a)})();