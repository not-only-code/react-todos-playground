var React = require('react'),
    Utils = require('../Utils'),
    _ = require('lodash');

var TodoItem = React.createClass({

  mixins: [Utils],

  getEditInput: function() {
    return this.refs.editItem.getDOMNode();
  },

  onEdit: function() {
    this.props.onEdit(this.props.reactKey);
  },

  offEdit: function() {
    this.props.offEdit(this.props.reactKey);
  },

  onComplete: function() {
    this.props.onComplete(this.props.reactKey, this.props.completed);
  },

  onDelete: function() {
    this.props.onDelete(this.props.reactKey);
  },

  saveTitle: function() {
    var input = this.getEditInput();
    if (_.isEmpty(input.value)) {
      input.value = this.props.title;
    } else {
      this.props.saveTitle(this.props.reactKey, input.value);
    }
    this.offEdit();
  },

  savePressItem: function(event) {
    if (event.keyCode != this.KEY_ENTER) {
      return;
    }
    this.saveTitle();
  },

  componentDidUpdate: function() {
    var input = this.getEditInput();
    if (this.props.editing) {
      input.focus();
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
          <input className="toggle" type="checkbox" checked={Boolean(this.props.completed)} onChange={this.onComplete} />
          <label onDoubleClick={this.onEdit}>{this.props.title}</label>
          <button className="destroy" onClick={this.onDelete} ></button>
        </div>
        <input ref="editItem" className="edit" defaultValue={this.props.title} onBlur={this.saveTitle} onKeyDown={this.savePressItem}/>
      </li>
    );
  }

});

module.exports = TodoItem;