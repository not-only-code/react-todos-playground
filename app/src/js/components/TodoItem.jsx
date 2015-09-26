var React = require('react'),
    Utils = require('../Utils'),
    _ = require('lodash');

var TodoItem = React.createClass({

  mixins: [Utils],

  getEditInput: function() {
    return this.refs.editItem.getDOMNode();
  },

  saveItem: function() {
    var input = this.getEditInput();
    if (_.isEmpty(input.value)) {
      input.value = this.props.title;
    } else {
      this.props.saveItem({
        title: input.value
      });
    }
    this.props.offEdit();
  },

  onKeyDown: function(event) {
    if (event.keyCode != this.KEY_ENTER) {
      return;
    }
    this.saveItem();
  },

  componentDidUpdate: function() {
    if (this.props.editing) {
      this.getEditInput().focus();
    }
  },

  render: function() {
    var classNames = this.props.completed? 'completed' : '';
    if (this.props.editing) {
      classNames += ' editing'
    }

    return (
      <li className={classNames}>
        <div className="view">
          <input className="toggle" type="checkbox" checked={Boolean(this.props.completed)} onChange={this.props.saveItem.bind(this, {completed: Number(!this.props.completed)})} />
          <label onDoubleClick={this.props.onEdit}>{this.props.title}</label>
          <button className="destroy" onClick={this.props.onDelete} ></button>
        </div>
        <input ref="editItem" className="edit" defaultValue={this.props.title} onBlur={this.saveItem} onKeyDown={this.onKeyDown}/>
      </li>
    );
  }

});

module.exports = TodoItem;