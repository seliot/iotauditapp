import { h, Component } from 'preact';
import Breadcrumbs from '../../components/breadcrumbs';

export default class Dashboard extends Component {

  componentWillMount() {
    this.state = {
      breadcrumbs: [
        {
          title: 'Home',
          url: '/',
          class: 'is-active'
        }
      ]
    };
  }

  render ({}, state) {
    return (
      <div>
        <Breadcrumbs breadcrumbs={state.breadcrumbs} />
        <section>
          <div class="row">
            <div class="col-lg-12">
              <h1 class="m-10-t has-text-center">Welcome to Audit Management</h1>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
