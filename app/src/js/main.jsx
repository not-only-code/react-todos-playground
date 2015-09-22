var React = require('react'),
    Todos = require('./components/Todos');

console.log(React);

React.render(
  <Todos />,
  document.getElementById('app')
);