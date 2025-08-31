'use client'
import { useEffect, useState } from 'react';

export default function Admin(){
  const [pwd,setPwd]=useState('');
  const [authed,setAuthed]=useState(false);
  const [logs,setLogs]=useState([]);
  const [filter,setFilter]=useState({q:'',min:0});

  async function login(){
    const res = await fetch('/api/admin/auth',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:pwd})});
    if(res.ok) setAuthed(true); else alert('Wrong password');
  }

  useEffect(()=>{ if(authed) fetchLogs(); },[authed]);

  async function fetchLogs(){
    const url = '/api/admin/logs';
    const res = await fetch(url);
    const data = await res.json();
    setLogs(data);
  }

  function filtered(){
    const q=filter.q.toLowerCase();
    return logs.filter(l=>(!q || l.created.toLowerCase().includes(q)) && l.netAssets >= Number(filter.min || 0));
  }

  async function exportCsv(){
    const res = await fetch('/api/admin/export');
    const csv = await res.text();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'zakaat_logs.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  if(!authed){
    return (<div className='card max-w-md'><h2 className='text-lg font-semibold'>Admin Login</h2><input className='input mt-3' type='password' value={pwd} onChange={e=>setPwd(e.target.value)} placeholder='Password' /><div className='mt-3'><button className='btn' onClick={login}>Enter</button></div></div>);
  }

  return (
    <div className='card'>
      <h2 className='text-xl font-semibold'>Saved Calculations</h2>
      <div className='mt-3 flex gap-2'>
        <input className='input' placeholder='Search by date/time' value={filter.q} onChange={e=>setFilter({...filter,q:e.target.value})} />
        <input className='input w-32' placeholder='Min net assets' type='number' value={filter.min} onChange={e=>setFilter({...filter,min:e.target.value})} />
        <button className='btn' onClick={()=>fetchLogs()}>Refresh</button>
        <button className='px-4 py-2 border rounded' onClick={exportCsv}>Export CSV</button>
      </div>

      <div className='mt-4 space-y-3'>
        {filtered().length===0 && <div className='small'>No records match the filter.</div>}
        {filtered().map((l,i)=>(
          <div key={i} className='border p-3 rounded'>
            <div className='text-sm'><strong>Date:</strong> {new Date(l.created).toLocaleString()}</div>
            <div className='text-sm'><strong>Net:</strong> PKR {Number(l.netAssets).toLocaleString()} | <strong>Zakaat:</strong> PKR {Number(l.zakaat).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
