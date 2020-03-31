import bs from 'bootstrap/dist/css/bootstrap.min.css';
import index from '../styles/index.css';

type CSSLib = 'bs' | 'index';

const strToLib = {
  'bs': bs,
  'index': index
};

/**
 * Returns a string of imported class identifiers corresponding to 
 * the given requested CSS classes. 
 * 
 * Example:
 *    classify({'bs': ['row', 'btn']})
 *      =>
 *    bs['row'] + ' ' + bs['btn']
 */
export function clJoin(params): string {
  return Object.entries(params).map(e => 
    e[1].map(cls => strToLib[e[0]][cls]).join(' ')
  ).join(' ');
}