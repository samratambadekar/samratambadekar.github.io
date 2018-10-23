var TopNavPrepare = React.createClass({
  render: function() {
    return (
      <div>
        <div className="action-header">
          <div className="action-header_title ellipsis">
            <a className="btn-link btn-lg btn-icon btn-back">
              <span className="icon icon-caret-left"></span>
              <span className="sr-text">Back</span>
            </a>
            <span className="title desktop">Templates</span>
          </div>
          <div className="btn-trigger">New I-9</div>
          <div className="actions">
            <a><button className="btn btn-inverse-secondary action hidden-sm">Create Guided Form</button></a>
            <a><button className="btn btn-main"><span className="">Save and Close</span></button></a>
          </div>
        </div>
        <div id="menuOtherActions" className="menu invisible">
          <ul className="menu-buttons" role="menu">
            <li className="ng-scope" role="menuitem"><a className="btn btn-secondary btn-block ng-binding">Save and Close</a></li>
            <li className="ng-scope" role="menuitem"><a className="btn btn-secondary btn-block ng-binding">Discard</a></li>
          </ul>
          <ul className="ng-scope" role="menu">
            <li role="menuitem"><a className="item ng-scope ng-binding" data-qa="edit-message">Edit Message</a></li>
            <li role="menuitem"><a className="item ng-binding" data-qa="edit-recipients">Edit Recipients</a></li>
            <li role="edit-documents"><a className="item ng-binding" data-qa="edit-documents">Edit Documents</a></li>
            <li role="menuitem"><a className="item ng-scope ng-binding" data-qa="edit-advanced-options">Advanced Options</a></li>
          </ul>
        </div>
      </div>
    );
  }
});

ReactDOM.render(<TopNavPrepare></TopNavPrepare>, document.getElementById("topNav"));
