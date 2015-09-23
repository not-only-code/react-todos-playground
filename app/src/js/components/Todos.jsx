var React = require('react'),
    _ = require('lodash'),
    ClassNames = require('classnames'),
    Utils = require('../Utils'),
    TodoItem = require('./TodoItem');

var Todos = React.createClass({

  mixins: [Utils],

  reRender: function() {
    this.forceUpdate();
  },

  componentDidMount: function() {
    window.addEventListener("hashchange", this.reRender);
  },

  componentWillUnmount: function() {
    window.removeEventListener("hashchange", this.reRender);
  },

  getInitialState: function() {
    var TODOS = [
      { key: 'AD56S6', title: 'Realtime data!', completed: 1, editing: 0},
      { key: 'AF4F44', title: 'JavaScript is fun', completed: 0, editing: 0},
      { key: 'R324FF', title: 'Coffee makes you awake', completed: 0, editing: 0}
    ];

    return {
      items: TODOS
    }
  },

  onEdit: function(key) {
    var item = _.findWhere(this.state.items, {key: key});
    item.editing = 1;
    this.forceUpdate();
  },

  onComplete: function(key) {
    var item = _.findWhere(this.state.items, {key: key});
    item.completed = Number(!item.completed);
    this.forceUpdate();
  },

  offEdit: function(key) {
    var item = _.findWhere(this.state.items, {key: key});
    item.editing = 0;
    this.forceUpdate();
  },

  onDelete: function(key) {
    var item = _.findWhere(this.state.items, {key: key});
    if (_.isUndefined(item)) {
      return;
    }
    this.setState({
      items: _.without(this.state.items, item)
    });
  },

  saveItem: function(item) {
    _.extend(_.findWhere(this.state.items, {key: item.reactKey}), {
      title: item.title,
      editing: 0
    });
    this.forceUpdate();
  },

  getCompleted: function() {
    return _.where(this.state.items, {completed:1});
  },

  clearCompleted: function() {
    var completed = this.getCompleted();
    this.setState({
      items: _.difference(this.state.items, completed)
    });
  },

  turnAll: function() {
    return this.getCompleted().length === this.state.items.length;
  },

  completeAll: function() {
    var turnAll = this.refs.completeAll.getDOMNode().checked;
    this.setState({
      items: _.map(this.state.items, function(item){
        item.completed = Number(turnAll);
        return item;
      }, this)
    })
  },

  onSubmit: function(event) {
    if (event.keyCode != this.KEY_ENTER) {
      return;
    }
    var $newItem = this.refs.newItem.getDOMNode(),
        newItem = {
          key: this.keyGen(),
          title: $newItem.value,
          completed: 0
        };

    var items = this.state.items.concat([newItem]);
    this.setState({
      items: items
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
    var turnAll = this.turnAll();

    var todoItems = _.map(items, function(item) {
      return <TodoItem
        key={item.key}
        reactKey={item.key}
        title={item.title}
        editing={item.editing}
        completed={item.completed}
        onDelete={this.onDelete}
        onComplete={this.onComplete}
        onEdit={this.onEdit}
        offEdit={this.offEdit}
        saveItem={this.saveItem} />
    }, this);

    return (
      <section className="todoapp">
        <header className="header">
          <h1>todos</h1>
          <input ref="newItem" className="new-todo" placeholder="What needs to be done?" autoFocus onKeyDown={this.onSubmit} />
        </header>
        <section className="main" style={styles}>
          <input className="toggle-all" ref="completeAll" type="checkbox" checked={turnAll} onChange={this.completeAll}/>
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