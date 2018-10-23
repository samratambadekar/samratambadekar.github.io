var TopNavPrepare = React.createClass({
  render: function() {
    return (
      <div>
        <div className="action-header">
          <div className="action-header_title">
            <a className="btn btn-link btn-lg btn-icon btn-back">
              <span className="icon icon-caret-left"></span>
              <span className="sr-text">Back</span>
            </a>
            <span className="title desktop">Templates</span>
            <span className="msg hidden">Saving...</span>
          </div>
          <div className="action-header_title">
            <span className="btn-trigger action document_title">Equipent Rental Form</span>
          </div>
          <div className="actions">
            <a className="btn btn-sm btn-link btn-trigger" target="none"><span className="">Help</span></a>
            <a><button className="btn btn-transparent btn_preview">Preview</button></a>
            <a href="recipients.html"><button className="btn btn-main btn_next">Next</button></a>
            <a href="templates.html"><button className="btn btn-transparent btn_save hide">Save & Close</button></a>
            <a><button className="btn btn-main btn_share hide">Share</button></a>
          </div>
        </div>
        <div id="menuOtherActions" className="menu invisible">
          <ul className="ng-scope" role="menu">
            <li role="edit-title"><a className="item ng-binding" data-qa="edit-documents">Edit Title</a></li>
            <li role="menuitem"><a className="item ng-scope ng-binding" data-qa="edit-message">Edit Message</a></li>
            <li role="menuitem"><a className="item ng-binding" data-qa="edit-recipients">Edit Recipients</a></li>
            <li role="menuitem"><a className="item ng-scope ng-binding" data-qa="edit-advanced-options">Advanced Options</a></li>
          </ul>
          <ul className="menu-buttons" role="menu">
            <li className="ng-scope" role="menuitem"><a className="btn btn-secondary btn-block ng-binding">Save and Close</a></li>
            <li className="ng-scope" role="menuitem"><a className="btn btn-secondary btn-block ng-binding">Discard</a></li>
          </ul>
        </div>
      </div>
    );
  }
});

ReactDOM.render(<TopNavPrepare></TopNavPrepare>, document.getElementById("topNav"));
