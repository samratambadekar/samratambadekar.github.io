var TaggerTopToolbar = React.createClass({
  render: function() {
    return (
      <div className="tagger_top_toolbar">
        <div className="site_toolbar toolbar_tagger">
          <div className="toolbar_left ng-isolate-scope">
            <button id="btnRecipients" type="button" data-qa="recipient-selector" className="btn btn-select btn-block btn-trigger btn-recipients u-ellipsis ng-scope">
              <span className="swatch swatch-sm swatch-round swatch-recipient swatch-ext-0"></span>
              <span className="ng-binding">Employee</span>
            </button>
            <div id="toolbarRecipientsMenu" className="menu invisible select-menu">
              <ul role="menu" aria-labelledby="Employee">
                <li data-qa="recipient-1" className="ng-scope" role="menuitem">
                  <button className="item on">
                    <span className="swatch swatch-round swatch-recipient swatch-ext-0" data-qa="recipient-list-name-1"></span>
                    <span className="ng-binding">Employee</span>
                  </button>
                </li>
              </ul>
              <ul role="menu" aria-labelledby="Employee">
                <li role="menuitem">
                  <button className="item ng-binding" ng-click="recipientSelector.openEditRecipientsModal()" data-qa="edit-recipients-swatch">Edit Recipients</button>
                </li>
              </ul>
            </div>
          </div>
          <div className="toolbar_main">
            <div className="btn-group">
              <button type="button" className="btn btn-minor btn-icon" disabled="disabled">
                <span className="icon icon-undo"></span>
                <span className="sr-text ng-binding">Undo</span>
              </button>
              <button type="button" className="btn btn-minor btn-icon" data-qa="redo-button" disabled="disabled">
                <span className="icon icon-redo"></span>
                <span className="sr-text ng-binding">Redo</span>
              </button>
            </div>
            <div className="btn-group">
              <button type="button" className="btn btn-minor btn-icon ng-scope" data-qa="copy-toolbar-button" disabled="disabled">
                <span className="icon icon-copy"></span>
                <span className="sr-text ng-binding">Copy</span>
              </button>
              <button type="button" className="btn btn-minor btn-icon ng-scope" data-qa="paste-toolbar-button" disabled="disabled">
                <span className="icon icon-paste"></span>
                <span className="sr-text ng-binding">Paste</span>
              </button>
            </div>
            <div className="btn-group">
              <button type="button" className="btn btn-minor btn-utility btn-trigger ng-binding ng-scope" data-qa="zoom-button">100%</button>
              <div className="menu select-menu invisible" id="menuZoomLevels">
                <ul className="ng-scope" role="menu" aria-labelledby="126%">
                  <li className="ng-scope" role="menuitem">
                    <a className="item" data-qa="zoom-level-25">
                      <span className="ng-binding ng-scope">25%</span>
                    </a>
                  </li>
                  <li className="ng-scope" role="menuitem">
                    <a className="item" data-qa="zoom-level-50">
                      <span className="ng-binding ng-scope">50%</span>
                    </a>
                  </li>
                  <li className="ng-scope" role="menuitem">
                    <a className="item" data-qa="zoom-level-75">
                      <span className="ng-binding ng-scope">75%</span>
                    </a>
                  </li>
                  <li className="ng-scope" role="menuitem">
                    <a className="item" data-qa="zoom-level-100">
                      <span className="ng-binding ng-scope">100%</span>
                    </a>
                  </li>
                  <li className="ng-scope" role="menuitem">
                    <a className="item" data-qa="zoom-level-125">
                      <span className="ng-binding ng-scope">125%</span>
                    </a>
                  </li>
                  <li className="ng-scope" role="menuitem">
                    <a className="item" data-qa="zoom-level-150">
                      <span className="ng-binding ng-scope">150%</span>
                    </a>
                  </li>
                  <li className="ng-scope" role="menuitem">
                    <a className="item" data-qa="zoom-level-200">
                      <span className="ng-binding ng-scope">200%</span>
                    </a>
                  </li>
                  <li className="ng-scope" role="menuitem">
                    <a className="item" data-qa="zoom-level-400">
                      <span className="ng-binding ng-scope">400%</span>
                    </a>
                  </li>
                </ul>
                <ul className="ng-scope" role="menu" aria-labelledby="126%">
                  <li className="ng-scope" role="menuitem">
                    <a className="item on" data-qa="zoom-level-auto">
                      <span className="ng-binding ng-scope">Fit to width</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div tab-search-cheshire="" className="ng-isolate-scope">
            </div>
          </div>
          <div className="toolbar_right"></div>
        </div>

        <div className="site_toolbar toolbar_smart_form hideTop">
          <div className="toolbar_left ng-isolate-scope">
          </div>
          <div className="toolbar_main">
            <span className="view_as">Viewing form for</span>
            <button id="btnRecipients" type="button" data-qa="recipient-selector" className="btn btn-select btn-trigger btn-recipients u-ellipsis ng-scope">
              <span className="swatch swatch-sm swatch-round swatch-recipient swatch-ext-0"></span>
              <span className="ng-binding">Employee</span>
            </button>
            <div id="toolbarRecipientsMenu" className="menu invisible select-menu">
              <ul role="menu" aria-labelledby="Employee">
                <li data-qa="recipient-1" className="ng-scope" role="menuitem">
                  <button className="item on">
                    <span className="swatch swatch-round swatch-recipient swatch-ext-0" data-qa="recipient-list-name-1"></span>
                    <span className="ng-binding">Employee</span>
                  </button>
                </li>
              </ul>
              <ul role="menu" aria-labelledby="Employee">
                <li role="menuitem">
                  <button className="item ng-binding" ng-click="recipientSelector.openEditRecipientsModal()" data-qa="edit-recipients-swatch">Edit Recipients</button>
                </li>
              </ul>
            </div>
          </div>
          <div className="toolbar_right">
          </div>
        </div>
      </div>
    );
  }
});

ReactDOM.render(<TaggerTopToolbar></TaggerTopToolbar>, document.getElementById("siteTopToolbar"));
