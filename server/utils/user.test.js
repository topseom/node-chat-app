const expect = require('expect');
const {Users} = require('./user');

var id = "abcdefg";
var name = "name";
var room = "room";

describe("Users",()=>{
    
    it("should add new user",()=>{
        var users = new Users();
        var user = users.addUser(id,name,room);
        expect(user).toInclude({id,name,room});
        expect(users.users).toEqual([user]);
    });

    it("should not add user if same name",()=>{
        var users = new Users();
        var user = users.addUser(id,name,room);
        var status = users.addUser(id,name,room);
        expect(status).toBe(false);
        expect(users.users.length).toBe(1);
    });

    it("should remove user",()=>{
        var users = new Users();
        var user = users.addUser(id,name,room);
        var id = users.removeUser(user.id);
        expect(users.users.length).toBe(0);
        expect(user.id).toBe(id);
    });

    it("should not remove user",()=>{
        var users = new Users();
        var user = users.addUser(id,name,room);
        var status = users.removeUser('1');
        expect(users.users.length).toBe(1);
        expect(status).toBe(false);
    });

    it("should get user by id",()=>{
        var users = new Users();
        var user = users.addUser(id,name,room);
        var user2 = users.getUser(user.id);
        expect(user).toEqual(user2);
    });

    it("should get users in room",()=>{
        var users = new Users();
        var user = users.addUser(id,name,room);
        var user2 = users.addUser(id+'2',name+'2',room);
        var list = users.getUserList(user.room);
        expect(list.length).toBe(2);
    });
});