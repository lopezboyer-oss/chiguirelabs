import test from 'node:test';
import assert from 'node:assert/strict';
import {seedState,balances,redeem} from '../assets/demo-model.mjs';
import {availableRewards} from '../assets/demo-ui.mjs';
test('counter notice includes saved rewards after a modality switch',()=>{
 const s=seedState('2026-10-11');s.mode='stamps';
 assert.deepEqual(availableRewards(s,{stamps:2,grains:60}).map(r=>r.name),['Americano de cortesía','Galleta de cortesía']);
 s.mode='grains';assert.equal(availableRewards(s,{stamps:16,grains:0})[0].count,2);
});
test('redemption updates notification without consuming the next stamp progress',()=>{
 const s=seedState('2026-10-11');s.mode='stamps';
 const before=availableRewards(s,balances(s,'DEMO-ANA')).find(r=>r.mode==='stamps');assert.equal(before.count,2);
 redeem(s,{id:'one-notice',customerId:'DEMO-ANA',branch:'Playas',actorId:'ana',mode:'stamps'});
 const after=availableRewards(s,balances(s,'DEMO-ANA')).find(r=>r.mode==='stamps');assert.equal(after.count,1);assert.equal(balances(s,'DEMO-ANA').stamps%s.target,2);
});
test('no notification for a balance below every available threshold',()=>{
 const s=seedState('2026-10-11');assert.deepEqual(availableRewards(s,{stamps:7,grains:39}),[]);s.mode='stamps';assert.deepEqual(availableRewards(s,{stamps:7,grains:39}),[]);
});
