var TaggerDocument = React.createClass({
  render: function() {
    return (
      <div className="site site-fit site-editor">
        <div className="site_content">
          <div className="doc_scanner">
            <div className="scanner_line"></div>
          </div>
          <div className="content_main">
            <div className="emptyState hide">
              <span className="icon icon-documents emptyState_icon"></span>
              <p className="emptyState_text ng-binding">You have no documents.</p>
              <button className="btn btn-primary ng-binding">Add Documents</button>
            </div>
            <svg id="documentTags" version="1.1" xlink="http://www.w3.org/1999/xlink" width="100%" height="auto">

            </svg>

            <div className="DocView document2"  data-item-num="2">
              {/*<div className="disclosures hide_transition">
                <div id="disclosure2" className="disclosure minimized" data-name="Disclosure">
                  <div className="info">
                    <div className="title">
                      I-9 Form
                    </div>
                    <div className="instructions">
                      Click this supplemental document to configure settings on the right panel.
                    </div>
                  </div>
                  <div className="action buttons">
                    <button className="btn btn-secondary btn_view">View</button>
                  </div>
                </div>
                <div className="disclosure_doc disclosure2">
                  <div className="overlay"></div>
                  <div className="disclosure_tools">
                    <div className="close_disclosure right">
                      <span className="toolbar-btn-wrapper"><span className="icon-times"></span><span className="tooltip below hide"><span>Close</span></span></span>
                    </div>
                    <div className="title">I-9 Agreement Form (3 Pages)</div>
                    <div className="toolbar desktop">
                      <div className="">
                        <span className="toolbar-btn-wrapper download-menu"><span className="icon-download"></span><span className="tooltip below hide"><span>Download</span></span></span>
                        <span className="toolbar-btn-wrapper"><span className="icon-print"></span><span className="tooltip below hide"><span>Print</span></span></span>
                      </div>
                    </div>
                  </div>
                  <div className="disclosure_pages">
                    <div className="disclosure_page disclosure_page1">
                      <img src="docs/I9_page1.gif"/>
                    </div>
                    <div className="disclosure_page disclosure_page1">
                      <img src="docs/I9_page2.gif"/>
                    </div>
                    <div className="disclosure_page disclosure_page1">
                      <img src="docs/I9_page3.gif"/>
                    </div>
                  </div>
                  <div className="disclosure_footer hidden">
                    <div>
                      <div className="disclosure_accept">I have read, understand and agree to this disclosure</div>
                      <button className="btn btn-primary btn_agree">Accept</button>
                    </div>
                  </div>
                </div>
              </div>*/}
              <div className="PageView">
                <div id="field-1" className="field-tag field-text" data-link-id="field-101">
                  Last Name
                </div>
                <div id="field-2" className="field-tag field-text" data-link-id="field-102">
                  First Name
                </div>
                <div id="field-3" className="field-tag field-text" data-link-id="field-103">
                  Text
                </div>
                <div id="field-4" className="field-tag field-text" data-link-id="field-104">
                  Text
                </div>
                <div id="field-5" className="field-tag field-text" data-link-id="field-105">
                  Text
                </div>
                <div id="field-6" className="field-tag field-text" data-link-id="field-106">
                  Text
                </div>
                <div id="field-7" className="field-tag field-text" data-link-id="field-107">
                  Text
                </div>
                <div id="field-8" className="field-tag field-text" data-link-id="field-108">
                  Dropdown
                </div>
                <div id="field-9" className="field-tag field-text" data-link-id="field-109">
                  Text
                </div>
                <div id="field-10" className="field-tag field-text" data-link-id="field-110">
                  Date
                </div>
                <div id="field-11" className="field-tag field-text" data-link-id="field-111">
                  Text
                </div>
                <div id="field-12" className="field-tag field-text" data-link-id="field-112">
                  Email
                </div>
                <div id="field-13" className="field-tag field-text" data-link-id="field-113">
                  Text
                </div>
                <div id="field-14" className="field-tag field-rb" data-link-id="field-114">
    							<input type="radio"/>
        				</div>
                <div id="field-15" className="field-tag field-rb" data-link-id="field-114">
    							<input type="radio"/>
        				</div>
                <div id="field-16" className="field-tag field-rb" data-link-id="field-114">
    							<input type="radio"/>
        				</div>
                <div id="field-17" className="field-tag field-rb" data-link-id="field-114">
    							<input type="radio"/>
        				</div>
                <div id="field-18" className="field-tag field-text field-conditional" data-link-id="field-118">
                  Text
                </div>
                <div id="field-19" className="field-tag field-text field-conditional" data-link-id="field-119">
                  Text
                </div>
                <div id="field-20" className="field-tag field-text field-conditional" data-link-id="field-120">
                  Text
                </div>
                <div id="field-21" className="field-tag field-text field-conditional" data-link-id="field-121">
                  Text
                </div>
                <div id="field-22" className="field-tag field-text field-conditional" data-link-id="field-122">
                  Text
                </div>
                <div id="field-23" className="field-tag field-text field-conditional" data-link-id="field-123">
                  Text
                </div>
                <div id="field-24" className="field-tag field-sign" data-link-id="field-124">
        					<img className="field-image" src="images/svg/SignHereActive150.svg"/>
        				</div>
                <div id="field-25" className="field-tag field-date" data-link-id="field-000">
                	Date Signed
        				</div>
                <img className="page_image" src="docs/I9_page1_blank.png"></img>
                <span>I-9 Form.docx</span>
                <span className="right">1 of 3</span>
              </div>
              <div className="PageView">
                <div id="field-201" className="field-tag field-text" data-link-id="field-201">
                  First Name
                </div>
                <div id="field-202" className="field-tag field-text" data-link-id="field-202">
                  Last Name
                </div>
                <div id="field-203" className="field-tag field-text" data-link-id="field-203">
                  Text
                </div>
                <div id="field-204" className="field-tag field-text" data-link-id="field-204">
                  Text
                </div>
                <div id="field-205" className="field-tag field-rb" data-link-id="field-205">
    							<input type="radio"/>
        				</div>
                <div id="field-206" className="field-tag field-rb" data-link-id="field-205">
    							<input type="radio"/>
        				</div>
                <div id="field-207" className="field-tag field-text field-conditional" data-link-id="field-207">
                  Text
                </div>
                <div id="field-208" className="field-tag field-text field-conditional" data-link-id="field-208">
                  Text
                </div>
                <div id="field-209" className="field-tag field-text field-conditional" data-link-id="field-209">
                  Text
                </div>
                <div id="field-210" className="field-tag field-text field-conditional" data-link-id="field-210">
                  Text
                </div>
                <div id="field-211" className="field-tag field-text field-conditional" data-link-id="field-211">
                  Text
                </div>
                <div id="field-212" className="field-tag field-text field-conditional" data-link-id="field-212">
                  Text
                </div>
                <div id="field-213" className="field-tag field-text field-conditional" data-link-id="field-213">
                  Text
                </div>
                <div id="field-214" className="field-tag field-text field-conditional" data-link-id="field-214">
                  Text
                </div>
                <div id="field-215" className="field-tag field-text field-conditional" data-link-id="field-215">
                  Text
                </div>
                <div id="field-216" className="field-tag field-text field-conditional" data-link-id="field-216">
                  Text
                </div>
                <div id="field-217" className="field-tag field-text field-conditional" data-link-id="field-217">
                  Text
                </div>
                <div id="field-218" className="field-tag field-text field-conditional" data-link-id="field-218">
                  Text
                </div>
                <div id="field-219" className="field-tag field-sign" data-link-id="field-219">
        					<img className="field-image" src="images/svg/tag-attachment.svg"/>
        				</div>

                <div id="field-220" className="field-tag field-text second_user" data-link-id="field-220">
                  Text
                </div>
                <div id="field-221" className="field-tag field-sign second_user" data-link-id="field-221">
        					<img className="field-image" src="images/svg/SignHereActive150.svg"/>
        				</div>
                <div id="field-222" className="field-tag field-date second_user" data-link-id="field-222">
                	Date Signed
        				</div>
                <div id="field-223" className="field-tag field-text second_user" data-link-id="field-223">
                  Title
                </div>
                <div id="field-224" className="field-tag field-text second_user" data-link-id="field-224">
                  Last Name
                </div>
                <div id="field-225" className="field-tag field-text second_user" data-link-id="field-225">
                  First Name
                </div>
                <div id="field-226" className="field-tag field-text second_user" data-link-id="field-226">
                  Company
                </div>
                <div id="field-227" className="field-tag field-text second_user" data-link-id="field-227">
                  Text
                </div>
                <div id="field-228" className="field-tag field-text second_user" data-link-id="field-228">
                  Text
                </div>
                <div id="field-229" className="field-tag field-text second_user" data-link-id="field-229">
                  Text
                </div>
                <div id="field-230" className="field-tag field-text second_user" data-link-id="field-230">
                  Text
                </div>
                <div id="field-231" className="field-tag field-sign field-conditional second_user" data-link-id="field-231">
        					<img className="field-image" src="images/svg/SignHereActive150.svg"/>
        				</div>
                <div id="field-232" className="field-tag field-date field-conditional second_user" data-link-id="field-232">
                	Date Signed
        				</div>
                <div id="field-233" className="field-tag field-text field-conditional second_user" data-link-id="field-233">
                  Full Name
                </div>
                <img className="page_image" src="docs/I9_page2_blank.png"></img>
                <span>I-9 Form.docx</span>
                <span className="right">2 of 3</span>
              </div>
              <div className="PageView">
                <img className="page_image" src="docs/I9_page3.png"></img>
                <span>I-9 Form.docx</span>
                <span className="right">3 of 3</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

ReactDOM.render(<TaggerDocument></TaggerDocument>, document.getElementById("taggerDocument"));
