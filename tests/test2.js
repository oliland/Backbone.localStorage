require.config({
  "paths": {
    "underscore": "vendor/underscore",
    "backbone": "vendor/backbone",
    "localstorage": "../backbone.localStorage"
  }
});

require(["underscore", "backbone", "localstorage"], function(_, backbone, localstorage) {
	var Library = Backbone.Collection.extend({
		localStorage: new Backbone.LocalStorage("libraryStore")
	});

	var attrs = {
		title  : 'The Tempest',
		author : 'Bill Shakespeare',
		length : 123
	};

	var library = null;

	module("localStorage on collections", {
		setup: function() {
			window.localStorage.clear();
			library = new Library();
		}
	});

	test("should be empty initially", function() {
		equals(library.length, 0, 'empty initially');
		library.fetch();
		equals(library.length, 0, 'empty read');
	});

	test("should create item", function() {
		library.create(attrs);
		equals(library.length, 1, 'one item added');
		equals(library.first().get('title'), 'The Tempest', 'title was read');
		equals(library.first().get('author'), 'Bill Shakespeare', 'author was read');
		equals(library.first().get('length'), 123, 'length was read');
	});

	test("should discard unsaved changes on fetch", function() {
		library.create(attrs);
		library.first().set({ 'title': "Wombat's Fun Adventure" });
		equals(library.first().get('title'), "Wombat's Fun Adventure", 'title changed, but not saved');
		library.fetch();
		equals(library.first().get('title'), 'The Tempest', 'title was read');
	});

	test("should persist changes", function(){
		library.create(attrs);
		equals(library.first().get('author'), 'Bill Shakespeare', 'author was read');
		library.first().save({ author: 'William Shakespeare' });
		library.fetch();
		equals(library.first().get('author'), 'William Shakespeare', 'verify author update');
	});
});

