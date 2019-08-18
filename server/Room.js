class Room {
  constructor(id,name,description = ''){
    this.id = id;
    this.name = name;
    this.member_num = 0;
    this.create_time = new Date();
    this.member_list = [];
    this.description = description;
  }

  get number(){
    return this.member_num;
  }

  get list(){
    return this.member_list;
  }

  add(member){
    this.member_list.push(member);
    this.member_num++;
  }

  minus(member,compareFunc){
    for(var i=0;i<this.member_num;i++){
      if(compareFunc(member,this.member_list[i])){
        this.member_list.splice(i,1);
        this.member_num--;
        break;
      }
    }
  }
}

module.exports = Room;