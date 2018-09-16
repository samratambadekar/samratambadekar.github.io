var SideBarTags = React.createClass({
  render: function() {
    return (
      <div className="content_sidebar content_sidebar-left ng-isolate-scope">
        <div className="sidebar-fields sidebar-flex">
          <div className="sidebar_main">
            <ul className="sidebarTabs">
              <li className="ng-scope">
                <button className="sidebarTabs_tab sidebarTabs_tab-on" data-qa="Standard Fields">
                  <span className="icon icon-fields-standard">
                  </span>
                </button>
              </li>
              <li className="ng-scope">
                <button className="sidebarTabs_tab" data-qa="Blocks">
                  <img src="images/svg/blocks.svg"/>
                </button>
              </li>
              <li className="ng-scope">
                <button className="sidebarTabs_tab" data-qa="Custom Fields">
                  <span className="icon icon-fields-custom">
                  </span>
                </button>
              </li>
              <li className="ng-scope">
                <button className="sidebarTabs_tab" data-qa="Merge Fields">
                  <span className="icon icon-fields-merge">
                  </span>
                </button>
              </li>
            </ul>

            <div className="sidebar-fields sidebar-tab-option" data-tab-name="Standard Fields">
              <div className="sidebar_group">
                <h5>
                  <span className="ng-binding ng-scope">Standard Fields</span>
                </h5>
              </div>
              <div className="text-center hide">
                <div className="spinner-circle spinner-sm"></div>
              </div>
              <div className="sidebar_item ng-scope">
                <div className="menu-fields">
                  <ul className="menu_list">
                    <li className="menu_listItem ng-isolate-scope" title="Signature">
                      <button className="menu_item u-ellipsis" data-qa="Signature">
                        <span className="swatch swatch-recipient swatch-lg swatch-ext-0">
                          <i className="icon icon-palette-field-sign"></i>
                        </span>
                        <span className="ng-binding">Signature</span>
                      </button>
                    </li>
                    <li className="menu_listItem ng-isolate-scope" title="Initial">
                      <button className="menu_item u-ellipsis" data-qa="Initial">
                        <span className="swatch swatch-recipient swatch-lg swatch-ext-0">
                          <i className="icon icon-palette-field-initial"></i>
                        </span>
                        <span className="ng-binding">Initial</span>
                      </button>
                    </li>
                    <li className="menu_listItem ng-isolate-scope" title="Date Signed">
                      <button className="menu_item u-ellipsis" data-qa="Date Signed">
                        <span className="swatch swatch-recipient swatch-lg swatch-ext-0">
                          <i className="icon icon-palette-field-date signed"></i>
                        </span>
                        <span className="ng-binding">Date Signed</span>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="sidebar_item ng-scope">
                <div className="menu-fields">
                  <ul className="menu_list">
                    <li className="menu_listItem ng-isolate-scope" title="Name">
                      <button className="menu_item u-ellipsis" data-qa="Name">
                        <span className="swatch swatch-recipient swatch-lg swatch-ext-0">
                          <i className="icon icon-palette-field-name"></i>
                        </span>
                        <span className="ng-binding">Name</span>
                      </button>
                    </li>
                    <li className="menu_listItem ng-isolate-scope" title="Email">
                      <button className="menu_item u-ellipsis" data-qa="Email">
                        <span className="swatch swatch-recipient swatch-lg swatch-ext-0">
                          <i className="icon icon-palette-field-email"></i>
                        </span>
                        <span className="ng-binding">Email</span>
                      </button>
                    </li>
                    <li className="menu_listItem ng-isolate-scope" title="Company">
                      <button className="menu_item u-ellipsis" data-qa="Company">
                        <span className="swatch swatch-recipient swatch-lg swatch-ext-0">
                          <i className="icon icon-palette-field-company"></i>
                        </span>
                        <span className="ng-binding">Company</span>
                      </button>
                    </li>
                    <li className="menu_listItem ng-isolate-scope" title="Title">
                      <button className="menu_item u-ellipsis" data-qa="Title">
                        <span className="swatch swatch-recipient swatch-lg swatch-ext-0">
                          <i className="icon icon-palette-field-title"></i>
                        </span>
                        <span className="ng-binding">Title</span>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="sidebar_item ng-scope">
                <div className="menu-fields">
                  <ul className="menu_list">
                    <li className="menu_listItem ng-isolate-scope" title="Text">
                      <button className="menu_item u-ellipsis" data-qa="Text">
                        <span className="swatch swatch-recipient swatch-lg swatch-ext-0">
                          <i className="icon icon-palette-field-text"></i>
                        </span>
                        <span className="ng-binding">Text</span>
                      </button>
                    </li>
                    <li className="menu_listItem ng-isolate-scope" title="Checkbox">
                      <button className="menu_item u-ellipsis" data-qa="Checkbox">
                        <span className="swatch swatch-recipient swatch-lg swatch-ext-0">
                          <i className="icon icon-palette-field-checkbox"></i>
                        </span>
                        <span className="ng-binding">Checkbox</span>
                      </button>
                    </li>
                    <li className="menu_listItem ng-isolate-scope" title="Dropdown">
                      <button className="menu_item u-ellipsis" data-qa="Dropdown">
                        <span className="swatch swatch-recipient swatch-lg swatch-ext-0">
                          <i className="icon icon-palette-field-dropdown"></i>
                        </span>
                        <span className="ng-binding">Dropdown</span>
                      </button>
                    </li>
                    <li className="menu_listItem ng-isolate-scope" title="Radio">
                      <button className="menu_item u-ellipsis" data-qa="Radio">
                        <span className="swatch swatch-recipient swatch-lg swatch-ext-0">
                          <i className="icon icon-palette-field-radio"></i>
                        </span>
                        <span className="ng-binding">Radio</span>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="sidebar_item ng-scope">
                <div className="menu-fields">
                  <ul className="menu_list">
                    <li className="menu_listItem ng-isolate-scope" title="Attachment">
                      <button className="menu_item u-ellipsis" data-qa="Attachment">
                        <span className="swatch swatch-recipient swatch-lg swatch-ext-0">
                          <i className="icon icon-palette-field-attachment"></i>
                        </span>
                        <span className="ng-binding">Attachment</span>
                      </button>
                    </li>
                    <li className="menu_listItem ng-isolate-scope" title="Note">
                      <button className="menu_item u-ellipsis" data-qa="Note">
                        <span className="swatch swatch-recipient swatch-lg swatch-ext-0">
                          <i className="icon icon-palette-field-note"></i>
                        </span>
                        <span className="ng-binding">Note</span>
                      </button>
                    </li>
                    <li className="menu_listItem ng-isolate-scope" title="Approve">
                      <button className="menu_item u-ellipsis" data-qa="Approve">
                        <span className="swatch swatch-recipient swatch-lg swatch-ext-0">
                          <i className="icon icon-palette-field-approve"></i>
                        </span>
                        <span className="ng-binding">Approve</span>
                      </button>
                    </li>
                    <li className="menu_listItem ng-isolate-scope" title="Decline">
                      <button className="menu_item u-ellipsis" data-qa="Decline">
                        <span className="swatch swatch-recipient swatch-lg swatch-ext-0">
                          <i className="icon icon-palette-field-decline"></i>
                        </span>
                        <span className="ng-binding">Decline</span>
                      </button>
                    </li>
                    <li className="menu_listItem ng-isolate-scope" title="Formula">
                      <button className="menu_item u-ellipsis" data-qa="Formula">
                        <span className="swatch swatch-recipient swatch-lg swatch-ext-0">
                          <i className="icon icon-palette-field-formula"></i>
                        </span>
                        <span className="ng-binding">Formula</span>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="sidebar-fields sidebar-tab-option hide" data-tab-name="Blocks">
              <div className="sidebar_group">
                <h5>
                  <span className="ng-binding ng-scope">Blocks</span>
                </h5>
              </div>
              <div className="text-center hide">
                <div className="spinner-circle spinner-sm"></div>
              </div>
              <div className="sidebar_item ng-scope">
                <div className="menu-fields">
                  <ul className="menu_list">
                    <li className="menu_listItem ng-isolate-scope" title="Image">
                      <button className="menu_item u-ellipsis" data-qa="Image">
                        <span className="swatch swatch-recipient swatch-lg swatch-ext-0">
                          <i className="icon icon-type-image"></i>
                        </span>
                        <span className="ng-binding">Image</span>
                      </button>
                    </li>
                    <li className="menu_listItem ng-isolate-scope" title="Link">
                      <button className="menu_item u-ellipsis" data-qa="Link">
                        <span className="swatch swatch-recipient swatch-lg swatch-ext-0">
                          <i className="icon icon-globe"></i>
                        </span>
                        <span className="ng-binding">Link</span>
                      </button>
                    </li>
                    <li className="menu_listItem ng-isolate-scope" title="Paragraph">
                      <button className="menu_item u-ellipsis" data-qa="Paragraph">
                        <span className="swatch swatch-recipient swatch-lg swatch-ext-0">
                          <span className="ng-binding"><img className="icon payment_icon" src="images/svg/tag-paragraph.svg"/></span>
                        </span>
                        <span className="ng-binding">Text</span>
                      </button>
                    </li>
                    <li className="menu_listItem ng-isolate-scope" title="Table">
                      <button className="menu_item u-ellipsis" data-qa="Table">
                        <span className="swatch swatch-recipient swatch-lg swatch-ext-0">
                          <span className="ng-binding"><img className="icon payment_icon" src="images/svg/tag-table.svg"/></span>
                        </span>
                        <span className="ng-binding">Table</span>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="resizeHandle-horizontal ng-scope">
              <span className="icon icon-handle"></span>
            </div>
          </div>
          <div className="sidebar_footer">
            <div className="form_item-iconLeft form_item-iconRight">
              <span className="icon icon-search"></span>
              <input type="text" className="input-text ng-pristine ng-untouched ng-valid" placeholder="Search"/>
              <button type="button" className="button-icon" ng-click="tabFactoryCtrl.resetCustomTabSearch()">
                <span className="icon icon-times"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

ReactDOM.render(<SideBarTags></SideBarTags>, document.getElementById("sidebarLeft"));

{/*<div className="content_sidebar content_sidebar-left sidebar-fields ng-isolate-scope">
  <div className="sidebar_header ng-scope" ng-if="!$root.Featured('expressSend')">
    <button type="button" className="button-text btn-trigger menu_trigger-on">
      <strong className="ng-binding">Standard Fields</strong>
    </button>
    <div id="menuFieldTypes" className="menu below left invisible">
      <ul role="menu">
        <li role="menuitem" className="ng-scope">
          <a className="item" data-qa="Standard Fields">
            <span className="ng-binding">Standard Fields</span>
          </a>
        </li>
        <li role="menuitem" className="ng-scope">
          <a className="item" data-qa="Custom Fields">
            <span className="ng-binding">Custom Fields</span>
          </a>
        </li>
        <li role="menuitem" className="ng-scope">
          <a className="item" data-qa="Merge Fields">
            <span className="ng-binding">Merge Fields</span>
          </a>
        </li>
      </ul>
    </div>
  </div>

  <div className="sidebar_group">
    <button className="item btn ng-isolate-scope" data-qa="Signature">
      <i className="icon icon-palette-field-sign"></i>
      <span className="ng-binding">Signature</span>
    </button>
    <button id="calloutTarget1" callout-pos="after middle" className="item btn ng-isolate-scope"
      data-qa="Initial">
      <i className="icon icon-palette-field-initial"></i>
      <span className="ng-binding">Initial</span>
    </button>
    <button className="item btn ng-isolate-scope" data-qa="Date Signed">
      <i className="icon icon-palette-field-date signed"></i>
      <span className="ng-binding">Date Signed</span>
    </button>
  </div>
  <div className="sidebar_group">
    <button className="item btn ng-isolate-scope" data-qa="Name">
      <i className="icon icon-palette-field-name"></i>
      <span className="ng-binding">Name</span>
    </button>
    <button className="item btn ng-isolate-scope" data-qa="Email">
      <i className="icon icon-palette-field-email"></i>
      <span className="ng-binding">Email</span>
    </button>
    <button className="item btn ng-isolate-scope" data-qa="Company">
      <i className="icon icon-palette-field-company"></i>
      <span className="ng-binding">Company</span>
    </button>
    <button className="item btn ng-isolate-scope" data-qa="Title">
      <i className="icon icon-palette-field-title"></i>
      <span className="ng-binding">Title</span>
    </button>
  </div>
  <div className="sidebar_group">
    <button className="item btn ng-isolate-scope" data-qa="Text">
      <i className="icon icon-palette-field-text"></i>
      <span className="ng-binding">Text</span>
    </button>
    <button className="item btn ng-isolate-scope" data-qa="Checkbox">
      <i className="icon icon-palette-field-checkbox"></i>
      <span className="ng-binding">Checkbox</span>
    </button>
    <button className="item btn ng-isolate-scope" data-qa="Dropdown">
      <i className="icon icon-palette-field-dropdown"></i>
      <span className="ng-binding">Dropdown</span>
    </button>
    <button className="item btn ng-isolate-scope" data-qa="Radio">
      <i className="icon icon-palette-field-radio"></i>
      <span className="ng-binding">Radio</span>
    </button>
  </div>
  <div className="sidebar_group">
    <button className="item btn ng-isolate-scope" data-qa="Attachment">
      <i className="icon icon-palette-field-attachment"></i>
      <span className="ng-binding">Attachment</span>
    </button>
    <button className="item btn ng-isolate-scope" data-qa="Note">
      <i className="icon icon-palette-field-note"></i>
      <span className="ng-binding">Note</span>
    </button>
    <button className="item btn ng-isolate-scope" data-qa="Approve">
      <i className="icon icon-palette-field-approve"></i>
      <span className="ng-binding">Approve</span>
    </button>
    <button className="item btn ng-isolate-scope" data-qa="Decline">
      <i className="icon icon-palette-field-decline"></i>
      <span className="ng-binding">Decline</span>
    </button>
    <button className="item btn ng-isolate-scope" data-qa="Formula">
      <i className="icon icon-palette-field-formula"></i>
      <span className="ng-binding">Formula</span>
    </button>
    <button className="item btn ng-isolate-scope" data-qa="Payment">
      <span className="ng-binding"><img className="icon payment_icon" src="images/svg/tag-payment.svg"/>Payment Amount</span>
    </button>
  </div>
  <div className="sidebar_handle">
    <i className="icon icon-handle custom-tab-palette-resize-icon"></i>
  </div>
</div>*/}
