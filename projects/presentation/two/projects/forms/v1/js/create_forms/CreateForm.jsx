var TaggerTopToolbar = React.createClass({
  render: function() {
    return (
      <div id="" className="">
        <div id="" className="new_form new_form-1">
          <div className="slider relative left">
            <div draggable="true"><img src="images/slider_arrow.svg"/></div>
          </div>

          <div className="section_blocks hide_vertical">
            <h5 className="head">
              <span className="">Sections</span>
            </h5>
            <div className="light">Sections: <span className="sections_count">11</span></div>
            <div className="section_items">
            </div>
            <div className="section_add_item">
              <img src="images/svg/icon_add.svg"/>
            </div>
            {/*<div className="switch">
              <input type="checkbox" className="switch_input" id="view_workflow" />
              <label className="switch_label" for="view_workflow">Conditional Workflows</label>
            </div>*/}
          </div>

          <div id="sortableSections" className="sortableSections section">
            <div className="conditional-workflow fadeOut">
              <svg className="conditional-viz">
                <line id="conditionalLine1" x1="0" y1="0" x2="0" y2="200" stroke="#CCC"></line>
                <line id="conditionalLine2" x1="0" y1="0" x2="0" y2="200" stroke="#CCC"></line>
                <line id="conditionalLine3" x1="0" y1="0" x2="0" y2="200" stroke="#CCC"></line>
                <line id="conditionalLine4" x1="0" y1="0" x2="0" y2="200" stroke="#CCC"></line>

                <g id="conditionalSource1"><circle cx="85%" cy="100" r="8" fill="#F3F3F3"></circle><circle cx="85%" cy="100" r="4" fill="none" stroke-width="3" stroke="#FFD65B"></circle></g>
                <g id="conditionalSource2"><circle cx="45%" cy="100" r="8" fill="#F3F3F3"></circle><circle cx="45%" cy="100" r="4" fill="none" stroke-width="3" stroke="#FFD65B"></circle></g>
                <g id="conditionalSource3"><circle cx="85%" cy="100" r="8" fill="#F3F3F3"></circle><circle cx="85%" cy="100" r="4" fill="none" stroke-width="3" stroke="#FFD65B"></circle></g>
                <g id="conditionalSource4"><circle cx="45%" cy="100" r="8" fill="#F3F3F3"></circle><circle cx="45%" cy="100" r="4" fill="none" stroke-width="3" stroke="#FFD65B"></circle></g>

                <g id="conditionalTarget1"><circle cx="85%" cy="100" r="8" fill="#F3F3F3"></circle><circle cx="85%" cy="100" r="4" fill="none" stroke-width="3" stroke="#FFD65B"></circle></g>
                <g id="conditionalTarget2"><circle cx="45%" cy="100" r="8" fill="#F3F3F3"></circle><circle cx="45%" cy="100" r="4" fill="none" stroke-width="3" stroke="#FFD65B"></circle></g>
                <g id="conditionalTarget3"><circle cx="85%" cy="100" r="8" fill="#F3F3F3"></circle><circle cx="85%" cy="100" r="4" fill="none" stroke-width="3" stroke="#FFD65B"></circle></g>
                <g id="conditionalTarget4"><circle cx="45%" cy="100" r="8" fill="#F3F3F3"></circle><circle cx="45%" cy="100" r="4" fill="none" stroke-width="3" stroke="#FFD65B"></circle></g>
              </svg>
            </div>
            <div className="spinner text-center">
              <div className="spinner-circle spinner-sm"></div>
            </div>
            <div className="collapse_all">
              Collapse All Sections <i className="icon icon-menu-triangle-down"></i>
            </div>
            <div className="container recipient-1 ignore-sortable" data-ignore-sortable="true" data-section-number="1">
              <div className="collapse"><div className="icon icon-menu-triangle-down"></div><div className="icon icon-trash hidden"></div></div>
              <div className="title_card" data-ignore-sortable="true">
                <div className="header" contentEditable="true" placeholder="Add Title">Untitled Form</div>
                <div className="field-name" contentEditable="true" placeholder="Add Description" data-preview-id="Main Description">Add Description</div>
                <div className="cards">
                  <div className="sender_profile center">
                    <div className="">
                      <img src="images/acme_logo.svg"/>
                    </div>

                    <img className="profile_avatar" src="images/alex_edwards_pic.png"/>
                    <div className="profile_intro">
                      <br/>
                      <div className="strong">
                        <div>Corey Kimel</div>
                        <div className="">corey.kimel@acme.com</div>
                        <div className="muted">Acme Inc. HR</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-bottom">
                <div className="add-section"><div className="divider-line"></div> <div><i className="icon icon-add"></i> Add Section</div> <div className="divider-line"></div></div>
                {/*<div className="btn-trigger">Go to Next</div>*/}
              </div>
            </div>

            <div className="container recipient-2 hidden ignore-sortable" data-ignore-sortable="true" data-section-number="1">
              <div className="collapse"><div className="icon icon-menu-triangle-down"></div><div className="icon icon-trash hidden"></div></div>
              <div className="title_card" data-ignore-sortable="true">
                <div className="header" contentEditable="true" placeholder="Add Title">Untitled Form</div>
                <div className="field-name" contentEditable="true" placeholder="Add Description">Add Description</div>
                <div className="cards">
                  <div className="sender_profile center">
                    <div className="">
                      <img src="images/acme_logo.svg"/>
                    </div>

                    <img className="profile_avatar" src="images/alex_edwards_pic.png"/>
                    <div className="profile_intro">
                      <br/>
                      <div className="strong">
                        <div>Corey Kimel</div>
                        <div className="">corey.kimel@acme.com</div>
                        <div className="muted">Acme Inc. HR</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-bottom">
                <div className="add-section"><div className="divider-line"></div> <div><i className="icon icon-add"></i> Add Section</div> <div className="divider-line"></div></div>
                {/*<div className="btn-trigger">Go to Next</div>*/}
              </div>
            </div>

            <div id="" className="container recipient-2" data-section-number="2">
              <div className="collapse"><div className="icon icon-menu-triangle-down"></div><div className="icon icon-trash hidden"></div></div>
              <div className="title_card" data-ignore-sortable="true">
                <div className="header" contentEditable="true" placeholder="Section Title">Untitled Section</div>
                <div className="field-name empty" contentEditable="true" placeholder="Add Description">Add Description</div>

                <div id="" className="cards sortableItems">
                  <div className="card item" data-link-id="field-220">
                    <span className="hatch"></span>
                    <span className="handle"><i className="icon icon-handle"></i></span>
                    <div className="field-name empty" contentEditable="true" placeholder="Label">Label</div>
                    <div className="field-input"><input className="input-text disabled" placeholder=""/></div>
                    <div className="card-options">
                      <div className="gear"><i className="icon-gear"></i></div>
                      <div className="search callout-target"><img src="images/svg/search-doc.svg"/></div>
                    </div>
                  </div>
                  <div className="card item" data-link-id="field-223">
                    <span className="hatch"></span>
                    <span className="handle"><i className="icon icon-handle"></i></span>
                    <div className="field-name" contentEditable="true" placeholder="Label">Title</div>
                    <div className="field-input"><input className="input-text disabled" placeholder=""/></div>
                    <div className="card-options">

                      <div className="search callout-target"><img src="images/svg/search-doc.svg"/></div>
                    </div>
                  </div>
                  <div className="card item uneditable-card" data-link-id="field-224">
                    <span className="hatch"></span>
                    <span className="handle"><i className="icon icon-handle"></i></span>
                    <div className="field-name" contentEditable="true" placeholder="Label">Last Name</div>
                    <div className="field-input"><input className="input-text disabled" placeholder=""/></div>
                    <div className="card-options">

                      <div className="search callout-target"><img src="images/svg/search-doc.svg"/></div>
                    </div>
                  </div>
                  <div className="card item uneditable-card" data-link-id="field-225">
                    <span className="hatch"></span>
                    <span className="handle"><i className="icon icon-handle"></i></span>
                    <div className="field-name" contentEditable="true" placeholder="Label">First Name</div>
                    <div className="field-input"><input className="input-text disabled" placeholder=""/></div>
                    <div className="card-options">

                      <div className="search callout-target"><img src="images/svg/search-doc.svg"/></div>
                    </div>
                  </div>
                  <div className="card item" data-link-id="field-226">
                    <span className="hatch"></span>
                    <span className="handle"><i className="icon icon-handle"></i></span>
                    <div className="field-name" contentEditable="true" placeholder="Label">Company</div>
                    <div className="field-input"><input className="input-text disabled" placeholder=""/></div>
                    <div className="card-options">

                      <div className="search callout-target"><img src="images/svg/search-doc.svg"/></div>
                    </div>
                  </div>
                  <div className="card item" data-link-id="field-227">
                    <span className="hatch"></span>
                    <span className="handle"><i className="icon icon-handle"></i></span>
                    <div className="field-name empty" contentEditable="true" placeholder="Label">Label</div>
                    <div className="field-input"><input className="input-text disabled" placeholder=""/></div>
                    <div className="card-options">

                      <div className="search callout-target"><img src="images/svg/search-doc.svg"/></div>
                    </div>
                  </div>
                  <div className="card item" data-link-id="field-228">
                    <span className="hatch"></span>
                    <span className="handle"><i className="icon icon-handle"></i></span>
                    <div className="field-name empty" contentEditable="true" placeholder="Label">Label</div>
                    <div className="field-input"><input className="input-text disabled" placeholder=""/></div>
                    <div className="card-options">

                      <div className="search callout-target"><img src="images/svg/search-doc.svg"/></div>
                    </div>
                  </div>
                  <div className="card item" data-link-id="field-229">
                    <span className="hatch"></span>
                    <span className="handle"><i className="icon icon-handle"></i></span>
                    <div className="field-name empty" contentEditable="true" placeholder="Label">Label</div>
                    <div className="field-input"><input className="input-text disabled" placeholder=""/></div>
                    <div className="card-options">

                      <div className="search callout-target"><img src="images/svg/search-doc.svg"/></div>
                    </div>
                  </div>
                  <div className="card item" data-link-id="field-230">
                    <span className="hatch"></span>
                    <span className="handle"><i className="icon icon-handle"></i></span>
                    <div className="field-name empty" contentEditable="true" placeholder="Label">Label</div>
                    <div className="field-input"><input className="input-text disabled" placeholder=""/></div>
                    <div className="card-options">

                      <div className="search callout-target"><img src="images/svg/search-doc.svg"/></div>
                    </div>
                  </div>
                  <div className="card item dummy"><div>Drag and Drop Blocks or Fields to this Section</div></div>
                </div>
              </div>
              <div className="card-bottom">
                <div className="add-section"><div className="divider-line"></div> <div><i className="icon icon-add"></i> Add Section</div> <div className="divider-line"></div></div>
              </div>
            </div>

            <div id="" className="container recipient-2" data-section-number="3">
              <div className="collapse"><div className="icon icon-menu-triangle-down"></div><div className="icon icon-trash hidden"></div></div>
              <div className="title_card" data-ignore-sortable="true">
                <div className="header" contentEditable="true" placeholder="Section Title">Untitled Sign Here</div>
                <div className="field-name empty" contentEditable="true" placeholder="Add Description">Add Description</div>
                <div id="" className="cards sortableItems">
                  <div className="card item" data-link-id="field-221">
                    <span className="hatch"></span>
                    <span className="handle"><i className="icon icon-handle"></i></span>
                    <div className="field-name" contentEditable="true" placeholder="Label">Signature</div>
                    <div className="field-input">
                      <div className="signature_placeholder">
                        <div className="sign_x">X</div>
                        <div className="sign_here_text">Sign Here</div>
                      </div>
                    </div>
                    <div className="card-options">

                      <div className="search callout-target"><img src="images/svg/search-doc.svg"/></div>
                    </div>
                  </div>
                  <div className="card item dummy"><div>Drag and Drop Blocks or Fields to this Section</div></div>
                </div>
              </div>
              <div className="card-bottom">
                <div className="add-section"><div className="divider-line"></div> <div><i className="icon icon-add"></i> Add Section</div> <div className="divider-line"></div></div>
              </div>
            </div>

            <div id="" className="container recipient-1" data-section-number="2">
              <div className="collapse"><div className="icon icon-menu-triangle-down"></div><div className="icon icon-trash hidden"></div></div>
              <div className="title_card" data-ignore-sortable="true">
                <div className="header" contentEditable="true" placeholder="Section Title">Untitled Section</div>
                <div className="field-name empty" contentEditable="true" placeholder="Add Description">Add Description</div>
                {/*<div className="card-options">
                  <div className="search"><img src="images/svg/search-doc.svg"/></div>
                </div>*/}
                <div id="" className="cards sortableItems">
                  <div className="card item uneditable-card" data-link-id="field-101" data-linked-field="head" data-linked-id="Last Name">
                    <span className="hatch"></span>
                    <span className="handle"><i className="icon icon-handle"></i></span>
                    <div className="field-name" contentEditable="true" placeholder="Label" data-preview-id="lastName">Last Name</div>
                    <div className="field-input"><input className="input-text disabled" placeholder=""/></div>
                    <div className="card-options">

                      <div className="search callout-target"><img src="images/svg/search-doc.svg"/></div>
                    </div>
                  </div>
                  <div className="card item uneditable-card" data-link-id="field-102" data-linked-field="head" data-linked-id="First Name">
                    <span className="hatch"></span>
                    <span className="handle"><i className="icon icon-handle"></i></span>
                    <div className="field-name" contentEditable="true" placeholder="Label" data-preview-id="firstName">First Name</div>
                    <div className="field-input"><input className="input-text disabled" placeholder=""/></div>
                    <div className="card-options">

                      <div className="search callout-target"><img src="images/svg/search-doc.svg"/></div>
                    </div>
                  </div>
                  <div className="card item" data-link-id="field-103">
                    <span className="hatch"></span>
                    <span className="handle"><i className="icon icon-handle"></i></span>
                    <div className="field-name empty optional" contentEditable="true" placeholder="Label (optional)" data-preview-id="middleInitial">Label (optional)</div>
                    <div className="field-input"><input className="input-text disabled" placeholder=""/></div>
                    <div className="card-options">

                      <div className="search callout-target"><img src="images/svg/search-doc.svg"/></div>
                    </div>
                  </div>
                  <div className="card item" data-link-id="field-104">
                    <span className="hatch"></span>
                    <span className="handle"><i className="icon icon-handle"></i></span>
                    <div className="field-name empty optional" contentEditable="true" placeholder="Label (optional)" data-preview-id="otherLastName">Label (optional)</div>
                    <div className="field-input"><input className="input-text disabled" placeholder=""/></div>
                    <div className="card-options">

                      <div className="search callout-target"><img src="images/svg/search-doc.svg"/></div>
                    </div>
                  </div>
                  <div className="card item" data-link-id="field-105">
                    <span className="hatch"></span>
                    <span className="handle"><i className="icon icon-handle"></i></span>
                    <div className="field-name empty" contentEditable="true" placeholder="Label" data-preview-id="physicalAddress">Label</div>
                    <div className="field-input"><input className="input-text disabled" placeholder=""/></div>
                    <div className="card-options">

                      <div className="search callout-target"><img src="images/svg/search-doc.svg"/></div>
                    </div>
                  </div>
                  <div className="card item" data-link-id="field-106">
                    <span className="hatch"></span>
                    <span className="handle"><i className="icon icon-handle"></i></span>
                    <div className="field-name empty optional" contentEditable="true" placeholder="Label (optional)" data-preview-id="aptNumber">Label (optional)</div>
                    <div className="field-input"><input className="input-text disabled" placeholder=""/></div>
                    <div className="card-options">

                      <div className="search callout-target"><img src="images/svg/search-doc.svg"/></div>
                    </div>
                  </div>
                  <div className="card item" data-link-id="field-107">
                    <span className="hatch"></span>
                    <span className="handle"><i className="icon icon-handle"></i></span>
                    <div className="field-name empty" contentEditable="true" placeholder="Label" data-preview-id="residentCity">Label</div>
                    <div className="field-input"><input className="input-text disabled" placeholder=""/></div>
                    <div className="card-options">

                      <div className="search callout-target"><img src="images/svg/search-doc.svg"/></div>
                    </div>
                  </div>
                  <div className="card item" data-link-id="field-108">
                    <span className="hatch"></span>
                    <span className="handle"><i className="icon icon-handle"></i></span>
                    <div className="field-name empty optional" contentEditable="true" placeholder="Label" data-preview-id="residentState">Label</div>
                    <div className="field-input">
                      <div className="select-wrap">
                        <select id="" className="input-text disabled" data-field-select-id="residentState">
                          <option value="-1">-- State --</option>
                          <option value="AL">Alabama</option>
                        	<option value="AK">Alaska</option>
                        	<option value="AZ">Arizona</option>
                        	<option value="AR">Arkansas</option>
                        	<option value="CA">California</option>
                        	<option value="CO">Colorado</option>
                        	<option value="CT">Connecticut</option>
                        	<option value="DE">Delaware</option>
                        	<option value="DC">District Of Columbia</option>
                        	<option value="FL">Florida</option>
                        	<option value="GA">Georgia</option>
                        	<option value="HI">Hawaii</option>
                        	<option value="ID">Idaho</option>
                        	<option value="IL">Illinois</option>
                        	<option value="IN">Indiana</option>
                        	<option value="IA">Iowa</option>
                        	<option value="KS">Kansas</option>
                        	<option value="KY">Kentucky</option>
                        	<option value="LA">Louisiana</option>
                        	<option value="ME">Maine</option>
                        	<option value="MD">Maryland</option>
                        	<option value="MA">Massachusetts</option>
                        	<option value="MI">Michigan</option>
                        	<option value="MN">Minnesota</option>
                        	<option value="MS">Mississippi</option>
                        	<option value="MO">Missouri</option>
                        	<option value="MT">Montana</option>
                        	<option value="NE">Nebraska</option>
                        	<option value="NV">Nevada</option>
                        	<option value="NH">New Hampshire</option>
                        	<option value="NJ">New Jersey</option>
                        	<option value="NM">New Mexico</option>
                        	<option value="NY">New York</option>
                        	<option value="NC">North Carolina</option>
                        	<option value="ND">North Dakota</option>
                        	<option value="OH">Ohio</option>
                        	<option value="OK">Oklahoma</option>
                        	<option value="OR">Oregon</option>
                        	<option value="PA">Pennsylvania</option>
                        	<option value="RI">Rhode Island</option>
                        	<option value="SC">South Carolina</option>
                        	<option value="SD">South Dakota</option>
                        	<option value="TN">Tennessee</option>
                        	<option value="TX">Texas</option>
                        	<option value="UT">Utah</option>
                        	<option value="VT">Vermont</option>
                        	<option value="VA">Virginia</option>
                        	<option value="WA">Washington</option>
                        	<option value="WV">West Virginia</option>
                        	<option value="WI">Wisconsin</option>
                        	<option value="WY">Wyoming</option>
                        </select>
                      </div>
                    </div>
                    <div className="card-options">

                      <div className="search callout-target"><img src="images/svg/search-doc.svg"/></div>
                    </div>
                  </div>
                  <div className="card item" data-link-id="field-109">
                    <span className="hatch"></span>
                    <span className="handle"><i className="icon icon-handle"></i></span>
                    <div className="field-name empty" contentEditable="true" placeholder="Label" data-preview-id="zipCode">Label</div>
                    <div className="field-input"><input className="input-text disabled" placeholder=""/></div>
                    <div className="card-options">

                      <div className="search callout-target"><img src="images/svg/search-doc.svg"/></div>
                    </div>
                  </div>
                  <div className="card item" data-link-id="field-110">
                    <span className="hatch"></span>
                    <span className="handle"><i className="icon icon-handle"></i></span>
                    <div className="field-name empty optional" contentEditable="true" placeholder="Label (optional)" data-preview-id="dateOfBirth">Label (optional)</div>
                    <div className="field-input"><input className="input-text disabled" placeholder=""/></div>
                    <div className="card-options">

                      <div className="search callout-target"><img src="images/svg/search-doc.svg"/></div>
                    </div>
                  </div>
                  <div className="card item" data-link-id="field-111">
                    <span className="hatch"></span>
                    <span className="handle"><i className="icon icon-handle"></i></span>
                    <div className="field-name empty optional" contentEditable="true" placeholder="Label (optional)" data-preview-id="SSN">Label (optional)</div>
                    <div className="field-input"><input className="input-text disabled" placeholder=""/></div>
                    <div className="card-options">

                      <div className="search callout-target"><img src="images/svg/search-doc.svg"/></div>
                    </div>
                  </div>
                  <div className="card item uneditable-card" data-link-id="field-112">
                    <span className="hatch"></span>
                    <span className="handle"><i className="icon icon-handle"></i></span>
                    <div className="field-name empty optional" contentEditable="true" placeholder="Label (optional)" data-preview-id="emailAddress">Email (optional)</div>
                    <div className="field-input"><input className="input-text disabled" placeholder=""/></div>
                    <div className="card-options">

                      <div className="search callout-target"><img src="images/svg/search-doc.svg"/></div>
                    </div>
                  </div>
                  <div className="card item" data-link-id="field-113">
                    <span className="hatch"></span>
                    <span className="handle"><i className="icon icon-handle"></i></span>
                    <div className="field-name empty optional" contentEditable="true" placeholder="Label (optional)" data-preview-id="phoneNumber">Label (optional)</div>
                    <div className="field-input"><input className="input-text disabled" placeholder=""/></div>
                    <div className="card-options">

                      <div className="search callout-target"><img src="images/svg/search-doc.svg"/></div>
                    </div>
                  </div>
                  <div className="card item dummy"><div>Drag and Drop Blocks or Fields to this Section</div></div>
                </div>
              </div>
              <div className="card-bottom">
                <div className="add-section"><div className="divider-line"></div> <div><i className="icon icon-add"></i> Add Section</div> <div className="divider-line"></div></div>
              </div>
            </div>

            <div id="" className="container recipient-1" data-section-number="3">
              <div className="collapse"><div className="icon icon-menu-triangle-down"></div><div className="icon icon-trash hidden"></div></div>
              <div className="title_card" data-ignore-sortable="true">
                <div className="header" contentEditable="true" placeholder="Section Title">Untitled Section</div>
                <div className="field-name empty" contentEditable="true" placeholder="Add Description">Add Description</div>
                <div id="" className="cards sortableItems">
                  <div className="card item" data-link-id="field-114">
                    <span className="hatch"></span>
                    <span className="handle"><i className="icon icon-handle"></i></span>
                    <div className="field-name empty" contentEditable="true" placeholder="Label">Label</div>
                    <div className="field-input">
                      <div className="radio_option"><input type="radio" className="input-rb"/><span className="radio_op_num">1.</span> <span className="radio_label" contentEditable="true">Citizen</span></div>
                      <div className="radio_option"><input type="radio" className="input-rb"/><span className="radio_op_num">2.</span> <span className="radio_label" contentEditable="true">Non-citizen national</span></div>
                      <div className="radio_option" data-conditional="conditionalSource1"><input type="radio" className="input-rb"/><span className="radio_op_num">3.</span> <span className="radio_label" contentEditable="true">Permanent resident</span></div>
                      <div className="radio_option" data-conditional="conditionalSource2"><input type="radio" className="input-rb"/><span className="radio_op_num">4.</span> <span className="radio_label" contentEditable="true">Alien</span></div>
                    </div>
                    <div className="card-options">

                      <div className="search"><img src="images/svg/search-doc.svg"/></div>
                    </div>
                  </div>
                  <div className="card item dummy"><div>Drag and Drop Blocks or Fields to this Section</div></div>
                </div>
              </div>
              <div className="card-bottom">
                <div className="add-section"><div className="divider-line"></div> <div><i className="icon icon-add"></i> Add Section</div> <div className="divider-line"></div></div>
                {/*<div className="btn-trigger">Select your document</div>*/}
              </div>
            </div>

            <div id="" className="container recipient-1" data-section-number="4" data-conditional="conditionalTarget1">
              <div className="collapse"><div className="icon icon-menu-triangle-down"></div><div className="icon icon-trash hidden"></div></div>
              <div className="title_card" data-ignore-sortable="true">
                <div className="header" contentEditable="true" placeholder="Section Title">Untitled Section</div>
                <div className="field-name empty" contentEditable="true" placeholder="Label">Label</div>

                <div id="" className="cards sortableItems">
                  <div className="card item restrict-sortable" data-link-id="field-118">
                    <span className="hatch"></span>
                    <span className="handle"><i className="icon icon-handle"></i></span>
                    <div className="field-name empty" contentEditable="true" placeholder="Label">Label</div>
                    <div className="field-input"><input className="input-text disabled" placeholder=""/></div>
                    <div className="card-options">

                      <div className="search callout-target"><img src="images/svg/search-doc.svg"/></div>
                    </div>
                  </div>
                  <div className="card item dummy"><div>Drag and Drop Blocks or Fields to this Section</div></div>
                </div>
              </div>
              <div className="card-bottom">
                <div className="add-section"><div className="divider-line"></div> <div><i className="icon icon-add"></i> Add Section</div> <div className="divider-line"></div></div>
              </div>
            </div>

            <div id="" className="container recipient-1" data-section-number="5" data-conditional="conditionalTarget2">
              <div className="collapse"><div className="icon icon-menu-triangle-down"></div><div className="icon icon-trash hidden"></div></div>
              <div className="title_card" data-ignore-sortable="true">
                <div className="header" contentEditable="true" placeholder="Section Title">Untitled Section</div>
                <div className="field-name empty" contentEditable="true" placeholder="Add Description">Add Description</div>
                <div id="" className="cards sortableItems">
                  <div className="card item restrict-sortable" data-link-id="field-119">
                    <span className="hatch"></span>
                    <span className="handle"><i className="icon icon-handle"></i></span>
                    <div className="field-name empty" contentEditable="true" placeholder="Label">Label</div>
                    <div className="field-input"><input className="input-text disabled" placeholder=""/></div>
                    <div className="card-options">

                      <div className="search callout-target"><img src="images/svg/search-doc.svg"/></div>
                    </div>
                  </div>
                  <div className="card item restrict-sortable" data-link-id="field-120">
                    <span className="hatch"></span>
                    <span className="handle"><i className="icon icon-handle"></i></span>
                    <div className="field-name empty" contentEditable="true" placeholder="Label">Label</div>
                    <div className="field-input"><input className="input-text disabled" placeholder=""/></div>
                    <div className="card-options">

                      <div className="search callout-target"><img src="images/svg/search-doc.svg"/></div>
                    </div>
                  </div>
                  <div className="card item restrict-sortable" data-link-id="field-121">
                    <span className="hatch"></span>
                    <span className="handle"><i className="icon icon-handle"></i></span>
                    <div className="field-name empty" contentEditable="true" placeholder="Label">Label</div>
                    <div className="field-input"><input className="input-text disabled" placeholder=""/></div>
                    <div className="card-options">

                      <div className="search callout-target"><img src="images/svg/search-doc.svg"/></div>
                    </div>
                  </div>
                  <div className="card item restrict-sortable" data-link-id="field-122">
                    <span className="hatch"></span>
                    <span className="handle"><i className="icon icon-handle"></i></span>
                    <div className="field-name empty" contentEditable="true" placeholder="Label">Label</div>
                    <div className="field-input"><input className="input-text disabled" placeholder=""/></div>
                    <div className="card-options">

                      <div className="search callout-target"><img src="images/svg/search-doc.svg"/></div>
                    </div>
                  </div>
                  <div className="card item restrict-sortable" data-link-id="field-123">
                    <span className="hatch"></span>
                    <span className="handle"><i className="icon icon-handle"></i></span>
                    <div className="field-name empty" contentEditable="true" placeholder="Label">Label</div>
                    <div className="field-input"><input className="input-text disabled" placeholder=""/></div>
                    <div className="card-options">

                      <div className="search callout-target"><img src="images/svg/search-doc.svg"/></div>
                    </div>
                  </div>
                  <div className="card item dummy"><div>Drag and Drop Blocks or Fields to this Section</div></div>
                </div>
              </div>
              <div className="card-bottom">
                <div className="add-section"><div className="divider-line"></div> <div><i className="icon icon-add"></i> Add Section</div> <div className="divider-line"></div></div>
              </div>
            </div>

            <div id="" className="container recipient-1" data-section-number="6">
              <div className="collapse"><div className="icon icon-menu-triangle-down"></div><div className="icon icon-trash hidden"></div></div>
              <div className="title_card" data-ignore-sortable="true">
                <div className="header" contentEditable="true" placeholder="Section Title">Untitled Section</div>
                <div className="field-name empty" contentEditable="true" placeholder="Add Description">Add Description</div>
                <div id="" className="cards sortableItems">
                  <div className="card item uneditable-card" data-link-id="field-201" data-linked-field="element" data-linked-id="First Name">
                    <span className="hatch"></span>
                    <span className="handle"><i className="icon icon-handle"></i></span>
                    <div className="field-name" contentEditable="true" placeholder="Label">First Name</div>
                    <div className="field-input"><input className="input-text disabled" placeholder=""/></div>
                    <div className="card-options">

                      <div className="search callout-target"><img src="images/svg/search-doc.svg"/></div>
                    </div>
                  </div>
                  <div className="card item uneditable-card" data-link-id="field-202" data-linked-field="element" data-linked-id="Last Name">
                    <span className="hatch"></span>
                    <span className="handle"><i className="icon icon-handle"></i></span>
                    <div className="field-name" contentEditable="true" placeholder="Label">Last Name</div>
                    <div className="field-input"><input className="input-text disabled" placeholder=""/></div>
                    <div className="card-options">

                      <div className="search callout-target"><img src="images/svg/search-doc.svg"/></div>
                    </div>
                  </div>
                  <div className="card item" data-link-id="field-203">
                    <span className="hatch"></span>
                    <span className="handle"><i className="icon icon-handle"></i></span>
                    <div className="field-name empty" contentEditable="true" placeholder="Label">Label</div>
                    <div className="field-input"><input className="input-text disabled" placeholder=""/></div>
                    <div className="card-options">

                      <div className="search callout-target"><img src="images/svg/search-doc.svg"/></div>
                    </div>
                  </div>
                  <div className="card item" data-link-id="field-204">
                    <span className="hatch"></span>
                    <span className="handle"><i className="icon icon-handle"></i></span>
                    <div className="field-name empty" contentEditable="true" placeholder="Label">Label</div>
                    <div className="field-input"><input className="input-text disabled" placeholder=""/></div>
                    <div className="card-options">

                      <div className="search callout-target"><img src="images/svg/search-doc.svg"/></div>
                    </div>
                  </div>
                  <div className="card item dummy"><div>Drag and Drop Blocks or Fields to this Section</div></div>
                </div>
              </div>
              <div className="card-bottom">
                <div className="add-section"><div className="divider-line"></div> <div><i className="icon icon-add"></i> Add Section</div> <div className="divider-line"></div></div>
              </div>
            </div>

            <div id="" className="container recipient-1" data-section-number="7">
              <div className="collapse"><div className="icon icon-menu-triangle-down"></div><div className="icon icon-trash hidden"></div></div>
              <div className="title_card" data-ignore-sortable="true">
                <div className="header" contentEditable="true" placeholder="Section Title">Untitled Section</div>
                <div className="field-name empty" contentEditable="true" placeholder="Add Description">Add Description</div>
                <div id="" className="cards sortableItems">
                  <div className="card item" data-link-id="field-205">
                    <span className="hatch"></span>
                    <span className="handle"><i className="icon icon-handle"></i></span>
                    <div className="field-name empty" contentEditable="true" placeholder="Label">Label</div>
                    <div className="field-input">
                      <div className="radio_option" data-conditional="conditionalSource3"><input type="radio" className="input-rb"/><span className="radio_op_num">1.</span> <span className="radio_label" contentEditable="true" data-preview-id="documentListA">Radio Button</span></div>
                      <div className="radio_option" data-conditional="conditionalSource4"><input type="radio" className="input-rb"/><span className="radio_op_num">2.</span> <span className="radio_label" contentEditable="true" data-preview-id="documentListBC">Radio Button</span></div>
                    </div>
                    <div className="card-options">

                      <div className="search"><img src="images/svg/search-doc.svg"/></div>
                    </div>
                  </div>
                  <div className="card item dummy"><div>Drag and Drop Blocks or Fields to this Section</div></div>
                </div>
              </div>
              <div className="card-bottom">
                <div className="add-section"><div className="divider-line"></div> <div><i className="icon icon-add"></i> Add Section</div> <div className="divider-line"></div></div>
              </div>
            </div>

            <div id="" className="container recipient-1" data-section-number="8" data-conditional="conditionalTarget3">
              <div className="collapse"><div className="icon icon-menu-triangle-down"></div><div className="icon icon-trash hidden"></div></div>
              <div className="title_card" data-ignore-sortable="true">
                <div className="header" contentEditable="true" placeholder="Section Title">Untitled Section</div>
                <div className="field-name empty" contentEditable="true" placeholder="Add Description">Add Description</div>
                <div id="" className="cards sortableItems">
                  <div className="card item restrict-sortable" data-link-id="field-207">
                    <span className="hatch"></span>
                    <span className="handle"><i className="icon icon-handle"></i></span>
                    <div className="field-name empty" contentEditable="true" placeholder="Label" data-preview-id="documentTitle">Label</div>
                    <div className="field-input"><input className="input-text disabled" placeholder=""/></div>
                    <div className="card-options">

                      <div className="search callout-target"><img src="images/svg/search-doc.svg"/></div>
                    </div>
                  </div>
                  <div className="card item restrict-sortable" data-link-id="field-208">
                    <span className="hatch"></span>
                    <span className="handle"><i className="icon icon-handle"></i></span>
                    <div className="field-name empty" contentEditable="true" placeholder="Label" data-preview-id="issuingAuthority">Label</div>
                    <div className="field-input"><input className="input-text disabled" placeholder=""/></div>
                    <div className="card-options">

                      <div className="search callout-target"><img src="images/svg/search-doc.svg"/></div>
                    </div>
                  </div>
                  <div className="card item restrict-sortable" data-link-id="field-209">
                    <span className="hatch"></span>
                    <span className="handle"><i className="icon icon-handle"></i></span>
                    <div className="field-name empty" contentEditable="true" placeholder="Label" data-preview-id="documentNumber">Label</div>
                    <div className="field-input"><input className="input-text disabled" placeholder=""/></div>
                    <div className="card-options">

                      <div className="search callout-target"><img src="images/svg/search-doc.svg"/></div>
                    </div>
                  </div>
                  <div className="card item restrict-sortable" data-link-id="field-210">
                    <span className="hatch"></span>
                    <span className="handle"><i className="icon icon-handle"></i></span>
                    <div className="field-name empty" contentEditable="true" placeholder="Label" data-preview-id="documentExpirationDate">Label</div>
                    <div className="field-input"><input className="input-text disabled" placeholder=""/></div>
                    <div className="card-options">

                      <div className="search callout-target"><img src="images/svg/search-doc.svg"/></div>
                    </div>
                  </div>
                  <div className="card item dummy"><div>Drag and Drop Blocks or Fields to this Section</div></div>
                </div>
              </div>
              <div className="card-bottom">
                <div className="add-section"><div className="divider-line"></div> <div><i className="icon icon-add"></i> Add Section</div> <div className="divider-line"></div></div>
              </div>
            </div>

            <div id="" className="container recipient-1" data-section-number="9" data-conditional="conditionalTarget4">
              <div className="collapse"><div className="icon icon-menu-triangle-down"></div><div className="icon icon-trash hidden"></div></div>
              <div className="title_card" data-ignore-sortable="true">
                <div className="header" contentEditable="true" placeholder="Section Title">Untitled Section</div>
                <div className="field-name empty" contentEditable="true" placeholder="Add Description">Add Description</div>
                <div id="" className="cards sortableItems">
                  <div className="card item restrict-sortable" data-link-id="field-211">
                    <span className="hatch"></span>
                    <span className="handle"><i className="icon icon-handle"></i></span>
                    <div className="field-name empty" contentEditable="true" placeholder="Label">Label</div>
                    <div className="field-input"><input className="input-text disabled" placeholder=""/></div>
                    <div className="card-options">

                      <div className="search callout-target"><img src="images/svg/search-doc.svg"/></div>
                    </div>
                  </div>
                  <div className="card item restrict-sortable" data-link-id="field-212">
                    <span className="hatch"></span>
                    <span className="handle"><i className="icon icon-handle"></i></span>
                    <div className="field-name empty" contentEditable="true" placeholder="Label">Label</div>
                    <div className="field-input"><input className="input-text disabled" placeholder=""/></div>
                    <div className="card-options">

                      <div className="search callout-target"><img src="images/svg/search-doc.svg"/></div>
                    </div>
                  </div>
                  <div className="card item restrict-sortable" data-link-id="field-213">
                    <span className="hatch"></span>
                    <span className="handle"><i className="icon icon-handle"></i></span>
                    <div className="field-name empty" contentEditable="true" placeholder="Label">Label</div>
                    <div className="field-input"><input className="input-text disabled" placeholder=""/></div>
                    <div className="card-options">

                      <div className="search callout-target"><img src="images/svg/search-doc.svg"/></div>
                    </div>
                  </div>
                  <div className="card item restrict-sortable" data-link-id="field-214">
                    <span className="hatch"></span>
                    <span className="handle"><i className="icon icon-handle"></i></span>
                    <div className="field-name empty" contentEditable="true" placeholder="Label">Label</div>
                    <div className="field-input"><input className="input-text disabled" placeholder=""/></div>
                    <div className="card-options">

                      <div className="search callout-target"><img src="images/svg/search-doc.svg"/></div>
                    </div>
                  </div>
                  <div className="card item restrict-sortable" data-link-id="field-215">
                    <span className="hatch"></span>
                    <span className="handle"><i className="icon icon-handle"></i></span>
                    <div className="field-name empty" contentEditable="true" placeholder="Label">Label</div>
                    <div className="field-input"><input className="input-text disabled" placeholder=""/></div>
                    <div className="card-options">

                      <div className="search callout-target"><img src="images/svg/search-doc.svg"/></div>
                    </div>
                  </div>
                  <div className="card item restrict-sortable" data-link-id="field-216">
                    <span className="hatch"></span>
                    <span className="handle"><i className="icon icon-handle"></i></span>
                    <div className="field-name empty" contentEditable="true" placeholder="Label">Label</div>
                    <div className="field-input"><input className="input-text disabled" placeholder=""/></div>
                    <div className="card-options">

                      <div className="search callout-target"><img src="images/svg/search-doc.svg"/></div>
                    </div>
                  </div>
                  <div className="card item restrict-sortable" data-link-id="field-217">
                    <span className="hatch"></span>
                    <span className="handle"><i className="icon icon-handle"></i></span>
                    <div className="field-name empty" contentEditable="true" placeholder="Label">Label</div>
                    <div className="field-input"><input className="input-text disabled" placeholder=""/></div>
                    <div className="card-options">

                      <div className="search callout-target"><img src="images/svg/search-doc.svg"/></div>
                    </div>
                  </div>
                  <div className="card item restrict-sortable" data-link-id="field-218">
                    <span className="hatch"></span>
                    <span className="handle"><i className="icon icon-handle"></i></span>
                    <div className="field-name empty" contentEditable="true" placeholder="Label">Label</div>
                    <div className="field-input"><input className="input-text disabled" placeholder=""/></div>
                    <div className="card-options">

                      <div className="search callout-target"><img src="images/svg/search-doc.svg"/></div>
                    </div>
                  </div>
                  <div className="card item dummy"><div>Drag and Drop Blocks or Fields to this Section</div></div>
                </div>
              </div>
              <div className="card-bottom">
                <div className="add-section"><div className="divider-line"></div> <div><i className="icon icon-add"></i> Add Section</div> <div className="divider-line"></div></div>
              </div>
            </div>

            <div id="" className="container recipient-1" data-section-number="10">
              <div className="collapse"><div className="icon icon-menu-triangle-down"></div><div className="icon icon-trash hidden"></div></div>
              <div className="title_card" data-ignore-sortable="true">
                <div className="header" contentEditable="true" placeholder="Section Title">Untitled Upload Image</div>
                <div className="field-name empty" contentEditable="true" placeholder="Add Description">Add Description</div>
                <div id="" className="cards sortableItems">
                  <div className="card item" data-link-id="field-219">
                    <span className="hatch"></span>
                    <span className="handle"><i className="icon icon-handle"></i></span>
                    <div className="field-name" contentEditable="true" placeholder="Label">Attachment</div>
                    <div className="field-input center attachment">
                      <img src="images/upload_passport.svg"/>
                    </div>
                    <div className="card-options">

                      <div className="search callout-target"><img src="images/svg/search-doc.svg"/></div>
                    </div>
                  </div>
                  <div className="card item dummy"><div>Drag and Drop Blocks or Fields to this Section</div></div>
                </div>
              </div>
              <div className="card-bottom">
                <div className="add-section"><div className="divider-line"></div> <div><i className="icon icon-add"></i> Add Section</div> <div className="divider-line"></div></div>
              </div>
            </div>

            <div id="" className="container recipient-1" data-section-number="11">
              <div className="collapse"><div className="icon icon-menu-triangle-down"></div><div className="icon icon-trash hidden"></div></div>
              <div className="title_card" data-ignore-sortable="true">
                <div className="header" contentEditable="true" placeholder="Section Title">Untitled Sign Here</div>
                <div className="field-name empty" contentEditable="true" placeholder="Add Description">Add Description</div>
                <div id="" className="cards sortableItems">
                  <div className="card item" data-link-id="field-124">
                    <span className="hatch"></span>
                    <span className="handle"><i className="icon icon-handle"></i></span>
                    <div className="field-name" contentEditable="true" placeholder="Label">Signature</div>
                    <div className="field-input">
                      <div className="signature_placeholder">
                        <div className="sign_x">X</div>
                        <div className="sign_here_text">Sign Here</div>
                      </div>
                    </div>
                    <div className="card-options">

                      <div className="search callout-target"><img src="images/svg/search-doc.svg"/></div>
                    </div>
                  </div>
                  <div className="card item dummy"><div>Drag and Drop Blocks or Fields to this Section</div></div>
                </div>
              </div>
              <div className="card-bottom">
                <div className="add-section"><div className="divider-line"></div> <div><i className="icon icon-add"></i> Add Section</div> <div className="divider-line"></div></div>
              </div>
            </div>
          </div>
          <div className="blocks minimized">
            <div className="sidebar-fields sidebar-tab-option" data-tab-name="Blocks">
              <div className="sidebar_group">
                <h5>
                  <span className="ng-binding ng-scope">Blocks</span>
                </h5>
                <i className="icon icon-incomplete callout-target" data-callout="blocks_info"></i>
              </div>
              <div className="spinner text-center hide">
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
                        <span className="ng-binding block_name">Image</span>
                      </button>
                    </li>
                    {/*<li className="menu_listItem ng-isolate-scope" title="Link">
                      <button className="menu_item u-ellipsis" data-qa="Link">
                        <span className="swatch swatch-recipient swatch-lg swatch-ext-0">
                          <i className="icon icon-globe"></i>
                        </span>
                        <span className="ng-binding block_name">Link</span>
                      </button>
                    </li>*/}
                    <li className="menu_listItem ng-isolate-scope" title="Paragraph">
                      <button className="menu_item u-ellipsis" data-qa="Paragraph">
                        <span className="swatch swatch-recipient swatch-lg swatch-ext-0">
                          <span className="ng-binding"><img className="icon payment_icon" src="images/svg/tag-paragraph.svg"/></span>
                        </span>
                        <span className="ng-binding block_name">Text</span>
                      </button>
                    </li>
                    {/*<li className="menu_listItem ng-isolate-scope" title="Table">
                      <button className="menu_item u-ellipsis" data-qa="Table">
                        <span className="swatch swatch-recipient swatch-lg swatch-ext-0">
                          <span className="ng-binding"><img className="icon payment_icon" src="images/svg/tag-table.svg"/></span>
                        </span>
                        <span className="ng-binding block_name">Table</span>
                      </button>
                    </li>*/}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

ReactDOM.render(<TaggerTopToolbar></TaggerTopToolbar>, document.getElementById("createForm"));
