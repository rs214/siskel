//Model
var Movie = Backbone.Model.extend({

  defaults: {
    like: true
  },

  toggleLike: function() {
    this.set('like', false);
  }

});

//Actual Collection Itself
var Movies = Backbone.Collection.extend({

  model: Movie,

  initialize: function() {
    this.on('change', this.sortByField);
  },

  comparator: 'title',

  sortByField: function(field) {
    this.sort();
    if (this.comparator !== field) {
      this.comparator = field;
    }
  }

});


//View
var AppView = Backbone.View.extend({

  events: {
    'click form input': 'handleClick'
  },

  handleClick: function(e) {
    var field = $(e.target).val();
    this.collection.sortByField(field);
  },

  render: function() {
    new MoviesView({
      el: this.$('#movies'),
      collection: this.collection
    }).render();
  }

});
//Another View - holds the like button, title year and rating
var MovieView = Backbone.View.extend({

  template: _.template('<div class="movie"> \
                          <div class="like"> \
                            <button><img src="images/<%- like ? \'up\' : \'down\' %>.jpg"></button> \
                          </div> \
                          <span class="title"><%- title %></span> \
                          <span class="year">(<%- year %>)</span> \
                          <div class="rating">Fan rating: <%- rating %> of 10</div> \
                        </div>'),

  initialize: function() {
    this.on('change', this.render());
  },

  events: {
    'click button': 'handleClick'
  },

  handleClick: function() {

    this.model.toggleLike();
  },

  render: function() {
    this.$el.html(this.template(this.model.attributes));
    return this.$el;
  }

});

//Another View - Holds actual movies themselves title year etc
var MoviesView = Backbone.View.extend({

  initialize: function() {
    this.on('change', this.render());
  },

  render: function() {
    this.$el.empty();
    this.collection.forEach(this.renderMovie, this);
  },

  renderMovie: function(movie) {
    var movieView = new MovieView({model: movie});
    this.$el.append(movieView.render());
  }

});
