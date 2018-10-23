var TopNavMain = React.createClass({
  render: function() {
    return (
      <div className="site-container">
        <button className="btn-nav btn-nav-menu">
          <span className="icon icon-menu"></span>
          <span className="sr-text ng-binding">Menu</span>
        </button>
        <a href="index.html" className="logo logo-docusign"></a>
        <div className="main-nav">
          <ul className="horizontal-list no-list">
            <li>
              <a href="index.html" className="item ng-scope ng-binding"><span className="icon icon-home"></span> Home</a>
            </li>
            <li>
              <a href="documents.html" className="item ng-scope ng-binding"><span className="icon icon-documents"></span> Documents</a>
            </li>
            <li className="ng-scope">
              <a href="templates.html" className="item ng-scope ng-binding on"><span className="icon icon-templates"></span> Templates</a>
            </li>
            <li className="ng-scope">
              <a href="#" className="item ng-scope ng-binding"><span className="icon icon-reports"></span> Reports</a>
            </li>
          </ul>
        </div>
        <div className="site-header-links ng-scope">
          <span className="btn-avatar"><a target="_blank" className="link" href="https://support.docusign.com/knowledgeSearch?by=product&amp;product=new_docusign_experience&amp;topic=all">Help</a><span className="icon icon-triangle down"></span></span>
          <button type="button" className="item btn-avatar">
            <img className="thumb" src="images/alex_edwards_pic.png"/> <span className="icon icon-triangle down"></span>
          </button>
          <div id="menuAccountNav" className="menu invisible">
            <div className="menu-section"><div className="grid ng-scope"><table className="id-card"><tbody><tr><td className="id-card-thumb"><span className="avatar"><img alt="User Avatar" src="/img/profile60.png"/></span></td><td className="id-card-info ng-binding"><strong className="line-1 ng-binding">DocuSign, Inc.</strong><br/><span>abc.def@docusign.com</span><br/>2563<br/></td></tr></tbody></table></div></div>
            <ul className="menu-grouping"><li role="menuitem"><a href="#" className="item ng-binding">My Preferences</a></li><li role="menuitem"></li><li className="ng-scope" role="menuitem"><a className="item ng-binding">Switch to Classic</a></li><li role="menuitem"><a className="item ng-binding">Feedback</a></li><li role="menuitem"><a target="_self" href="#" className="item ng-binding">Log Out</a></li></ul>
          </div>
        </div>
        <button type="button"className="btn-nav btn-side-nav">
          <span className="icon icon-search"></span> <span className="sr-text ng-binding">Filter</span>
        </button>
      </div>
    );
  }
});

ReactDOM.render(<TopNavMain></TopNavMain>, document.getElementById("topNav"));
