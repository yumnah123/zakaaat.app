export async function POST(req){
  try {
    const { password } = await req.json();
    if(password && process.env.ADMIN_PASSWORD && password === process.env.ADMIN_PASSWORD){
      return new Response(JSON.stringify({ ok:true }), { status:200 });
    }
    return new Response(JSON.stringify({ error:'unauthorized' }), { status:401 });
  } catch(e){
    return new Response(JSON.stringify({ error:'failed' }), { status:500 });
  }
}
