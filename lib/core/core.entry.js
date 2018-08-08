import './core.scss';
import { CORE } from './script/core.js'

const root = ( (root) => {
	if ( typeof root === 'object' && ( root.self === root || root.global === global ) && root ) {
		return root;
	}
} )(self || global || {});

root.core = CORE;