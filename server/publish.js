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

Meteor.publish('registerUsers', function(user, team) {
  user = user ? user : '';
  team = team ? team : '';

  console.log('user   : ', user);
  console.log('team   : ', team);

  return liveDb.select(
    'select * from (select * from (select u.userId, concat(u.lastName, u.firstName)playerName, p.playerId, p.clubId, t.teamName, l.community, l.season, l.end from user u left outer join player p on p.userId = u.userId  left outer join club c on c.clubId = p.clubId left outer join team t on t.teamId = c.teamId left outer join league l on c.leagueId = l.leagueId WHERE (u.firstName LIKE "%' + user + '%" OR u.lastName LIKE "%' + user + '%" OR concat(u.lastName, u.firstName) LIKE "%' + user + '%") AND t.teamName LIKE "%' + team + '%" order by l.end desc, c.clubId asc) us group by us.userId) pl order by pl.end desc, pl.teamName asc',
    [{table: 'user'}]
  );
})
