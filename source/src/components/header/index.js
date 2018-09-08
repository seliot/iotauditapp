import { h, Component } from 'preact';

export default class Header extends Component {

  openNav() {
    let sideNavDiv = Array.prototype.slice.call(document.querySelectorAll('.sidenav'), 0);
    if (sideNavDiv.length > 0) {
      document.getElementById("mySidenav").classList.toggle('sidenav-width');
      document.getElementById("mySidenav").classList.toggle('sidenav-hide');
      document.getElementById("main").classList.toggle('header-hide');
      document.getElementById("main").classList.toggle('margin-left-200');
      document.getElementById("burger-menu").classList.toggle('margin-right-200');
      document.getElementById("myOverlay").classList.toggle('overlay');
    }
    let contentDiv = Array.prototype.slice.call(document.querySelectorAll('.outer-most-div'), 0);
    if (contentDiv.length > 0) {
      let $target = document.getElementById('main-body');
      $target.classList.toggle('margin-left-200');
    }
  }

  componentWillMount() {
    document.addEventListener('DOMContentLoaded', () => {

      // Get all "navbar-burger" elements
      let $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

      // Check if there are any navbar burgers
      if ($navbarBurgers.length > 0) {

        // Add a click event on each of them
        $navbarBurgers.forEach(($el) => {
          $el.addEventListener('click', () => {

            // Get the target from the "data-target" attribute
            let target = $el.dataset.target;
            let $target = document.getElementById(target);

            // Toggle the class on both the "navbar-burger" and the "navbar-menu"
            $el.classList.toggle('is-active');
            $target.classList.toggle('is-active');

          });
        });
      }

    });
  }

  closeNav(){
    document.getElementById("myOverlay").classList.toggle('overlay');
    let $target = document.getElementById('mySidenav');
    $target.classList.toggle('sidenav-width');
    $target.classList.toggle('sidenav-hide');
  }

  componentDidMount() {
  }

  render({}) {
    return (
      <div style="transition:0.3s">
        <div id="myOverlay" class="overlay" onclick={this.closeNav.bind(this)}/>
        <div class="hero-head" >
          <nav class="navbar box" style="padding:0 !important;">
            <div class="container margin-left-200" id="main">

              <div class="navbar-brand">
                <span style="font-size:23px;cursor:pointer;padding: 10px 5px 0px 20px;"  onclick={this.openNav.bind(this)}>&#9776;</span>
                <a class="navbar-item" href="/">
                  <strong>Audit Management</strong>
                </a>
                <span class="navbar-burger burger margin-right-200" id="burger-menu" data-target="navbarMenuHero1">
                  <span/>
                  <span/>
                  <span/>
                </span>
              </div>
              <div id="navbarMenuHero1" class="navbar-menu">
                <div class="navbar-end"  style="margin-right:2em;">
                  <a class="navbar-item is-active" href="/audits">
                    Audits
                  </a>

                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>
    );
  }
}
