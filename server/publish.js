var config = {
  host        : '',
  port        : 3306,
  user        : '',
  password    : '',
  database    : ''
  // serverId    : 1
  // minInterval : 200
}

var liveDb = new LiveMysql(config);

Meteor.publish('registerUsers', function(query) {
  console.log('query   : ', query);
  if(!query) query = '';
  return liveDb.select(
    'select * from (select u.userId, concat(u.lastName, u.firstName)playerName, p.playerId, p.clubId, t.teamName, l.community, l.season, l.end from user u left outer join player p on p.userId = u.userId  left outer join club c on c.clubId = p.clubId left outer join team t on t.teamId = c.teamId left outer join league l on c.leagueId = l.leagueId WHERE u.firstName LIKE "%' + query + '%" OR u.lastName LIKE "%' + query + '%" OR concat(u.lastName, u.firstName) LIKE "%' + query + '%" order by l.end desc, c.clubId asc) us group by us.userId',
    [{table: 'user'}]
  );
})
