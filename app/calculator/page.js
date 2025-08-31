'use client'
import { useState } from 'react';
import settings from '@/content/settings.json';

export default function Calculator(){
  const nisabDefault = settings.nisab || 0;
  const [form,setForm] = useState({gold:'',silver:'',cash:'',bank:'',business:'',investments:'',property:'',other:'',liabilities:''});
  const [result,setResult] = useState(null);
  const [status,setStatus] = useState(null);
  const [nisab,setNisab] = useState(nisabDefault);

  const handle = (k,v)=> setForm(s=>({ ...s, [k]: v }));

  const calcLocal = (payload)=>{
    const n = v => Number(String(v).replace(/[^0-9.-]+/g,'')) || 0;
    const total = n(payload.gold) + n(payload.silver) + n(payload.cash) + n(payload.bank) + n(payload.business) + n(payload.investments) + n(payload.property) + n(payload.other);
    const liabilities = n(payload.liabilities);
    const net = Math.max(0, total - liabilities);
    const zakaat = +(net * 0.025).toFixed(2);
    return { totalAssets: total, liabilities, netAssets: net, zakaat };
  };

  const submit = async (e)=>{
    e.preventDefault();
    setStatus('Calculating...');
    const payload = { ...form, created: new Date().toISOString() };
    const res = await fetch('/api/calc', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
    const data = await res.json();
    if(res.ok){ setResult(data); setStatus('Saved to logs'); }
    else { setStatus('Calculation failed'); }
  };

  return (
    <div className='card'>
      <h2 className='text-xl font-semibold'>Zakaat Calculator</h2>
      <p className='small mt-1'>Nisab (editable): <input className='input inline-block w-40 ml-2' value={nisab} onChange={e=>setNisab(e.target.value)} /></p>
      <form onSubmit={submit} className='grid gap-3 mt-4'>
        {['gold','silver','cash','bank','business','investments','property','other'].map(k=>(
          <div key={k}>
            <label className='small'>{k.charAt(0).toUpperCase()+k.slice(1)} (PKR)</label>
            <input className='input' value={form[k]} onChange={e=>handle(k,e.target.value)} placeholder='0' />
          </div>
        ))}
        <div>
          <label className='small'>Liabilities (PKR)</label>
          <input className='input' value={form.liabilities} onChange={e=>handle('liabilities',e.target.value)} placeholder='0' />
        </div>
        <div className='flex gap-3'>
          <button className='btn' type='submit'>Calculate & Save</button>
          <button type='button' className='px-4 py-2 border rounded' onClick={()=>{ setForm({gold:'',silver:'',cash:'',bank:'',business:'',investments:'',property:'',other:'',liabilities:''}); setResult(null); setStatus(null); }}>Reset</button>
        </div>
      </form>

      {status && <div className='mt-3 small'>{status}</div>}
      {result && (
        <div className='mt-4 p-3 border rounded'>
          <div><strong>Total assets:</strong> PKR {result.totalAssets.toLocaleString()}</div>
          <div><strong>Liabilities:</strong> PKR {result.liabilities.toLocaleString()}</div>
          <div><strong>Net zakatable assets:</strong> PKR {result.netAssets.toLocaleString()}</div>
          <div className='mt-2 font-semibold'>Zakaat due (2.5%): PKR {result.zakaat.toLocaleString()}</div>
        </div>
      )}
    </div>
  );
}
