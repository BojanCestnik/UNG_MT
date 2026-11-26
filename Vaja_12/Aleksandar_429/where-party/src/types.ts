export type Crowd = 'Empty' | 'Lively' | 'Packed';
export type Venue = {id:number;name:string;address:string;genre:string;hours:string;x:number;y:number;crowd:Crowd;reports:number;updated:string|null};
export type PartyEvent = {venueId:number;title:string;time:string;dj:string};
export type Filters = {search:string;genre:string;crowd:string;sort:boolean;favourites:boolean};
