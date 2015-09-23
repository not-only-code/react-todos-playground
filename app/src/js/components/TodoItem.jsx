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
    this.props.onComplete(this.props.reactKey);
  },

  onDelete: function() {
    this.props.onDelete(this.props.reactKey);
  },

  saveItem: function() {
    var input = this.getEditInput();
    var item = _.cloneDeep(this.props);
    _.extend(item, {title: input.value});
    this.props.saveItem(item);
  },

  savePressItem: function(event) {
    if (event.keyCode != this.KEY_ENTER) {
      return;
    }
    this.saveItem();
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

    console.log(this.props.completed);

    return (
      <li key={this.props.key} className={classNames}>
        <div className="view">
          <input className="toggle" type="checkbox" checked={Boolean(this.props.completed)} onChange={this.onComplete} />
          <label onDoubleClick={this.onEdit}>{this.props.title}</label>
          <button className="destroy" onClick={this.onDelete} ></button>
        </div>
        <input ref="editItem" className="edit" defaultValue={this.props.title} onBlur={this.saveItem} onKeyDown={this.savePressItem}/>
      </li>
    );
  }

});

module.exports = TodoItem;