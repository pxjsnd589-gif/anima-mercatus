/* =========================================================
   《成交》v2 · 暗影集市 —— 规则内核（玩法与 v1.4 灰盒完全一致）
   本文件只含数据与规则，不含任何 DOM 操作。
   渲染由 UI.render() 承接；动效钩子由 FX.* 承接。
   ========================================================= */

var IDENTITIES = {
  LOVER:   {name:"痴情者", gold:800,  startFrags:["letter"],   ask:2,
            selfSet:["ring","letter","memory","cat"],
            skill:"无（基础）",
            title:"THE LOVER",  epithet:"以血为墨，写未寄之信"},
  KING:    {name:"王者",   gold:1000, startFrags:["scepter"],  ask:3,
            selfSet:["scepter","crown","memory","coin"],
            skill:"无（基础，起始金币最多）",
            title:"THE KING",   epithet:"三朝旧冠，压得头颅低垂"},
  HERMIT:  {name:"隐士",   gold:300,  startFrags:["mountain"], ask:2,
            selfSet:["mountain","scripture","cat","stone"],
            skill:"果园产出：每回合发放后额外得 1 张随机碎片",
            title:"THE HERMIT", epithet:"读山半生，缺最后一页"},
  WANDERER:{name:"浪子",   gold:600,  startFrags:["guitar"],   ask:2,
            selfSet:["wine","guitar","cat","stone"],
            skill:"可弃 1 张手牌，换抽 1 张",
            title:"THE WANDERER",epithet:"敬自由，也敬孤独"},
  GUARDIAN:{name:"守护者", gold:700,  startFrags:["lamp"],     ask:2,
            selfSet:["lamp","shield","coin","stone"],
            skill:"无（基础）",
            title:"THE WARDEN", epithet:"守到天亮，灯芯烧尽"},
  BETRAYER:{name:"背叛者", gold:500,  startFrags:["contract"], ask:2,
            selfSet:["contract","dagger","memory","coin"],
            skill:"无（基础）",
            title:"THE JUDAS",  epithet:"一纸契约，卖掉了名字"},
};
var IKEYS = Object.keys(IDENTITIES);

/* 16 种碎片：12 专属（每套 2 张）+ 4 跨套抢手（各跨 3 套） */
var FRAGMENTS = {
  ring:     {name:"戒指",   clear:260, sets:["LOVER"],       skin:"定情戒指，内圈刻着名字"},
  letter:   {name:"情书",   clear:200, sets:["LOVER"],       skin:"一封没寄出的信，墨迹已晕开"},
  scepter:  {name:"权杖",   clear:300, sets:["KING"],        skin:"加冕的权杖，沉得压手"},
  crown:    {name:"王冠",   clear:280, sets:["KING"],        skin:"一顶王冠，戴过三朝"},
  mountain: {name:"山",     clear:220, sets:["HERMIT"],      skin:"一座山，读了半生"},
  scripture:{name:"经书",   clear:200, sets:["HERMIT"],      skin:"半卷经书，缺了最后一页"},
  wine:     {name:"酒",     clear:190, sets:["WANDERER"],    skin:"一瓶酒，敬自由也敬孤独"},
  guitar:   {name:"吉他",   clear:220, sets:["WANDERER"],    skin:"一把旧吉他，弦断了一根"},
  lamp:     {name:"灯",     clear:210, sets:["GUARDIAN"],    skin:"一盏灯，守到天亮"},
  shield:   {name:"盾牌",   clear:230, sets:["GUARDIAN"],    skin:"一面旧盾，挡过箭"},
  contract: {name:"契约",   clear:250, sets:["BETRAYER"],    skin:"一纸契约，卖掉了什么"},
  dagger:   {name:"匕首",   clear:240, sets:["BETRAYER"],    skin:"一把匕首，淬过毒"},
  memory:   {name:"记忆",   clear:320, sets:["LOVER","KING","BETRAYER"],     skin:"一段被偷走的记忆，谁都想要"},
  coin:     {name:"旧币",   clear:160, sets:["KING","GUARDIAN","BETRAYER"],  skin:"一枚旧币，朝代已亡"},
  cat:      {name:"猫",     clear:170, sets:["LOVER","HERMIT","WANDERER"],   skin:"一只老猫，陪到他走"},
  stone:    {name:"石头",   clear:140, sets:["HERMIT","WANDERER","GUARDIAN"],skin:"一块不知名的石头——前妻潜水时带回的"},
};
var FKEYS = Object.keys(FRAGMENTS);
var SET_SCORE_SELF = 13000, SET_SCORE_OTHER = 10000;
var ROUNDS = 3, DEAL_PER = 3;
var COPY_PER = 3;
var AUCTION_PER_ROUND = 3;

