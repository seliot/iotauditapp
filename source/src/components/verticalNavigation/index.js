import { h, Component } from 'preact';
import { Link } from 'preact-router';

export default class VerticalNavigation extends Component {

  render({}, {}) {
    return (<div id="mySidenav" class="sidenav sidenav-width">
      <aside class="nav--super-vertical g--2 g-m--3 g-s--6 g-t--12 no-margin-vertical">
        <div class="g--12 logo-area banking-suite no-margin-vertical">
          <h5 class="color--white no-margin-vertical">BBS</h5>
        </div>
        <hr class="dropdown-divider"/>
        <div class="g--12 logo-area no-margin-vertical">
          <img src="/assets/images/PDCC_Symbol.png" />
        </div>
        <div class="color--white has-text-center p-5"><b>Pune District Central Cooperative Bank</b></div>
        <hr class="dropdown-divider"/>
        <div class="nav-collapsible">
          <div class="row ">
            <div class="col-xs-12 col-sm-12 col-lg-12">
              <input type="checkbox" id="nav-collapsible-2" />
              <label for="nav-collapsible-2" style="display:flex; border-bottom:none;">
                <div class="row middle-xs">
                  <div class="col-xs-4 col-sm-4  col-lg-4" >
                    <img src="/assets/images/user.png" />
                  </div>
                  <div class="col-xs-8 col-sm-8 col-lg-8 no-pad">
                    <div class="color--white nav--link">Username</div>
                  </div>
                </div>
              </label>
              <div class="nav-collapsible-links">
                <a href="#">Change Password</a>
                <a href="#">Logout</a>
              </div>
            </div>
          </div>
        </div>
        <hr class="dropdown-divider"/>
        <nav class="g--12 no-margin-vertical">
          <Link href="/">
            <div class="row ">
              <div class="col-xs-12 col-sm-12 col-lg-12">
                <div class="row middle-xs">
                  <div class="col-xs-3 col-sm-3  col-lg-3" >
                    <img src="/assets/images/PDCC_Symbol.png" class="nav--img" />
                  </div>
                  <div class="col-xs-9 col-sm-9 col-lg-9 no-pad">
                    <div class="color--white nav--link">Audit Management</div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </nav>
      </aside>
    </div>);
  }
}
