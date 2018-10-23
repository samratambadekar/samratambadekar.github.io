var SideBarOptions = React.createClass({
  render: function() {
    return (
      <div className="content_sidebar content_sidebar-right">
        <div className="sidebar-options ">
          <div className="sidebar_header ng-binding">Documents</div>
          <div className="docsWrapper" data-qa="test">
            <div className="singleDocument" data-doc-num="document2" data-item-num="2">
              <div className="documentDescription accordion open">
                <i className="icon accordion-icon" data-qa="document-page-icon"></i>
                <span className="docName ng-binding">I-9.pdf</span>
                <i className="icon icon-right more_options" data-qa="document-options-icon"><img src="images/svg/icon_more.svg"/></i>
                <span className="docPages ng-binding" data-qa="uploaded-file-pages">Pages: 2</span>

                <div id="" className="menu menu_doc_options invisible">
                  <ul role="menu">
                    <li role="set_as_supplement" className="ng-scope">
                      <a className="item" data-qa="Standard Fields">Set as Supplement</a>
                    </li>
                    <li role="menuitem" className="ng-scope">
                      <a className="item" data-qa="Custom Fields">Delete Document</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="documentPageSet drawer down full open">
                <div className="drawer-wrapper"><br/>
                  <div callout-pos="before top" className="documentPage callout-target">
                    <img className="img" src="docs/I9_page1.png"/>
                    <div className="bar-action">
                      <span className="pageNumber ng-binding">1</span>
                      <button className="btn btn-icon btn-minor btn-action">
                        <span className="icon icon-trash"></span>
                        <span className="sr-text ng-binding">Delete</span>
                      </button>
                      <button className="btn btn-icon btn-minor btn-action">
                        <span className="icon icon-rotate-circle-right"></span>
                        <span className="sr-text ng-binding">Rotate</span>
                      </button>
                    </div>

                    <div className="column-indicators">
                      <div className="indicator-tag ng-scope indicator-recipient-0"></div>
                    </div>
                    <span className="pageNumber ng-binding">1</span>
                  </div>
                  <div callout-pos="before top" className="documentPage callout-target">
                    <img className="img" src="docs/I9_page2.png"/>
                    <div className="bar-action">
                      <span className="pageNumber ng-binding">2</span>
                      <button className="btn btn-icon btn-minor btn-action">
                        <span className="icon icon-trash"></span>
                        <span className="sr-text ng-binding">Delete</span>
                      </button>
                      <button className="btn btn-icon btn-minor btn-action">
                        <span className="icon icon-rotate-circle-right"></span>
                        <span className="sr-text ng-binding">Rotate</span>
                      </button>
                    </div>
                    <div className="column-indicators"></div>
                    <span className="pageNumber ng-binding">2</span>
                  </div>
                  <div callout-pos="before top" className="documentPage callout-target">
                    <img className="img" src="docs/I9_page3.png"/>
                    <div className="bar-action">
                      <span className="pageNumber ng-binding">3</span>
                      <button className="btn btn-icon btn-minor btn-action">
                        <span className="icon icon-trash"></span>
                        <span className="sr-text ng-binding">Delete</span>
                      </button>
                      <button className="btn btn-icon btn-minor btn-action">
                        <span className="icon icon-rotate-circle-right"></span>
                        <span className="sr-text ng-binding">Rotate</span>
                      </button>
                    </div>
                    <div className="column-indicators"></div>
                    <span className="pageNumber ng-binding">3</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
           <div className="drawer left drawer-properties ng-isolate-scope open">
             <div className="drawer-wrapper">
               <div className="drawer-content full-drawer">
                 <div className="drawer-properties_header">
                   <span className="icon icon-palette-field-text"></span>
                   <span data-qa="pannel-header" className="ng-binding">Text</span>
                 </div>

                   <div className="drawer-properties_main">
                     <div className="drawer-properties_section tag_option">
                       <div className="section">
                         <div className="form-group">
                           <div className="cb inline-input">
                             <input type="checkbox" id="tagDetailRequired" className="cb_input ng-pristine ng-untouched ng-valid" checked/> <label for="tagDetailRequired" className="cb_label ng-binding">Required Field</label>
                           </div>
                         </div>
                       </div>
                        <div className="section ng-hide">
                          <div className="form-group">
                            <div className="inline-input">
                              <div className="select-wrap">
                                <select id="nameTypeSelector" className="input-select ng-pristine ng-untouched ng-valid">
                                  <option value="empty">-- ? --</option>
                                  <option data-qa="Full Name" value="full" className="ng-binding">Full Name</option>
                                  <option data-qa="First Name" value="first" className="ng-binding">First Name</option>
                                  <option data-qa="Last Name" value="last" className="ng-binding">Last Name</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="inline-input" data-qa="read-only-checkbox">
                          <input type="checkbox" id="tabIsReadOnly" data-qa="read-only-input" className="input-cb vh ng-pristine ng-untouched ng-valid"/>
                          <label for="tabIsReadOnly" className="cb-box"></label>
                          <label for="tabIsReadOnly" className="cb-label ng-binding">Read Only</label>
                        </div>
                      </div>
                      <div data-qa="add-text-accordion" className="tag_option">
                        <div className="accordion open">
                          <span className="ng-binding">Add Text</span>
                          <i className="icon accordion-icon"></i>
                        </div>
                        <div className="drawer drawer-properties_section down full open">
                          <div className="drawer-wrapper">
                            <div className="drawer-content showing">
                              <div className="section">
                                <div className="form-group">
                                  <textarea className="input-textarea ng-pristine ng-untouched ng-valid" type="text" placeholder="Add Text" data-qa="add-text" maxlength="4000"></textarea>
                                </div>
                                <div className="form-group">
                                  <input id="charLimitPropPanel" data-qa="char-limit" className="input-text input-number input-noSpinButtons ng-pristine ng-untouched ng-valid" type="number"/>
                                  <label for="charLimitPropPanel" className="ng-binding">Character Limit</label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div id="propertiesPanelRecipientsMenu" className="menu select-menu invisible">
                        <ul>
                          <li> <button type="button" className="item on">
                            <span className="recipient-swatch ng-binding recipient-swatch-0">Beth Morgan</span>
                          </button> </li>
                        </ul>
                      </div>
                      <div data-qa="pay-provider-properties-accordion" className="tag_option">
                        <div className="accordion closed">
                          <span className="ng-binding">Payment Provider</span>
                          <i className="icon accordion-icon"></i>
                        </div>
                        <div className="drawer drawer-properties_section down closed">
                          <div className="drawer-wrapper">
                            <div className="drawer-content">
                              <div className="section">
                                <div className="form-group">
                                  <div className="select-wrap">
                                    <select className="input-select ng-pristine ng-untouched ng-valid" autocomplete="off">
                                      <option data-qa="stripe" value="stripe" className="ng-binding">Stripe</option>
                                      <option data-qa="paypal" value="paypal" className="ng-binding">Paypal</option>
                                      <option data-qa="newProvider" value="newProvider" className="ng-binding">-- Add Provider --</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div data-qa="pay-amount-properties-accordion" className="tag_option">
                        <div className="accordion closed">
                          <span className="ng-binding">Amount</span>
                          <i className="icon accordion-icon"></i>
                        </div>
                        <div className="drawer drawer-properties_section down closed">
                          <div className="drawer-wrapper">
                            <div className="drawer-content">
                              <div className="section">
                                <div className="form-group">
                                  <div className="select-wrap">
                                    <select className="input-select ng-pristine ng-untouched ng-valid">
                                      <option data-qa="usd" value="usd" className="ng-binding">$ USD</option>
                                    </select>
                                  </div>
                                  <div className="form_row">
                                    <div className="select-wrap">
                                      <select className="input-select ng-pristine ng-untouched ng-valid" autocomplete="off">
                                        <option value="fixedamount" data-qa="fixedamount" className="ng-binding" selected="selected">Fixed Amount</option>
                                        <option value="byformula" data-qa="byformula" className="ng-binding">Based on Formula</option>
                                        <option value="bysigner" data-qa="bysigner" className="ng-binding">Entered by Recipient</option>
                                      </select>
                                    </div>
                                  </div>
                                  <div className="form_row">
                                    <input className="input input-text ng-pristine ng-untouched ng-valid" data-qa="pay-amount-text" placeholder="0.00" value="0.00"/>
                                    <button className="btn btn-utility btn-block ng-binding hidden">Setup</button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div data-qa="pay-description-properties-accordion" className="tag_option">
                        <div className="accordion closed">
                          <span className="ng-binding">Description</span>
                          <i className="icon accordion-icon"></i>
                        </div>
                        <div className="drawer drawer-properties_section down closed">
                          <div className="drawer-wrapper">
                            <div className="drawer-content">
                              <div className="section">
                                <div className="form-group">
                                  <div className="form_row">
                                    <input className="input input-text ng-pristine ng-untouched ng-valid" data-qa="item-name-text" placeholder="Item Name"/>
                                  </div>
                                  <div className="form_row">
                                    <input className="input input-text ng-pristine ng-untouched ng-valid" data-qa="item-code-text" placeholder="Item Code / Sku"/>
                                  </div>
                                  <div className="form_row">
                                    <input className="input input-text ng-pristine ng-untouched ng-valid" data-qa="unit-price-text" placeholder="Unit Price"/>
                                  </div>
                                  <div className="form_row">
                                    <input className="input input-text ng-pristine ng-untouched ng-valid" data-qa="item-details-text" placeholder="Item Details"/>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div data-qa="formatting-properties-accordion" className="tag_option">
                        <div className="accordion closed">
                          <span className="ng-binding">Formatting</span>
                          <i className="icon accordion-icon"></i>
                        </div>
                        <div className="drawer drawer-properties_section down closed">
                          <div className="drawer-wrapper">
                            <div className="drawer-content">
                              <div className="section">
                                <div className="form-group">
                                  <div className="select-wrap">
                                    <select className="input-select ng-pristine ng-untouched ng-valid">
                                      <option data-qa="arial" value="arial" className="ng-binding">Arial</option>
                                      <option data-qa="arialnarrow" value="arialnarrow" className="ng-binding">Arial Narrow</option>
                                      <option data-qa="calibri" value="calibri" className="ng-binding">Calibri</option>
                                      <option data-qa="couriernew" value="couriernew" className="ng-binding">Courier New</option>
                                      <option data-qa="garamond" value="garamond" className="ng-binding">Garamond</option>
                                      <option data-qa="georgia" value="georgia" className="ng-binding">Georgia</option>
                                      <option data-qa="helvetica" value="helvetica" className="ng-binding">Helvetica</option>
                                      <option data-qa="lucidaconsole" value="lucidaconsole" className="ng-binding" selected="selected">Lucida Console</option>
                                      <option data-qa="msgothic" value="msgothic" className="ng-binding">MS Gothic</option>
                                      <option data-qa="msmincho" value="msmincho" className="ng-binding">MS Mincho</option>
                                      <option data-qa="tahoma" value="tahoma" className="ng-binding">Tahoma</option>
                                      <option data-qa="timesnewroman" value="timesnewroman" className="ng-binding">Times New Roman</option>
                                      <option data-qa="trebuchet" value="trebuchet" className="ng-binding">Trebuchet</option>
                                      <option data-qa="verdana" value="verdana" className="ng-binding">Verdana</option>
                                    </select>
                                  </div>
                                  <div className="form_row">
                                    <div className="select-wrap btn-fontSize">
                                      <select className="input-select ng-pristine ng-untouched ng-valid">
                                        <option value="7" data-qa="font-7" className="ng-binding">7</option>
                                        <option value="8" data-qa="font-8" className="ng-binding">8</option>
                                        <option value="9" data-qa="font-9" className="ng-binding" selected="selected">9</option>
                                        <option value="10" data-qa="font-10" className="ng-binding">10</option>
                                        <option value="11" data-qa="font-11" className="ng-binding">11</option>
                                        <option value="12" data-qa="font-12" className="ng-binding">12</option>
                                        <option value="14" data-qa="font-14" className="ng-binding">14</option>
                                        <option value="16" data-qa="font-16" className="ng-binding">16</option>
                                        <option value="18" data-qa="font-18" className="ng-binding">18</option>
                                        <option value="20" data-qa="font-20" className="ng-binding">20</option>
                                        <option value="22" data-qa="font-22" className="ng-binding">22</option>
                                        <option value="24" data-qa="font-24" className="ng-binding">24</option>
                                        <option value="26" data-qa="font-26" className="ng-binding">26</option>
                                        <option value="28" data-qa="font-28" className="ng-binding">28</option>
                                        <option value="36" data-qa="font-36" className="ng-binding">36</option>
                                        <option value="48" data-qa="font-48" className="ng-binding">48</option>
                                        <option value="72" data-qa="font-72" className="ng-binding">72</option>
                                      </select>
                                    </div>
                                    <div className="group">
                                      <button className="btn btn-md btn-icon btn-utility group-item">
                                        <i className="icon icon-text-bold" data-qa="format-bold" ng-className="'icon-text-' + attribute"></i>
                                      </button>
                                      <button className="btn btn-md btn-icon btn-utility group-item">
                                        <i className="icon icon-text-italic" data-qa="format-italic" ng-className="'icon-text-' + attribute"></i>
                                      </button>
                                      <button className="btn btn-md btn-icon btn-utility group-item">
                                        <i className="icon icon-text-underline" data-qa="format-underline" ng-className="'icon-text-' + attribute"></i>
                                      </button>
                                    </div>
                                  </div>
                                  <div className="form-group">
                                    <div className="select-wrap">
                                      <select className="input-select ng-pristine ng-untouched ng-valid" data-qa="font-color">
                                        <option data-qa="black" value="black" className="ng-binding" selected="selected">Black</option>
                                        <option data-qa="brightblue" value="brightblue" className="ng-binding">Bright Blue</option>
                                        <option data-qa="brightred" value="brightred" className="ng-binding">Bright Red</option>
                                        <option data-qa="darkgreen" value="darkgreen" className="ng-binding">Dark Green</option>
                                        <option data-qa="darkred" value="darkred" className="ng-binding">Dark Red</option>
                                        <option data-qa="gold" value="gold" className="ng-binding">Gold</option>
                                        <option data-qa="green" value="green" className="ng-binding">Green</option>
                                        <option data-qa="navyblue" value="navyblue" className="ng-binding">Navy Blue</option>
                                        <option data-qa="purple" value="purple" className="ng-binding">Purple</option>
                                        <option data-qa="white" value="white" className="ng-binding">White</option>
                                      </select>
                                    </div>
                                  </div>
                                  <div className="form-group">
                                    <input type="checkbox" id="astericksText" data-qa="astericks-text" className="input-cb vh ng-pristine ng-untouched ng-valid"/>
                                    <label for="astericksText" className="cb-box"></label>
                                    <label for="astericksText" className="cb-label ng-binding">Hide text with asterisks</label>
                                  </div>
                                  <div className="form-group">
                                    <input type="checkbox" id="disableAutoSizeCb" data-qa="fixed-width" className="input-cb vh ng-pristine ng-untouched ng-valid"/>
                                    <label for="disableAutoSizeCb" className="cb-box"></label>
                                    <label for="disableAutoSizeCb" className="cb-label ng-binding">Fixed Width</label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                     <div data-qa="data-label-properties-accordion" className="tag_option">
                       <div className="accordion closed">
                         <span className="ng-binding">Data Label</span>
                         <i className="icon accordion-icon"></i>
                       </div>
                       <div className="drawer drawer-properties_section down closed">
                         <div className="drawer-wrapper">
                           <div className="drawer-content">
                             <div className="section">
                               <div className="form-group">
                                 <input className="input input-text ng-pristine ng-untouched ng-valid" data-qa="data-label-text" placeholder="..."/>
                               </div>
                             </div>
                           </div>
                         </div>
                       </div>
                     </div>
                     <div data-qa="tooltip-properties-accordion" className="tag_option">
                      <div className="accordion closed"><span className="ng-binding">Tooltip</span> <i className="icon accordion-icon"></i></div>
                      <div className="drawer drawer-properties_section down closed">
                        <div className="drawer-wrapper">
                          <div className="drawer-content">
                            <div className="section">
                              <div className="form-group"> <input className="input input-text ng-pristine ng-untouched ng-valid ng-valid-maxlength" data-qa="tooltip-text" placeholder="..." maxlength="100"/> </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div data-qa="data-validation-properties-accordion" className="tag_option">
                      <div className="accordion closed"><span className="ng-binding">Validation</span> <i className="icon accordion-icon"></i></div>
                      <div className="drawer drawer-properties_section down closed">
                        <div className="drawer-wrapper">
                          <div className="drawer-content">
                            <div className="section">
                              <div className="form-group">
                                <div className="select-wrap">
                                  <select className="input-select ng-pristine ng-untouched ng-valid" data-qa="validation">
                                    <option data-qa="Custom" value="Custom" className="ng-binding">Custom</option>
                                    <option data-qa="Date" value="Date" className="ng-binding">Date</option>
                                    <option data-qa="Email" value="Email" className="ng-binding">Email</option>
                                    <option data-qa="Letters" value="Letters" className="ng-binding">Letters</option>
                                    <option data-qa="None" value="None" className="ng-binding" selected="selected">None</option>
                                    <option data-qa="Number" value="Number" className="ng-binding">Number</option>
                                    <option data-qa="SSN" value="SSN" className="ng-binding">SSN</option>
                                    <option data-qa="Zip" value="Zip" className="ng-binding">Zip</option>
                                    <option data-qa="Zip-Ext" value="Zip-Ext" className="ng-binding">Zip-Ext</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                   <div data-qa="anchor-tabs-properties-accordion" className="tag_option">
                     <div className="accordion closed"><span className="ng-binding">AutoPlace</span> <i className="icon accordion-icon"></i></div>
                     <div className="drawer drawer-properties_section down closed">
                       <div className="drawer-wrapper">
                         <div className="drawer-content">
                          <div className="section">
                            <div className="form-group"> <button className="btn btn-utility btn-block ng-binding">Set Up</button> </div>
                          </div>
                         </div>
                       </div>
                     </div>
                   </div>
                   <div data-qa="radio-values-properties-accordion" className="ng-hide tag_option">
                     <div className="accordion closed"><span className="ng-binding">Radio Button Values</span> <i className="icon accordion-icon"></i></div>
                     <div className="drawer drawer-properties_section down closed">
                       <div className="drawer-wrapper">
                         <div className="drawer-content">
                           <div className="section" data-qa="checkbox-section"></div>
                         </div>
                       </div>
                     </div>
                   </div>
                   <div data-qa="collab-property-accordion" className="tag_option">
                     <div className="accordion closed"><span className="ng-binding">Collaboration</span> <i className="icon accordion-icon"></i></div>
                     <div className="drawer drawer-properties_section down closed">
                       <div className="drawer-wrapper">
                         <div className="drawer-content">
                           <div className="cb inline-input" data-qa="shared-tab-checkbox"> <input type="checkbox" id="sharedTabCheckbox" data-qa="input-shared-tab-checkbox" className="cb_input ng-pristine ng-untouched ng-valid"/> <label for="sharedTabCheckbox" className="cb_label ng-binding">Recipients Can Collaborate</label></div>
                           <div className="cb inline-input ng-hide" data-qa="require-initial-on-shared-change-cb"> <input type="checkbox" id="requireInitialOnSharedChangeCb" className="cb_input ng-pristine ng-untouched ng-valid" data-qa="input-require-initial-on-shared-change-cb"/> <label for="requireInitialOnSharedChangeCb" className="cb_label ng-binding">Changes Require Initials</label></div>
                         </div>
                       </div>
                     </div>
                   </div>
                   <div data-qa="conditional-logic-properties-accordion" className="tag_option">
                     <div className="accordion closed"><span className="ng-binding">Conditional Logic</span> <i className="icon accordion-icon"></i></div>
                     <div className="drawer drawer-properties_section down closed">
                       <div className="drawer-wrapper">
                         <div className="drawer-content">
                           <div className="section">
                             <div className="form-group"> <button className="btn btn-utility btn-block ng-binding">Create Rule</button> </div>
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>

                 <div className="drawer-properties_footer">
                   <button className="btn btn-block btn-md btn-utility" data-qa="properties-panel-save-as-custom">
                     <span className="ng-binding">Save As Custom Field</span>
                   </button>
                   <button className="btn btn-block btn-md btn-utility" data-qa="properties-panel-delete">
                     <span className="ng-binding">Delete</span>
                   </button>
                 </div>
               </div>
             </div>
           </div>
         </div>

         <div className="sidebar-sections">
           <div className="title">
           </div>
           <div className="section-info">
           </div>
           <div className="section-blocks">
           </div>
         </div>
       </div>
    );
  }
});

ReactDOM.render(<SideBarOptions></SideBarOptions>, document.getElementById("sidebarRight"));
