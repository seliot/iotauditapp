import { h, Component } from 'preact';

export default class PreviousPagination extends Component {

  onPreviosPageClick() {
    this.props.onChangePageClick(this.props.currentPageNo - 1);
  }
  render({count, pageSize, currentPageNo}, {}) {
    if (!Number(count)) count = 1;
    const fromRecord = ((pageSize * (currentPageNo - 1)) + 1);
    const toRecord = (pageSize * currentPageNo);
    return (
      <span>
        <button class="btn--raised btn--primary m-10-r m-10-t" type="button"
          onClick={this.onPreviosPageClick.bind(this)} disabled={(currentPageNo === 1)}>{'Load Older'}</button>
        <span>Showing {count >  fromRecord ? fromRecord : count} -
          {count > toRecord ? toRecord : count } of {count}  </span>
      </span>
    );
  }
}
