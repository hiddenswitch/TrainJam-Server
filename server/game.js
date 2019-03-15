import {_} from "meteor/underscore";
import {check} from "meteor/check";

let recipes = {
  'hamburger': ['cooked meat', 'buns'],
  'cheeseburger': ['cooked meat', 'sliced cheese', 'buns']
};

// Common stage settings. Stages will
let stageCommon = {
  // Amount of time in seconds the players have before the game automatically starts
  tutorialDuration: 8,
  // Amount of time in seconds for the round
  matchDuration: 60 * 4
};


let startingStage = 'stage0';
let victoryStage = 'victory';

// Game stages
// Victory is a special stage that indicates thanks for playing!
let stages = [
  {
    stageId: startingStage,
    matchDuration: 140,
    playerCount: 2,
    orderWinCount: 7,
    // Prefabs that correspond to recipes / objects that must be dropped in the delivery point.
    // The client should show in the tutorial view the necessary tutorialization in the tutorial view
    // If the order hasn't been fulfilled after warnDuration seconds, the client should shake the hamburger order
    // The order fails after 30s and the players get a demerit (may slow down the game as you underperform)
    orders: [
      {item: 'hamburger', insertionTime: 0, warnDuration: 12, failureDuration: 30, playerIds: [0, 1]},
      {item: 'hamburger', insertionTime: 0, warnDuration: 12, failureDuration: 30, playerIds: [0, 1]},
      {item: 'hamburger', insertionTime: 16, warnDuration: 12, failureDuration: 30, playerIds: [0, 1]},
      {item: 'cheeseburger', insertionTime: 24, warnDuration: 12, failureDuration: 30, playerIds: [0, 1]},
      {item: 'cheeseburger', insertionTime: 24, warnDuration: 12, failureDuration: 30, playerIds: [0, 1]},
      {item: 'hamburger', insertionTime: 64, warnDuration: 12, failureDuration: 30, playerIds: [0, 1]},
      {item: 'hamburger', insertionTime: 64, warnDuration: 12, failureDuration: 30, playerIds: [0, 1]},
      {item: 'hamburger', insertionTime: 78, warnDuration: 12, failureDuration: 30, playerIds: [0, 1]},
      {item: 'cheeseburger', insertionTime: 96, warnDuration: 12, failureDuration: 30, playerIds: [0, 1]},
      {item: 'cheeseburger', insertionTime: 108, warnDuration: 12, failureDuration: 30, playerIds: [0, 1]},
      {item: 'hamburger', insertionTime: 120, warnDuration: 12, failureDuration: 30, playerIds: [0, 1]}
    ],
    // The number of orders the players can fail until they lose
    failsToLose: 4,
    // The maximum number of orders the players have to deal with in this stage
    maxOrders: 3,
    // A "setup" corresponds to the items on the player's map for the specified number of players.
    assignments: [
      {
        items: ['cutting board', 'delivery', 'hamburger buns', 'meat', 'portal 2', 'trash']
      },
      {
        items: ['frying pan', 'delivery', 'tomatoes', 'cheese', 'portal 1', 'trash']
      }
    ],
    // Indicates the next stage after this one is won
    nextStage: 'stage1'
  },
  {
    stageId: 'stage1',
    matchDuration: 20,
    playerCount: 2,
    orders: [
      {item: 'cheeseburger', insertionTime: 0, warnDuration: 12, failureDuration: 30, playerIds: [0, 1]},
      {item: 'cheeseburger', insertionTime: 0, warnDuration: 12, failureDuration: 30, playerIds: [0, 1]},
      {item: 'cheeseburger', insertionTime: 8, warnDuration: 12, failureDuration: 30, playerIds: [0, 1]},
    ],
    // The number of orders the players can fail until they lose
    failsToLose: 4,
    // The maximum number of orders the players have to deal with in this stage
    maxOrders: 3,
    // A "setup" corresponds to the items on the player's map for the specified number of players.
    assignments: [
      {
        items: ['cutting board', 'delivery', 'hamburger buns', 'meat', 'portal 2', 'trash']
      },
      {
        items: ['frying pan', 'delivery', 'tomatoes', 'cheese', 'portal 1', 'trash']
      }
    ],
    // Indicates the next stage after this one is won
    nextStage: victoryStage
  },
  {
    stageId: startingStage,
    playerCount: 3,
    matchDuration: 140,
    orders: [
      {item: 'hamburger', insertionTime: 8, warnDuration: 12, failureDuration: 30, playerIds: [0]},
      {item: 'hamburger', insertionTime: 16, warnDuration: 12, failureDuration: 30, playerIds: [1]},
      {item: 'hamburger', insertionTime: 20, warnDuration: 12, failureDuration: 30, playerIds: [2]},
      {item: 'cheeseburger', insertionTime: 24, warnDuration: 12, failureDuration: 30, playerIds: [0]},
      {item: 'hamburger', insertionTime: 64, warnDuration: 12, failureDuration: 30, playerIds: [1]},
      {item: 'hamburger', insertionTime: 78, warnDuration: 12, failureDuration: 30, playerIds: [2]},
      {item: 'cheeseburger', insertionTime: 96, warnDuration: 12, failureDuration: 30, playerIds: [0]},
      {item: 'cheeseburger', insertionTime: 96, warnDuration: 12, failureDuration: 30, playerIds: [1]},
      {item: 'cheeseburger', insertionTime: 108, warnDuration: 12, failureDuration: 30, playerIds: [2]},
      {item: 'hamburger', insertionTime: 120, warnDuration: 12, failureDuration: 30, playerIds: [0]}
    ],
    // The number of orders the players can fail until they lose
    failsToLose: 3,
    // The maximum number of orders the players have to deal with in this stage
    maxOrders: 4,
    // The time until the next order is queued up
    timeTillNextOrder: 7,
    assignments: [
      {
        items: ['cutting board', 'hamburger buns', 'meat', 'portal 2', 'portal 3', 'trash']
      },
      {
        items: ['frying pan', 'delivery', 'cheese', 'portal 1', 'portal 3', 'trash']
      },
      {
        items: ['cutting board', 'tomatoes', 'meat', 'portal 1', 'portal 2', 'trash']
      }
    ],
    nextStage: victoryStage
  }
];

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

  Connections.insert({_id: connectionId});

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
    Connections.remove({_id: connectionId});
  });
});

