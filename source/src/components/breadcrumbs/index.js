import { h, Component } from 'preact';
import { route } from 'preact-router';

export default class Breadcrumbs extends Component {
  render(props, {}) {
    return (<div>
      <nav class="breadcrumb">
        <ul>
        {
          props.breadcrumbs.map( (breadcrumb) => (
            <li class={breadcrumb.class}>
              <a href={breadcrumb.url}>{breadcrumb.title}</a>
            </li>
          ))
        }
        </ul>
      </nav>
    </div>);
  }
}
