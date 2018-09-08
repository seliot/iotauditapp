import { h, Component } from 'preact';

export default class NotFound extends Component {
  render(props) {
    return (
      <div class="container">
        <div class="row">
          <h1> {props.type} Error </h1>
        </div>
        <div class="row">
          Page Not Found
        </div>
      </div>
    );
  }
}
