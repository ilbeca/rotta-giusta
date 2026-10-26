/* Interazioni del solo storyboard: nessuna rete, archivio o selezione di quiz. */
const dialog = document.querySelector('#info');
const descriptions = {
  Accedi: 'L’accesso non è attivo nel mock. Puoi esplorare le schermate senza inserire dati.',
  'Crea un account': 'La registrazione non è attiva nel mock. Nessun dato viene inviato o conservato.',
  Esame: 'Nel sito qui trovi le prove di carteggio, quiz base e vela. In questo mock puoi vedere la preparazione della simulazione dalla Home.',
  Progressi: 'I progressi richiedono risposte salvate con un account. Il mock non crea account e non produce stime di preparazione.',
  Carteggio: 'Si lavora sulla carta, con squadrette e compasso. Questa attività non è simulata nel mock: la proposta visiva qui copre i Quiz.',
  Segnali: 'L’allenamento dei fanali e dei segnali non è incluso in questo mock.',
  Errori: 'Non ci sono risposte salvate nel mock. Per vedere la correzione, avvia l’allenamento breve e scegli una risposta.',
  Segnalibri: 'I segnalibri del mock durano soltanto nella domanda aperta. Non viene creato un archivio.',
  Consigliato: 'Nel sito il motore sceglie in base alle risposte disponibili. Il mock non riproduce quella selezione: puoi provare l’allenamento breve.',
  Vela: 'La vela ha una prova distinta. I quesiti mostrati in questo mock sono soltanto esempi dei quiz base.',
};
document.querySelectorAll('[data-info]').forEach(el => el.addEventListener('click', ev => {
  ev.preventDefault();
  document.querySelector('#info-title').textContent = el.dataset.topic || el.dataset.info;
  document.querySelector('#info-copy').textContent = el.dataset.info === 'Argomento' ? 'La scelta per argomento non è simulata. Puoi esplorare una domanda breve, una lunga o una con figura dal menu «Esplora il mock» in fondo alla pagina.' : descriptions[el.dataset.info];
  dialog.showModal();
}));
dialog.addEventListener('click',ev=>{if(ev.target===dialog){const r=dialog.getBoundingClientRect();if(ev.clientX<r.left||ev.clientX>r.right||ev.clientY<r.top||ev.clientY>r.bottom)dialog.close();}});
const params = new URLSearchParams(location.search);
if (document.querySelector('#prep-title') && params.get('modo') === 'sim') {
  document.querySelector('#prep-title').textContent='La prova dei quiz base.';
  document.querySelector('#prep-desc').textContent='Come all’esame: 20 domande, 30 minuti, al più 4 errori. La correzione arriva alla fine.';
  document.querySelector('#prep-count').textContent='20';document.querySelector('#prep-time').textContent='30 minuti';document.querySelector('#prep-correction').textContent='Alla fine';
  const start=document.querySelector('[data-primary]'); const disabled=document.createElement('button');disabled.className=start.className;disabled.textContent='Simulazione non attiva nel mock';disabled.disabled=true;start.replaceWith(disabled);
  document.querySelector('#prep-demo').textContent='Per provare il mock, torna ai Quiz e scegli l’allenamento da 10 domande.';
}
const questionData=document.querySelector('#question-data');
if(questionData){
  const {correct}=JSON.parse(questionData.textContent);let chosen=null;
  const showAnswer=(index)=>{
    if(chosen!==null)return;chosen=index;
    document.querySelectorAll('[data-answer]').forEach((b,i)=>{
      b.disabled=true;const state=b.querySelector('.answer-state');
      if(i===correct){b.classList.add('correct');state.hidden=false;state.textContent=i===index?'La tua risposta · corretta':'Risposta del decreto';}
      else if(i===index){b.classList.add('wrong');state.hidden=false;state.textContent='La tua risposta · errata';}
    });
    document.querySelector('#outcome').textContent=index===correct?'Risposta corretta.':`Risposta errata. Era la ${correct+1}.`;
    document.querySelector('.feedback').hidden=index===correct;
    document.querySelector('#next').disabled=false;
    document.querySelector('.end').href=`riepilogo.html?esito=${index===correct?'corretta':'errata'}&caso=${encodeURIComponent(location.pathname.split('/').pop())}&scelta=${index}`;
  };
  document.querySelectorAll('[data-answer]').forEach(b=>b.addEventListener('click',()=>showAnswer(Number(b.dataset.answer))));
  document.querySelector('#next').addEventListener('click',()=>{if(chosen!==null)location.href=document.querySelector('.end').href;});
  const previous=params.get('scelta');if(previous!==null&&/^[012]$/.test(previous))showAnswer(Number(previous));
  document.querySelector('.bookmark').addEventListener('click',ev=>{const b=ev.currentTarget;const on=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',String(on));b.querySelector('span').textContent=on?'Segnalibro di esempio inserito':'Metti un segnalibro';});
}
if(document.querySelector('#answered')){
  const outcome=params.get('esito')||'corretta'; const empty=outcome==='vuoto';
  document.querySelector('#answered').textContent=empty?'0 domande':'1 domanda';
  document.querySelector('#right-count').textContent=outcome==='corretta'?'1':'0';
  document.querySelector('#wrong-count').textContent=outcome==='errata'?'1':'0';
  document.querySelector('#left-count').textContent=empty?'10':'9';
  document.querySelector('#unanswered-copy').textContent=`Le ${empty?'10':'9'} non affrontate non contano come errori.`;
  const link=document.querySelector('#result-action');const cases=['runner.html','runner-lungo.html','runner-figura.html'];const file=cases.includes(params.get('caso'))?params.get('caso'):'runner.html';const choice=params.get('scelta')||'0';
  link.href=empty?'preparazione.html':`${file}?scelta=${/^[012]$/.test(choice)?choice:'0'}`;
  if(empty){link.firstChild.textContent='Prepara un allenamento';document.querySelector('.save').hidden=true;}
}
