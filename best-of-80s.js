Movies = new Meteor.Collection('movies');

if (Meteor.isClient) {
  Template.movies.helpers({
    movies: function() {
      return Movies.find({}, {sort: {rating: -1}, limit: 30});
    },
    selected: function() {
      return this._id == Session.get('selected');
    },
    img: function() {
      return 'http://80talsfilm.se/images/headers/h' + this.id.replace(/^t/, '') + '.jpg';
    }
  });
  
  Template.movies.events({
    'click li': function(event, template) {
      Session.set('selected', this._id);
    },
    'click button': function() {
      var slc = Session.get('selected');
      Movies.update({_id: slc}, {$inc: {rating: 1}});
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function() {
    
    if (Movies.find().count() === 0) {
      HTTP.get('http://80talsfilm.se/api/?action=titles&sortcolumn=year&sortorder=desc', function(error, result) {
        var movies = result.content.split(/\r\n/);
        var i = 0;
        for(i in movies) {
          var movie = movies[i].split(';');
          Movies.insert({
            id: movie[0],
            title: movie[2],
            year: movie[3]
          });
        }
        console.log(i + ' movies added');
      });
    }
  });
}
