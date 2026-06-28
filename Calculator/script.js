(function(){
  const $=id=>document.getElementById(id);
  const exprEl=$("expr"), resultEl=$("result"), keys=$("keys");
  let expr="";

  const pretty=s=>s.replace(/\*/g,"\u00d7").replace(/\//g,"\u00f7").replace(/-/g,"\u2212");
  const render=()=>{ exprEl.innerHTML = expr ? pretty(expr) : "&nbsp;"; };

  // Evaluate safely: only digits, operators, parentheses and decimal points are allowed.
  function evaluate(e){
    if(!e || !/^[0-9+\-*/(). ]+$/.test(e)) return "Error";
    try{
      const v = Function('"use strict"; return (' + e + ')')();
      if(typeof v!=="number" || !isFinite(v)) return "Error";   // covers /0, NaN, etc.
      return String(Math.round(v*1e10)/1e10);                   // trim float noise
    }catch(_){ return "Error"; }
  }

  function calc(){
    if(!expr) return;
    const out = evaluate(expr);
    resultEl.textContent = out;
    resultEl.classList.toggle("err", out==="Error");
    if(out!=="Error"){ expr=out; render(); }   // chain off the answer
  }
  function press(v){ resultEl.classList.remove("err"); expr+=v; render(); }
  function clearAll(){ expr=""; render(); resultEl.textContent="0"; resultEl.classList.remove("err"); }
  function back(){ expr=expr.slice(0,-1); render(); }

  keys.addEventListener("click",e=>{
    const b=e.target.closest("button"); if(!b) return;
    if(b.dataset.val!==undefined) press(b.dataset.val);
    else if(b.dataset.act==="clear") clearAll();
    else if(b.dataset.act==="back") back();
    else if(b.dataset.act==="equals") calc();
  });

  // keyboard: digits, operators, Enter (=), Backspace, Escape
  window.addEventListener("keydown",e=>{
    const k=e.key;
    if(/^[0-9.+\-*/()]$/.test(k)) press(k);
    else if(k==="Enter"||k==="="){ e.preventDefault(); calc(); }
    else if(k==="Backspace") back();
    else if(k==="Escape") clearAll();
  });

  render();
})();
