const _ = require('lodash')
let arr = [
  {"user_id":2,"ref_id":1,"level":1},
  {"user_id":3,"ref_id":2,"level":1},
  {"user_id":4,"ref_id":1,"level":3},
  {"user_id":5,"ref_id":4,"level":1},
   {"user_id":6,"ref_id":1,"level":1}
]
function _create(user_id, ref_id, level = 1){
  if(level >= 5) return;
  if(level == 1){
    //insert
    _create(user_id, ref_id, level + 1);
  }else{
    //select ref_id ... where user_id = ref_id and level = 1
    if(data.ref_id){
      //insert ... (user_id, ref_id, level) values ($user_id, $data.ref_id, $level)
      _create(user_id, data.ref_id, level+1);
    }
  }
}

function create (user_id,ref_id,level,arr){
    let newArr = arr
    let next_user_id,next_ref_id,next_level;
    //insert 4,3,1
    newArr.push({"user_id":user_id,"ref_id":ref_id,"level":level})
    newArr.forEach(e => {
      if(e.user_id!==ref_id){  
        return
      }else{
        if(e.user_id===ref_id){
          next_ref_id = e.ref_id
        }
        next_level = level+1;

        next_user_id=user_id;
       create(next_user_id,next_ref_id,next_level,newArr)
      }    
    });
    return newArr
    
}
let a = create(8,5,1,arr)
a.map(e=>console.log(e))


//input 5 4 var arr = [
//   {user_id:2,ref_id:1,level:1},
//   {user_id:3,ref_id:1,level:1},
//   {user_id:4,ref_id:1,level:1}
// ]
// ouput var arr = [
//   {user_id:2,ref_id:1,level:1},
//   {user_id:3,ref_id:1,level:1},
//   {user_id:4,ref_id:1,level:1},
//   {user_id:5,ref_id:4,level:1},
//   {user_id:5,ref_id:1,level:2}
// ]
