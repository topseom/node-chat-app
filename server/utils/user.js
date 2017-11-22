const uniqid = require('uniqid');

// addUser(id,name,room)
// removeUser(id)
// getUser(id)
// getUserList(room)

class Users{
    constructor(){
        this.users = [];
    }
    addUser(id,name,room){
        if(this.getUser(id)){
            return false
        }
        var user = new User(id,name,room);
        this.users.push(user);
        return user;
    }
    removeUser(id){
        var user = this.getUser(id);
        if(!user){
            return false;
        }
        this.users = this.users.filter((user)=>user.id !== id);
        return user;
    }
    getUser(id){
        return this.users.find((user)=>user.id === id);
    }
    getUserList(room){
        var users = this.users.filter((user)=> user.room === room );
        return users.map((user)=>user.name);
    }
}

class User{
    constructor(id,name,room){
        this.id = id;
        this.name = name;
        this.room = room;
    }    
}

module.exports = {Users};