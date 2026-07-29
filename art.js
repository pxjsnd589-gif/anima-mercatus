/* =========================================================
   《成交》v2 美术层 · 暗黑奇幻 / 哥特圣像 concept-art 风
   参考调性：骨白 + 干血 + 陈金 + 苔绿；哑光金属、皮革扣带、
   缠布、圣徽、空白瞳孔、被剥夺的目光。
   全部纯 SVG，无外部依赖。
   ========================================================= */
var ART = (function(){

  /* —— 设计令牌 —— */
  var C = {
    bone:"#EDE7DC", bone2:"#D8D2C6", bone3:"#B9B2A4",
    ink:"#1A1917", ink2:"#26251F", ink3:"#0F0E0D",
    blood:"#9E2A25", blood2:"#6E181C", blood3:"#4A1113",
    brass:"#C9A961", brass2:"#B08F4E", brass3:"#7E6534",
    moss:"#2E3A33", moss2:"#3F4F44", moss3:"#5C6459",
    leather:"#5B4636", leather2:"#3D2E24",
    teal:"#2FB79A", ice:"#A9D4EC"
  };

  function uid(p){ return p+"_"+Math.random().toString(36).slice(2,7); }

  /* =======================================================
     一、共用滤镜 / 纹理（纸纹、干笔、暗角）
     ======================================================= */
  function grainDefs(id){
    return ''
    + '<filter id="grain_'+id+'" x="-10%" y="-10%" width="120%" height="120%">'
    +   '<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="7" result="n"/>'
    +   '<feColorMatrix in="n" type="saturate" values="0" result="ng"/>'
    +   '<feComponentTransfer in="ng" result="nc"><feFuncA type="linear" slope="0.30"/></feComponentTransfer>'
    +   '<feComposite in="nc" in2="SourceAlpha" operator="in"/>'
    + '</filter>'
    + '<filter id="rough_'+id+'">'
    +   '<feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="3" result="t"/>'
    +   '<feDisplacementMap in="SourceGraphic" in2="t" scale="1.6" xChannelSelector="R" yChannelSelector="G"/>'
    + '</filter>'
    + '<radialGradient id="vig_'+id+'" cx="50%" cy="38%" r="72%">'
    +   '<stop offset="55%" stop-color="#000" stop-opacity="0"/>'
    +   '<stop offset="100%" stop-color="#000" stop-opacity=".85"/>'
    + '</radialGradient>';
  }

  /* =======================================================
     二、六身份立绘（240x360，正面对称·圣像式）
     ======================================================= */
  var FACE = {
    LOVER:   {robe:C.blood2, robe2:C.blood3, hair:"#C9A961", accent:C.brass,  glow:"#3A1B1B", veil:false, mark:"cross",  head:"crown-flower"},
    KING:    {robe:"#4A2B2B",robe2:"#2A1516", hair:"#8A7248", accent:C.brass, glow:"#3A2A18", veil:false, mark:"none",   head:"crown"},
    HERMIT:  {robe:C.moss2,  robe2:"#232C26", hair:"#CFC8B8", accent:C.moss3, glow:"#23302A", veil:false, mark:"none",   head:"feather"},
    WANDERER:{robe:C.leather,robe2:C.leather2,hair:"#2A1F16", accent:"#A87A3A",glow:"#33241A",veil:false, mark:"none",   head:"scarf"},
    GUARDIAN:{robe:"#2F3C42", robe2:"#1B2429", hair:"#3A322A", accent:"#9AB0BC",glow:"#1F2E34",veil:true,  mark:"none",  head:"hood"},
    BETRAYER:{robe:"#3A2230", robe2:"#1F1220", hair:"#7A2A20", accent:"#9A6AB0",glow:"#2A1428", veil:false, mark:"tears", head:"keys"}
  };

  function portrait(key, opt){
    opt = opt || {};
    var f = FACE[key] || FACE.HERMIT;
    var id = uid(key);
    var p = [];
    p.push('<svg viewBox="0 0 240 360" xmlns="http://www.w3.org/2000/svg" class="portrait-svg" preserveAspectRatio="xMidYMid meet">');
    p.push('<defs>');
    p.push(grainDefs(id));
    p.push('<linearGradient id="bgp_'+id+'" x1="0" y1="0" x2="0" y2="1">'
      + '<stop offset="0%" stop-color="'+f.glow+'"/><stop offset="62%" stop-color="#100C09"/><stop offset="100%" stop-color="#070605"/></linearGradient>');
    p.push('<linearGradient id="robe_'+id+'" x1="0" y1="0" x2="0" y2="1">'
      + '<stop offset="0%" stop-color="'+f.robe+'"/><stop offset="70%" stop-color="'+f.robe2+'"/><stop offset="100%" stop-color="#0B0908"/></linearGradient>');
    p.push('<linearGradient id="skin_'+id+'" x1="0" y1="0" x2="0" y2="1">'
      + '<stop offset="0%" stop-color="#F4EFE6"/><stop offset="60%" stop-color="#DCD2C2"/><stop offset="100%" stop-color="#A79C8C"/></linearGradient>');
    p.push('<linearGradient id="plate_'+id+'" x1="0" y1="0" x2="1" y2="1">'
      + '<stop offset="0%" stop-color="#8E7A50"/><stop offset="38%" stop-color="'+C.brass+'"/>'
      + '<stop offset="55%" stop-color="#F0E0B4"/><stop offset="72%" stop-color="'+C.brass2+'"/>'
      + '<stop offset="100%" stop-color="#4E3F26"/></linearGradient>');
    p.push('<radialGradient id="halo_'+id+'" cx="50%" cy="50%" r="50%">'
      + '<stop offset="0%" stop-color="'+C.brass+'" stop-opacity=".55"/>'
      + '<stop offset="70%" stop-color="'+C.brass3+'" stop-opacity=".12"/>'
      + '<stop offset="100%" stop-color="'+C.brass3+'" stop-opacity="0"/></radialGradient>');
    p.push('</defs>');

    /* 背景 + 圣像拱龛 */
    p.push('<rect width="240" height="360" fill="url(#bgp_'+id+')"/>');
    p.push('<g opacity=".5" stroke="'+f.accent+'" fill="none">');
    p.push('<path d="M28 356 V118 Q28 26 120 26 Q212 26 212 118 V356" stroke-width="1.6" opacity=".55"/>');
    p.push('<path d="M38 356 V122 Q38 38 120 38 Q202 38 202 122 V356" stroke-width=".7" opacity=".32"/>');
    p.push('</g>');
    /* 光晕 */
    p.push('<circle cx="120" cy="104" r="62" fill="url(#halo_'+id+')"/>');
    /* 拱顶符号 */
    p.push('<g opacity=".38" fill="none" stroke="'+C.brass3+'" stroke-width="1">');
    p.push('<path d="M104 46 h32 M120 34 v24"/>');
    p.push('<circle cx="120" cy="46" r="9"/>');
    p.push('</g>');

    /* 影子底座 */
    p.push('<ellipse cx="120" cy="342" rx="66" ry="12" fill="#000" opacity=".65"/>');

    /* ——— 长袍 / 裙摆（下沉入暗） ——— */
    p.push('<path d="M120 150 C88 152 74 200 68 252 L52 344 H188 L172 252 C166 200 152 152 120 150 Z" '
      + 'fill="url(#robe_'+id+')" stroke="'+f.accent+'" stroke-width="1" stroke-opacity=".45"/>');
    /* 裙摆撕裂毛边 */
    p.push('<path d="M52 344 l10 -14 l6 12 l8 -18 l7 16 l9 -20 l8 18 l9 -22 l8 20 l9 -18 l8 16 l7 -14 l7 12 l8 -12 l6 16 l7 -14 l6 14" '
      + 'fill="none" stroke="#0A0807" stroke-width="3" opacity=".8"/>');
    /* 垂直暗影 + 中缝 */
    p.push('<path d="M120 152 V330" stroke="'+f.accent+'" stroke-width=".8" opacity=".28"/>');
    p.push('<path d="M96 168 C88 216 84 268 82 330" stroke="#000" stroke-width="6" opacity=".22" fill="none"/>');
    p.push('<path d="M144 168 C152 216 156 268 158 330" stroke="#000" stroke-width="6" opacity=".22" fill="none"/>');

    /* ——— 手臂 + 缠布 ——— */
    p.push('<path d="M92 168 C74 186 70 226 78 262" fill="none" stroke="'+f.robe2+'" stroke-width="13" stroke-linecap="round"/>');
    p.push('<path d="M148 168 C166 186 170 226 162 262" fill="none" stroke="'+f.robe2+'" stroke-width="13" stroke-linecap="round"/>');
    p.push('<g stroke="'+C.bone2+'" stroke-width="2.4" opacity=".8" fill="none">');
    p.push('<path d="M72 236 l14 4 M71 244 l14 4 M70 252 l14 4"/>');
    p.push('<path d="M168 236 l-14 4 M169 244 l-14 4 M170 252 l-14 4"/>');
    p.push('</g>');

    /* ——— 胸甲（哑光黄铜，竖排线 + 磨损） ——— */
    p.push('<path d="M120 148 C100 148 92 168 92 190 Q120 202 148 190 C148 168 140 148 120 148 Z" fill="url(#plate_'+id+')" stroke="#3A2E1A" stroke-width="1"/>');
    p.push('<g stroke="#5A4A2A" stroke-width=".7" opacity=".65">');
    for(var i=-3;i<=3;i++) p.push('<path d="M'+(120+i*7)+' 152 V193"/>');
    p.push('</g>');
    p.push('<path d="M92 190 Q120 202 148 190" fill="none" stroke="#F2E4BC" stroke-width="1" opacity=".55"/>');

    /* ——— 腰带（皮革 + 大方扣，腰线对齐 40% 高度） ——— */
    p.push('<rect x="80" y="212" width="80" height="16" rx="3" fill="'+C.leather2+'" stroke="#221A13"/>');
    p.push('<rect x="108" y="207" width="24" height="26" rx="3" fill="url(#plate_'+id+')" stroke="#33280F"/>');
    p.push('<rect x="114" y="214" width="12" height="12" rx="2" fill="#100C08"/>');
    p.push('<g fill="'+C.brass3+'" opacity=".9">');
    p.push('<circle cx="88" cy="220" r="2.2"/><circle cx="97" cy="220" r="2.2"/><circle cx="143" cy="220" r="2.2"/><circle cx="152" cy="220" r="2.2"/>');
    p.push('</g>');
    /* 垂饰 */
    p.push('<g stroke="'+C.brass3+'" stroke-width="1" fill="'+C.brass2+'" opacity=".9">');
    p.push('<path d="M100 228 v16" stroke-width="1"/><circle cx="100" cy="248" r="4"/>');
    p.push('<path d="M140 228 v22" stroke-width="1"/><rect x="136" y="250" width="8" height="10" rx="1"/>');
    p.push('</g>');

    /* ——— 颈 / 高领 ——— */
    p.push('<rect x="112" y="126" width="16" height="26" rx="6" fill="url(#skin_'+id+')"/>');
    p.push('<path d="M100 148 Q120 138 140 148 Q140 158 120 160 Q100 158 100 148 Z" fill="'+f.robe2+'" opacity=".95"/>');

    /* ——— 头部（插画风格：精致轮廓 + 光影层次） ——— */
    /* 头发底层（先画，让面部覆盖在上方） */
    p.push(headHairBack(f, id));

    /* 面部：不再是椭圆，而是有下颌轮廓的头型 */
    p.push('<path d="M120 62 C104 62 93 74 90 90 C88 104 89 116 93 126 C97 136 106 142 120 142 C134 142 143 136 147 126 C151 116 152 104 150 90 C147 74 136 62 120 62 Z" fill="url(#skin_'+id+')"/>');
    /* 面部阴影：右侧暗面 */
    p.push('<path d="M120 62 C136 62 147 74 150 90 C152 104 151 116 147 126 C143 136 134 142 120 142 L120 62 Z" fill="#000" opacity=".18"/>');
    /* 面部高光：左侧亮面 */
    p.push('<path d="M120 62 C104 62 93 74 90 90 C89 98 89 106 91 114 C95 100 102 82 120 78 L120 62 Z" fill="#FFF" opacity=".06"/>');
    /* 颧骨淡红 */
    p.push('<ellipse cx="104" cy="110" rx="9" ry="5" fill="'+C.blood+'" opacity=".10"/>');
    p.push('<ellipse cx="136" cy="110" rx="9" ry="5" fill="'+C.blood+'" opacity=".10"/>');
    /* 下颌阴影 */
    p.push('<path d="M97 130 Q120 142 143 130 Q143 136 138 140 Q120 144 102 140 Q97 136 97 130 Z" fill="#000" opacity=".15"/>');

    /* 头发前层（覆盖额头） */
    p.push(headHairFront(f, id));

    /* 眉毛 */
    p.push('<path d="M98 86 Q107 82 116 86" stroke="#3A2E24" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".8"/>');
    p.push('<path d="M124 86 Q133 82 142 86" stroke="#3A2E24" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".8"/>');

    /* 面部：空白瞳孔 / 遮目 —— 剥夺目光 */
    if(f.veil){
      /* 血污面具 / 眼带 */
      p.push('<rect x="86" y="90" width="68" height="18" rx="4" fill="'+C.bone+'" opacity=".92"/>');
      p.push('<path d="M90 99 q10 -6 20 2 q10 6 20 -2 q10 -6 20 2" fill="none" stroke="'+C.blood2+'" stroke-width="2.4" opacity=".8"/>');
      p.push('<path d="M102 108 q2 12 -1 20 M138 108 q-2 12 1 20" stroke="'+C.blood3+'" stroke-width="2" fill="none" opacity=".7"/>');
    } else {
      /* 眼眶 + 眼白 + 瞳孔（插画式：有眼形轮廓） */
      p.push('<path d="M96 96 Q107 92 118 96 Q107 100 96 96" fill="#F6F2EA" opacity=".95"/>');
      p.push('<path d="M122 96 Q133 92 144 96 Q133 100 122 96" fill="#F6F2EA" opacity=".95"/>');
      p.push('<ellipse cx="107" cy="96" rx="2.8" ry="3.2" fill="#15120F" opacity=".65"/>');
      p.push('<ellipse cx="133" cy="96" rx="2.8" ry="3.2" fill="#15120F" opacity=".65"/>');
      /* 瞳孔微光 */
      p.push('<circle cx="108" cy="95" r="0.8" fill="#FFF" opacity=".4"/>');
      p.push('<circle cx="134" cy="95" r="0.8" fill="#FFF" opacity=".4"/>');
      /* 上眼线 */
      p.push('<path d="M96 95 Q107 91 118 95" stroke="#2A1E14" stroke-width="1.2" fill="none" opacity=".6"/>');
      p.push('<path d="M122 95 Q133 91 144 95" stroke="#2A1E14" stroke-width="1.2" fill="none" opacity=".6"/>');
    }

    /* 鼻梁（细线暗示） */
    p.push('<path d="M120 100 L118 116 L122 118" stroke="#B89A82" stroke-width="1" fill="none" opacity=".35"/>');
    p.push('<ellipse cx="117" cy="118" rx="2" ry="1.5" fill="#B89A82" opacity=".25"/>');
    p.push('<ellipse cx="123" cy="118" rx="2" ry="1.5" fill="#B89A82" opacity=".25"/>');

    /* 唇（有形状的嘴，不是一条线） */
    p.push('<path d="M110 122 Q120 126 130 122 Q120 130 110 122" fill="'+C.blood3+'" opacity=".55"/>');
    p.push('<path d="M110 122 Q120 124 130 122" stroke="#3A1A14" stroke-width="0.8" fill="none" opacity=".5"/>');
    p.push('<path d="M114 124 Q120 128 126 124" fill="#000" opacity=".15"/>');

    /* 仪式记号 */
    if(f.mark==="cross"){
      p.push('<path d="M120 66 v16 M112 74 h16" stroke="'+C.blood+'" stroke-width="3" opacity=".9" stroke-linecap="round"/>');
    } else if(f.mark==="tears"){
      p.push('<path d="M107 102 q-2 14 1 22 M133 102 q2 14 -1 22" stroke="'+C.blood2+'" stroke-width="2.4" fill="none" opacity=".8"/>');
      p.push('<path d="M96 112 q10 8 4 18" stroke="'+C.blood3+'" stroke-width="2" fill="none" opacity=".6"/>');
    }

    /* 圣徽 / 道具 */
    p.push(emblem(key, id));

    /* 纸纹 + 暗角 */
    p.push('<rect width="240" height="360" fill="#8A7A5A" opacity=".05" filter="url(#grain_'+id+')"/>');
    p.push('<rect width="240" height="360" fill="url(#vig_'+id+')"/>');
    p.push('</svg>');
    return p.join("");
  }

  function headHairBack(f, id){
    var s = [];
    switch(f.head){
      case "crown-flower":
        /* 痴情者：长发垂落，层次丰富 */
        s.push('<path d="M86 98 Q84 50 120 40 Q156 50 154 98 Q150 70 120 66 Q90 70 86 98 Z" fill="'+f.hair+'" opacity=".85"/>');
        s.push('<path d="M84 98 Q76 140 84 170 M156 98 Q164 140 156 170" stroke="'+f.hair+'" stroke-width="10" fill="none" opacity=".75" stroke-linecap="round"/>');
        /* 发丝层次 */
        s.push('<path d="M88 100 Q82 140 86 168" stroke="'+f.hair+'" stroke-width="3" fill="none" opacity=".5"/>');
        s.push('<path d="M152 100 Q158 140 154 168" stroke="'+f.hair+'" stroke-width="3" fill="none" opacity=".5"/>');
        break;
      case "crown":
        /* 王者：短发威严 */
        s.push('<path d="M90 92 Q92 48 120 42 Q148 48 150 92 Q142 66 120 64 Q98 66 90 92 Z" fill="'+f.hair+'" opacity=".9"/>');
        break;
      case "feather":
        /* 隐士：白发披散 */
        s.push('<path d="M86 98 Q88 48 120 44 Q152 48 154 98 Q148 70 120 68 Q92 70 86 98 Z" fill="'+f.hair+'" opacity=".88"/>');
        s.push('<path d="M84 98 Q74 150 82 196 M156 98 Q166 150 158 196" stroke="'+f.hair+'" stroke-width="8" fill="none" opacity=".7" stroke-linecap="round"/>');
        s.push('<path d="M88 100 Q80 145 84 185" stroke="'+f.hair+'" stroke-width="3" fill="none" opacity=".5"/>');
        s.push('<path d="M152 100 Q160 145 156 185" stroke="'+f.hair+'" stroke-width="3" fill="none" opacity=".5"/>');
        break;
      case "scarf":
        /* 浪子：粗布头巾包裹 */
        s.push('<path d="M86 96 Q88 46 120 42 Q152 46 154 96 Q146 70 120 68 Q94 70 86 96 Z" fill="'+f.hair+'" opacity=".85"/>');
        break;
      case "hood":
        /* 守护者：兜帽深罩 */
        s.push('<path d="M78 110 Q78 42 120 36 Q162 42 162 110 Q146 74 120 74 Q94 74 78 110 Z" fill="'+f.robe2+'" stroke="'+f.accent+'" stroke-width=".8" stroke-opacity=".5"/>');
        s.push('<path d="M78 110 Q70 155 80 196 M162 110 Q170 155 160 196" stroke="'+f.robe2+'" stroke-width="13" fill="none" opacity=".85"/>');
        break;
      case "keys":
        /* 背叛者：凌乱发，角状 */
        s.push('<path d="M82 104 Q82 44 120 38 Q158 44 158 104 Q150 64 120 62 Q90 64 82 104 Z" fill="'+f.hair+'" opacity=".9"/>');
        /* 两侧翘起的发束 */
        s.push('<path d="M82 64 q-14 -20 -5 -34 q8 14 12 26" fill="'+f.hair+'" opacity=".8"/>');
        s.push('<path d="M158 64 q14 -20 5 -34 q-8 14 -12 26" fill="'+f.hair+'" opacity=".8"/>');
        break;
    }
    return s.join("");
  }

  function headHairFront(f, id){
    var s = [];
    switch(f.head){
      case "crown-flower":
        /* 前额碎发 + 花饰 */
        s.push('<path d="M92 76 Q96 58 120 54 Q144 58 148 76 Q138 68 120 66 Q102 68 92 76 Z" fill="'+f.hair+'" opacity=".95"/>');
        /* 碎刘海 */
        s.push('<path d="M96 78 q4 -6 8 -2 M104 76 q4 -6 8 -2 M128 76 q4 -6 8 -2 M136 78 q4 -6 8 -2" stroke="'+f.hair+'" stroke-width="2" fill="none" opacity=".7"/>');
        /* 血色花饰 */
        s.push('<g fill="'+C.blood2+'" opacity=".85"><circle cx="96" cy="56" r="4"/><circle cx="120" cy="46" r="4.6"/><circle cx="144" cy="56" r="4"/></g>');
        s.push('<g fill="'+C.blood3+'" opacity=".7"><circle cx="96" cy="56" r="1.5"/><circle cx="120" cy="46" r="1.8"/><circle cx="144" cy="56" r="1.5"/></g>');
        break;
      case "crown":
        /* 王者前发 + 金冠 */
        s.push('<path d="M94 76 Q98 56 120 52 Q142 56 146 76 Q136 68 120 66 Q104 68 94 76 Z" fill="'+f.hair+'" opacity=".92"/>');
        s.push('<path d="M94 56 L102 28 L120 50 L138 28 L146 56 Z" fill="url(#plate_'+id+')" stroke="#3A2C14" stroke-width="1"/>');
        s.push('<circle cx="120" cy="40" r="3.6" fill="'+C.blood+'"/>');
        s.push('<circle cx="102" cy="32" r="2.4" fill="'+C.teal+'" opacity=".85"/><circle cx="138" cy="32" r="2.4" fill="'+C.teal+'" opacity=".85"/>');
        /* 冠底带 */
        s.push('<rect x="92" y="54" width="56" height="5" rx="1" fill="url(#plate_'+id+')" opacity=".8"/>');
        break;
      case "feather":
        /* 隐士前发 + 羽毛 */
        s.push('<path d="M92 78 Q96 54 120 50 Q144 54 148 78 Q138 70 120 68 Q102 70 92 78 Z" fill="'+f.hair+'" opacity=".92"/>');
        s.push('<path d="M92 78 q4 -4 8 -1 M128 78 q4 -3 8 1" stroke="'+f.hair+'" stroke-width="2" fill="none" opacity=".6"/>');
        s.push('<path d="M148 54 q22 -22 28 -34 q-16 6 -30 26" fill="'+C.bone2+'" opacity=".75" stroke="'+C.brass3+'" stroke-width=".6"/>');
        s.push('<path d="M152 48 q14 -10 20 -22" stroke="'+C.brass3+'" stroke-width=".8" fill="none" opacity=".6"/>');
        break;
      case "scarf":
        /* 浪子粗布头巾覆盖额头 */
        s.push('<path d="M90 82 Q120 92 150 82 Q154 96 120 100 Q86 96 90 82 Z" fill="'+C.leather2+'" stroke="#241B14"/>');
        s.push('<path d="M90 82 Q120 76 150 82" stroke="#5A4030" stroke-width="1" fill="none" opacity=".6"/>');
        s.push('<g stroke="#3D2E24" stroke-width=".6" opacity=".5"><path d="M96 85 H144 M98 90 H142"/></g>');
        break;
      case "hood":
        /* 守护者兜帽前缘 */
        s.push('<path d="M78 110 Q86 82 120 78 Q154 82 162 110 Q150 90 120 88 Q90 90 78 110 Z" fill="'+f.robe2+'" opacity=".9"/>');
        s.push('<path d="M78 110 Q86 82 120 78 Q154 82 162 110" stroke="'+f.accent+'" stroke-width="1" fill="none" opacity=".4"/>');
        break;
      case "keys":
        /* 背叛者凌乱前发 + 钥匙装饰 */
        s.push('<path d="M88 82 Q92 52 120 48 Q148 52 152 82 Q142 66 120 64 Q98 66 88 82 Z" fill="'+f.hair+'" opacity=".95"/>');
        /* 不规则刘海 */
        s.push('<path d="M94 82 q6 -8 12 -3 M108 80 q6 -8 12 -3 M126 80 q6 -8 12 -3 M138 82 q6 -8 8 0" stroke="'+f.hair+'" stroke-width="2.5" fill="none" opacity=".7"/>');
        s.push('<g stroke="'+C.brass2+'" stroke-width="1.4" fill="none" opacity=".9">');
        s.push('<path d="M158 232 v22"/><circle cx="158" cy="258" r="4.5"/><path d="M158 244 h6 M158 250 h5"/>');
        s.push('<path d="M168 228 v18"/><circle cx="168" cy="250" r="3.6"/>');
        s.push('</g>');
        break;
    }
    return s.join("");
  }

  function headwear(f, id){ return headHairBack(f,id) + headHairFront(f,id); }

  function emblem(key, id){
    var s=[];
    switch(key){
      case "LOVER":
        s.push('<g transform="translate(0,4)"><rect x="60" y="248" width="34" height="24" rx="2" fill="'+C.bone+'" stroke="'+C.brass3+'" transform="rotate(-10 77 260)"/>'
          + '<path d="M60 250 L77 264 L94 250" fill="none" stroke="#8A6A3A" stroke-width="1.4" transform="rotate(-10 77 260)"/>'
          + '<path d="M77 248 l-4 -10 l8 4 Z" fill="'+C.blood2+'" transform="rotate(-10 77 260)"/></g>');
        s.push('<g stroke="'+C.brass+'" fill="none" stroke-width="2.4"><circle cx="162" cy="256" r="9"/></g><circle cx="162" cy="247" r="3.4" fill="'+C.blood+'"/>');
        break;
      case "KING":
        s.push('<line x1="176" y1="262" x2="188" y2="96" stroke="url(#plate_'+id+')" stroke-width="5"/>');
        s.push('<circle cx="188" cy="90" r="8" fill="url(#plate_'+id+')" stroke="#3A2C14"/><path d="M184 88 l4 -8 l4 8" fill="'+C.blood+'"/>');
        break;
      case "HERMIT":
        s.push('<line x1="62" y1="258" x2="52" y2="92" stroke="#5A4632" stroke-width="5"/>');
        s.push('<path d="M52 88 q-12 -14 -2 -22 q12 6 8 22 Z" fill="'+C.moss2+'" stroke="'+C.brass3+'" stroke-width=".8"/>');
        s.push('<g fill="'+C.brass2+'" opacity=".9"><circle cx="176" cy="292" r="3.4"/><circle cx="185" cy="296" r="3.4"/></g>');
        break;
      case "WANDERER":
        s.push('<g transform="rotate(24 120 260)"><ellipse cx="152" cy="268" rx="24" ry="18" fill="#6A4A2A" stroke="'+C.brass3+'"/>'
          + '<circle cx="152" cy="268" r="6.5" fill="#100C08"/>'
          + '<rect x="149" y="214" width="6" height="42" rx="2" fill="#4A3216"/>'
          + '<g stroke="'+C.bone3+'" stroke-width=".7"><path d="M150 220 V264 M154 220 V264"/></g></g>');
        break;
      case "GUARDIAN":
        s.push('<path d="M62 236 L92 246 V276 Q92 300 62 312 Q32 300 32 276 V246 Z" fill="#26313A" stroke="'+C.brass3+'" stroke-width="1.2"/>');
        s.push('<path d="M62 246 V300 M42 272 H82" stroke="'+C.brass+'" stroke-width="1.6" opacity=".8"/>');
        s.push('<path d="M176 224 l10 4 l6 62 l-11 6 l-11 -6 Z" fill="#2A383F" stroke="'+C.brass3+'"/>');
        s.push('<circle cx="181" cy="252" r="4" fill="'+C.ice+'" opacity=".8"/>');
        break;
      case "BETRAYER":
        s.push('<path d="M182 216 l5 56 l-5 8 l-5 -8 l0 -56 Z" fill="#C8C8D0" stroke="#5A5A66"/>');
        s.push('<rect x="176" y="278" width="12" height="7" rx="2" fill="#3A2A1A"/>');
        s.push('<path d="M182 220 v50" stroke="'+C.blood3+'" stroke-width="1.2" opacity=".7"/>');
        s.push('<path d="M62 250 q-8 14 2 26" fill="none" stroke="'+C.bone+'" stroke-width="5"/>');
        break;
    }
    return s.join("");
  }

  /* =======================================================
     三、16 枚遗物图标（88x88，蚀刻风 · 陈金描边 + 骨白高光）
     ======================================================= */
  function fragIcon(fid, cls){
    var id = uid("f");
    var s = '<svg viewBox="0 0 88 88" xmlns="http://www.w3.org/2000/svg" class="'+(cls||"frag-icon")+'">';
    s += '<defs>'
      + '<linearGradient id="mtl_'+id+'" x1="0" y1="0" x2="1" y2="1">'
      +   '<stop offset="0%" stop-color="#7E6534"/><stop offset="35%" stop-color="'+C.brass+'"/>'
      +   '<stop offset="52%" stop-color="#F4E7C0"/><stop offset="70%" stop-color="'+C.brass2+'"/>'
      +   '<stop offset="100%" stop-color="#4A3B22"/></linearGradient>'
      + '<radialGradient id="gl_'+id+'" cx="50%" cy="50%" r="50%">'
      +   '<stop offset="0%" stop-color="#FFF3D0" stop-opacity=".85"/>'
      +   '<stop offset="100%" stop-color="#C9A961" stop-opacity="0"/></radialGradient>'
      + grainDefs(id)
      + '</defs>';
    /* 底衬：蚀刻圆盘 */
    s += '<circle cx="44" cy="44" r="37" fill="#14110D" opacity=".55"/>';
    s += '<circle cx="44" cy="44" r="37" fill="none" stroke="'+C.brass3+'" stroke-width=".8" opacity=".5" stroke-dasharray="2 4"/>';

    var g = 'url(#mtl_'+id+')';
    switch(fid){
      case "ring":
        s += '<circle cx="44" cy="48" r="17" fill="none" stroke="'+g+'" stroke-width="5"/>'
           + '<circle cx="44" cy="48" r="17" fill="none" stroke="#2A2013" stroke-width="1" opacity=".7"/>'
           + '<path d="M36 28 l8 -8 l8 8 l-8 7 Z" fill="'+C.blood+'" stroke="'+g+'" stroke-width="1.6"/>'
           + '<circle cx="44" cy="28" r="2" fill="#FFE7B0" opacity=".8"/>'; break;
      case "letter":
        s += '<rect x="18" y="28" width="52" height="34" rx="2" fill="'+C.bone+'" stroke="'+g+'" stroke-width="2"/>'
           + '<path d="M18 30 L44 50 L70 30" fill="none" stroke="#9A8258" stroke-width="1.6"/>'
           + '<path d="M40 56 q6 -10 12 0" fill="none" stroke="#B9B2A4" stroke-width="1"/>'
           + '<circle cx="44" cy="52" r="5" fill="'+C.blood2+'" opacity=".9"/>'
           + '<path d="M41 52 h6 M44 49 v6" stroke="#3A0E10" stroke-width="1"/>'; break;
      case "scepter":
        s += '<line x1="44" y1="20" x2="44" y2="72" stroke="'+g+'" stroke-width="5"/>'
           + '<circle cx="44" cy="18" r="9" fill="'+C.blood2+'" stroke="'+g+'" stroke-width="2"/>'
           + '<circle cx="44" cy="18" r="9" fill="url(#gl_'+id+')"/>'
           + '<path d="M34 30 h20 M36 38 h16" stroke="'+g+'" stroke-width="2"/>'
           + '<rect x="36" y="70" width="16" height="5" rx="2" fill="'+g+'"/>'; break;
      case "crown":
        s += '<path d="M16 60 L24 28 L34 46 L44 24 L54 46 L64 28 L72 60 Z" fill="#40331C" stroke="'+g+'" stroke-width="2.4"/>'
           + '<path d="M16 60 h56" stroke="'+g+'" stroke-width="3"/>'
           + '<circle cx="44" cy="42" r="4" fill="'+C.blood+'"/><circle cx="28" cy="46" r="2.6" fill="'+C.teal+'"/><circle cx="60" cy="46" r="2.6" fill="'+C.teal+'"/>'; break;
      case "mountain":
        s += '<path d="M12 66 L32 26 L46 50 L56 34 L76 66 Z" fill="'+C.moss+'" stroke="'+g+'" stroke-width="2"/>'
           + '<path d="M27 34 L32 26 L37 35 L32 39 Z" fill="'+C.bone+'" opacity=".85"/>'
           + '<path d="M52 40 L56 34 L60 41" fill="'+C.bone2+'" opacity=".6"/>'
           + '<path d="M12 66 h64" stroke="'+C.brass3+'" stroke-width="1" opacity=".7"/>'; break;
      case "scripture":
        s += '<rect x="22" y="18" width="44" height="52" rx="2" fill="#3E3221" stroke="'+g+'" stroke-width="2"/>'
           + '<line x1="44" y1="18" x2="44" y2="70" stroke="'+g+'" stroke-width="1.6"/>'
           + '<g stroke="#C8B48A" stroke-width="1" opacity=".8">'
           + '<path d="M28 30 h12 M48 30 h12 M28 38 h12 M48 38 h12 M28 46 h9 M48 46 h12"/></g>'
           + '<path d="M44 12 v10 M39 16 h10" stroke="'+C.blood+'" stroke-width="2"/>'; break;
      case "wine":
        s += '<path d="M34 18 h20 v14 q0 12 -10 18 q-10 -6 -10 -18 Z" fill="'+C.blood3+'" stroke="'+g+'" stroke-width="2"/>'
           + '<path d="M34 26 q10 6 20 0" fill="none" stroke="'+C.blood+'" stroke-width="2.4"/>'
           + '<rect x="41" y="50" width="6" height="16" fill="'+g+'"/>'
           + '<ellipse cx="44" cy="68" rx="12" ry="4" fill="'+g+'"/>'; break;
      case "guitar":
        s += '<g transform="rotate(-24 44 48)"><ellipse cx="40" cy="56" rx="20" ry="16" fill="#6A4A2A" stroke="'+g+'" stroke-width="2"/>'
           + '<circle cx="40" cy="56" r="6" fill="#100C08"/>'
           + '<rect x="37" y="16" width="6" height="30" rx="2" fill="#3E2B14" stroke="'+C.brass3+'" stroke-width=".6"/>'
           + '<g stroke="'+C.bone3+'" stroke-width=".8"><path d="M38 20 V70 M42 20 V70"/></g>'
           + '<path d="M41 34 q6 6 2 12" stroke="'+C.bone+'" stroke-width="1" fill="none"/></g>'; break;
      case "lamp":
        s += '<path d="M28 34 h32 l-5 32 h-22 Z" fill="#2E2519" stroke="'+g+'" stroke-width="2"/>'
           + '<path d="M32 34 q12 -18 24 0" fill="none" stroke="'+g+'" stroke-width="2"/>'
           + '<circle cx="44" cy="48" r="11" fill="url(#gl_'+id+')"/>'
           + '<path d="M44 42 q4 6 0 12 q-4 -6 0 -12" fill="#FFE9B4" opacity=".95"/>'
           + '<path d="M30 66 h28" stroke="'+g+'" stroke-width="2.4"/>'; break;
      case "shield":
        s += '<path d="M44 14 L70 24 V46 Q70 66 44 76 Q18 66 18 46 V24 Z" fill="#26313A" stroke="'+g+'" stroke-width="2.4"/>'
           + '<path d="M44 22 V64 M26 42 H62" stroke="'+g+'" stroke-width="2.4"/>'
           + '<circle cx="44" cy="42" r="5" fill="'+C.blood2+'"/>'
           + '<path d="M44 14 L70 24 V46 Q70 66 44 76" fill="#fff" opacity=".05"/>'; break;
      case "contract":
        s += '<rect x="18" y="22" width="52" height="42" rx="3" fill="'+C.bone+'" stroke="'+g+'" stroke-width="2"/>'
           + '<g stroke="#9A8258" stroke-width="1.3"><path d="M24 32 h40 M24 40 h32 M24 48 h36"/></g>'
           + '<circle cx="60" cy="60" r="7" fill="'+C.blood2+'" stroke="#3A0E10"/>'
           + '<path d="M56 60 h8 M60 56 v8" stroke="#F0D9A8" stroke-width="1"/>'; break;
      case "dagger":
        s += '<path d="M44 12 L50 52 L44 60 L38 52 Z" fill="#CFCFD6" stroke="#4A4A55" stroke-width="1.2"/>'
           + '<path d="M44 16 V52" stroke="#fff" stroke-width="1" opacity=".7"/>'
           + '<path d="M30 58 h28" stroke="'+g+'" stroke-width="4"/>'
           + '<rect x="40" y="60" width="8" height="16" rx="2" fill="#3A2A1A" stroke="'+C.brass3+'" stroke-width=".8"/>'
           + '<path d="M46 30 q4 12 -2 20" stroke="'+C.blood2+'" stroke-width="1.4" fill="none" opacity=".8"/>'; break;
      case "memory":
        s += '<path d="M44 14 L51 34 L72 34 L55 47 L61 68 L44 55 L27 68 L33 47 L16 34 L37 34 Z" fill="#2F2038" stroke="'+g+'" stroke-width="1.8"/>'
           + '<circle cx="44" cy="43" r="9" fill="url(#gl_'+id+')"/>'
           + '<circle cx="44" cy="43" r="5" fill="#B98BD0" opacity=".85"/>'; break;
      case "coin":
        s += '<circle cx="44" cy="44" r="24" fill="#453520" stroke="'+g+'" stroke-width="3"/>'
           + '<circle cx="44" cy="44" r="15" fill="none" stroke="'+g+'" stroke-width="1.4" stroke-dasharray="3 3"/>'
           + '<path d="M38 44 l5 5 l9 -11" fill="none" stroke="#F0DFB2" stroke-width="2.4"/>'
           + '<path d="M22 34 q22 -10 44 0" fill="none" stroke="#fff" stroke-width="1" opacity=".18"/>'; break;
      case "cat":
        s += '<path d="M26 54 q-4 -26 18 -26 q22 0 18 26 q0 14 -18 14 q-18 0 -18 -14 Z" fill="#211C19" stroke="'+g+'" stroke-width="1.6"/>'
           + '<path d="M26 32 L31 16 L41 28 Z" fill="#211C19" stroke="'+g+'" stroke-width="1.2"/>'
           + '<path d="M62 32 L57 16 L47 28 Z" fill="#211C19" stroke="'+g+'" stroke-width="1.2"/>'
           + '<ellipse cx="35" cy="48" rx="4" ry="5" fill="'+C.brass+'"/><ellipse cx="53" cy="48" rx="4" ry="5" fill="'+C.brass+'"/>'
           + '<path d="M35 46 v5 M53 46 v5" stroke="#150F0A" stroke-width="1.6"/>'
           + '<path d="M44 56 l-3 3 l3 2 l3 -2 Z" fill="'+C.blood3+'"/>'; break;
      case "stone":
        s += '<path d="M20 52 Q16 34 34 30 Q52 24 62 38 Q72 52 60 62 Q42 70 26 62 Q20 58 20 52 Z" fill="#3A3834" stroke="'+g+'" stroke-width="2"/>'
           + '<path d="M30 44 Q40 40 50 46" fill="none" stroke="#5F5A50" stroke-width="1.6"/>'
           + '<path d="M26 54 Q38 58 54 54" fill="none" stroke="#2A2724" stroke-width="1.6"/>'
           + '<circle cx="56" cy="36" r="3" fill="'+C.teal+'" opacity=".55"/>'; break;
      default:
        s += '<circle cx="44" cy="44" r="18" fill="none" stroke="'+g+'" stroke-width="2"/>';
    }
    s += '<circle cx="44" cy="44" r="37" fill="#8A7A5A" opacity=".07" filter="url(#grain_'+id+')"/>';
    s += '</svg>';
    return s;
  }

  /* =======================================================
     四、终极之物：旋转的华丽金属球（多层 SVG，CSS 驱动自转）
     ======================================================= */
  function orb(size){
    size = size || 260;
    var id = uid("orb");
    var s = '<svg viewBox="0 0 200 200" width="'+size+'" height="'+size+'" xmlns="http://www.w3.org/2000/svg" class="orb-svg">';
    s += '<defs>'
      /* 球体金属渐变 */
      + '<radialGradient id="sph_'+id+'" cx="36%" cy="30%" r="76%">'
      +   '<stop offset="0%" stop-color="#FBF0CE"/>'
      +   '<stop offset="18%" stop-color="#E2C88B"/>'
      +   '<stop offset="42%" stop-color="'+C.brass2+'"/>'
      +   '<stop offset="68%" stop-color="#6B5530"/>'
      +   '<stop offset="88%" stop-color="#2E2416"/>'
      +   '<stop offset="100%" stop-color="#171208"/>'
      + '</radialGradient>'
      /* 环形金属 */
      + '<linearGradient id="ring_'+id+'" x1="0" y1="0" x2="1" y2="1">'
      +   '<stop offset="0%" stop-color="#5A4726"/><stop offset="30%" stop-color="'+C.brass+'"/>'
      +   '<stop offset="50%" stop-color="#FFF4D2"/><stop offset="72%" stop-color="'+C.brass2+'"/>'
      +   '<stop offset="100%" stop-color="#3E3119"/>'
      + '</linearGradient>'
      /* 核心冷光 */
      + '<radialGradient id="core_'+id+'" cx="50%" cy="50%" r="50%">'
      +   '<stop offset="0%" stop-color="#DFF6FF" stop-opacity=".95"/>'
      +   '<stop offset="45%" stop-color="'+C.teal+'" stop-opacity=".55"/>'
      +   '<stop offset="100%" stop-color="'+C.teal+'" stop-opacity="0"/>'
      + '</radialGradient>'
      + '<radialGradient id="aur_'+id+'" cx="50%" cy="50%" r="50%">'
      +   '<stop offset="60%" stop-color="'+C.brass+'" stop-opacity="0"/>'
      +   '<stop offset="82%" stop-color="'+C.brass+'" stop-opacity=".22"/>'
      +   '<stop offset="100%" stop-color="'+C.brass+'" stop-opacity="0"/>'
      + '</radialGradient>'
      + '<filter id="soft_'+id+'"><feGaussianBlur stdDeviation="2.4"/></filter>'
      + '<filter id="soft2_'+id+'"><feGaussianBlur stdDeviation="6"/></filter>'
      + grainDefs(id)
      + '</defs>';

    /* 外层光雾 */
    s += '<circle cx="100" cy="100" r="94" fill="url(#aur_'+id+')" class="orb-aura"/>';

    /* 最外符文环（逆时针） */
    s += '<g class="orb-rune-ring">';
    s += '<circle cx="100" cy="100" r="88" fill="none" stroke="'+C.brass3+'" stroke-width="1" opacity=".7" stroke-dasharray="1 7"/>';
    s += '<circle cx="100" cy="100" r="82" fill="none" stroke="'+C.brass3+'" stroke-width=".6" opacity=".45"/>';
    for(var k=0;k<12;k++){
      var a = k*30;
      s += '<g transform="rotate('+a+' 100 100)">'
         + '<path d="M100 12 l4 8 l-4 7 l-4 -7 Z" fill="'+C.brass2+'" opacity=".9"/>'
         + (k%3===0 ? '<path d="M96 30 h8 M100 26 v10" stroke="'+C.blood+'" stroke-width="1.4" opacity=".8"/>' : '')
         + '</g>';
    }
    s += '</g>';

    /* 赤道大环（顺时针，带扣件） */
    s += '<g class="orb-belt">';
    s += '<ellipse cx="100" cy="100" rx="76" ry="22" fill="none" stroke="url(#ring_'+id+')" stroke-width="7"/>';
    s += '<ellipse cx="100" cy="100" rx="76" ry="22" fill="none" stroke="#1A1409" stroke-width="1" opacity=".8"/>';
    s += '<g fill="url(#ring_'+id+')" stroke="#241B0E" stroke-width=".8">';
    s += '<rect x="168" y="92" width="16" height="16" rx="3"/><rect x="16" y="92" width="16" height="16" rx="3"/>';
    s += '<rect x="94" y="76" width="12" height="10" rx="2"/><rect x="94" y="114" width="12" height="10" rx="2"/>';
    s += '</g></g>';

    /* 倾斜环 A */
    s += '<g class="orb-ring-a"><ellipse cx="100" cy="100" rx="70" ry="26" fill="none" stroke="url(#ring_'+id+')" stroke-width="4" transform="rotate(34 100 100)" opacity=".95"/></g>';
    /* 倾斜环 B */
    s += '<g class="orb-ring-b"><ellipse cx="100" cy="100" rx="66" ry="20" fill="none" stroke="url(#ring_'+id+')" stroke-width="3" transform="rotate(-52 100 100)" opacity=".85"/></g>';

    /* 球体本体 */
    s += '<circle cx="100" cy="100" r="56" fill="url(#sph_'+id+')"/>';
    /* 经纬蚀刻（随球自转） */
    s += '<g class="orb-lat" clip-path="none" opacity=".55">';
    s += '<g stroke="#2A2013" stroke-width=".9" fill="none">';
    s += '<ellipse cx="100" cy="100" rx="56" ry="14"/><ellipse cx="100" cy="100" rx="56" ry="30"/><ellipse cx="100" cy="100" rx="56" ry="45"/>';
    s += '</g></g>';
    s += '<g class="orb-lon" opacity=".5"><g stroke="#2A2013" stroke-width=".9" fill="none">';
    s += '<ellipse cx="100" cy="100" rx="14" ry="56"/><ellipse cx="100" cy="100" rx="30" ry="56"/><ellipse cx="100" cy="100" rx="45" ry="56"/>';
    s += '</g></g>';
    /* 球体镜面高光 + 磨损 */
    s += '<ellipse cx="80" cy="76" rx="20" ry="13" fill="#FFF8E2" opacity=".5" filter="url(#soft_'+id+')" transform="rotate(-28 80 76)"/>';
    s += '<ellipse cx="120" cy="128" rx="26" ry="10" fill="'+C.brass+'" opacity=".18" filter="url(#soft_'+id+')"/>';
    s += '<circle cx="100" cy="100" r="56" fill="none" stroke="#0D0A06" stroke-width="2" opacity=".7"/>';
    s += '<circle cx="100" cy="100" r="56" fill="#8A7A5A" opacity=".10" filter="url(#grain_'+id+')"/>';

    /* 球心裂隙冷光（脉动） */
    s += '<g class="orb-core">';
    s += '<circle cx="100" cy="100" r="26" fill="url(#core_'+id+')"/>';
    s += '<path d="M100 74 l7 20 l-7 8 l-7 -8 Z" fill="#E9FBFF" opacity=".55" filter="url(#soft_'+id+')"/>';
    s += '<path d="M86 100 q14 -8 28 0 q-14 8 -28 0 Z" fill="#FFFDF2" opacity=".7"/>';
    s += '</g>';

    /* 悬浮碎片卫星 */
    s += '<g class="orb-sat">';
    s += '<g transform="rotate(0 100 100)"><rect x="95" y="5" width="10" height="10" rx="2" fill="url(#ring_'+id+')" stroke="#221A0C" stroke-width=".8"/></g>';
    s += '<g transform="rotate(120 100 100)"><rect x="96" y="6" width="8" height="8" rx="2" fill="'+C.brass+'" stroke="#221A0C" stroke-width=".8"/></g>';
    s += '<g transform="rotate(240 100 100)"><rect x="96" y="6" width="8" height="8" rx="2" fill="'+C.brass2+'" stroke="#221A0C" stroke-width=".8"/></g>';
    s += '</g>';

    s += '</svg>';
    return s;
  }

  /* 小型印章（身份徽记，用于对手行 / 结算） */
  function sigil(key, size){
    size = size || 46;
    var id = uid("sg");
    var f = FACE[key] || FACE.HERMIT;
    var s = '<svg viewBox="0 0 60 60" width="'+size+'" height="'+size+'" xmlns="http://www.w3.org/2000/svg" class="sigil">';
    s += '<defs><linearGradient id="sg_'+id+'" x1="0" y1="0" x2="1" y2="1">'
      + '<stop offset="0%" stop-color="#6B5530"/><stop offset="45%" stop-color="'+C.brass+'"/>'
      + '<stop offset="60%" stop-color="#FBEFC8"/><stop offset="100%" stop-color="#3A2E18"/></linearGradient></defs>';
    s += '<circle cx="30" cy="30" r="27" fill="#13100C" stroke="url(#sg_'+id+')" stroke-width="1.6"/>';
    s += '<circle cx="30" cy="30" r="22" fill="none" stroke="'+f.accent+'" stroke-width=".7" stroke-dasharray="2 3" opacity=".7"/>';
    var m = {
      LOVER:   '<path d="M30 42 C18 33 20 20 30 24 C40 20 42 33 30 42 Z" fill="'+C.blood+'" opacity=".9"/>',
      KING:    '<path d="M16 40 L20 20 L30 32 L40 20 L44 40 Z" fill="url(#sg_'+id+')"/>',
      HERMIT:  '<path d="M14 42 L26 20 L34 33 L40 24 L46 42 Z" fill="'+C.moss3+'"/>',
      WANDERER:'<circle cx="30" cy="34" r="10" fill="none" stroke="url(#sg_'+id+')" stroke-width="3"/><path d="M30 24 V14" stroke="url(#sg_'+id+')" stroke-width="3"/>',
      GUARDIAN:'<path d="M30 14 L44 20 V34 Q44 44 30 48 Q16 44 16 34 V20 Z" fill="none" stroke="url(#sg_'+id+')" stroke-width="2.6"/>',
      BETRAYER:'<path d="M30 12 L34 36 L30 42 L26 36 Z" fill="#CFCFD6"/><path d="M20 40 h20" stroke="url(#sg_'+id+')" stroke-width="2.4"/>'
    };
    s += (m[key]||m.HERMIT);
    s += '</svg>';
    return s;
  }

  return { portrait:portrait, fragIcon:fragIcon, orb:orb, sigil:sigil, C:C };
})();
