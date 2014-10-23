define(['tb.core.Response'], function (TbResponse) {
    'use strict';

    var Response = new TbResponse();

    describe('Test Response', function () {
        it('Testing Headers getter/setter', function () {
            var headers = {'Content-Type': 'application/json', 'Range': '1, 10'};

            expect(Response.getHeaders()).toEqual({});

            Response.setHeaders(headers);
            expect(Response.getHeaders()).toEqual(headers);
            expect(Response.getHeader('Content-Type')).toEqual('application/json');
            expect(Response.getHeader('foo')).toEqual(null);

            Response.addHeader('bar', 'foo');
            expect(Response.getHeader('bar')).toEqual('foo');
        });

        it('Testing RawDatas getter/setter', function () {
            var rawDatas = '{"foo": "bar"}';

            expect(Response.getRawDatas()).toEqual('');

            Response.setRawDatas(rawDatas);
            expect(Response.getRawDatas()).toEqual(rawDatas);
        });

        it('Testing Datas getter/setter', function () {
            var datas = [{"foo": "bar"}, {"bar": "foo"}];

            expect(Response.getDatas()).toEqual('{"foo": "bar"}');

            Response.setDatas(datas);
            expect(Response.getDatas()).toEqual(datas);
        });

        it('Testing Status getter/setter', function () {
            var status = 404;

            expect(Response.getStatus()).toEqual(200);

            Response.setStatus(status);
            expect(Response.getStatus()).toEqual(status);
        });

        it('Testing Status text getter/setter', function () {
            var statusText = '404 not found';

            expect(Response.getStatusText()).toEqual('');

            Response.setStatusText(statusText);
            expect(Response.getStatusText()).toEqual(statusText);
        });

        it('Testing Error text getter/setter', function () {
            var errorText = 'An error occured.';

            expect(Response.getErrorText()).toEqual('');

            Response.setErrorText(errorText);
            expect(Response.getErrorText()).toEqual(errorText);
        });
    });
});