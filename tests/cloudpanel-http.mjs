// Isolated endpoint contract test. Fake mailer is generated in a private temp dir
// and NEVER shipped to production; this does not prove live SMTP delivery.
import assert from 'node:assert/strict';
import {mkdtemp, mkdir, writeFile, readFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import {spawn} from 'node:child_process';
import net from 'node:net';

const root=resolve('dist-cloudpanel-production');
const fixture=await mkdtemp(join(tmpdir(),'serina-http-'));
const privateDir=join(fixture,'private');
await mkdir(join(privateDir,'sessions'),{recursive:true,mode:0o700});
await mkdir(join(privateDir,'rate-limits'),{recursive:true,mode:0o700});
await mkdir(join(privateDir,'vendor'),{recursive:true,mode:0o700});
for(const item of ['contact-lib.php','smtp-mailer.php']) {
  const {copyFile}=await import('node:fs/promises');
  await copyFile(join(root,'private',item),join(privateDir,item));
}
const fakeMailer=String.raw`<?php
namespace PHPMailer\PHPMailer;
class PHPMailer {
  public const ENCRYPTION_STARTTLS = 'tls';
  public const ENCRYPTION_SMTPS = 'ssl';
  public string $Body='';
  public function __construct($exceptions=true) {}
  public function isSMTP() {}
  public function isHTML($enabled) {}
  public function setFrom($email,$name='') {}
  public function addAddress($email) {}
  public function addReplyTo($email,$name='') {}
  public function send() {
    if (str_contains($this->Body, 'SIMULATED_SMTP_OUTAGE')) throw new \RuntimeException('Synthetic relay outage');
    file_put_contents(getenv('SERINA_TEST_DELIVERY_LOG'), $this->Body . "\n---\n", FILE_APPEND);
    return true;
  }
}
`;
await writeFile(join(privateDir,'vendor','autoload.php'),fakeMailer);
const deliveryLog=join(fixture,'deliveries.txt');
const port=await new Promise((resolve,reject)=>{
  const s=net.createServer();s.once('error',reject);s.listen(0,'127.0.0.1',()=>{const p=s.address().port;s.close(()=>resolve(p));});
});
const origin='https://nyandagreatmindsconsultancy.co.zw';
const server=spawn('php',['-S',`127.0.0.1:${port}`,'-t',join(root,'public')],{
  env:{...process.env,SERINA_PRIVATE_DIR:privateDir,SERINA_ORIGIN:origin,SERINA_MAIL_READY:'1',
    SERINA_RATE_SECRET:'a-40-character-long-secret-for-testing-only-12',
    SERINA_SMTP_HOST:'smtp.example.invalid',SERINA_SMTP_PORT:'587',SERINA_SMTP_USER:'test',
    SERINA_SMTP_PASS:'synthetic-fixture-secret',SERINA_MAIL_TO:'inbox@example.test',
    SERINA_MAIL_FROM:'sender@example.test',SERINA_TEST_DELIVERY_LOG:deliveryLog},
  stdio:['ignore','pipe','pipe'],
});
let err='';server.stderr.on('data',d=>{err+=d.toString();});
const base=`http://127.0.0.1:${port}`;
const formData={name:'Synthetic Test',phone:'+263 77 123 4567',email:'',service:'general',location:'Harare',message:'Test callback request', 'contact-consent':'yes','bot-field':''};
async function csrf() {
  const r=await fetch(base+'/api/csrf.php');assert.equal(r.status,200,'CSRF endpoint should issue token');
  const body=await r.json();assert.match(body.token,/^[a-f0-9]{64}$/);
  const cookie=r.headers.get('set-cookie').split(';')[0];
  return{cookie,token:body.token};
}
async function post({cookie,token}, params={}, headers={}){
  const form=new URLSearchParams({...formData,csrf_token:token,...params});
  return fetch(base+'/api/contact.php',{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded;charset=UTF-8','cookie':cookie,origin,...headers},body:form});
}
try {
  let connected=false;
  for(let i=0;i<50;i++){
    try {const r=await fetch(base+'/api/csrf.php');if(r.status===200){connected=true;break;}}catch{}
    await new Promise(r=>setTimeout(r,80));
  }
  assert.ok(connected,'PHP server booted; '+err);
  let ctx=await csrf();
  let bad=await post(ctx,{}, {origin:'https://evil.example'});
  assert.equal(bad.status,403,'cross-origin submit is rejected');
  let good=await post(ctx);
  assert.equal(good.status,200,'phone-only synthetic enquiry accepted by fake SMTP');
  assert.equal((await good.json()).ok,true);
  assert.match(await readFile(deliveryLog,'utf8'),/Synthetic Test/);
  let replay=await post(ctx);
  assert.equal(replay.status,403,'one-time CSRF token cannot be reused');
  ctx=await csrf();
  let failPhone=await post(ctx,{phone:'xxx'});
  assert.equal(failPhone.status,422,'invalid phone is rejected server-side');
  ctx=await csrf();
  let failMessage=await post(ctx,{message:''});
  assert.equal(failMessage.status,422,'blank message rejected');
  ctx=await csrf();
  let honeypot=await post(ctx,{'bot-field':'spam trap filled'});
  assert.equal(honeypot.status,422,'honeypot rejected without notifying');
  assert.equal((await readFile(deliveryLog,'utf8')).split('Synthetic Test').length-1,1,'only genuine test delivered');
  ctx=await csrf();
  const outage=await post(ctx,{message:'SIMULATED_SMTP_OUTAGE'});
  assert.equal(outage.status,503,'SMTP outage fails closed');
  assert.match((await outage.json()).error,/unavailable/i);
  for(let i=0;i<3;i++) {
    ctx=await csrf();
    const ok=await post(ctx,{message:`Another synthetic enquiry ${i}`});
    assert.equal(ok.status,200,'rate-limit budget permits distinct tested request');
  }
  ctx=await csrf();
  const limit=await post(ctx,{message:'One extra enquiry'});
  assert.equal(limit.status,429,'rate limit rejects excess submissions');
  console.log('PASS: HTTP same-origin, session, validation, honeypot and fake SMTP contract');
  console.log('NOTE: Actual SMTP and ZCHPC public HTTPS path remain unverified.');
} finally {
  server.kill('SIGTERM');
  await new Promise(resolve=>server.once('exit',resolve));
  await rm(fixture,{recursive:true,force:true});
}
