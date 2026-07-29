/* =========================================================
   《成交》v2 · 动效层 FX
   灰烬粒子 / 相位环 / 冲击波 / 浮金 / 吐司 / 火花
   ========================================================= */
var FX = (function(){

  /* ---------- 灰烬粒子（canvas） ---------- */
  var cv, ctx, W, H, parts=[], raf=null;
  function initAsh(){
    cv = document.getElementById("ashCanvas");
    if(!cv) return;
    ctx = cv.getContext("2d");
    resize();
    window.addEventListener("resize", resize);
    parts = [];
    var n = Math.round(Math.min(120, Math.max(50, window.innerWidth/14)));
    for(var i=0;i<n;i++) parts.push(newP(true));
    loop();
  }

  /* ---------- 星辰粒子（球体夜空） ---------- */
  function initStars(){
    var box = document.getElementById("orbStars");
    if(!box) return;
    box.innerHTML = "";
    var n = 80;
    for(var i=0;i<n;i++){
      var s = document.createElement("div");
      var cls = "star";
      var r = Math.random();
      if(r<.15) cls += " big";
      else if(r<.55) cls += " tiny";
      s.className = cls;
      s.style.left = (Math.random()*100).toFixed(2)+"%";
      s.style.top = (Math.random()*100).toFixed(2)+"%";
      s.style.setProperty("--dur", (2+Math.random()*4).toFixed(1)+"s");
      s.style.setProperty("--delay", (Math.random()*3).toFixed(1)+"s");
      box.appendChild(s);
    }
  }
  function resize(){
    if(!cv) return;
    var dpr = Math.min(2, window.devicePixelRatio||1);
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = W*dpr; cv.height = H*dpr;
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  function newP(spread){
    return {
      x: Math.random()*W,
      y: spread ? Math.random()*H : H + Math.random()*40,
      r: .5 + Math.random()*1.8,
      vy: -(.12 + Math.random()*.42),
      vx: (Math.random()-.5)*.22,
      a: .12 + Math.random()*.55,
      ph: Math.random()*Math.PI*2,
      warm: Math.random()<.34
    };
  }
  function loop(){
    if(!ctx) return;
    ctx.clearRect(0,0,W,H);
    for(var i=0;i<parts.length;i++){
      var p = parts[i];
      p.ph += .012;
      p.x += p.vx + Math.sin(p.ph)*.28;
      p.y += p.vy;
      if(p.y < -20 || p.x < -30 || p.x > W+30) parts[i] = newP(false);
      var al = p.a * (0.55 + 0.45*Math.sin(p.ph*1.7));
      ctx.beginPath();
      ctx.fillStyle = p.warm
        ? "rgba(214,180,116,"+al.toFixed(3)+")"
        : "rgba(196,200,204,"+(al*.7).toFixed(3)+")";
      ctx.arc(p.x, p.y, p.r, 0, 6.2832);
      ctx.fill();
      if(p.warm && p.r>1.4){
        ctx.beginPath();
        ctx.fillStyle = "rgba(214,180,116,"+(al*.14).toFixed(3)+")";
        ctx.arc(p.x, p.y, p.r*4, 0, 6.2832);
        ctx.fill();
      }
    }
    raf = requestAnimationFrame(loop);
  }

  /* ---------- 相位环文字 ---------- */
  function buildPhaseRing(){
    var svg = document.getElementById("phaseRing");
    if(!svg) return;
    var txt = "PRAELUDIUM \u2727 DISTRIBUTIO \u2727 MERCATUS \u2727 AUCTIO \u2727 IUDICIUM \u2727 ANIMA MERCATUS \u2727";
    svg.innerHTML =
      '<defs><path id="prPath" d="M200,200 m-172,0 a172,172 0 1,1 344,0 a172,172 0 1,1 -344,0"/></defs>' +
      '<text><textPath href="#prPath" startOffset="1%" textLength="1050" lengthAdjust="spacing">'+txt+'</textPath></text>' +
      '<circle cx="200" cy="200" r="188" fill="none" stroke="#6E5A31" stroke-width=".6" opacity=".45" stroke-dasharray="1 9"/>';
  }

  /* ---------- 冲击波 ---------- */
  function shock(){
    var el = document.getElementById("orbShock");
    if(!el) return;
    el.classList.remove("go");
    void el.offsetWidth;
    el.classList.add("go");
  }

  /* ---------- 相位推进：球体震荡 + 冲击波 + 吐司 ---------- */
  var PHASE_TEXT = {
    deal:   ["DISTRIBUTIO","命运发牌"],
    trade:  ["MERCATUS","集市开张"],
    auction:["AUCTIO","密封拍卖"],
    settle: ["IUDICIUM","终局审判"]
  };
  function phasePulse(phase){
    shock();
    var t = PHASE_TEXT[phase];
    if(t) toast(t[1]+" · "+t[0], "gold");
    var wrap = document.getElementById("orbWrap");
    if(wrap){
      wrap.animate(
        [{transform:"scale(1)"},{transform:"scale(1.09)"},{transform:"scale(.98)"},{transform:"scale(1)"}],
        {duration:820, easing:"cubic-bezier(.2,.9,.25,1)"}
      );
    }
    sparks(14);
  }

  /* ---------- 屏幕闪光 ---------- */
  function flash(){
    var d = document.createElement("div");
    d.className = "screen-flash go";
    document.body.appendChild(d);
    setTimeout(function(){ d.remove(); }, 900);
  }

  /* ---------- 火花（自球心散射） ---------- */
  function sparks(n){
    var root = document.getElementById("fxRoot");
    var orb = document.getElementById("orbWrap");
    if(!root || !orb) return;
    var r = orb.getBoundingClientRect();
    var cx = r.left + r.width/2, cy = r.top + r.height/2;
    for(var i=0;i<(n||12);i++){
      (function(i){
        var s = document.createElement("div");
        s.className = "spark";
        s.style.left = cx+"px"; s.style.top = cy+"px";
        root.appendChild(s);
        var ang = Math.random()*Math.PI*2;
        var dist = 70 + Math.random()*160;
        s.animate(
          [{transform:"translate(-50%,-50%) scale(1)",opacity:1},
           {transform:"translate("+(Math.cos(ang)*dist-50)+"%,"+(Math.sin(ang)*dist-50)+"%) scale(0)",opacity:0}],
          {duration:700+Math.random()*600, easing:"cubic-bezier(.1,.8,.2,1)"}
        ).onfinish = function(){ s.remove(); };
      })(i);
    }
  }

  /* ---------- 浮金数字 ---------- */
  function goldGain(v, anchor){
    var root = document.getElementById("fxRoot");
    var cell = anchor || document.getElementById("goldCell");
    if(!root || !cell) return;
    var r = cell.getBoundingClientRect();
    var d = document.createElement("div");
    d.className = "float-gold";
    d.textContent = (v>=0?"+":"")+v;
    d.style.left = (r.left + r.width/2 - 18)+"px";
    d.style.top  = (r.bottom - 6)+"px";
    root.appendChild(d);
    setTimeout(function(){ d.remove(); }, 1600);
    cell.classList.remove("flash"); void cell.offsetWidth; cell.classList.add("flash");
  }

  /* ---------- 吐司 ---------- */
  function toast(txt, kind){
    var d = document.createElement("div");
    d.className = "toast" + (kind?(" "+kind):"");
    d.textContent = txt;
    document.body.appendChild(d);
    setTimeout(function(){ d.remove(); }, 2500);
  }

  /* ---------- 数字滚动 ---------- */
  function tickNumber(el, to, dur){
    if(!el) return;
    var from = parseInt(el.textContent.replace(/[^\d-]/g,""),10);
    if(isNaN(from)) from = 0;
    to = to|0;
    if(from===to){ el.textContent = to; return; }
    dur = dur||600;
    var t0 = performance.now();
    function step(t){
      var k = Math.min(1,(t-t0)/dur);
      var e = 1-Math.pow(1-k,3);
      el.textContent = Math.round(from + (to-from)*e);
      if(k<1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- 卡牌飞入手牌坞 ---------- */
  function flyToDock(fromEl){
    var dock = document.getElementById("dock");
    if(!fromEl || !dock) return;
    var a = fromEl.getBoundingClientRect(), b = dock.getBoundingClientRect();
    var ghost = fromEl.cloneNode(true);
    ghost.style.cssText = "position:fixed;left:"+a.left+"px;top:"+a.top+"px;width:"+a.width+"px;"+
      "margin:0;z-index:90;pointer-events:none;";
    document.getElementById("fxRoot").appendChild(ghost);
    ghost.animate(
      [{transform:"translate(0,0) scale(1)",opacity:1},
       {transform:"translate("+((b.left+b.width*0.2)-a.left)+"px,"+((b.top+18)-a.top)+"px) scale(.55)",opacity:.15}],
      {duration:760, easing:"cubic-bezier(.3,.9,.2,1)"}
    ).onfinish = function(){ ghost.remove(); };
  }

  return {
    initAsh:initAsh, initStars:initStars, buildPhaseRing:buildPhaseRing, shock:shock,
    phasePulse:phasePulse, flash:flash, sparks:sparks,
    goldGain:goldGain, toast:toast, tickNumber:tickNumber, flyToDock:flyToDock
  };
})();
