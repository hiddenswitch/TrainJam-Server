import {_} from "meteor/underscore";
import {check} from "meteor/check";

Meteor.startup(() => {
  if (Lobbies.find({}).count() !== 0) {
    return;
  }

  // Create a default lobby
  Lobbies.insert({
    _id: 'public',
    connections: [],
    playerCount: 0,
    readyCount: 0,
    message: 'Waiting for a second player'
  });
});

// Users <==> connections instead
Meteor.onConnection((connection) => {
  let connectionId = connection.id;

  // Join the public lobby by default and await the user to press the ready button
  Lobbies.update({_id: 'public'}, {
    $inc: {playerCount: 1},
    $addToSet:
      {connections: {id: connection.id, ready: false}}
  });

  // Remove the player from all the lobbies he's in
  connection.onClose(() => {
    Lobbies.update({'connections.id': connectionId}, {
      $inc: {playerCount: -1},
      $pull: {connections: {id: connectionId}}
    }, {multi: true});
  });
});

Meteor.publish('lobbies', function () {
  return Lobbies.find({});
});

Meteor.publish('matches', function () {
  return Matches.find({players: this.connection.id});
});

Meteor.methods({
  /**
   * Indicates the player is ready to play
   */
  readyPlayer: function () {
    this.unblock();

    let readiedCount = Lobbies.update({'connections': {id: this.connection.id, ready: false}},
      {
        $set: {'connections.$.ready': true},
        $inc: {readyCount: 1}
      });

    return readiedCount === 1;
  },
  /**
   * Take all the ready players and put them into a match.
   * @param lobbyId
   * @returns {any}
   */
  startGame: function (lobbyId) {
    check(lobbyId, String);

    let op = {
      query: {_id: lobbyId, readyCount: {$gt: 1}}
    };

    if (lobbyId === 'public') {
      _.extend(op, {
        update: {
          connections: [],
          playerCount: 0,
          readyCount: 0,
          message: 'Waiting for a second player'
        }
      });
    } else {
      _.extend(op, {
        remove: true
      });
    }

    let lobby = Lobbies.findAndModify(op);
    if (lobby == null) {
      // The game was already started
      return null;
    }

    // All the ready players who are ready in this lobby will be put into the game.
    let readyPlayers = _.pluck(_.filter(lobby.connections, player => player.ready), 'id');
    let matchId = Matches.insert({
      players: readyPlayers,
      level: 'default',
      round: 1
    });

    // Create the game timer
    // Create an in-memory collection corresponding to the objects in each player's screens
    // Deal with match changes when any players disconnect

    return matchId;
  }
});