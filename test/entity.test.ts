import * as assert from 'assert';
import * as spring from '../node'

spring.requestConfig.baseURL = 'http://localhost:8080///';
spring.entityConfig.restBaseURL = 'http://localhost:8080//rest//';

class Student extends spring.Entity {

    get name():string {
        return this.get('name');
    }

    set name(name:string) {
        this.set('name', name);
    }

    hi():string {
        return `${this.name}:${this.get('age')}`;
    }
}
Student.entityName = 'students';

let Academy = spring.extend('academies');
let Classroom = spring.extend('classrooms');

describe('class:Entity', ()=> {

    describe('extend', ()=> {

        it('ok', ()=> {
            let student = new Student({
                name: 'Hal',
                age: 23
            });
            assert.equal(student.name, 'Hal');
            assert.equal(student.hi(), 'Hal:23');
            let physics = new Academy({
                name: 'Physics'
            });
            assert.equal(student instanceof Student, true);
            assert.equal(physics instanceof Student, false);
            assert.equal(student instanceof Academy, false);
            assert.equal(physics instanceof Academy, true);
        })
    });

    describe('method:save', ()=> {

        it('create', (done)=> {
            let student = new Student();
            student.set('name', 'Tom');
            student.save().then(()=> {
                assert(student.id != null);
                return spring.get(`${Student.entityBaseURL()}/${student.id}`).send();
            }).then((json)=> {
                assert.equal(json.name, 'Tom');
                done();
            }).catch(err=> {
                done(err);
            })
        });

        it('update', (done)=> {
            let academy = new Academy({name: 'Math'});
            academy.save().then(()=> {
                academy.set('name', 'Physics');
                return academy.save();
            }).then(()=> {
                assert.deepEqual(academy.get('name'), 'Physics');
                done();
            }).catch(err=> {
                done(err);
            })
        });

    });

    describe('method:delete', ()=> {

        it('ok', (done)=> {
            let student = new Student();
            student.save().then(()=> {
                return student.remove();
            }).then(()=> {
                return Student.findOne(student.id);
            }).catch(err=> {
                assert.equal(err.response.status, 404);
                done();
            });
        });

    });

    describe('method:fetch', ()=> {

        it('fetch', (done)=> {
            let name = 'Ace';
            let age = 20;
            let ace = new Student({name: name, age: age});
            let student = new Student();
            ace.save().then(()=> {
                student.id = ace.id;
                return student.fetch();
            }).then(json=> {
                assert.equal(json.name, name);
                assert.equal(json.age, age);
                assert.equal(student.get('name'), name);
                assert.equal(student.get('age'), age);
                done();
            }).catch(err=> {
                done(err);
            });
        });

    });

    describe('method:follow', ()=> {

        it('follow', (done)=> {
            let student = new Student({name: '吴浩麟', age: 23});
            let academy = new Academy({name: '计算机学院'});
            student.set('academy', academy);
            student.save().then(()=> {
                return student.follow(['academy']);
            }).then((json)=> {
                assert.equal(json.name, '计算机学院');
                done();
            }).catch(err=> {
                done(err);
            });
        });

    });

    describe('method:findOne', ()=> {

        it('ok', (done)=> {
            let classRoom = new Classroom({name: '东16412'});
            classRoom.save().then(()=> {
                return Classroom.findOne(classRoom.id);
            }).then(entity=> {
                assert.equal(entity.get('name'), '东16412');
                done();
            }).catch(err=> {
                done(err);
            });
        });

        it('404', (done)=> {
            Student.findOne('404404').then(()=> {
                done('should be 404 error');
            }).catch(req=> {
                assert.equal(req.response.status, 404);
                done();
            })
        });

        it('projection support', (done)=> {
            let student = new Student({name: 'HalWu', age: 23});
            student.save().then(()=> {
                return Student.findOne(student.id, {projection: 'NoAge'});
            }).then(entity=> {
                assert.equal(entity.get('name'), 'HalWu');
                assert.equal(entity.get('age'), null);
                done();
            }).catch(err=> {
                done(err);
            })
        });
    });

    describe('method:findAll', ()=> {

        //insert 50 student first
        before((done)=> {
            let promiseList = [];
            for (let i = 0; i < 30; i++) {
                let student = new Student({name: `student${i}`, age: i});
                promiseList.push(student.save());
            }
            Promise.all(promiseList).then(()=> {
                done();
            }).catch(req=> {
                done(req);
            });
        });

        it('ok', (done)=> {
            let size = 13;
            let pageIndex = 1;
            Student.findAll({page: pageIndex, size: size, sort: 'age,desc'}).then(function (arr) {
                assert(Array.isArray(arr));
                assert.equal(arr.length, size);
                assert.deepEqual(arr['page'].constructor, Object);
                for (let i = 1; i < size - 2; i++) {
                    assert.equal(arr[i].get('age') > arr[i + 1].get('age'), true);
                }
                done();
            }).catch(req=> {
                done(req);
            });
        });

    });

    describe('method:search', ()=> {

        //insert 50 student first
        before((done)=> {
            let promiseList = [];
            for (let i = 1000; i < 1030; i++) {
                let student = new Student({name: `student${i}`, age: i});
                promiseList.push(student.save());
            }
            Promise.all(promiseList).then(()=> {
                done();
            }).catch(req=> {
                done(req);
            });
        });

        it('search one entity', (done)=> {
            Student.search('nameEquals', {name: 'student1015'}).then((entity:spring.Entity)=> {
                assert.equal(entity.get('age'), 1015);
                done();
            }).catch(err=> {
                done(err);
            })
        });

        it('search entity array', (done)=> {
            Student.search('nameContaining', {keyword: '1023'}).then((entityList:spring.Entity[])=> {
                assert.equal(entityList.constructor, Array);
                assert.equal(entityList.length, 1);
                assert.equal(entityList['page'].constructor, Object);
                assert.equal(entityList[0].get('age'), 1023);
                done();
            }).catch(err=> {
                done(err);
            });
        });

        it('search with pageable', (done)=> {
            Student.search('ageGreaterThan', {
                age: 1013,
                page: 1,
                size: 5,
                sort: 'age,desc'
            }).then((entityList:spring.Entity[])=> {
                assert.equal(entityList.constructor, Array);
                assert.equal(entityList.length, 5);
                for (var i = 0; i < entityList.length - 2; i++) {
                    assert(entityList[i].get('age') > entityList[i + 1].get('age'));
                }
                done();
            }).catch(err=> {
                done(err);
            });
        });

        it('404 error', (done)=> {
            Student.search('nameEquals', {name: 'student101512'}).then(()=> {
                done('should be 404 error');
            }).catch(err=> {
                assert.equal(err.response.status, 404);
                done();
            })
        });
    });

});