/* ===================== 工具 ===================== */
function rnd(n){return Math.floor(Math.random()*n);}
function pick(arr){return arr[rnd(arr.length)];}
function shuffle(a){for(var i=a.length-1;i>0;i--){var j=rnd(i+1);var t=a[i];a[i]=a[j];a[j]=t;}return a;}

/* ===================== 状态 ===================== */
var G = null;
function newGame(){
  var ids = shuffle(IKEYS.slice()).slice(0,4);
  var players = ids.map(function(idk,idx){
    var id = IDENTITIES[idk];
    return {
      idx:idx, isHuman: idx===0, key:idk, name: id.isHuman?"你":id.name+"·AI",
      gold: id.gold, hand: id.startFrags.slice(),
      askUsed:0, askMax:id.ask,
      stall:[],
      selfSet:id.selfSet.slice(), skill:id.skill, askMax:id.ask
    };
  });
  var pool=[]; FKEYS.forEach(function(f){for(var c=0;c<COPY_PER;c++)pool.push(f);});
  pool = shuffle(pool);
  G = {players:players, pool:pool, round:1, phase:"start", log:[], tradeTick:0};
  G.players.forEach(function(p){ if(p.isHuman){ p.name="你"; } });
}

function me(){return G.players[0];}
function ais(){return G.players.filter(function(p){return !p.isHuman;});}

function log(txt, kind){
  G.log.unshift({t:"R"+G.round+"·"+phaseLabel(), txt:txt, kind:kind||"" , id:Date.now()+Math.random()});
}
function phaseLabel(){
  return ({start:"准备",deal:"发放",trade:"自由交易",auction:"拍卖会",settle:"结算"})[G.phase]||G.phase;
}
var PHASE_LATIN = {start:"PRAELUDIUM",deal:"DISTRIBUTIO",trade:"MERCATUS",auction:"AUCTIO",settle:"IUDICIUM"};

/* ===================== 取得/缺失 ===================== */
function targetSetKey(p){ return p.key; }
function setMissing(p, setKey){
  var fragIds = IDENTITIES[setKey].selfSet;
  return fragIds.filter(function(f){return !p.hand.includes(f);});
}
function isHot(f){ return FRAGMENTS[f].sets.length>=2; }
function setNames(f){ return FRAGMENTS[f].sets.map(function(s){return IDENTITIES[s].name;}).join("/"); }

/* ===================== AI 估值 / 底价 ===================== */
function inTarget(p, f){ return IDENTITIES[targetSetKey(p)].selfSet.includes(f); }
function aiValue(p, f){
  var base = FRAGMENTS[f].clear;
  var missingSelf = setMissing(p, targetSetKey(p)).includes(f);
  if(missingSelf) return Math.min(p.gold, Math.round(base*2.6));
  if(FRAGMENTS[f].sets.length>=2) return Math.round(base*1.4);
  return Math.round(base*1.1);
}
function aiSellFloor(p, f){
  var base = FRAGMENTS[f].clear;
  var missingSelf = setMissing(p, targetSetKey(p)).includes(f);
  if(missingSelf) return Math.round(base*2.0);
  return Math.round(base*1.15);
}
function aiAnswerCard(p, f){
  var missingSelf = setMissing(p, targetSetKey(p)).includes(f);
  var needGold = p.gold < 300;
  var truth = missingSelf ? "滚" : (needGold ? "好啊" : "也行");
  if(Math.random()<0.3){
    var map={"好啊":"滚","也行":"滚","滚":"好啊"};
    if(Math.random()<0.5) truth = map[truth]||truth;
  }
  return truth;
}

