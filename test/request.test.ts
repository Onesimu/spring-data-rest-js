import * as assert from 'assert';
import * as spring from '../node'

spring.requestConfig.baseURL = 'http://localhost:8080/';
spring.entityConfig.restBaseURL = 'http://localhost:8080/rest/';
let Student = spring.extend('students');
let Academy = spring.extend('academies');
let Classroom = spring.extend('classrooms');

describe('class:Request', ()=> {

    it('auto revise url', ()=> {
        let req = spring.get('//hello/name//');
        assert.equal(req.options.url, `http://localhost:8080/hello/name/`);
        let req2 = spring.get('https://google.com//hello/name');
        assert.equal(req2.options.url, `https://google.com/hello/name`);
    });

    describe('attr:config', ()=> {

        describe('attr:config.globalFetchOptions', ()=> {

            it('ok', function () {
                spring.requestConfig.globalFetchOptions = {
                    credentials: 'same-origin',
                    headers: {
                        'X': 'x'
                    }
                };
                let req = spring.get('/hello');
                assert.equal(req.options.url, `http://localhost:8080/hello`);
                assert.equal(req.options.credentials, 'same-origin');
                assert.deepEqual(req.options.headers, {
                    'X': 'x'
                })
            });
        });

        describe('attr:config.fetchStartHook', ()=> {

            it('ok', (done)=> {
                let flag = 'old';
                let request = spring.get(spring.requestConfig.baseURL);
                spring.requestConfig.fetchStartHook = function (req) {
                    assert.equal(req, request);
                    flag = 'new';
                };
                request.send().then(()=> {
                    assert.equal(flag, 'new');
                    done();
                }).catch(err=> {
                    done(err);
                });
            });

            after(()=> {
                spring.requestConfig.fetchStartHook = null;
            });

        });

        describe('attr:config.fetchEndHook', ()=> {

            it('ok', (done)=> {
                let flag = 'old';
                let request = spring.get(spring.requestConfig.baseURL);
                spring.requestConfig.fetchEndHook = function (req) {
                    assert.equal(req, request);
                    flag = 'new';
                };
                request.send().then(()=> {
                    assert.equal(flag, 'new');
                    done();
                }).catch(err=> {
                    done(err);
                });
            });

            after(()=> {
                spring.requestConfig.fetchEndHook = null;
            });

        });

    });

    describe('method:queryParam', ()=> {

        it('ok', ()=> {
            let param1 = {name: '中'};
            let param2 = {age: 23, academy: 'physics'};
            let request = spring.get(spring.requestConfig.baseURL).queryParam(param1);
            assert.equal(request.options.url, 'http://localhost:8080/?name=中');
            request.queryParam(param2);
            assert.equal(request.options.url, 'http://localhost:8080/?age=23&academy=physics');
        });
    });

    describe('method:jsonBody', ()=> {

        it('ok', ()=> {
            let param = {name: '吴浩麟', age: 23};
            let request = spring.post('/').jsonBody(param);
            assert.equal(request.options.body, JSON.stringify(param));
            assert.equal(request.options.headers['Content-Type'], 'application/json');
        });

    });

    describe('method:formBody', ()=> {

        it('ok', (done)=> {
            let param = {name: '中国', age: 123};
            let request = spring.post('/postForm').formBody(param);
            assert.equal(request.options.headers['Content-Type'], 'application/x-www-form-urlencoded');
            request.send().then(json=> {
                assert.equal(json.name, '中国');
                assert.equal(json.age, 123);
                done();
            }).catch(err=> {
                done(err);
            });
        });

    });

    describe('method:send', ()=> {

        it('response json type', (done)=> {
            let classroom = new Classroom({name: 'D1143'});
            let request;
            classroom.save().then(function () {
                request = spring.get(`${Classroom.entityBaseURL()}/${classroom.id}`);
                return request.send();
            }).then(json=> {
                assert.equal(json.constructor, Object);
                assert.equal(json.name, 'D1143');
                assert.deepEqual(json, request.responseData);
                done();
            }).catch(err=> {
                done(err);
            });
        });

        it('response status ok with null', (done)=> {
            let classroom = new Classroom({name: 'D1143'});
            classroom.save().then(()=> {
                return spring.get(`${Classroom.entityBaseURL()}/${classroom.id}`).send();
            }).then(json=> {
                assert.equal(json.constructor, Object);
                assert.equal(json.name, 'D1143');
                done();
            }).catch(err=> {
                done(err);
            });
        });

        it('response status ok with string', (done)=> {
            spring.get(`/returnString`).send().then((str)=> {
                assert.equal(str.constructor, String);
                done();
            }).catch(err=> {
                done(err);
            });
        });

        it('response status ok with string-with auto send', (done)=> {
            spring.get(`/returnString`).send().then((str)=> {
                assert.equal(str.constructor, String);
                done();
            }).catch(err=> {
                done(err);
            });
        });

        it('response 404 error', (done)=> {
            spring.get(`/$%404`).send().then(()=> {
                done('should be 404 error');
            }).catch(err=> {
                assert.equal(err.response.status, 404);
                done();
            });
        });

        it('response 404 error-with auto send', (done)=> {
            spring.get(`/$%404`).send().then(()=> {
                done('should be 404 error');
            }).catch(err=> {
                assert.equal(err.response.status, 404);
                done();
            });
        });

        it('response error with json', (done)=> {
            spring.get(`/errorWithJSON`).send().then(()=> {
                done('should be 404 error');
            }).catch(req=> {
                assert.equal(req.response.status, 500);
                assert.equal(req.error.constructor, Object);
                assert.equal(req.error.message, "for errorWithJSON test");
                done();
            });
        });

        it('response error with json-with auto send', (done)=> {
            spring.get(`/errorWithJSON`).send().then(()=> {
                done('should be 404 error');
            }).catch(req=> {
                assert.equal(req.response.status, 500);
                assert.equal(req.error.constructor, Object);
                assert.equal(req.error.message, "for errorWithJSON test");
                done();
            });
        });

    });

    describe('method:follow', ()=> {

        it('ok', (done)=> {
            let student = new Student({name: '吴浩麟', age: 23});
            let academy = new Academy({name: '计算机学院'});
            student.set('academy', academy);
            student.save().then(()=> {
                return spring.get(`${Student.entityBaseURL()}/${student.id}`).follow(['self', 'academy', 'self', 'self']);
            }).then((json)=> {
                assert.equal(json.name, '计算机学院');
                done();
            }).catch(err=> {
                done(err);
            });
        });

    });

    describe('method:mockRequest', ()=> {

        it('ok', (done)=> {
            let student = new Student({name: 'HalWu', age: 18});
            let academy = new Academy({name: 'Physics Academy'});
            student.set('academy', academy);
            student.save().then((json)=> {
                return spring.mockRequest(json).follow(['self', 'academy', 'self', 'self']);
            }).then((json)=> {
                assert.equal(json.name, 'Physics Academy');
                done();
            }).catch(err=> {
                done(err);
            });
        });

        it('404', (done)=> {
            let student = new Student({name: 'HalWu', age: 18});
            let academy = new Academy({name: 'Physics Academy'});
            student.set('academy', academy);
            student.save().then((json)=> {
                return spring.mockRequest(json).follow(['self404', 'academy', 'self', 'self']);
            }).then(()=> {
                done('should be 404');
            }).catch(()=> {
                done();
            });
        });

    });

});