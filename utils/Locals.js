class Model {
    constructor(){
        if(new.target === Model){
            throw new Error('Can´t be instance')
        }
    }
    clear() {
        throw new Error('Must be implement in the subclass')
    }
}

class Email extends Model {
    constructor(email,owner){
        this.email = email;
        this.owner = owner;
    }
    clear(){
        this.email = ''
        this.owner = null
    }
}
class ErrorInput extends Model{
    constructor(field,type){
        this.field = field;
        this.type = type;
    }
    clear(){
        this.email = ''
        this.owner = null
    }
}