/* ===================== 拍卖 ===================== */
function startAuction(){
  G.auctionItems=[];
  for(var i=0;i<AUCTION_PER_ROUND;i++){
    if(!G.pool.length) break;
    var idx=-1;
    for(var j=0;j<G.pool.length;j++){ if(isHot(G.pool[j])){ idx=j; break; } }
    if(idx<0) idx=G.pool.length-1;
    var f=G.pool.splice(idx,1)[0];
    G.auctionItems.push({frag:f, done:false});
  }
  G.auctionPending={};
}
function resolveAuction(){
  G.auctionResults = [];
  G.auctionItems.forEach(function(it, aidx){
    var myBid = G.auctionPending[aidx] != null ? G.auctionPending[aidx] : -1;
    var best={idx:-1, price:-1};
    G.players.forEach(function(p){
      var bid;
      if(p.isHuman) bid=myBid;
      else bid=Math.min(p.gold, aiValue(p, it.frag)+rnd(40)-20);
      if(bid>best.price && bid<=p.gold){ best={idx:p.idx, price:bid}; }
    });
    if(best.idx>=0){
      var w=G.players[best.idx];
      w.gold-=best.price; w.hand.push(it.frag);
      it.done=true; it.winner=w.name; it.winPrice=best.price; it.winIsHuman=w.isHuman;
      log("拍卖 "+FRAGMENTS[it.frag].name+" 成交： "+w.name+" 出 "+best.price, w.isHuman?"good":"");
    } else {
      it.done=true; it.winner="流拍"; it.winPrice=0; it.winIsHuman=false;
      log("拍卖 "+FRAGMENTS[it.frag].name+" 流拍");
    }
    G.auctionResults.push({frag:it.frag, winner:it.winner, price:it.winPrice, isHuman:it.winIsHuman});
  });
  G.auctionPending=null; G.auctionItems=null;
}

/* ===================== 回合推进 ===================== */
function doDeal(){
  G.players.forEach(function(p){
    var got=[];
    for(var i=0;i<DEAL_PER;i++){ if(G.pool.length){ got.push(G.pool.pop()); } }
    p.hand=p.hand.concat(got);
    if(p.isHuman) p._lastDeal=got;
    if(p.key==="HERMIT" && G.pool.length){ var extra=G.pool.pop(); p.hand.push(extra); if(p.isHuman) p._hermitBonus=[extra]; }
  });
}

function aiBuyFromHuman(){
  var human=me();
  if(!human.stall.length) return;
  var bought=0, totalGold=0;
  ais().forEach(function(buyer){
    var snapshot=human.stall.slice();
    snapshot.forEach(function(fid){
      if(!buyer.gold) return;
      if(!human.stall.includes(fid)) return;
      var val=aiValue(buyer,fid);
      var floor=Math.round(FRAGMENTS[fid].clear*1.15);
      if(val>=floor && val<=buyer.gold && Math.random()<0.88){
        buyer.gold-=val; human.gold+=val;
        removeFrom(human.hand,fid); removeFrom(human.stall,fid);
        buyer.hand.push(fid);
        bought++; totalGold+=val;
        log("◈ "+buyer.name+" 以 "+val+" 从 你 买走 "+FRAGMENTS[fid].name+"（你的金币+"+val+" → "+human.gold+"）","good");
      }
    });
  });
  if(bought>0){
    log("本轮 AI 共从你这里买了 "+bought+" 件货，你获得 "+totalGold+" 金币","good");
    if(window.FX) FX.goldGain(totalGold);
  }
}

function aiAutoTrade(){
  ais().forEach(function(buyer){
    G.players.forEach(function(seller){
      if(seller===buyer) return;
      seller.stall.slice().forEach(function(fid){
        var val=aiValue(buyer,fid);
        var floor=aiSellFloor(seller,fid);
        if(val>=floor && val<=buyer.gold && Math.random()<0.75){
          buyer.gold-=val; seller.gold+=val;
          removeFrom(seller.hand,fid); removeFrom(seller.stall,fid);
          buyer.hand.push(fid);
          log(buyer.name+" 以 "+val+" 从 "+seller.name+" 买走 "+FRAGMENTS[fid].name);
        }
      });
    });
  });
  aiBuyFromHuman();
}

function removeFrom(arr,x){var i=arr.indexOf(x); if(i>=0)arr.splice(i,1);}
function clearStalls(){ G.players.forEach(function(p){p.stall=[];}); }
function aiListStall(){
  ais().forEach(function(a){
    var list=[];
    a.hand.forEach(function(f){
      if(!inTarget(a,f) && !a.stall.includes(f)) list.push(f);
    });
    var seen={};
    a.hand.forEach(function(f){ if(inTarget(a,f)) seen[f]=(seen[f]||0)+1; });
    Object.keys(seen).forEach(function(f){
      for(var k=1;k<seen[f];k++){ if(!a.stall.includes(f)) list.push(f); }
    });
    shuffle(list);
    list.sort(function(x,y){ return FRAGMENTS[y].sets.length-FRAGMENTS[x].sets.length; });
    var n=Math.min(list.length, 3+(Math.random()<0.5?1:0));
    for(var i=0;i<n;i++) a.stall.push(list[i]);
  });
}

