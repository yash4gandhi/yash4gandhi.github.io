(() => {
 const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
 const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
 const agents=$('[data-research="agents"]');
 if(agents){
  const difference=(1284-1120)/10, growth=((1284-1120)/1120*100).toFixed(2);
  const step=(name,kind,input,action,output,rows=[])=>({name,kind,input,action,output,rows});
  const router=q=>step('Router','Agent responsibility',q,'Classify the question and choose a numerical, narrative or clarification route.','Numerical question → retrieve evidence and plan a calculation.');
  const retrieve=step('Evidence retrieval','Retrieval tool + agent selection','Company: Northstar. Periods: 2023 and 2024. Metric: total revenue.','Locate both year cells and retain the table, row and unit references.','Report table 1 → Total revenue → 2023: 112.0; 2024: 128.4. Unit: USD millions.',['total']);
  const plan=step('Calculation planner','Agent responsibility','Revenue values with source references.','Turn the question into a calculation whose operands are traceable to report cells.','Difference = revenue[2024] − revenue[2023]. Growth = difference / revenue[2023] × 100.',['total']);
  const calculate=step('Calculator','Deterministic tool','112.0 and 128.4 USD million; the planned formulas.','Execute the arithmetic locally. This is a tool operation, not another language model. ',`128.4 − 112.0 = ${difference.toFixed(1)}. Revenue increase: $${difference.toFixed(1)} million (${growth}%).`,['total']);
  const verify=step('Verifier','Agent responsibility + arithmetic checks','Candidate answer, planned formula and original cell references.','Check the requested years, shared units, available evidence and arithmetic.','Checks pass: both years are present, units agree, and recalculation returns 16.4.',['total']);
  const answer=step('Answer writer','Agent responsibility','Verified result and source references.','Explain the result and cite the evidence behind it.',`Total revenue increased by $${difference.toFixed(1)} million (${growth}%), from $112.0 million in 2023 to $128.4 million in 2024. Source: report table 1, Total revenue row.`,['total']);
  const paths=[
   [router('How much did total revenue increase?'),retrieve,plan,calculate,verify,answer],
   [router('Which segment had the highest percentage growth?'),step('Evidence retrieval','Retrieval tool + agent selection','All three segments, both years.','Read the segment rows with their shared units.','Industrial: 40 → 52; Consumer: 42 → 46; Services: 30 → 30.4 (USD millions).',['industrial','consumer','services']),step('Calculation planner','Agent responsibility','Three pairs of segment revenues.','Use percentage growth to compare segments with different starting revenues.','For each segment: (2024 − 2023) / 2023 × 100; then rank the results.'),step('Calculator','Deterministic tool','Segment values and relative-growth formula.','Compute each percentage locally.',`Industrial: ${((520-400)/400*100).toFixed(2)}%; Consumer: ${((460-420)/420*100).toFixed(2)}%; Services: ${((304-300)/300*100).toFixed(2)}%.`,['industrial','consumer','services']),step('Verifier','Agent responsibility + arithmetic checks','Computed segment growth rates.','Confirm that all three segments were compared using the same years and formula.','Checks pass. Industrial has the largest percentage increase.',['industrial']),step('Answer writer','Agent responsibility','Verified segment ranking.','Answer with the leading segment and its calculation.','Industrial grew fastest at 30%, from $40 million to $52 million. Source: report table 1, Industrial row.',['industrial'])],
   [step('Router','Agent responsibility','Summarize the revenue changes.','Choose a narrative path with source-grounded comparisons.','Narrative question → retrieve the table, summarize changes, then check evidence.'),retrieve,step('Narrative analyst','Agent responsibility','The complete revenue table.','Describe the direction of change and the relative size of segment increases.','Revenue rose across all three segments. Industrial supplied the largest absolute increase; Services changed only slightly.',['industrial','consumer','services']),step('Evidence checker','Agent responsibility','Draft summary and the source table.','Confirm that retrieved evidence is present before returning the narrative.','Evidence is present: report table 1. This check does not independently validate each sentence. The table does not explain why revenue changed.',['industrial','consumer','services']),step('Answer writer','Agent responsibility','Prepared summary and available report references.','Produce a concise narrative with its source.','Revenue increased in 2024, with Industrial contributing the largest gain. Consumer also grew, while Services was nearly flat. Source: report table 1.',['industrial','consumer','services'])],
   [step('Router','Agent responsibility','What was adjusted profit?','Look for the requested metric and definition.','Adjusted profit requires evidence beyond the revenue table.'),step('Evidence retrieval','Retrieval tool + agent selection','Requested metric: adjusted profit.','Search the available report evidence.','No adjusted-profit figure or definition is present.'),step('Clarification','Agent responsibility','Missing metric, definition and reporting period.','Ask for the missing evidence before choosing operands.','Which definition and year of adjusted profit do you mean? Please provide the relevant profit statement. No numerical answer is produced without that evidence.')],
   [router('How much did total revenue increase?'),retrieve,step('Candidate calculation','Deliberate walkthrough error','The revenue difference question.','Introduce an incorrect candidate to show why verification matters.','Candidate answer: $18.4 million. This is a constructed error, not a recorded model failure.',['total']),step('Verifier','Agent responsibility + arithmetic checks','Candidate $18.4 million and original operands.','Re-execute the arithmetic and compare the result.','Check failed: 128.4 − 112.0 = 16.4, not 18.4. Return to retrieval and calculation.',['total']),step('Expanded retrieval','Retrieval tool + agent selection','Failed check and original question.','Re-read the surrounding table to confirm years, row and units.','Confirmed: Total revenue, 2023 = 112.0 and 2024 = 128.4, both USD millions.',['total']),plan,calculate,verify,answer]
  ];
  let choice=0,index=0;
  function render(){const path=paths[choice],s=path[index];
   $('[data-agent-nodes]',agents).innerHTML=path.map((p,i)=>`<button data-agent-stage="${i}" aria-pressed="${i===index}" ${i===index?'aria-current="step"':''}><span>${String(i+1).padStart(2,'0')}</span>${p.name}<small>${p.kind}</small></button>`).join('');
   $('[data-agent-inspector]',agents).innerHTML=`<p class="eyebrow">${s.kind}</p><h3>${s.name}</h3><dl><dt>Receives</dt><dd>${esc(s.input)}</dd><dt>Does</dt><dd>${esc(s.action)}</dd><dt>Produces</dt><dd class="agent-result">${esc(s.output)}</dd></dl>`;
   $$('[data-agent-stage]',agents).forEach(b=>b.addEventListener('click',()=>{index=Number(b.dataset.agentStage);render();$(`[data-agent-stage="${index}"]`,agents).focus()}));
   $$('[data-agent-row]',agents).forEach(row=>row.classList.toggle('highlight',s.rows.includes(row.dataset.agentRow)));
   $('[data-agent-position]',agents).textContent=`Stage ${index+1} of ${path.length}`;
   $('[data-agent-back]',agents).disabled=index===0;$('[data-agent-next]',agents).disabled=index===path.length-1;
  }
  $('[data-agent-question]',agents).addEventListener('change',e=>{choice=Number(e.target.value);index=0;render()});
  $('[data-agent-back]',agents).addEventListener('click',()=>{index=Math.max(0,index-1);render()});
  $('[data-agent-next]',agents).addEventListener('click',()=>{index=Math.min(paths[choice].length-1,index+1);render()});
  $('[data-agent-reset]',agents).addEventListener('click',()=>{index=0;render()});render();
 }
 const peptide=$('[data-research="peptides"]');
 if(peptide){
  const records=JSON.parse($('[data-peptide-records]',peptide).textContent),alphabet='ACDEFGHIKLMNPQRSTVWY';
  const names=['Alanine','Cysteine','Aspartic acid','Glutamic acid','Phenylalanine','Glycine','Histidine','Isoleucine','Lysine','Leucine','Methionine','Asparagine','Proline','Glutamine','Arginine','Serine','Threonine','Valine','Tryptophan','Tyrosine'];
  let selected=0,position=0;
  const chosen=()=>records[selected],sequence=()=>chosen().sequence.slice(1);
  function inspect(){const letter=sequence()[position],column=alphabet.indexOf(letter);
   $$('[data-amino]',peptide).forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.amino)===position)));
   $$('[data-matrix-row]',peptide).forEach(el=>el.classList.toggle('selected-row',Number(el.dataset.matrixRow)===position));
   $('[data-amino-inspector]',peptide).innerHTML=`<p class="eyebrow">Encoded position ${position+1} of 20</p><strong>${letter} · ${names[column]}</strong><p>Row ${position+1}, column ${column+1} (${letter}) = <b>1</b>. Every other column in this row = <b>0</b>.</p><p>Decoding picks the active column, recovering <b>${letter}</b>.</p>`;
  }
  function decode(){const n=Number($('[data-decode]',peptide).value);$('[data-decode-status]',peptide).textContent=`${n} of 20 positions decoded`;$('[data-decoded]',peptide).textContent=sequence().slice(0,n)+'·'.repeat(20-n)}
  function renderSequence(){const seq=sequence();
   $('[data-amino-buttons]',peptide).innerHTML=[...seq].map((c,i)=>`<button data-amino="${i}" aria-label="Position ${i+1}: ${names[alphabet.indexOf(c)]}, ${c}" aria-pressed="${i===position}"><span>${i+1}</span>${c}</button>`).join('');
   $('[data-matrix]',peptide).innerHTML='<span></span>'+[...alphabet].map(c=>`<b>${c}</b>`).join('')+[...seq].map((c,i)=>`<span data-matrix-row="${i}">${i+1}</span>`+[...alphabet].map(a=>`<i data-matrix-row="${i}" class="${a===c?'active':''}">${a===c?'1':'0'}</i>`).join('')).join('');
   $$('[data-amino]',peptide).forEach(b=>b.addEventListener('click',()=>{position=Number(b.dataset.amino);inspect()}));inspect();decode();
  }
  $('[data-peptide-select]',peptide).addEventListener('change',e=>{selected=Number(e.target.value);renderSequence()});
  $('[data-decode]',peptide).addEventListener('input',decode);
  const evidence=[
   '<div class="evidence-metrics"><p><strong>91.7%</strong> of tested candidates were functional</p><p><strong>75%</strong> of tested candidates bound more strongly than the wild-type reference</p></div><details><summary>Study size and percentage calculation</summary><p>Full-data DDIM experiment: 11 of 12 tested peptides were functional (91.7%); 9 of those 12 bound more strongly than the wild-type reference (75%). These percentages describe this tested set, not an estimated success rate for all generated sequences.</p></details>',
   '<div class="evidence-metrics"><p><strong>83.3%</strong> of tested candidates were functional</p></div><details><summary>Study size and percentage calculation</summary><p>Smaller-data DDIM experiment: 5 of 6 tested peptides were functional (83.3%). This was a separate experiment, with a separate denominator.</p></details>',
   '<div class="evidence-metrics"><p><strong>&gt;99%</strong> of generated sequences were novel relative to the training data</p></div><details><summary>What novelty means</summary><p>The published study reports sequence novelty against its training data. A new sequence is not automatically functional or a strong binder; experimental validation addresses a different question.</p></details>'
  ];
  $$('[data-peptide-evidence]',peptide).forEach(b=>b.addEventListener('click',()=>{$$('[data-peptide-evidence]',peptide).forEach(x=>x.setAttribute('aria-pressed',String(x===b)));$('[data-peptide-evidence-output]',peptide).innerHTML=evidence[Number(b.dataset.peptideEvidence)]}));
  $('[data-peptide-evidence-output]',peptide).innerHTML=evidence[0];renderSequence();
 }
 const tour=$('[data-research="tourist"]');
 if(tour){const views=[
  '<strong>Basilica of Bom Jesus</strong><p>Old Goa, India. This selected photo has a prepared identification; no recognition model is running.</p><p>In the original application, image recognition connected a landmark photograph to its guide.</p>',
  '<strong>A guide to the landmark</strong><p>Completed in 1605, the Basilica of Bom Jesus is known for housing the tomb of St Francis Xavier. It forms part of the Churches and Convents of Goa UNESCO World Heritage site.</p><p>The app’s guide connects recognition with historical context; QR-linked stops can extend that story inside a site.</p><p><a href="https://whc.unesco.org/en/list/234/">Read the UNESCO site description ↗</a></p>',
  '<strong>Continue through Old Goa</strong><p>Explore Sé Cathedral, another monument in the same World Heritage group. The original guide paired landmark information with map navigation.</p><p><a href="https://www.google.com/maps/search/?api=1&query=Se+Cathedral+Old+Goa" target="_blank" rel="noopener noreferrer">Find Sé Cathedral on the map ↗</a></p><p class="fine">The map opens separately. No live location or route is calculated by this walkthrough.</p>'
 ];$$('[data-tour-view]',tour).forEach(b=>b.addEventListener('click',()=>{$$('[data-tour-view]',tour).forEach(x=>x.setAttribute('aria-pressed',String(x===b)));$('[data-tour-output]',tour).innerHTML=views[Number(b.dataset.tourView)]}));}
})();
