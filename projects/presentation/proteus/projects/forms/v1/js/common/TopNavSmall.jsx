var TopNavPrepare = React.createClass({
  render: function() {
    return (
      <div className="action-header">
        <div className="action-header_title">
          <a className="btn btn-link btn-lg btn-icon btn-back">
            <span className="icon icon-caret-left"></span>
            <span className="sr-text">Back</span>
          </a>
          <span className="title desktop">Upload a Document and Add Recipients</span>
          <span className="msg hidden">Saving...</span>
        </div>
        <div className="actions">
          <a className="btn btn-lg btn-link" target="none" href="//support.docusign.com/guides/ndse-user-guide-send-a-document"><span className="">Help</span></a>
          <a className="btn btn-link btn-lg btn-trigger action hidden-sm">Other Actions</a>
          <a><button className="btn btn-main btn-lg btn_next"><span className="">Next</span> <span className="icon icon-caret-right"></span></button></a>
          <button className="btn btn-main btn-lg hidden" disabled="true"><span className="">Save and Resend</span></button>
        </div>
        <div id="menuOtherActions" className="menu invisible">
          <ul className="menu-buttons" role="menu">
            <li role="menuitem"><a className="btn btn-secondary btn-block">Save and Close</a></li>
            <li role="menuitem"><a className="btn btn-secondary btn-block">Send Now</a></li>
            <li role="menuitem"><a className="btn btn-secondary btn-block">Discard</a></li>
          </ul>
        </div>
      </div>
    );
  }
});

ReactDOM.render(<TopNavPrepare></TopNavPrepare>, document.getElementById("topNav"));
