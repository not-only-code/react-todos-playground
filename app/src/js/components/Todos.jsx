var React = require('react'),
    TodoSubmit = require('./TodoSubmit'),
    TodoList = require('./TodoList');

var Todos = React.createClass({

  render: function() {
    return (
      <section className="todoapp">
        <header className="header">
          <h1>todos</h1>
          <TodoSubmit />
        </header>
        <section className="main">
          <input className="toggle-all" type="checkbox" />
          <label for="toggle-all">Mark all as complete</label>
          <TodoList />
        </section>
      </section>
    );
  }

});

module.exports = Todos;