Meteor.publish('data', function () {
  let connectionId = this.connection.id;
  return [
    Lobbies.find({}),
    Matches.find({players: connectionId}),
    Connections.find({_id: connectionId})];
});

Meteor.publish('entities', function (matchId, playerId) {
  return Entities.find({matchId: matchId, playerIds: playerId});
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
    let match = {
      players: readyPlayers,
      stage: startingStage,
      playerCount: readyPlayers.length,
      round: 1
    };
    let matchId = Matches.insert(match);
    _.extend(match, {_id: matchId});

    let stage = _.find(stages, s => s.stageId === match.stage && s.playerCount === match.playerCount);
    // TODO: Create the necessary game entities
    Entities.insert({
      _id: matchId + '/timeLeftClock',
      matchId: matchId,
      prefab: 'Time Left Clock',
      playerIds: _.range(0, readyPlayers.length),
      values: [stage.matchDuration]
    });

    // For now, just add all the orders and let the client take care of interpreting their times.
    _.forEach(stage.orders, order => {
      Entities.insert({
        matchId: matchId,
        prefab: 'order',
        playerIds: order.playerIds,
        values: [order.insertionTime, order.warnDuration, order.failureDuration],
        texts: [order.item].concat(recipes[order.item]),
        // [finished, failed]
        bools: [false, false]
      });
    });

    // TODO: Deal with match changes when any players disconnect

    return matchId;
  },

  'setBool': function (entityId, boolIndex, bool) {
    return Entities.update(entityId, {$set: {[`bools.${boolIndex}`]: bool}});
  },

  'setBools': function (entityId, bools) {
    return Entities.update(entityId, {$set: {bools: bools}});
  },

  /**
   * Ends the specified game
   * @param matchId
   */
  'endGame': function (matchId) {
    // Remove all entities
    Entities.remove({matchId: matchId});
  }
});