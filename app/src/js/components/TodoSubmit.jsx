var React = require('react');

var TodoSubmit = React.createClass({
  
  render: function() {
    return (
      <input className="new-todo" placeholder="What needs to be done?" autoFocus />
    );
  }
});

module.exports = TodoSubmit;