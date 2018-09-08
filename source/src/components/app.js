import { h, Component } from 'preact';
import { Router } from 'preact-router';
import { Match } from 'preact-router/src/match';

import Header from './header';
import VerticalNavigation from './verticalNavigation';
import Dashboard from '../routes/dashboard';
import Audits from '../routes/audits';
import AuditDetails from '../routes/auditDetails';
import CreateObjection from '../routes/createObjection';
import CreateCorrespondence from '../routes/createCorrespondence';
import ObjectionDetails from '../routes/objectionDetails';
import Footer from './footer';
import NotFound from '../components/error_pages/not_found';
import Styling from '../routes/styling';
import Theme from '../routes/theme';

export default class App extends Component {
  render() {
    return (<div>
      <Match path="/">
        {
          ({path}) => {
            if (path === '/login' || path === '/notFound') {
              return (<NotFound type="404" />);
            }
            if (!/\/([a-zA-Z])*\/login/.test(path) && path !== '/setup' && !/\/([a-zA-Z])*\/forgotpassword/.test(path)  &&
             path !== '/resetpassword' && path !== '/verify'&& path !== '/setpassword') {
              return (
                <div>
                  <Header/>
                  <VerticalNavigation />
                </div>
              );
            }
          }
        }
      </Match>
      <Footer/>
      <div id="main-body" class="outer-most-div margin-left-200" style="transition: margin-left .5s;">
        <Router>
          <Dashboard path="/"/>
          <NotFound type="404" default/>
          <Styling path="/styling" />
          <Theme path="/themePage" />
          <Audits path="/audits" />
          <AuditDetails path="/audit/:auditID" />
          <ObjectionDetails path="/audit/:auditID/objection/:objectionID" />
          <CreateObjection path="/audit/:auditID/objection/create" />
          <CreateCorrespondence path="/audit/:auditID/objection/:objectionID/correspondence/create" />
        </Router>
      </div>
    </div>);
  }
}
