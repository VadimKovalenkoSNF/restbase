'use strict';

// mocha defines to avoid JSHint breakage
/* global describe, it, before, beforeEach, after, afterEach */

const assert = require('../../utils/assert.js');
const preq = require('preq');
const server = require('../../utils/server.js');
const variantsPageTitle = 'RESTBase_Testing_Page';


describe('Language variants', function() {

    this.timeout(20000);

    before(() => server.start());

    it('should request html with impossible variants', () => {
        return preq.get({ uri: `${server.config.labsBucketURL}/html/Main_Page`})
        .then((res) => {
            assert.deepEqual(res.status, 200);
            assert.varyNotContains(res, 'accept');
            assert.varyNotContains(res, 'accept-language');
            assert.deepEqual(res.headers['content-language'], 'en');
            assert.deepEqual(res.headers['cache-control'], 'test_purged_cache_control');
            assert.checkString(res.headers.etag, /^"\d+\/[a-f0-9-]+"$/);
        });
    });

    let storedEtag;

    it('should request html with no variants', () => {
        return preq.get({ uri: `${server.config.variantsWikiBucketURL}/html/${variantsPageTitle}`})
        .then((res) => {
            storedEtag = res.headers.etag;
            assert.deepEqual(res.status, 200);
            assert.varyNotContains(res, 'accept');
            assert.varyContains(res, 'accept-language');
            assert.deepEqual(res.headers['cache-control'], 'test_purged_cache_control');
            assert.deepEqual(res.headers['content-language'], 'sr');
            assert.checkString(res.headers.etag, /^"\d+\/[a-f0-9-]+"$/);
            assert.deepEqual(/1\. Ово је тестна страница/.test(res.body), true);
            assert.deepEqual(/2\. Ovo je testna stranica/.test(res.body), true);
        });
    });

    it('should request html with default variant, from storage', () => {
        return preq.get({
            uri: `${server.config.variantsWikiBucketURL}/html/${variantsPageTitle}`,
            headers: {
                'accept-language': 'sr'
            }
        })
        .then((res) => {
            assert.deepEqual(res.status, 200);
            assert.varyNotContains(res, 'accept');
            assert.varyContains(res, 'accept-language');
            assert.deepEqual(res.headers['cache-control'], 'test_purged_cache_control');
            assert.deepEqual(res.headers['content-language'], 'sr');
            assert.deepEqual(res.headers.etag, storedEtag);
            assert.deepEqual(/1\. Ово је тестна страница/.test(res.body), true);
            assert.deepEqual(/2\. Ovo je testna stranica/.test(res.body), true);
        });
    });

    it('should request html with wrong variant, from storage', () => {
        return preq.get({
            uri: `${server.config.variantsWikiBucketURL}/html/${variantsPageTitle}`,
            headers: {
                'accept-language': 'sr-blablabla'
            }
        })
        .then((res) => {
            assert.deepEqual(res.status, 200);
            assert.varyNotContains(res, 'accept');
            assert.varyContains(res, 'accept-language');
            assert.deepEqual(res.headers['cache-control'], 'test_purged_cache_control');
            assert.deepEqual(res.headers['content-language'], 'sr');
            assert.deepEqual(res.headers.etag, storedEtag);
            assert.deepEqual(/1\. Ово је тестна страница/.test(res.body), true);
            assert.deepEqual(/2\. Ovo je testna stranica/.test(res.body), true);
        });
    });

    it('should request html with cyrillic variant', () => {
        return preq.get({
            uri: `${server.config.variantsWikiBucketURL}/html/${variantsPageTitle}`,
            headers: {
                'accept-language': 'sr-ec'
            }
        })
        .then((res) => {
            assert.deepEqual(res.status, 200);
            assert.varyNotContains(res, 'accept');
            assert.varyContains(res, 'accept-language');
            assert.deepEqual(res.headers['cache-control'], 'test_purged_cache_control');
            assert.deepEqual(res.headers['content-language'], 'sr-ec');
            assert.checkString(res.headers.etag, /^"\d+\/[a-f0-9-]+"$/);
            assert.deepEqual(/1\. Ово је тестна страница/.test(res.body), true);
            assert.deepEqual(/2\. Ово је тестна страница/.test(res.body), true);
        });
    });

    it('should request html with latin variant', () => {
        return preq.get({
            uri: `${server.config.variantsWikiBucketURL}/html/${variantsPageTitle}`,
            headers: {
                'accept-language': 'sr-el'
            }
        })
        .then((res) => {
            assert.deepEqual(res.status, 200);
            assert.varyNotContains(res, 'accept');
            assert.varyContains(res, 'accept-language');
            assert.deepEqual(res.headers['cache-control'], 'test_purged_cache_control');
            assert.deepEqual(res.headers['content-language'], 'sr-el');
            assert.checkString(res.headers.etag, /^"\d+\/[a-f0-9-]+"$/);
            assert.deepEqual(/1\. Ovo je testna stranica/.test(res.body), true);
            assert.deepEqual(/2\. Ovo je testna stranica/.test(res.body), true);
        });
    });
});