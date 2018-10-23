var TopNavMain = React.createClass({
  render: function() {
    return (
      <div className="toast">
        <div className="toast-message">Toast Message</div>
      </div>
    );
  }
});

ReactDOM.render(<TopNavMain></TopNavMain>, document.getElementById("toastMessage"));
