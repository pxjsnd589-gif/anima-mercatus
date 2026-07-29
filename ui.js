/* =========================================================
   《成交》v2 · 界面层 UI
   规则一律走 core.js；本层只负责呈现与交互
   ========================================================= */
var UI = (function(){

  var $ = function(id){ return document.getElementById(id); };
  var lastLogId = null;

  /* ---------------- 遗物卡 ---------------- */
  function hotTag(f){
    var n = FRAGMENTS[f].sets.length;
    if(n>=3) return '<span class="tag hot">抢手 · '+n+'套</span>';
    if(n>=2) return '<span class="tag hot">抢手</span>';
    return '';
  }
  function fragCard(fid, o){
    o = o||{};
    var F = FRAGMENTS[fid], hot = isHot(fid);
    var cls = "frag-card"
      + (o.need?" need":"") + (hot?" hot":"")
      + (o.owned?" ownedby":"") + (o.listed?" listed":"");
    var h = '<div class="'+cls+'"'+(o.attr||"")+'>';
    if(o.listed) h += '<div class="listed-ribbon">已上架</div>';
    if(o.wax) h += '<div class="wax">'+o.wax+'</div>';
    h += '<div class="fc-head"><span class="fc-name">'+F.name+'</span>'
      + (o.need?'<span class="tag self">自套缺口</span>':'')
      + (o.youNeed && !o.need?'<span class="tag self">你要的</span>':'')
      + hotTag(fid) + '</div>';
    h += '<div class="fc-icon">'+ART.fragIcon(fid)+'</div>';
    if(o.skin!==false) h += '<div class="fc-skin">'+F.skin+'</div>';
    h += '<div class="fc-meta"><span>清算 <b>'+F.clear+'</b></span><span>归 '+setNames(fid)+'</span></div>';
    if(o.extra) h += o.extra;
    h += '</div>';
    return h;
  }

  /* ---------------- 顶栏 ---------------- */
  function renderHUD(){
    $("hRound").textContent = G.round;
    $("hPhase").textContent = phaseLabel();
    $("hPhaseLatin").textContent = PHASE_LATIN[G.phase]||"—";
    FX.tickNumber($("hGold"), me().gold);
    var myId = IDENTITIES[me().key];
    $("hYou").innerHTML =
      '<span class="id-badge">'+myId.name+'</span>'
      + '<span class="id-secret">对手不可见</span>';
    if(!$("brandSigil").innerHTML) $("brandSigil").innerHTML = ART.sigil(me().key, 42);
  }

  /* ---------------- 金属球区 ---------------- */
  function renderOrb(){
    var wrap = $("orbWrap");
    if(!wrap.innerHTML){
      wrap.innerHTML = ART.orb(clampOrb());
      wrap.onclick = function(){ FX.shock(); FX.sparks(18); FX.toast(orbLine(),"gold"); };
      FX.buildPhaseRing();
    }
    var p = me(), miss = setMissing(p, p.key).length, got = 4-miss;
    $("orbTitle").textContent = ({start:"TERMINUS",deal:"DISTRIBUTIO",trade:"MERCATUS",auction:"AUCTIO",settle:"IUDICIUM"})[G.phase]||"TERMINUS";
    $("orbSub").innerHTML = G.phase==="settle"
      ? '终局已定 · 命运封存'
      : '终极之物 · 人生已铸 <b style="color:var(--brass)">'+got+'</b>/4';
  }
  function clampOrb(){
    var w = window.innerWidth;
    if(w<720) return 210;
    if(w<1080) return 240;
    return 268;
  }
  function orbLine(){
    var lines = ["它记得每一次成交","球心裂隙里有人在低语","四块碎片，一个人生","价格是谎言，缺口才是真话"];
    return lines[Math.floor(Math.random()*lines.length)];
  }

  /* ---------------- 左：身份圣龛 ---------------- */
  function renderIdentity(){
    var p = me(), id = IDENTITIES[p.key];
    var miss = setMissing(p, p.key), got = 4-miss.length;
    var h = '<div class="shrine">';
    h += '<div class="portrait-frame">'+ART.portrait(p.key)+'</div>';
    h += '<div class="shrine-plate">'
      + '<div class="sp-title">'+id.title+'</div>'
      + '<div class="sp-name">'+id.name+'</div>'
      + '<div class="sp-ep">「'+id.epithet+'」</div>'
      + '<div class="sp-skill">'+id.skill+'</div>'
      + '<div class="sp-meta">提问上限 '+p.askMax+' 次/回合 · 起始金币 '+id.gold+'</div>'
      + '</div>';
    h += '<div class="bonebar'+(got===4?" full":"")+'"><i style="width:'+(got/4*100)+'%"></i></div>';
    h += '<div class="recipe stagger">';
    id.selfSet.forEach(function(f){
      var have = p.hand.includes(f);
      h += '<div class="rc '+(have?"have":"miss")+'" title="'+FRAGMENTS[f].name+' · 清算 '+FRAGMENTS[f].clear+'">'
        + ART.fragIcon(f,"rc-ico")
        + '<span class="rc-n">'+FRAGMENTS[f].name+'</span></div>';
    });
    h += '</div>';
    h += '<div class="recipe-note">'
      + (miss.length===0
          ? '<span style="color:var(--brass)">人生已成 · 可结算自套 '+SET_SCORE_SELF+'</span>'
          : '尚缺 <span style="color:#E8A493">'+miss.length+'</span>/4 —— 终局亦可改投他套（'+SET_SCORE_OTHER+'）')
      + '</div>';
    h += '</div>';
    $("identityBox").innerHTML = h;
  }

  /* ---------------- 左：六套配方 ---------------- */
  function renderPublicSets(){
    var p = me(), mySet = IDENTITIES[p.key].selfSet, meKey = p.key;
    var h = '<div class="stagger">';
    IKEYS.forEach(function(sk){
      var id = IDENTITIES[sk], mine = (sk===meKey);
      h += '<div class="setrow'+(mine?" is-mine":"")+'">';
      h += '<div class="setrow-h">'+ART.sigil(sk,26)
        + '<b>'+id.name+'</b>'
        + (mine?'<span class="tag mine">你</span>':'')
        + '<span class="lat">'+id.title+'</span></div>';
      h += '<div class="chips">';
      id.selfSet.forEach(function(f){
        var inMy = mySet.includes(f), have = p.hand.includes(f);
        var need = inMy && !have;
        h += '<span class="chip'+(need?" need":"")+(inMy?" mine":"")+'">'+FRAGMENTS[f].name
          + (isHot(f)?'<span class="h">◈'+FRAGMENTS[f].sets.length+'</span>':'')+'</span>';
      });
      h += '</div></div>';
    });
    h += '</div>';
    h += '<div class="recipe-note" style="text-align:left">红痕 = 你自套缺口（去抢）；◈ = 抢手货，多套争夺，小心被抬价。</div>';
    $("publicSetsBox").innerHTML = h;
  }

  /* ---------------- 右：对手 ---------------- */
  function renderOpp(){
    var h = '<div class="stagger">' + ais().map(function(a){
      var missN = setMissing(a,a.key).length, got = 4-missN;
      var pips = "";
      for(var i=0;i<4;i++) pips += '<span class="pip'+(i<got?" on":"")+'"></span>';
      return '<div class="opp">'
        + '<div class="opp-face">'+ART.portrait(a.key)+'</div>'
        + '<div class="opp-body">'
        +   '<div class="opp-name">'+a.name+'<span class="mask">面 具</span></div>'
        +   '<div class="opp-stat"><span>金币 <b>'+a.gold+'</b></span><span>手牌 <b>'+a.hand.length+'</b></span><span>摊位 <b>'+a.stall.length+'</b></span></div>'
        +   '<div class="opp-miss pips">'+pips+'<span class="pips-l">人生 '+got+'/4</span></div>'
        + '</div></div>';
    }).join("") + '</div>';
    $("oppBox").innerHTML = h;
  }

  /* ---------------- 右：编年 ---------------- */
  function renderLog(){
    var top = G.log[0];
    var fresh = top && top.id !== lastLogId;
    if(top) lastLogId = top.id;
    $("log").innerHTML = G.log.slice(0,60).map(function(e,i){
      return '<div class="logline '+(e.kind||"")+(i===0&&fresh?" fresh":"")+'">'
        + '<span class="lt">'+e.t+'</span>'+e.txt+'</div>';
    }).join("");
  }

  /* ---------------- 手牌（右侧竖栏） ---------------- */
  function renderHand(){
    var p = me();
    if(!p.hand.length){ $("handBox").innerHTML = '<div class="hand-empty">尚无碎片。命运还未发牌。</div>'; return; }
    $("handBox").innerHTML = p.hand.map(function(f,i){
      var need = IDENTITIES[p.key].selfSet.includes(f);
      var listed = p.stall.includes(f);
      return fragCard(f, {
        need:need, youNeed:need, listed:listed, skin:false,
        attr:' data-list="'+f+'" data-i="'+i+'"',
        extra:'<div class="fc-btns"><button class="btn sm '+(listed?"blood":"ghost")+'" data-list="'+f+'"><span>'
              + (listed?"撤下摊位":"上架出售")+'</span></button></div>'
      });
    }).join("");
  }

  /* ---------------- 中央：仪式台 ---------------- */
  function phaseTitle(cn, lat){
    return '<div class="phase-title">'+cn+'<small>'+lat+'</small></div>';
  }

  function renderCenter(){
    var c = $("centerContent"), btn = $("btnMain");
    var p = me();

    if(G.phase==="start"){
      btn.innerHTML = '<span>抽 身 份 · 开 局</span>'; btn.disabled = false;
      c.innerHTML = '<div class="fade-up">'
        + phaseTitle("序 幕","PRAELUDIUM")
        + '<div class="tip">暗影集市在雾里开张。你与 <b>3 名蒙面对手</b> 各持一个隐秘身份，'
        + '用三个回合收集「人生碎片」，把自己拼成一个可以被清算的人。</div>'
        + '<div class="tip">你的身份在左侧圣龛中<b>完全可见</b>，而他们看不到你是谁——也看不到你缺什么。'
        + '每回合 = <b>发放 → 自由交易 → 拍卖会</b>，三轮之后由终极之物做出审判。</div>'
        + '</div>';
    }
    else if(G.phase==="deal"){
      btn.innerHTML = '<span>进 入 自 由 交 易</span>'; btn.disabled = false;
      var got = p._lastDeal||[];
      var h = '<div class="fade-up">' + phaseTitle("第 "+G.round+" 回合 · 发 放","DISTRIBUTIO");
      h += '<div class="tip">命运向众生发牌。你抽到：'
        + (got.length? '<b>'+got.map(function(f){return FRAGMENTS[f].name;}).join('、')+'</b>' : '（空手）') + '。</div>';
      if(p._hermitBonus) h += '<div class="tip">◈ 隐士的果园结果了：额外获得 <b>'
        + p._hermitBonus.map(function(f){return FRAGMENTS[f].name;}).join('、')+'</b>。</div>';
      h += '<div class="grid-cards stagger" style="margin-top:10px">'
        + (got.concat(p._hermitBonus||[])).map(function(f){
            return fragCard(f,{need:IDENTITIES[p.key].selfSet.includes(f), youNeed:IDENTITIES[p.key].selfSet.includes(f)});
          }).join("")
        + '</div></div>';
      c.innerHTML = h;
    }
    else if(G.phase==="trade"){
      btn.innerHTML = '<span>散 市 · 进 入 拍 卖</span>'; btn.disabled = false;
      var missMe = setMissing(p,p.key).length;
      c.innerHTML = '<div class="fade-up">'
        + phaseTitle("第 "+G.round+" 回合 · 自 由 交 易","MERCATUS")
        + '<div class="tip">逛摊位买牌：点卡面「求 购」→ 可 <b>提问</b> 逼对方打出答案卡（会撒谎）→ <b>出价</b> ≥ 他的秘密底价即成交。'
        + '你也可以把多余的牌 <span class="em">上架</span>（底部手牌坞），等 AI 来买。</div>'
        + '<div class="tip">你还缺 <b>'+missMe+'</b> 块自套碎片。市场上找不到，就去拍卖会抢。</div>'
        + '<div class="actionbar">'
        +   '<button class="btn sm ghost" id="btnRefreshStall"><span>刷新摊位</span></button>'
        +   '<button class="btn sm ghost" id="btnAutoListMine"><span>一键上架非自套牌</span></button>'
        +   '<button class="btn sm ghost" id="btnAiBuyAgain"><span>催 AI 买我的货</span></button>'
        + '</div><div id="stallArea"></div></div>';
      renderStalls();
      bindTradeActions();
    }
    else if(G.phase==="auction"){
      btn.innerHTML = '<span>落 槌 · 结 束 本 回 合</span>';
      btn.disabled = (G.auctionPending!=null && Object.keys(G.auctionPending).length<(G.auctionItems?G.auctionItems.length:0));
      c.innerHTML = '<div class="fade-up">'
        + phaseTitle("第 "+G.round+" 回合 · 拍 卖 会","AUCTIO")
        + '<div class="tip">一次性 <b>密封价</b>，四人同出，价高者得。系统已替 AI 落价。'
        + '对想要的牌填价后点「封 蜡」，全部出完再点主按钮落槌。</div>'
        + '<div id="auctionArea"></div></div>';
      renderAuction();
    }
    else if(G.phase==="settle"){
      btn.innerHTML = '<span>重 开 一 局</span>'; btn.disabled = false;
      c.innerHTML = '<div class="fade-up">'
        + phaseTitle("终 局 · 审 判","IUDICIUM")
        + '<div class="tip">三个回合已尽，命运已被清算。</div>'
        + '<div class="actionbar"><button class="btn sm ghost" id="btnReopenJudge"><span>重看审判书</span></button></div>'
        + '</div>';
      var rb = $("btnReopenJudge");
      if(rb) rb.onclick = function(){ showSettle(G.result); };
    }
  }

  /* ---------------- 摊位 ---------------- */
  function renderStalls(){
    var area = $("stallArea"); if(!area) return;
    var h = "", total = 0;
    G.players.forEach(function(seller){
      if(!seller.stall.length) return;
      total += seller.stall.length;
      h += '<div class="stall"><div class="stall-h'+(seller.isHuman?" self":"")+'">'
        + ART.sigil(seller.key,26)
        + '<span>'+(seller.isHuman?"你的摊位":seller.name+" 的摊位")+'</span>'
        + '<span class="ln"></span><span class="cnt">'+seller.stall.length+' 件</span></div>';
      h += '<div class="grid-cards stagger">';
      seller.stall.forEach(function(fid){
        var mine = seller.isHuman;
        var myNeed = !mine && IDENTITIES[me().key].selfSet.includes(fid);
        var extra = mine
          ? '<div class="fc-btns"><span class="tag">静候买家</span></div>'
          : '<div class="fc-btns"><button class="btn sm" data-buy="'+fid+'" data-seller="'+seller.idx+'"><span>求 购</span></button></div>';
        h += fragCard(fid, {youNeed:myNeed, owned:mine, listed:mine, extra:extra});
      });
      h += '</div></div>';
    });
    if(!h){
      h = '<div class="empty-note">摊位空空。<br>① 点「刷新摊位」让 AI 重新上架<br>② 点「一键上架非自套牌」把多余的牌摆出去<br>③ 也可从底部手牌坞逐张上架</div>';
    } else {
      h += '<div class="recipe-note" style="text-align:left">市场共 <b style="color:var(--brass)">'+total+'</b> 件在售。没看到想要的？刷新换一批。</div>';
    }
    area.innerHTML = h;
    area.querySelectorAll("[data-buy]").forEach(function(b){
      b.onclick = function(){ openTradeModal(+b.dataset.seller, b.dataset.buy); };
    });
  }

  function bindTradeActions(){
    var r = $("btnRefreshStall"), a = $("btnAutoListMine"), q = $("btnAiBuyAgain");
    if(r) r.onclick = function(){
      clearStalls(); aiListStall();
      var p = me();
      var extra = p.hand.filter(function(f){ return !IDENTITIES[p.key].selfSet.includes(f) && !p.stall.includes(f); });
      shuffle(extra).slice(0, Math.min(3, extra.length)).forEach(function(f){ p.stall.push(f); });
      log("摊位已刷新");
      FX.toast("集市换了一批货","gold");
      render();
    };
    if(a) a.onclick = function(){
      var p = me();
      var extra = p.hand.filter(function(f){ return !IDENTITIES[p.key].selfSet.includes(f) && !p.stall.includes(f); });
      extra.forEach(function(f){ p.stall.push(f); });
      log("你一键上架了 "+extra.length+" 张非自套牌");
      FX.toast("上架 "+extra.length+" 件","gold");
      render();
    };
    if(q) q.onclick = function(){
      var before = me().gold;
      aiBuyFromHuman();
      log("你催促了 AI 来看货");
      var d = me().gold - before;
      if(d<=0) FX.toast("无人问价","blood");
      render();
    };
  }

  /* ---------------- 交易弹窗 ---------------- */
  function openTradeModal(sellerIdx, fid){
    var seller = G.players[sellerIdx], F = FRAGMENTS[fid];
    var need = IDENTITIES[me().key].selfSet.includes(fid);
    var askLeft = me().askMax - me().askUsed;

    var box = document.createElement("div");
    box.className = "modal";
    box.innerHTML = '<div class="box">'
      + '<h3>求 购 · '+F.name+'</h3>'
      + '<div class="sub">向 '+seller.name+' 开口 —— 他的身份仍在面具之下</div>'
      + '<div style="max-width:230px;margin:0 auto 6px">'
      +   fragCard(fid,{need:need, youNeed:need})
      + '</div>'
      + '<div class="tip">底价由卖家秘密决定。你出价 <b>≥ 底价</b> 即成交，低了则当场作废（不扣钱）。</div>'
      + '<div id="askRow"></div>'
      + '<div class="row" style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:12px">'
      +   '<label class="inp">你的出价 <input type="number" id="offerInput" min="0" value="'
      +     Math.min(me().gold, Math.round(F.clear*1.8))+'"></label>'
      +   '<button class="btn primary" id="doOffer" style="padding:9px 22px;font-size:13.5px"><span>出 价 成 交</span></button>'
      +   '<span class="tag">你有 '+me().gold+' 金币</span>'
      + '</div>'
      + '<div class="deal-msg" id="tradeMsg"></div>'
      + '<div class="modal-actions"><button class="btn ghost" id="closeTrade"><span>离 开</span></button></div>'
      + '</div>';
    $("modalRoot").appendChild(box);

    var askRow = box.querySelector("#askRow");
    var msg = box.querySelector("#tradeMsg");
    var offer = box.querySelector("#offerInput");
    var doOffer = box.querySelector("#doOffer");

    if(askLeft>0){
      askRow.innerHTML = '<div class="askpad">'
        + '<button class="btn sm" id="askBtn"><span>◈ 提 问（剩 '+askLeft+' 次）</span></button>'
        + '<div class="ans-note">逼他打出一张答案卡。<b>好啊</b>=想卖 · <b>也行</b>=中立 · <b>滚</b>=不缺或不贱卖。'
        + '答案卡<span class="em">可能撒谎</span>。</div></div>';
      askRow.querySelector("#askBtn").onclick = function(){
        me().askUsed++;
        var card = aiAnswerCard(seller, fid);
        var cls = card==="滚" ? "bad" : (card==="好啊" ? "good" : "neutral");
        var note = card==="滚"
          ? "他可能不缺这张，或不肯贱卖 —— 底价会偏高。"
          : (card==="好啊" ? "他急着出手，底价可能偏低 —— 也不排除是抬价的谎。" : "中立态度，按常价出手即可。");
        askRow.innerHTML = '<div class="askpad"><div style="font-family:var(--serif);font-size:12.6px;color:var(--bone3);margin-bottom:8px">卖家打出答案卡</div>'
          + '<span class="anscard '+cls+'">'+card+'</span>'
          + '<div class="ans-note">'+note+'</div></div>';
        FX.toast("答案卡：「"+card+"」", cls==="bad"?"blood":"gold");
        renderHUD();
      };
    } else {
      askRow.innerHTML = '<div class="askpad"><div class="ans-note">本回合提问已尽（上限 '+me().askMax+' 次）。只能盲价。</div></div>';
    }

    doOffer.onclick = function(){
      var val = Math.max(0, Math.floor(+offer.value||0));
      if(val > me().gold){ msg.innerHTML = '<span class="no">金币不足。</span>'; return; }
      var floor = aiSellFloor(seller, fid);
      if(val >= floor){
        me().gold -= val; seller.gold += val;
        removeFrom(seller.hand,fid); removeFrom(seller.stall,fid);
        me().hand.push(fid);
        log("你以 "+val+" 从 "+seller.name+" 买下 "+F.name+"（底价≈"+floor+"）","good");
        msg.innerHTML = '<span class="ok">成 交。</span> 你出 '+val+' ≥ 底价 '+floor+'。';
        FX.flash(); FX.sparks(20); FX.goldGain(-val);
        FX.toast("成交 · "+F.name,"gold");
      } else {
        log("你出 "+val+" 想买 "+F.name+"，低于底价 "+floor+"，未成交","bad");
        msg.innerHTML = '<span class="no">未 成 交。</span> 你出 '+val+' &lt; 卖家底价 '+floor+'。下次高一点，或先用答案卡探他的急。';
        FX.toast("他把货收了回去","blood");
      }
      doOffer.disabled = true;
      var ab = box.querySelector("#askBtn"); if(ab) ab.disabled = true;
      setTimeout(function(){ box.remove(); render(); }, 1250);
    };
    box.querySelector("#closeTrade").onclick = function(){ box.remove(); };
    box.addEventListener("click", function(e){ if(e.target===box) box.remove(); });
  }

  /* ---------------- 拍卖 ---------------- */
  function renderAuction(){
    var area = $("auctionArea"); if(!area) return;

    if(G.auctionResults && !G.auctionItems){
      area.innerHTML = '<div class="auc-grid stagger">' + G.auctionResults.map(function(r){
        var mine = IDENTITIES[me().key].selfSet.includes(r.frag);
        return fragCard(r.frag, {need:mine && !me().hand.includes(r.frag), youNeed:mine, extra:
          '<div class="auc-result'+(r.isHuman?" win":"")+'">落槌 <b>'+r.price+'</b> → '+r.winner+'</div>'});
      }).join("") + '</div>';
      return;
    }
    if(!G.auctionItems || !G.auctionItems.length){
      area.innerHTML = '<div class="empty-note">发放池已空。本回合无拍卖。</div>';
      return;
    }
    var h = '<div class="auc-grid stagger">';
    G.auctionItems.forEach(function(it, idx){
      var F = FRAGMENTS[it.frag];
      var myBid = G.auctionPending[idx];
      var myNeed = IDENTITIES[me().key].selfSet.includes(it.frag);
      var extra;
      if(it.done){
        extra = '<div class="auc-result'+(it.winIsHuman?" win":"")+'">落槌 <b>'+it.winPrice+'</b> → '+it.winner+'</div>';
      } else {
        extra = '<div class="bidrow">'
          + '<input type="number" id="ab_'+idx+'" min="0" style="width:88px" value="'
          + (myBid!=null?myBid:Math.min(me().gold, Math.round(F.clear*(myNeed?2.2:1.5))))+'">'
          + '<button class="btn sm" data-ab="'+idx+'"><span>封 蜡</span></button></div>';
      }
      h += fragCard(it.frag, {need:myNeed, youNeed:myNeed, extra:extra, wax:(myBid!=null?myBid:null)});
    });
    h += '</div>';
    var sealed = Object.keys(G.auctionPending||{}).length;
    h += '<div class="recipe-note" style="text-align:left">已封蜡 <b style="color:var(--brass)">'+sealed+'</b>/'+G.auctionItems.length
      + ' 件。全部封蜡后主按钮才会开放落槌。</div>';
    area.innerHTML = h;

    G.auctionItems.forEach(function(it, idx){
      if(it.done) return;
      var b = area.querySelector('[data-ab="'+idx+'"]');
      if(b) b.onclick = function(){
        var v = Math.max(0, Math.floor(+area.querySelector("#ab_"+idx).value||0));
        G.auctionPending[idx] = v;
        FX.toast("封蜡 · "+FRAGMENTS[it.frag].name+" · "+v,"gold");
        render();
      };
    });
  }

  /* ---------------- 结算：审判书 ---------------- */
  function showSettle(res){
    if(!res) return;
    var win = res[0];
    var box = document.createElement("div");
    box.className = "modal";
    var h = '<div class="box judge">'
      + '<div class="judge-h"><div class="lat">IUDICIUM FINALE</div><div class="cn">终 局 审 判</div></div>';
    res.forEach(function(r,i){
      var setName = r.setKey ? IDENTITIES[r.setKey].name : "（未凑齐任何人生）";
      h += '<div class="jrow'+(i===0?" first":"")+(r.isHuman?" you":"")+'">'
        + '<div class="jrank">'+(i+1)+'</div>'
        + '<div class="jface">'+ART.portrait(r.key)+'</div>'
        + '<div class="jbody">'
        +   '<div class="jname">'+r.name+(i===0?' <span class="tag hot">加 冕</span>':'')+'</div>'
        +   '<div class="jdetail">身份 <em>'+IDENTITIES[r.key].name+'</em> · 结算人生 <em>'+setName+'</em>'
        +     (r.setKey ? (r.isSelf?'（自套 '+SET_SCORE_SELF+'）':'（他套 '+SET_SCORE_OTHER+'）') : '')
        +     ' → <em>'+r.setScore+'</em><br>'
        +     '碎片清算 <em>'+r.clearSum+'</em>（'+r.handCount+' 件）· 余金 <em>'+r.gold+'</em> · 技能加分 <em>'+r.skillBonus+'</em>'
        +   '</div>'
        + '</div>'
        + '<div class="jscore">'+r.total+'</div>'
        + '</div>';
    });
    h += '<div class="verdict'+(win.isHuman?" win":"")+'">'
      + (win.isHuman ? "你 赢 了 · 集市记住了你的名字" : win.name+" 加 冕 · 你的人生仍是残缺的")
      + '</div>';
    h += '<div class="modal-actions">'
      + '<button class="btn primary" id="judgeRestart"><span>重 开 一 局</span></button>'
      + '<button class="btn ghost" id="judgeClose"><span>合 上 卷 宗</span></button></div></div>';
    box.innerHTML = h;
    $("modalRoot").appendChild(box);
    FX.flash(); FX.sparks(30);
    FX.toast(win.isHuman?"审判已下 · 你胜":"审判已下 · "+win.name+" 胜", win.isHuman?"gold":"blood");
    box.querySelector("#judgeClose").onclick = function(){ box.remove(); };
    box.querySelector("#judgeRestart").onclick = function(){
      box.remove(); restart();
    };
  }

  /* ---------------- 卷宗 ---------------- */
  function showHelp(){
    var box = document.createElement("div");
    box.className = "modal";
    box.innerHTML = '<div class="box">'
      + '<h3>卷 宗 · ANIMA MERCATUS</h3>'
      + '<div class="sub">《成交》· 暗影集市 v2 —— 玩法与灰盒 v1.4 完全一致</div>'
      + '<p><b>主题</b>：暗色西方玄幻 / 哥特圣像。你在雾中的集市里收集「人生碎片」，把自己拼成一个可被清算的人；三回合后由终极之物审判，分高者胜。</p>'
      + '<p><b>你是谁</b>：左侧圣龛是你的身份立绘与自套配方（对手不可见）。每套 4 块碎片，凑齐自套 = <span class="kbd">'+SET_SCORE_SELF+'</span>，凑齐别人的套 = <span class="kbd">'+SET_SCORE_OTHER+'</span>。</p>'
      + '<p><b>配方公开，身份保密</b>：左下列出全部 6 套各要哪 4 块（众生皆见），但<b>谁在凑哪套</b>是秘密。◈ = 抢手货（2~3 套都要），红痕 = 你自套还缺的牌。</p>'
      + '<p><b>流程</b>：每回合 = 发放 → 自由交易 → 拍卖会，重复 3 次。共 16 种碎片（12 专属 + 4 抢手），每种 3 份，都会真实流入市场。</p>'
      + '<p><b>自由交易</b>：逛摊位 → 点「求 购」→ 可 ◈ 提问逼对方打出答案卡（好啊 / 也行 / 滚，<b>可能撒谎</b>）→ 出价 ≥ 秘密底价即成交。多余牌可在底部手牌坞<b>上架</b>，AI 会掏钱买。</p>'
      + '<p><b>拍卖会</b>：一次性密封价，价高者得，优先上架抢手未发牌 —— 抢跨套碎片的主战场。自套缺口建议出到清算价 2 倍以上。</p>'
      + '<p><b>计分</b>：成套分 + 全部碎片清算价合计 + 剩余金币 +（手牌 ≥ 10 张额外 2000）。</p>'
      + '<div class="modal-actions"><button class="btn ghost" id="closeHelp"><span>合 上</span></button></div>'
      + '</div>';
    $("modalRoot").appendChild(box);
    box.querySelector("#closeHelp").onclick = function(){ box.remove(); };
    box.addEventListener("click", function(e){ if(e.target===box) box.remove(); });
  }

  /* ---------------- 总渲染 ---------------- */
  function render(){
    renderHUD();
    renderOrb();
    renderIdentity();
    renderPublicSets();
    renderOpp();
    renderLog();
    renderHand();
    renderCenter();
  }

  function restart(){
    newGame();
    $("brandSigil").innerHTML = "";
    $("orbWrap").innerHTML = "";
    lastLogId = null;
    render();
    FX.toast("新的一局 · 面具已换","gold");
    FX.phasePulse("deal");
  }

  /* ---------------- 事件绑定 ---------------- */
  function bind(){
    $("btnMain").addEventListener("click", function(){
      var p = G.phase;
      if(p==="start"){ startRound(); }
      else if(p==="deal"){ enterTrade(); }
      else if(p==="trade"){ enterAuction(); }
      else if(p==="auction"){
        if(G.auctionPending!=null){ resolveAuction(); }
        FX.flash();
        endRoundOrNext();
      }
      else if(p==="settle"){ restart(); }
    });

    $("btnAuto").addEventListener("click", function(){
      if(G.phase==="start"){ startRound(); }
      autoPlay();
      FX.toast("自动推演完成","gold");
    });

    $("btnHelp").addEventListener("click", showHelp);

    /* 手牌坞：上架 / 撤下 */
    $("handBox").addEventListener("click", function(e){
      var b = e.target.closest("[data-list]");
      if(!b) return;
      var fid = b.dataset.list, p = me();
      if(p.stall.includes(fid)){
        removeFrom(p.stall, fid);
        FX.toast("已从摊位撤下 · "+FRAGMENTS[fid].name,"blood");
      } else {
        p.stall.push(fid);
        FX.toast("已上架 · "+FRAGMENTS[fid].name,"gold");
        FX.sparks(6);
      }
      render();
    });

    /* 窗口尺寸变化时重制球体尺寸 */
    var t=null;
    window.addEventListener("resize", function(){
      clearTimeout(t);
      t = setTimeout(function(){ $("orbWrap").innerHTML=""; renderOrb(); }, 240);
    });

    /* 键盘：空格 = 主按钮 */
    document.addEventListener("keydown", function(e){
      if(e.code==="Space" && !/input|textarea/i.test((e.target.tagName||""))){
        e.preventDefault(); $("btnMain").click();
      }
      if(e.key==="Escape"){
        var m = $("modalRoot").lastElementChild; if(m) m.remove();
      }
    });
  }

  /* ---------------- 启动 ---------------- */
  function boot(){
    FX.initAsh();
    FX.initStars();
    bind();
    newGame();
    render();
    setTimeout(function(){ FX.toast("暗影集市已开张","gold"); }, 400);
  }

  return { render:render, showSettle:showSettle, boot:boot, fragCard:fragCard };
})();

if(document.readyState==="loading"){
  document.addEventListener("DOMContentLoaded", UI.boot);
}else{
  UI.boot();
}
