var BottomNav = React.createClass({
  render: function() {
    return (
      <div className="site_footer ng-scope">
        <div className="site_container">
          <div className="footer_left"></div>
          <div className="footer_main">
            <ul className="footer-links">
              <li className="ng-scope"><a className="footer-links_item btn-triggeR ng-binding"><span className="icon icon-globe"></span> English (US)</a></li>
              <li><span className="footer-links_item ng-binding">Powered by DocuSign</span></li>
              <li><a target="_blank" className="footer-links_item ng-scope ng-binding" href="https://support.docusign.com/contactSupport">Contact Us</a></li>
              <li><a target="_blank" className="footer-links_item ng-binding" href="http://www.docusign.com/company/terms-of-use/lang/en">Terms of Use</a></li>
              <li><a target="_blank" className="footer-links_item ng-binding" href="http://www.docusign.com/company/privacy-policy/lang/en">Privacy</a></li>
              <li><a target="_blank" className="footer-links_item ng-binding" href="http://www.docusign.com/IP/lang/en">Intellectual Property</a></li>
              <li><span className="footer-links_item ng-binding">Copyright © 2016 DocuSign, Inc. All rights reserved.</span></li>
            </ul>
            <div id="menuLanguages" className="menu select-menu invisible">
              <ul role="menu" aria-labelledby=" English (US)">
                <li className="item ng-binding ng-scope on" role="menuitem">English (US)</li>
                <li className="item ng-binding ng-scope" role="menuitem">Deutsch</li>
                <li className="item ng-binding ng-scope" role="menuitem">Español</li>
                <li className="item ng-binding ng-scope" role="menuitem">Français</li>
                <li className="item ng-binding ng-scope" role="menuitem">Italiano</li>
                <li className="item ng-binding ng-scope" role="menuitem">Nederlandse</li>
                <li className="item ng-binding ng-scope" role="menuitem">Português (Brasil)</li>
                <li className="item ng-binding ng-scope" role="menuitem">Português (Portugal)</li>
                <li className="item ng-binding ng-scope" role="menuitem">Русский</li>
                <li className="item ng-binding ng-scope"  role="menuitem">中文(台灣)</li>
                <li className="item ng-binding ng-scope"  role="menuitem">中文(简体)</li>
                <li className="item ng-binding ng-scope"  role="menuitem">日本語</li>
                <li className="item ng-binding ng-scope"  role="menuitem">한국어</li>
                <li className="item ng-binding ng-scope"  role="menuitem">［～Þƨèúδô～］</li>
              </ul>
            </div>
          </div>
          <div className="footer_right"></div>
        </div>
      </div>
    );
  }
});

ReactDOM.render(<BottomNav></BottomNav>, document.getElementById("bottomNav"));
