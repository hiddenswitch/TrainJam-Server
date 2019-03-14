Matches = new Mongo.Collection('matches', Meteor.isServer ? {connection: null} : {});
Lobbies = new Mongo.Collection('lobbies', Meteor.isServer ? {connection: null} : {});

class Shared {

}