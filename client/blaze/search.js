var registerUsers = (new MysqlSubscription('registerUsers'));

console.log('registerUsers  : ', registerUsers);

Template.search.helpers({
  registerUsers: function(param) {
    console.log('arguments  : ', arguments);
    return registerUsers.reactive();
  },
  currentCount: function() {
    console.log('registerUsers.length  : ', registerUsers.length);
    return registerUsers.reactive().length;
  }
})

Template.search.events({
  'keyup input[name="search"]': function(e) {
    var player = e.currentTarget.value;
    var team = $('select[name="team"]').val();

    registerUsers.change(player, team);
  },
  'change select[name="team"]': function(e) {
    var player = $('input[name="player"]').val();
    var team = e.currentTarget.value;

    registerUsers.change(player, team);
  }
})