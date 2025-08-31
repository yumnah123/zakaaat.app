export async function GET(){
  try {
    const logs = globalThis.kindlewayLogs || [];
    // return newest first
    return new Response(JSON.stringify([...logs].reverse()), { status:200 });
  } catch(e){
    return new Response(JSON.stringify([]), { status:200 });
  }
}
