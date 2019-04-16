#!/usr/bin/env node

/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/* eslint-env node */

'use strict';

const buildApiDocs = require( './buildapi' );

const skipLiveSnippets = process.argv.includes( '--skip-snippets' );
const skipApi = process.argv.includes( '--skip-api' );
const skipValidation = process.argv.includes( '--skip-validation' );
const production = process.argv.includes( '--production' );
const watch = process.argv.includes( '--watch' );
const verbose = process.argv.includes( '--verbose' );
const whitelistedSnippets = process.argv.find( item => item.startsWith( '--whitelisted-snippet=' ) );

buildDocs();

function buildDocs() {
	let promise;

	if ( skipApi ) {
		promise = Promise.resolve();
	} else {
		promise = buildApiDocs();
	}

	promise
		.then( () => {
			return runUmberto( {
				skipLiveSnippets,
				skipApi,
				skipValidation,
				production,
				watch,
				verbose
			} );
		} );
}

function runUmberto( options ) {
	const umberto = require( 'umberto' );

	return umberto.buildSingleProject( {
		configDir: 'docs',
		clean: true,
		dev: !options.production,
		skipLiveSnippets: options.skipLiveSnippets,
		skipValidation: options.skipValidation,
		snippetOptions: {
			production: options.production
		},
		skipApi: options.skipApi,
		verbose: options.verbose,
		watch: options.watch,
		whitelistedSnippets: whitelistedSnippets ? whitelistedSnippets.replace( '--whitelisted-snippet=', '' ) : undefined
	} );
}
