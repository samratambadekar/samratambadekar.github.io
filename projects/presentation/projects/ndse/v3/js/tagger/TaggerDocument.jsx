var TaggerDocument = React.createClass({
  render: function() {
    return (
      <div className="site site-fit site-editor">
        <div className="site_content">
          <div className="content_main">
            <div className="emptyState hide">
              <span className="icon icon-documents emptyState_icon"></span>
              <p className="emptyState_text ng-binding">You have no documents.</p>
              <button className="btn btn-primary ng-binding">Add Documents</button>
            </div>
            <svg id="documentTags" version="1.1" xlink="http://www.w3.org/1999/xlink" width="100%" height="auto">

            </svg>

            <div className="DocView">
              <div className="PageView">
                <img className="page_image" src="docs/Sales_Order_page1.png"></img>
                <span>Sales Order.pdf</span>
                <span className="right">1 of 1</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

ReactDOM.render(<TaggerDocument></TaggerDocument>, document.getElementById("taggerDocument"));
