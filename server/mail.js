Meteor.startup(function () {
  smtp = {
    username: '',
    password: '',
    server:   '',
    port: 465
 };

  process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;
});