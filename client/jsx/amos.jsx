var Amos = React.createClass({
  render: function() {
    return (
      <div className="box">
        hihi~~~~~
        <button className="btn btn-default">btn</button>
      </div>
    )
  }
})


Meteor.startup(function() {
  ReactDOM.render(<Amos />, document.getElementById('container'));
})
