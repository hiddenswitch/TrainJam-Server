Matches = new Mongo.Collection('matches', Meteor.isServer ? {connection: null} : {});
Lobbies = new Mongo.Collection('lobbies', Meteor.isServer ? {connection: null} : {});
Connections = new Mongo.Collection('connections', Meteor.isServer ? {connection: null} : {});
Entities = new Mongo.Collection('entities', Meteor.isServer ? {connection: null} : {});