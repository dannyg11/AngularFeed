'use strict';

var app = angular.module('FeedFriend', ['feeds'])
  app.config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'feed.html',
        controller: "RSSController"
      })
      .otherwise({
        redirectTo: '/'
      });
  });