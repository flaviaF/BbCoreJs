define(['require', 'tb.core.DriverHandler', 'tb.core.RestDriver'], function (require, dh) {
    'use strict';

    dh.reset();

    describe('DriverHandler spec', function () {
        it('Checks of DriverHandler AVAILABLE_ACTIONS constant value', function () {
            expect(dh.AVAILABLE_ACTIONS).toEqual(['create', 'read', 'update', 'delete', 'patch', 'link']);
        });

        it('Has and get on unknown driver', function () {
            expect(dh.hasDriver('rest')).toBe(false);
            expect(dh.getDriver('rest')).toBe(null);
        });

        it('Define default driver with unknown id won\'t work', function () {
            expect(dh.drivers).toEqual({});
            expect(dh.defaultDriverId).toEqual(null);
            dh.defaultDriver('rest');
            expect(dh.defaultDriverId).toEqual(null);
        });

        it('First added driver will be used as default driver', function () {
            var driver = require('tb.core.RestDriver');

            dh.addDriver('rest', driver);
            expect(dh.hasDriver('rest')).toBe(true);
            expect(dh.getDriver('rest')).toEqual(driver);

            expect(dh.defaultDriverId).toBe('rest');
        });

        it('Add driver with id that already exists won\'t replace the old one', function () {
            var driver = dh.getDriver('rest'),
                otherDriver = {};

            dh.addDriver('rest', otherDriver);
            expect(dh.getDriver('rest')).not.toEqual(otherDriver);
            expect(dh.getDriver('rest')).toEqual(driver);
        });

        it('Change default driver', function () {
            expect(dh.defaultDriverId).toEqual('rest');
            dh.addDriver('test', {});
            dh.defaultDriver('test');
            expect(dh.defaultDriverId).toEqual('test');
            dh.defaultDriver('rest');
        });

        it('Add of action/drivers mapping with wrong format won\'t work', function () {
            expect(dh.mappings).toEqual({});
            dh.addActionDriverMapping('page', {});
            expect(dh.mappings).toEqual({});
        });

        it('Only valid action/driver row are added', function () {
            var pageMappings;

            expect(dh.isValidActionDriverMapping({})).toEqual(false);
            expect(dh.isValidActionDriverMapping({action: 'put', drivers: []})).toEqual(false);
            expect(dh.isValidActionDriverMapping({action: 'read', drivers: {}})).toEqual(false);
            expect(dh.isValidActionDriverMapping({action: 'read', drivers: []})).toEqual(false);
            expect(dh.isValidActionDriverMapping({action: 'read', drivers: ['ls']})).toEqual(false);
            expect(dh.isValidActionDriverMapping({action: 'read', drivers: ['rest']})).toEqual(true);

            pageMappings = [
                {
                    action: 'create',
                    drivers: ['rest']
                },
                {
                    action: 'read',
                    drivers: ['rest', 'test']
                },
                {
                    action: 'link',
                    drivers: ['rest', 'test', 'toto']
                }
            ];

            dh.addActionDriverMapping('page', pageMappings);
            expect(dh.mappings.hasOwnProperty('page')).toEqual(true);
            expect(dh.mappings.page.hasOwnProperty('create')).toEqual(true);
            expect(dh.mappings.page.create.drivers).toEqual(pageMappings[0].drivers);
            expect(dh.mappings.page.hasOwnProperty('read')).toEqual(true);
            expect(dh.mappings.page.read.drivers).toEqual(pageMappings[1].drivers);
            expect(dh.mappings.page.hasOwnProperty('link')).toEqual(false);
        });

        it('FormatDatas will always return an object with datas, criterias, orderBy, start and limit properties', function () {
            var datas = dh.formatDatas();
            expect(datas.hasOwnProperty('datas')).toEqual(true);
            expect(datas.hasOwnProperty('criterias')).toEqual(true);
            expect(datas.hasOwnProperty('orderBy')).toEqual(true);
            expect(datas.hasOwnProperty('start')).toEqual(true);
            expect(datas.hasOwnProperty('limit')).toEqual(true);
        });

        it('Retrieve drivers for a given type and action is always valid; it returns list of drivers according to your mappings or default driver', function () {
            expect(dh.getDriversByTypeAndAction('layout', 'read')).toEqual(['rest']);
            expect(dh.getDriversByTypeAndAction('page', 'read')).toEqual(['rest', 'test']);
        });

        it('create, read, update, delete, link and patch will always perform your request and then provide the result to your callback', function () {
            var message = '',
                callback = function (result) {
                    message = result;
                },
                driver = {
                    handle: function (action, type, datas, callback) {
                        callback(type + ' ' + action, datas);
                    }
                };

            dh.addDriver('random', driver);
            dh.addActionDriverMapping('content', [
                { action: 'create', drivers: ['random'] },
                { action: 'read', drivers: ['random'] },
                { action: 'update', drivers: ['random'] },
                { action: 'delete', drivers: ['random'] },
                { action: 'link', drivers: ['random'] },
                { action: 'patch', drivers: ['random'] }
            ]);

            dh.create('content', {}, callback);
            expect(message).toEqual('content create');

            dh.read('content', {}, {}, null, null, callback);
            expect(message).toEqual('content read');

            dh.update('content', {}, {}, {}, null, null, callback);
            expect(message).toEqual('content update');

            dh.delete('content', {}, {}, null, null, callback);
            expect(message).toEqual('content delete');

            dh.link('content', {}, {}, {}, null, null, callback);
            expect(message).toEqual('content link');

            dh.patch('content', {}, {}, {}, null, null, callback);
            expect(message).toEqual('content patch');
        });
    });
});