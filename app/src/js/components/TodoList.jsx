var React = require('react'),
    TodoItem = require('./TodoItem');

var TodoList = React.createClass({

  render: function() {
    //var lists = [].map.....
    return (
      <ul className="todo-list">
        <TodoItem />
      </ul>
    );
  }

});

module.exports = TodoList;