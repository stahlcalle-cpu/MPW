fetch('/funds/listoffunds/null/null').then(r=>r.json()).then(funds=>{
window._funds=funds;
window._filtered=funds.slice();
window._pg=0;
window._ps=50;

var s=document.createElement('style');
s.textContent=`*{margin:0;padding:0;box-sizing:border-box}body{font-family:system-ui,sans-serif;background:#f0f2f5;color:#1a2b47}.hd{background:#002359;padding:14px 24px;display:flex;align-items:center;gap:14px}.hd h1{color:#fff;font-size:17px}.hd input{flex:1;max-width:400px;padding:9px 14px;border:none;border-radius:8px;font-size:13px;background:rgba(255,255,255,.12);color:#fff;outline:none}.hd input::placeholder{color:rgba(255,255,255,.4)}.ct{max-width:1100px;margin:16px auto;padding:0 16px}table{width:100%;border-collapse:collapse;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.06)}th{padding:8px 12px;text-align:left;font-size:10px;font-weight:700;color:#627ca5;text-transform:uppercase;background:#f7f8fa;border-bottom:1px solid #e2e6ee;cursor:pointer}td{padding:8px 12px;font-size:12px;border-bottom:1px solid #f0f2f5}tr:hover{background:#f7f9fc;cursor:pointer}.fn{font-weight:600;color:#002359;max-width:250px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pos{color:#22c55e}.neg{color:#ef4444}.ov{display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.4);z-index:100;justify-content:center;align-items:flex-start;padding:30px 16px;overflow-y:auto}.ov.open{display:flex}.dt{background:#fff;border-radius:12px;width:100%;max-width:860px;box-shadow:0 16px 48px rgba(0,0,0,.15)}.dh{background:#002359;color:#fff;padding:18px 22px;display:flex;justify-content:space-between;border-radius:12px 12px 0 0}.dh h2{font-size:17px}.sub{font-size:11px;color:rgba(255,255,255,.5);margin-top:3px}.cb{background:rgba(255,255,255,.1);border:none;color:#fff;width:28px;height:28px;border-radius:6px;cursor:pointer;font-size:16px}.db{padding:20px 22px}.sec{margin-bottom:18px}.sec h3{font-size:11px;font-weight:700;text-transform:uppercase;color:#627ca5;margin-bottom:8px;border-left:3px solid #009fdf;padding-left:7px}.kpis{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:6px}.kp{background:#f7f8fa;border-radius:8px;padding:8px 10px}.kp .l{font-size:9px;color:#627ca5;text-transform:uppercase;font-weight:600}.kp .v{font-size:15px;font-weight:800;margin-top:1px}.chs{display:grid;grid-template-columns:1fr 1fr;gap:14px}.cbx{background:#f7f8fa;border-radius:8px;padding:12px}.cbx h4{font-size:10px;font-weight:700;color:#627ca5;margin-bottom:8px;text-transform:uppercase}.br{display:flex;align-items:center;gap:5px;margin-bottom:4px}.bl{font-size:10px;width:100px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.bt{flex:1;height:12px;background:#e2e6ee;border-radius:3px;overflow:hidden}.bf{height:100%;border-radius:3px}.bp{font-size:10px;font-weight:700;width:36px;text-align:right}.pg{display:flex;justify-content:center;gap:6px;padding:16px}.pg button{padding:5px 12px;border:1px solid #e2e6ee;background:#fff;border-radius:6px;cursor:pointer;font-size:11px;font-weight:600;color:#627ca5}.pg button.ac{background:#009fdf;color:#fff;border-color:#009fdf}.pg button:disabled{opacity:.3}`;

document.open();
document.write('<!DOCTYPE html><html><head><meta charset="utf-8"><title>FundFinder</title></head><body></body></html>');
document.close();
document.head.appendChild(s);

document.body.innerHTML=`<div class="hd"><h1>FundFinder</h1><input id="si" placeholder="Sök fond..."/></div><div class="ct"><div id="cn" style="font-size:11px;color:#627ca5;text-align:right;margin-bottom:6px"></div><table><thead><tr><th>Fondnamn</th><th>ISIN</th><th>YTD</th><th>1 år</th><th>3 år</th><th>Avgift</th><th>Valuta</th></tr></thead><tbody id="tb"></tbody></table><div class="pg" id="pg"></div></div><div class="ov" id="ov"><div class="dt"><div class="dh"><div><h2 id="dn"></h2><div class="sub" id="ds"></div></div><button class="cb" onclick="document.getElementById('ov').classList.remove('open')">✕</button></div><div class="db" id="dd"></div></div></div>`;

function fp(v){return v==null?'–':'<span class="'+(v>=0?'pos':'neg')+'">'+(v>=0?'+':'')+v.toFixed(1)+'%</span>'}

window.renderList=function(){
  var st=_pg*_ps,pd=_filtered.slice(st,st+_ps);
  document.getElementById('cn').textContent='Visar '+(st+1)+'–'+Math.min(st+_ps,_filtered.length)+' av '+_filtered.length+' fonder';
  document.getElementById('tb').innerHTML=pd.map(f=>'<tr onclick="showFund('+f.Id+')"><td class="fn" title="'+f.N+'">'+f.N+'</td><td style="font-size:10px;color:#627ca5">'+f.I+'</td><td>'+fp(f.Y)+'</td><td>'+fp(f.R1)+'</td><td>'+fp(f.R3)+'</td><td>'+(f.M/100).toFixed(2)+'%</td><td>'+f.C+'</td></tr>').join('');
  var tp=Math.ceil(_filtered.length/_ps);
  if(tp<=1){document.getElementById('pg').innerHTML='';return}
  var h='<button '+(0===_pg?'disabled':'')+' onclick="_pg--;renderList()">‹</button>';
  for(var i=Math.max(0,_pg-2);i<=Math.min(tp-1,_pg+2);i++)h+='<button class="'+(i===_pg?'ac':'')+'" onclick="_pg='+i+';renderList()">'+(i+1)+'</button>';
  h+='<button '+(_pg>=tp-1?'disabled':'')+' onclick="_pg++;renderList()">›</button>';
  document.getElementById('pg').innerHTML=h;
};

document.getElementById('si').addEventListener('input',function(e){
  var q=e.target.value.toLowerCase();
  _filtered=q?_funds.filter(f=>(f.N||'').toLowerCase().includes(q)||(f.I||'').toLowerCase().includes(q)):_funds.slice();
  _pg=0;renderList();
});

document.getElementById('ov').addEventListener('click',function(e){if(e.target===this)this.classList.remove('open')});
document.addEventListener('keydown',function(e){if(e.key==='Escape')document.getElementById('ov').classList.remove('open')});

var CL=['#009fdf','#ff6380','#22c55e','#f59e0b','#8b5cf6','#ec4899','#14b8a6','#f97316'];

window.showFund=async function(id){
  document.getElementById('ov').classList.add('open');
  document.getElementById('dd').innerHTML='Laddar...';
  var f=_funds.find(x=>x.Id===id);
  document.getElementById('dn').textContent=f?f.N:'';
  document.getElementById('ds').textContent=f?'ISIN: '+f.I+' · '+f.C+' · ID: '+id:'';
  try{
    var sec=await fetch('/funds/industries/'+id).then(r=>r.json()).catch(()=>[]);
    var reg=await fetch('/funds/regionsandcountries/'+id).then(r=>r.json()).catch(()=>[]);
    var inf=await fetch('/funds/fundinfo/'+id).then(r=>r.json()).catch(()=>null);
    var i=Array.isArray(inf)?inf[0]:inf;
    var h='<div class="sec"><h3>Nyckeltal</h3><div class="kpis">';
    if(i){
      if(i.LatestNavBaseCurrency)h+='<div class="kp"><div class="l">NAV</div><div class="v">'+parseFloat(i.LatestNavBaseCurrency).toLocaleString('sv-SE',{minimumFractionDigits:2})+'</div></div>';
      if(i.OngoingCharge)h+='<div class="kp"><div class="l">Avgift</div><div class="v">'+parseFloat(i.OngoingCharge).toFixed(2)+'%</div></div>';
      if(i.TotalFundValue)h+='<div class="kp"><div class="l">Storlek</div><div class="v">'+(parseFloat(i.TotalFundValue)/1e6).toFixed(0)+' M</div></div>';
      if(i.AssetSubClassName)h+='<div class="kp"><div class="l">Kategori</div><div class="v" style="font-size:11px">'+i.AssetSubClassName+'</div></div>';
      if(i.CompanyName)h+='<div class="kp"><div class="l">Fondbolag</div><div class="v" style="font-size:11px">'+i.CompanyName+'</div></div>';
      if(i.Managers)h+='<div class="kp"><div class="l">Förvaltare</div><div class="v" style="font-size:10px">'+i.Managers+'</div></div>';
    }
    h+='</div></div><div class="chs">';
    if(sec.length){
      sec.sort((a,b)=>b.Slice-a.Slice);
      h+='<div class="cbx"><h4>Sektorer</h4>';
      sec.forEach((s,j)=>{if(s.Slice)h+='<div class="br"><span class="bl">'+s.Name+'</span><div class="bt"><div class="bf" style="width:'+s.Slice+'%;background:'+CL[j%CL.length]+'"></div></div><span class="bp">'+s.Slice.toFixed(1)+'%</span></div>'});
      h+='</div>';
    }
    if(reg.length){
      var rg={};reg.forEach(r=>{if(!rg[r.Region])rg[r.Region]={s:r.RegionShare,c:[]};rg[r.Region].c.push(r)});
      var rl=Object.entries(rg).sort((a,b)=>b[1].s-a[1].s);
      h+='<div class="cbx"><h4>Regioner</h4>';
      rl.forEach(([n,d],j)=>{
        h+='<div class="br"><span class="bl" style="font-weight:700">'+n+'</span><div class="bt"><div class="bf" style="width:'+d.s+'%;background:'+CL[j%CL.length]+'"></div></div><span class="bp">'+d.s.toFixed(1)+'%</span></div>';
        d.c.sort((a,b)=>b.Share-a.Share).slice(0,5).forEach(c=>{
          h+='<div class="br" style="padding-left:14px;opacity:.6"><span class="bl" style="font-size:9px">'+c.CountryName+'</span><div class="bt" style="height:8px"><div class="bf" style="width:'+c.Share+'%;background:'+CL[j%CL.length]+'"></div></div><span class="bp" style="font-size:9px">'+c.Share.toFixed(1)+'%</span></div>';
        });
      });
      h+='</div>';
    }
    h+='</div>';
    document.getElementById('dd').innerHTML=h;
  }catch(e){document.getElementById('dd').innerHTML='Fel: '+e.message}
};

_filtered.sort((a,b)=>(a.N||'').localeCompare(b.N||''));
renderList();
})
