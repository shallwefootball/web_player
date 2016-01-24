var registerUsers = (new MysqlSubscription('registerUsers'));

console.log('registerUsers  : ', registerUsers);

Template.search.helpers({
  registerUsers: function(param) {
    console.log('arguments  : ', arguments);
    return registerUsers.reactive();
  }
})

Template.search.events({
  'keyup #search': function(e) {

    console.log('e  : ', e);
    console.log('e.currentTarget.value  : ', e.currentTarget.value);
    var val = e.currentTarget.value;

    registerUsers.change(val);

  }
})