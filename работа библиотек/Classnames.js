/*eslint-disable*/
/*
  Иногда в React не смотря на то что классы установил в нужной последовательности
  на деле может оказаться так что последний класс стоит первым и перекрывает стили
  для этого можно воспользоваться ClassNames
*/
/*-------------------------------------------------------------------------*/
import classNames from 'classnames';
classNames('foo', 'bar'); // => 'foo bar'
classNames('foo', { bar: true }); // => 'foo bar'
classNames({ 'foo-bar': true }); // => 'foo-bar'
classNames({ 'foo-bar': false }); // => ''
classNames({ foo: true }, { bar: true }); // => 'foo bar'
classNames({ foo: true, bar: true }); // => 'foo bar'
// множество аргументов разного типа 
classNames('foo', { bar: true, duck: false }, 'baz', { quux: true }); // => 'foo bar baz quux'
 
// другие ложные значения просто игнорируются
classNames(null, false, 'bar', undefined, 0, 1, { baz: null }, ''); // => 'bar 1'
/*-------------------------------------------------------------------------*/
var arr = ['b', { c: true, d: false }];
classNames('a', arr); // => 'a b c'
/*-------------------------------------------------------------------------*/
let buttonType = 'primary';
classNames({ [`btn-${buttonType}`]: true });
/*-------------------------------------------------------------------------*/
var Button = React.createClass({
  // ...
  render () {
    var btnClass = 'btn';
    if (this.state.isPressed) btnClass += ' btn-pressed';
    else if (this.state.isHovered) btnClass += ' btn-over';
    return <button className={btnClass}>{this.props.label}</button>;
  }
});
/*-------------------------------------------------------------------------*/
var Button = React.createClass({
  // ...
  render () {
    var btnClass = classNames({
      btn: true,
      'btn-pressed': this.state.isPressed,
      'btn-over': !this.state.isPressed && this.state.isHovered
    });
    return <button className={btnClass}>{this.props.label}</button>;
  }
});
/*-------------------------------------------------------------------------*/
var btnClass = classNames('btn', this.props.className, {
  'btn-pressed': this.state.isPressed,
  'btn-over': !this.state.isPressed && this.state.isHovered
});
/*-------------------------------------------------------------------------*/
classNames('foo', 'foo', 'bar'); // => 'foo bar'
classNames('foo', { foo: false, bar: true }); // => 'bar'
/*-------------------------------------------------------------------------*/
var classNames1 = require('classnames/bind');
var styles = {
  foo: 'abc',
  bar: 'def',
  baz: 'xyz'
};
 
var cx = classNames1.bind(styles);
var className = cx('foo', ['bar'], { baz: true }); // => "abc def xyz"
/*-------------------------------------------------------------------------*/

import { Component } from 'react';
import classNames2 from 'classnames/bind';
import styles1 from './submit-button.css';
 
let cx1 = classNames2.bind(styles1);
 
export default class SubmitButton extends Component {
  render () {
    let text = this.props.store.submissionInProgress ? 'Processing...' : 'Submit';
    let className = cx1({
      base: true,
      inProgress: this.props.store.submissionInProgress,
      error: this.props.store.errorOccurred,
      disabled: this.props.form.valid,
    });
    return <button className={className}>{text}</button>;
  }
};