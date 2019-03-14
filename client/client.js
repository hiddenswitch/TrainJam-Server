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
  match: function() {
    // Select the one match that corresponds to me (the only ones I will see)
    return Matches.findOne({});
  }
});

Template.matchView.events({

});

Meteor.startup(() => {
  Meteor.subscribe('matches');
  Meteor.subscribe('lobbies');
});