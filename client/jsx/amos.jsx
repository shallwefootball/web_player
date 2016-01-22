Login = React.createClass({
	render: function() {
		return (
			// <div classNam></div>
			<div className="panel panel-default">
				<div className="panel-heading">
					<div className="panel-title">로그인</div>
				</div>
				<div className="panel-body">
					<form id="login" className="form-horizontal" role="form" method="post" action="/login" >
						<div className="form-group">
							<div className="col-sm-12 col-md-12 col-xs-12">
								<input type="email" className="form-control" name="email" placeholder="이메일" autofocus />
							</div>
						</div>
						<div className="form-group">
							<div className="col-sm-12 col-md-12 col-xs-12">
								<input id="login-password" type="password" className="form-control" name="password" placeholder="비밀번호" />
							</div>
						</div>
						<div className="form-group">

							<div className="col-sm-12 controls">
								<button type="submit" id="btn-login" className="btn btn-success btn-block">로그인  </button>
							</div>
						</div>
						<div className="form-group">
							<div className="col-md-12">

								<div style="border-top: 1px solid#888; padding-top:15px; font-size:85%" >
									아이디가 없다면?
									<a href="/signup">
										선수등록!
									</a>
								</div>

							</div>
						</div>
					</form>
				</div>
			</div>
		)
	}
})


Meteor.startup(function() {
  ReactDOM.render(<Login />, document.getElementById('container'));
})
