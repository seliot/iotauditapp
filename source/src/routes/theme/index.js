import { h, Component } from 'preact';

export default class Theme extends Component {
  render ({}, {}) {
    return (
      <div class="row">
        <div class="col-lg-2">
          <input type="checkbox" id="nav--super-vertical-responsive" />
          <label for="nav--super-vertical-responsive">MENU</label>
          <aside class="nav--super-vertical g--2 g-m--3 g-s--6 g-t--12 no-margin-vertical">
            <div class="g--12 logo-area no-margin-vertical">
              <h4 class="color--pink no-margin-vertical">Surface</h4>
            </div>
            <nav class="g--12 no-margin-vertical">
              <a href="../index.html">Home</a>
              <a href="../getting-started.html">Getting Started</a>
              <div class="nav-collapsible">
                <input type="checkbox" id="nav-collapsible-1" checked />
                <label for="nav-collapsible-1">Components</label>
                <div class="nav-collapsible-links">
                  <a href="alerts.html">Alerts</a>
                  <a href="animations.html">Animations</a>
                  <a href="buttons.html">Buttons</a>
                  <a href="cards-tiles.html">Cards &amp; Tiles</a>
                  <a href="collapsibles.html">Collapsibles</a>
                  <a href="colors.html">Colors</a>
                  <a href="footer.html">Footer</a>
                  <a href="forms.html">Forms</a>
                  <a href="grid.html">Grid</a>
                  <a href="header.html">Header</a>
                  <a href="lightbox.html">Lightbox</a>
                  <a href="links.html">Links</a>
                  <a href="media.html">Media</a>
                  <a href="modals.html">Modals</a>
                  <a href="navigation.html">Navigation</a>
                  <a href="tables.html">Tables</a>
                  <a href="tabs.html">Tabs</a>
                  <a href="tooltips.html">Tooltips</a>
                  <a href="typography.html">Typography</a>
                  <a href="utility.html">Utility</a>
                </div>
              </div>
              <a href="../about.html">About</a>
            </nav>
          </aside>
        </div>
        <div class="col-lg-10">
          <section>
            <h1>Grid</h1>
            <hr/>
            <div class="row">
              <div class="col-lg-12">
                <div class="card bg--gun-metal">col-12</div>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-6">
                <div class="card">col-6</div>
              </div>
              <div class="col-lg-6">
                <div class="card">col-6</div>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-4">
                <div class="card">col-4</div>
              </div>
              <div class="col-lg-4">
                <div class="card">col-4</div>
              </div>
              <div class="col-lg-4">
                <div class="card">col-4</div>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-3">
                <div class="card">col-3</div>
              </div>
              <div class="col-lg-3">
                <div class="card">col-3</div>
              </div>
              <div class="col-lg-3">
                <div class="card">col-3</div>
              </div>
              <div class="col-lg-3">
                <div class="card">col-3</div>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-2">
                <div class="card">col-2</div>
              </div>
              <div class="col-lg-2">
                <div class="card">col-2</div>
              </div>
              <div class="col-lg-2">
                <div class="card">col-2</div>
              </div>
              <div class="col-lg-2">
                <div class="card">col-2</div>
              </div>
              <div class="col-lg-2">
                <div class="card">col-2</div>
              </div>
              <div class="col-lg-2">
                <div class="card">col-2</div>
              </div>
            </div>
          </section>

          <section>
            <h1>Typography</h1>
            <hr/>
            <div class="row">
              <div class="col-lg-6">
                <h1>Heading 1</h1>
                <h2>Heading 2</h2>
                <h3>Heading 3</h3>
                <h4>Heading 4</h4>
                <h5>Heading 5</h5>
                <h6>Heading 6</h6>
                <p>Pellentesque luctus scelerisque odio at euismod. Integer purus massa, varius eget justo sed, ultricies ornare massa.
                  Suspendisse commodo tortor maximus magna pulvinar, vel porta ligula placerat. Sed feugiat tortor quis nisl mattis,
                  nec lobortis nisi faucibus. Pellentesque sed risus vel nisl molestie tincidunt. In suscipit quis nisl et iaculis.
                  Ut sit amet sodales odio. Aenean pretium nec velit eget</p>
                <h2 class="subtitle">Subtitle</h2>
              </div>
            </div>
          </section>

          <section>
            <h1>Alerts</h1>
            <hr/>
            <div class="row">
              <div class="col-lg-6">
                <div class="alert-wrap">
                  <input type="checkbox" id="alert-check" />
                  <label for="alert-check">CLOSE</label>
                  <div class="alert card">
                    <p>Surface rules! That is all.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h1>Animation</h1>
            <hr/>
            <div class="row">
              <div class="col-lg-6">
                <div class="tile fade-in-from-top">
                  I fade in from the top
                </div>
                <div class="tile fade-in-from-bottom">
                  I fade in from the bottom
                </div>
                <div class="tile fade-in-from-left">
                  I fade in from the left
                </div>
                <div class="tile fade-in-from-right">
                  I fade in from the right
                </div>
              </div>
            </div>
          </section>

          <section>
            <h1>Buttons</h1>
            <hr/>
            <div class="row">
              <div class="col-lg-12">
                <button class="btn--flat">Flat</button>
                <button class="btn--float nudge--left nudge--right color--white btn--primary">+</button>
                <button class="btn--raised">Raised</button>
              </div>
              <hr />
              <div class="col-lg-12">
                <button class="btn--float nudge--left nudge--right color--white btn--primary">
                  <em class="icon icon-search" />
                </button>
                <button class="btn--float nudge--left nudge--right color--white btn--primary btn-border-radiun-none">
                  <em class="icon icon-search" />
                </button>
                <button class="btn--float nudge--left nudge--right color--white btn-tranparent btn-border-radiun-none">
                  <em class="icon icon-search" />
                </button>
              </div>
              <hr />
              <div class="col-lg-12">
                <button class="btn--raised btn--red">Red</button>
                <button class="btn--raised btn--yellow">Yellow</button>
                <button class="btn--raised btn--green">Green</button>
                <button class="btn--raised btn--blue">Blue</button>
                <button class="btn--raised btn--primary">Primary</button>
                <button class="btn--raised btn--secondary color--black">Secondary</button>
                <button class="btn--raised btn--accent color--black">Accent</button>
              </div>
            </div>
          </section>

          <section>
            <h1>Modal</h1>
            <hr/>
            <div class="row">
              <div class="col-lg-12">
                <input type="checkbox" id="modal-1" />
                <label class="modal-trigger" for="modal-1">Modal Link</label>
                <div class="modal-content col-lg-6">
                  <p>Lorem ipsum dolor.</p>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-12">
                <input type="checkbox" id="modal-2" />
                <label class="modal-trigger" for="modal-2">2 Modal Link</label>
                <div class="modal-content col-lg-6">
                  <p>2 Lorem ipsum dolor.</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h1>Table</h1>
            <hr/>
            <div class="row">
              <table class="col-lg-10 card no-pad">
                <tbody>
                  <tr class="table-header">
                    <td>Number</td>
                    <td>Name</td>
                    <td>Age</td>
                    <td>Job</td>
                  </tr>
                  <tr>
                    <td>521</td>
                    <td>Ben</td>
                    <td>23</td>
                    <td>Front End Dev</td>
                  </tr>
                  <tr>
                    <td>951</td>
                    <td>Zoe</td>
                    <td>21</td>
                    <td>Care Worker</td>
                  </tr>
                  <tr>
                    <td>444</td>
                    <td>Simon</td>
                    <td>22</td>
                    <td>Film Producer</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h1>Tabs</h1>
            <hr/>
            <div class="row">
              <div class="card col-lg-10 tabs tab-demo no-pad">
                <input type="radio" name="tabs" id="tab1" checked />
                <div class="tab-label-content" id="tab1-content">
                  <label for="tab1">Tab 1</label>
                  <div class="tab-content">TAB 1 - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis laoreet eget lectus
                   eu congue. Name finibus urna eget nisl aliquam, in dictum ligula feugiat. Donec mollis ligula purus, et
                   interdum velit bibendum eget. Aliquam magna diam, tristique eu libero nec, sagittis finibus sapien. Cras
                   a ex ultricies, faucibus elit sagittis, maximus nisi. Donec quis arcu sapien.</div>
                </div>

                <input type="radio" name="tabs" id="tab2" />
                <div class="tab-label-content" id="tab2-content">
                  <label for="tab2">Tab 2</label>
                  <div class="tab-content">TAB 2 - Quisque egestas, purus in tempor vulputate, diam augue mollis quam, quis elementum
                   ipsum ex a risus. Quisque sed augue porta, facilisis felis vitae, cursus mi. Nullam mollis magna eget tincidunt
                   mollis. Sed suscipit placerat ultricies. Sed eget lorem et ipsum ultricies congue eu a enim. Name quis ex nec
                   lorem dignissim suscipit eu ut felis. Vivamus molestie felis id purus congue, vel ultrices sem molestie.</div>
                </div>

                <input type="radio" name="tabs" id="tab3" />
                <div class="tab-label-content" id="tab3-content">
                  <label for="tab3">Tab 3</label>
                  <div class="tab-content">TAB 3 - Quisque egestas, purus in tempor vulputate, diam augue mollis quam, quis elementum
                   ipsum ex a risus. Quisque sed augue porta, facilisis felis vitae, cursus mi. Nullam mollis magna eget tincidunt
                   mollis. Sed suscipit placerat ultricies. Sed eget lorem et ipsum ultricies congue eu a enim. Name quis ex nec
                   lorem dignissim suscipit eu ut felis. Vivamus molestie felis id purus congue, vel ultrices sem molestie.</div>
                </div>

                <div class="slide slide-demo" />
              </div>
            </div>
          </section>

          <section>
            <h1>Media</h1>
            <hr/>
            <div class="row">
              <div class="col-lg-12 tile">
                <img src="http://i.imgur.com/7TDE8wi.jpg" />
              </div>
            </div>
          </section>

          <section id="navbar">
            <h1>Navigation</h1>
            <hr/>
            <nav class="navbar is-primary">
              <div class="navbar-brand">
                <a class="navbar-item" href="http://bulma.io">
                  <img src="http://bulma.io/images/bulma-logo.png" alt="Bulma: a modern CSS framework based on Flexbox" />
                </a>
                <a class="navbar-item is-hidden-desktop" href="https://github.com/jgthms/bulma" target="_blank">
                  <span class="icon" style="color: #333;">
                    <i class="fa fa-github" />
                  </span>
                </a>
                <a class="navbar-item is-hidden-desktop" href="https://twitter.com/jgthms" target="_blank">
                  <span class="icon" style="color: #55acee;">
                    <i class="fa fa-twitter" />
                  </span>
                </a>
                <div class="navbar-burger burger" data-target="navMenuExample2">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
              <div id="navMenuExample2" class="navbar-menu">
                <div class="navbar-start">
                  <a class="navbar-item " href="#">
                    Home
                  </a>
                  <div class="navbar-item has-dropdown is-hoverable">
                    <a class="navbar-link  is-active" href="#">
                      Docs
                    </a>
                    <div class="navbar-dropdown ">
                      <a class="navbar-item " href="#">
                        Overview
                      </a>
                      <a class="navbar-item " href="#">
                        Modifiers
                      </a>
                      <a class="navbar-item " href="#">
                        Grid
                      </a>
                      <a class="navbar-item " href="#">
                        Form
                      </a>
                      <a class="navbar-item " href="#">
                        Elements
                      </a>
                      <a class="navbar-item is-active" href="#">
                        Components
                      </a>
                      <a class="navbar-item " href="#">
                        Layout
                      </a>
                      <hr class="navbar-divider" />
                      <div class="navbar-item">
                        <div>version
                          <p class="has-text-info is-size-6-desktop">0.4.3</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="navbar-item has-dropdown is-hoverable">
                    <a class="navbar-link " href="#blog/">
                      Blog
                    </a>
                    <div id="blogDropdown" class="navbar-dropdown " data-style="width: 18rem;">
                      <a class="navbar-item" href="/2017/03/10/new-field-element/">
                        <div class="navbar-content">
                          <p>
                            <small class="has-text-info">10 Mar 2017</small>
                          </p>
                          <p>New field element (for better controls)</p>
                        </div>
                      </a>
                      <a class="navbar-item" href="/2016/04/11/metro-ui-css-grid-with-bulma-tiles/">
                        <div class="navbar-content">
                          <p>
                            <small class="has-text-info">11 Apr 2016</small>
                          </p>
                          <p>Metro UI CSS grid with Bulma tiles</p>
                        </div>
                      </a>
                      <a class="navbar-item" href="/2016/02/09/blog-launched-new-responsive-columns-new-helpers/">
                        <div class="navbar-content">
                          <p>
                            <small class="has-text-info">09 Feb 2016</small>
                          </p>
                          <p>Blog launched, new responsive columns, new helpers</p>
                        </div>
                      </a>
                      <a class="navbar-item" href="#blog/">
                        More posts
                      </a>
                      <hr class="navbar-divider" />
                      <div class="navbar-item">
                        <div class="navbar-content">
                          <div class="level is-mobile">
                            <div class="level-left">
                              <div class="level-item">
                                <strong>Stay up to date!</strong>
                              </div>
                            </div>
                            <div class="level-right">
                              <div class="level-item">
                                <a class="btn" href="#atom.xml">
                                  <span class="icon is-small">
                                    <i class="fa fa-rss" />
                                  </span>
                                  <span>Subscribe</span>
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="navbar-item has-dropdown is-hoverable">
                    <div class="navbar-link">
                      More
                    </div>
                    <div id="moreDropdown" class="navbar-dropdown ">
                      <a class="navbar-item " href="#extensions/">
                        <div class="level is-mobile">
                          <div class="level-left">
                            <div class="level-item">
                              <p>
                                <strong>Extensions</strong>
                                <br />
                                <small>Side projects to enhance Bulma</small>
                              </p>
                            </div>
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
                {/*
                <div class="navbar-end">
                  <a class="navbar-item" href="https://github.com/jgthms/bulma" target="_blank">
                    Github
                  </a>
                  <a class="navbar-item" href="https://twitter.com/jgthms" target="_blank">
                    Twitter
                  </a>
                  <div class="navbar-item">
                    <div class="field is-grouped">
                      <p class="control">
                        <a id="twitter" class="btn">
                          <span>Tweet</span>
                        </a>
                      </p>
                      <p class="control">
                        <a class="btn" href="https://github.com/jgthms/bulma/archive/0.4.3.zip">
                          <span class="icon">
                            <i class="fa fa-download" />
                          </span>
                          <span>Download</span>
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
                */}
              </div>
            </nav>
          </section>

          <section>
            <h1>Tags</h1>
            <hr/>
            <div class="row">
              <div class="col-lg-12">
                <span class="tag">This is a tag</span>
                <span class="tag">This is closable tag
                  <a class="delete" />
                </span>
              </div>
            </div>
          </section>

          <section>
            <h1>Breadcrumbs</h1>
            <hr/>
            <nav class="breadcrumb">
              <ul>
                <li>
                  <a>Bulma</a>
                </li>
                <li>
                  <a>Documentation</a>
                </li>
                <li>
                  <a>Components</a>
                </li>
                <li class="is-active">
                  <a>Breadcrumb</a>
                </li>
              </ul>
            </nav>
          </section>

          <section>
            <h1>Dropdowns</h1>
            <hr/>
            <div class="row">
              <div class="col-lg-6">
                <div class="dropdown is-active">
                  <div class="dropdown-trigger">
                    <button class="btn" aria-haspopup="true" aria-controls="dropdown-menu">
                      <span>Dropdown button</span>
                      <span class="icon is-small">
                        <i class="fa fa-angle-down" aria-hidden="true" />
                      </span>
                    </button>
                  </div>
                  <div class="dropdown-menu" id="dropdown-menu" role="menu">
                    <div class="dropdown-content">
                      <a href="#" class="dropdown-item">
                        Dropdown item
                      </a>
                      <a class="dropdown-item">
                        Other dropdown item
                      </a>
                      <a href="#" class="dropdown-item is-active">
                        Active dropdown item
                      </a>
                      <a href="#" class="dropdown-item">
                        Other dropdown item
                      </a>
                      <hr class="dropdown-divider" />
                      <a href="#" class="dropdown-item">
                        With a divider
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h1>Form Styling 1</h1>
            <hr/>
            <div class="row">
              <div class="col-lg-6">
                <div class="field">
                  <label class="label">Name</label>
                  <p class="control">
                    <input class="input is-small" type="text" placeholder="Text input" />
                  </p>
                </div>
                <div class="field">
                  <label class="label">Name</label>
                  <p class="control">
                    <input class="input" type="text" placeholder="Text input" />
                  </p>
                </div>
                <div class="field">
                  <label class="label">Name</label>
                  <p class="control">
                    <input class="input is-medium" type="text" placeholder="Text input" />
                  </p>
                </div>
                <div class="field">
                  <label class="label">Name</label>
                  <p class="control">
                    <input class="input is-large" type="text" placeholder="Text input" />
                  </p>
                </div>
              </div>
              <div class="col-lg-6">
                <div class="field">
                  <label class="label">Subject</label>
                  <p class="">
                    <span class="select is-small">
                      <select>
                        <option>Select dropdown</option>
                        <option>With options</option>
                      </select>
                    </span>
                  </p>
                </div>
                <div class="field">
                  <label class="label">Subject</label>
                  <p class="">
                    <span class="select is-small">
                      <select>
                        <option>Select dropdown</option>
                        <option>With options</option>
                      </select>
                    </span>
                  </p>
                </div>
                <div class="field">
                  <label class="label">Subject</label>
                  <p class="">
                    <span class="select is-medium">
                      <select>
                        <option>Select dropdown</option>
                        <option>With options</option>
                      </select>
                    </span>
                  </p>
                </div>
                <div class="field">
                  <label class="label">Subject</label>
                  <p class="">
                    <span class="select is-large">
                      <select>
                        <option>Select dropdown</option>
                        <option>With options</option>
                      </select>
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h1>Form Styling 2</h1>
            <hr/>
            <div class="row">
              <div class="col-lg-12 tile">
                <input type="checkbox" /> Checkbox
              </div>
              <div class="col-lg-12 tile">
                <input type="radio" name="radio" /> Radio 1
                <input type="radio" name="radio" /> Radio 2
                <input type="radio" name="radio" /> Radio 3
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }
}
