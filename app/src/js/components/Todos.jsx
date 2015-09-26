var React = require('react'),
    _ = require('lodash'),
    Firebase = require('firebase'),
    ReactFire = require('reactfire'),
    ClassNames = require('classnames'),
    Utils = require('../Utils'),
    TodoItem = require('./TodoItem');

var Todos = React.createClass({

  mixins: [Utils, ReactFire],

  reRender: function() {
    this.forceUpdate();
  },

  componentDidMount: function() {
    window.addEventListener("hashchange", this.reRender);
  },

  componentWillMount: function() {
    var ref = new Firebase("https://reactjs-todo.firebaseio.com/todos");
    this.bindAsArray(ref, "items");
  },

  componentWillUnmount: function() {
    window.removeEventListener("hashchange", this.reRender);
  },

  getInitialState: function() {
    return {
      editing: null
    }
  },

  onDelete: function(key) {
    this.firebaseRefs.items.child(key).remove();
  },

  saveItem: function(key, item) {
    this.firebaseRefs.items.child(key).update(item);
  },

  getCompleted: function() {
    return _.where(this.state.items, {completed:1});
  },

  clearCompleted: function() {
    this.getCompleted().forEach(function(item){
      this.onDelete(item['.key']);
    }, this);
  },

  allCompleted: function() {
    return this.getCompleted().length === this.state.items.length;
  },

  completeAll: function() {
    var allCompleted = this.refs.completeAll.getDOMNode().checked;
    this.state.items.forEach(function(item){
      this.saveItem(item['.key'], {
        completed: Number(allCompleted)
      });
    }, this);
  },

  onSubmit: function(event) {
    if (event.keyCode != this.KEY_ENTER) {
      return;
    }
    var $newItem = this.refs.newItem.getDOMNode();
    if (_.isEmpty($newItem.value)) {
      return;
    }
    this.firebaseRefs.items.push({
      title: $newItem.value,
      completed: 0
    });
    $newItem.value = '';
  },

  filterItems: function() {
    switch(this.getCurrentState()) {
      case this.STATES.ACTIVE:
        return _.where(this.state.items, {completed:0});
      break;
      case this.STATES.COMPLETED:
        return _.where(this.state.items, {completed:1});
      break;
      default:
        return this.state.items;
    }
  },

  render: function() {
    var items = this.filterItems();
    var itemsLeft = _.where(this.state.items, {completed:0});
    var styles = this.state.items.length? {} : {display: 'none'};
    var currState = this.getCurrentState();
    var completedStyle = this.getCompleted().length? {} : {display: 'none'};
    var allCompleted = this.allCompleted();

    var todoItems = _.map(items, function(item) {
      var key = item['.key'];
      return <TodoItem
        key={key}
        reactKey={key}
        title={item.title}
        editing={this.state.editing === key}
        completed={item.completed}
        onDelete={this.onDelete.bind(this, key)}
        onEdit={this.setState.bind(this, {editing: key})}
        offEdit={this.setState.bind(this, {editing: null})}
        saveItem={this.saveItem.bind(this, key)} />
    }, this);

    return (
      <section className="todoapp">
        <header className="header">
          <h1>todos</h1>
          <input ref="newItem" className="new-todo" placeholder="What needs to be done?" autoFocus onKeyDown={this.onSubmit} />
        </header>
        <section className="main" style={styles}>
          <input className="toggle-all" ref="completeAll" type="checkbox" checked={allCompleted} onChange={this.completeAll}/>
          <label htmlFor="toggle-all">Mark all as complete</label>
          <ul className="todo-list">
            { todoItems }
          </ul>
        </section>
        <footer className="footer" style={styles}>
          <span className="todo-count"><strong>{itemsLeft.length}</strong> items left</span>
          <ul className="filters">
            <li>
              <a href="#/" className={ClassNames({selected: currState === this.STATES.ALL || _.isEmpty(currState)})}>All</a>
            </li>
            <li>
              <a href="#/active" className={ClassNames({selected: currState === this.STATES.ACTIVE})}>Active</a>
            </li>
            <li>
              <a href="#/completed" className={ClassNames({selected: currState === this.STATES.COMPLETED})}>Completed</a>
            </li>
          </ul>
          <button className="clear-completed" onClick={this.clearCompleted} style={completedStyle}>Clear completed</button>
        </footer>
      </section>
    );
  }

});

module.exports = Todos;