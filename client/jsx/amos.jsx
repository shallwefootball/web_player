var Amos = React.createClass({
  render: function() {
    return (
      <div className="box">
        hihi
      </div>
    )
  }
})


Meteor.startup(function() {
  ReactDOM.render(<Amos />, document.getElementById('container'));
})
