Template.lobbyView.helpers({
  lobby: function () {
    return Lobbies.findOne('public');
  },
  isStartable: function () {
    return Lobbies.find({_id: 'public', readyCount: {$gt: 1}}).count() > 0;
  }
});

Template.lobbyView.events({
  'click #ready-button': function () {
    Meteor.call('readyPlayer');
  },
  'click #start-game-button': function () {
    Meteor.call('startGame', 'public', (err, res) => {
      console.log(`startGame: matchId=${res}`)
    });
  }
});

Template.matchView.helpers({
  matches: function () {
    // Select the one match that corresponds to me (the only ones I will see)
    return Matches.find();
  },
  entities: function () {
    return Entities.find();
  }
});

Meteor.startup(() => {
  Meteor.subscribe('data');
  let sub = null;
  Matches.find().observe({
    added: function (id, doc) {
      sub = Meteor.subscribe('entities', id, doc.players.indexOf(Connections.findOne()._id));
    },
    removed: function(id) {
      sub.stop();
    }
  })
});