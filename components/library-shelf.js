export const SHELF_KEY='smisha-library-shelf-v1';
export function readShelf(){try{const value=JSON.parse(localStorage.getItem(SHELF_KEY)||'[]');return Array.isArray(value)?value.filter(x=>typeof x==='string'):[];}catch{return [];}}
export function saveShelf(value){localStorage.setItem(SHELF_KEY,JSON.stringify(value));window.dispatchEvent(new Event('smisha-library-shelf'));}