function startRound(){
  G.phase="deal"; me()._lastDeal=[]; me()._hermitBonus=null;
  doDeal();
  log("第 "+G.round+" 回合开始，发放完成");
  UI.render(); if(window.FX) FX.phasePulse("deal");
}
function enterTrade(){
  G.phase="trade"; me().askUsed=0; G.tradeTick=0;
  clearStalls(); aiListStall();
  var p=me();
  var extra=p.hand.filter(function(f){return !IDENTITIES[p.key].selfSet.includes(f)&&!p.stall.includes(f);});
  shuffle(extra).slice(0,Math.min(2,extra.length)).forEach(function(f){p.stall.push(f);});
  aiAutoTrade();
  log("自由交易期开始");
  UI.render(); if(window.FX) FX.phasePulse("trade");
}
function enterAuction(){
  G.phase="auction";
  clearStalls();
  startAuction();
  log("拍卖会开始");
  UI.render(); if(window.FX) FX.phasePulse("auction");
}
function endRoundOrNext(){
  if(G.round<ROUNDS){
    G.round++; G.phase="deal"; me()._lastDeal=[]; me()._hermitBonus=null; doDeal();
    log("第 "+G.round+" 回合开始，发放完成");
    UI.render(); if(window.FX) FX.phasePulse("deal");
  }
  else { settle(); }
}

/* ===================== 结算 ===================== */
function scoreOf(p){
  var best={setKey:null, score:0, isSelf:false, missing:4};
  IKEYS.forEach(function(sk){
    var miss=setMissing(p,sk);
    var isSelf = (sk===p.key);
    if(miss.length===0){
      var sc = isSelf?SET_SCORE_SELF:SET_SCORE_OTHER;
      if(sc>best.score) best={setKey:sk, score:sc, isSelf:isSelf, missing:0};
    }
  });
  var clearSum = p.hand.reduce(function(s,f){return s+FRAGMENTS[f].clear;},0);
  var skillBonus=0;
  if(p.hand.length>=10) skillBonus=2000;
  var total = best.score + clearSum + p.gold + skillBonus;
  return {total:total, setScore:best.score, setKey:best.setKey, isSelf:best.isSelf, clearSum:clearSum, gold:p.gold, skillBonus:skillBonus, handCount:p.hand.length};
}

function settleData(){
  return G.players.map(function(p){
    var s=scoreOf(p);
    return {name:p.name, key:p.key, isHuman:p.isHuman, total:s.total, setScore:s.setScore,
            setKey:s.setKey, isSelf:s.isSelf, clearSum:s.clearSum, gold:s.gold,
            skillBonus:s.skillBonus, handCount:s.handCount};
  }).sort(function(a,b){return b.total-a.total;});
}
function settle(){
  G.phase="settle";
  G.result = settleData();
  UI.render();
  UI.showSettle(G.result);
}

/* ===================== 自动推演（自检） ===================== */
function autoPlayerBuy(){
  var p=me();
  ais().forEach(function(seller){
    seller.stall.slice().forEach(function(fid){
      if(p.hand.includes(fid)) return;
      if(!IDENTITIES[p.key].selfSet.includes(fid)) return;
      var floor=aiSellFloor(seller,fid);
      var val=Math.min(p.gold, aiValue(p,fid));
      if(val>=floor && val<=p.gold){
        p.gold-=val; seller.gold+=val;
        removeFrom(seller.hand,fid); removeFrom(seller.stall,fid);
        p.hand.push(fid);
        log("你 自动以 "+val+" 从 "+seller.name+" 买下 "+FRAGMENTS[fid].name+" (底价≈"+floor+")");
      }
    });
  });
}
function autoPlay(){
  if(G.phase==="start") startRound();
  var guard=0;
  while(G.phase!=="settle" && guard++<50){
    if(G.phase==="deal"){ enterTrade(); }
    else if(G.phase==="trade"){
      aiAutoTrade();
      autoPlayerBuy();
      enterAuction();
    }
    else if(G.phase==="auction"){
      if(G.auctionItems){ G.auctionPending={}; G.auctionItems.forEach(function(it,idx){ G.auctionPending[idx]=Math.min(me().gold, aiValue(me(),it.frag)); }); }
      resolveAuction();
      endRoundOrNext();
    }
  }
  UI.render();
}
