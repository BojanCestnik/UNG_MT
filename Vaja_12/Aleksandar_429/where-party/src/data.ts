import type {Venue,PartyEvent} from './types';
const names=['Neon Room','Pulse','Velvet Bar','Afterglow','Bassline','Moonlight','The Loft','Electric Garden','Echo Club','Midnight Social'];
const genres=['Techno','House','Pop','Hip-hop','Techno','Jazz','House','Indie','EDM','Pop'];
export const venues:Venue[]=names.map((name,i)=>({id:i+1,name,address:`${i+1} Demo Street`,genre:genres[i],hours:i%3===0?'20:00 – 04:00':'21:00 – 03:00',x:12+(i%5)*18,y:25+Math.floor(i/5)*48+(i%2)*10,crowd:(['Lively','Packed','Empty'] as const)[i%3],reports:0,updated:null}));
export const events:PartyEvent[]=[{venueId:1,title:'Neon Nights',time:'22:00',dj:'DJ Nova · Techno'},{venueId:2,title:'House Sessions',time:'23:00',dj:'DJ Orbit · House'},{venueId:5,title:'Bass After Dark',time:'23:30',dj:'DJ Flux · Techno'}];
