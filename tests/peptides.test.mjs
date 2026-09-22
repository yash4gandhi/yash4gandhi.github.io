import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const records=JSON.parse(fs.readFileSync('src/peptides.json','utf8'));
test('Saved peptide sequences and predictions remain intact; removed list and downloads stay absent',()=>{
 assert.equal(records.length,15);
 assert.equal(new Set(records.map(r=>r.id)).size,15);
 assert.equal(records[0].sequence,'MIDTNVILNYKKAADHFSIFM');
 assert.equal(records[0].predictedDeltaG,-15.1);
 assert.equal(records[0].experimentalDeltaG,-15.5);
 assert.ok(!fs.existsSync('dist/downloads/peptide-candidates.fasta'));
 assert.ok(!fs.existsSync('dist/downloads/peptide-saved-results.csv'));
 const page=fs.readFileSync('dist/work/peptide-design/index.html','utf8');
 const embedded=JSON.parse(page.match(/data-peptide-records>(.*?)<\/script>/s)[1]);
 assert.deepEqual(embedded,records);
 assert.ok(!page.includes('data-run-peptides'));
 assert.ok(!page.includes('data-peptide-task'));
 assert.ok(page.includes('data-peptide-film'));
 for(const r of records){
  assert.match(r.sequence,/^M[ACDEFGHIKLMNPQRSTVWY]{20}$/);
  assert.ok(r.predictedKdM>0&&r.experimentalKdM>0);
 }
});
