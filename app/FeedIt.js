'use strict';


    app.controller('RSSController', function($scope) {

        
        $scope.articles = [ ];
        $scope.rssFeed = '';
        $scope.originalRssFeed = '';
        $scope.existingArticles = function () {
            return _.find($scope.articles, function (a) {
                return !a.cleared
            }) != null;
        };
        $scope.allAreRead = function () {
            return _.every($scope.articles, function (a) {
                return a.read;
            });
        };

        $scope.showOrHideAll = function () {
            var markAsHide = _.every($scope.articles, function (a) {
                return a.show;
            });
            _.each($scope.articles, function (el, index, list) {
                el.show = !markAsHide;
            });
        };

        $scope.clearCompleted = function () {
            _.each(_.where($scope.articles, { read: true }), function (a) {
                a.cleared = true;
            });
        };

        $scope.markAsRead = function (article) {
            article.read = !article.read;
        };

        $scope.markAll = function () {
            var markAsUnread = $scope.allAreRead();
            _.each($scope.articles, function (el, index, list) {
                el.read = !markAsUnread;
            });
        };

        //just a test
        $scope.myFavs = [ ]; 
        $scope.addMyFavs = function(){
            $scope.myFavs.push({myList: $scope.rssFeed});
        
            $scope.rssFeed = '';

        };

        // just a test

        var hostname = (function () {
            var a = document.createElement('a');
            return function (url) {
                a.href = url;
                return a.hostname;
            }
        })();

        var parseEntry = function (el) {
            var date = el.publishedDate || el.pubDate;
            var content = el.content || el.description;
            return { title: el.title, content: content, read: false, date: date, link: el.link, shortLink: hostname(el.link) };
        }

        var parseRSS = function (url, callback) {
            $.ajax({
                url: '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=50&callback=?&q=' + encodeURIComponent(url),
                dataType: 'json',
                success: callback
            });
        }

        $scope.updateModel = function () {
            parseRSS($scope.rssFeed, function (data) {
                if (data == null)
                    return;

                var mostRecentDate = null;
                if ($scope.articles.length && $scope.rssFeed == $scope.originalRssFeed)
                    mostRecentDate = $scope.articles[0].date;

                var entries = _.map(data.responseData.feed.entries, function (el) {
                    return parseEntry(el);
                });

                if (mostRecentDate != null) {
                    entries = _.filter(entries, function (el) {
                        return el.date < mostRecentDate;
                    });
                }

                if ($scope.rssFeed != $scope.originalRssFeed) {
                    $scope.articles = entries;
                    $scope.originalRssFeed = $scope.rssFeed;
                }
                else
                    $scope.articles = _.union($scope.articles, entries);

                $scope.$apply(function () {
                    $scope.articles = _.sortBy($scope.articles, function (el) {
                        return el.date;
                    });
                });
            });
        };
    });