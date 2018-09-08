import { h, Component } from 'preact';

export default class Pagination extends Component {

  onPreviosPageClick() {
    this.props.onChangePageClick(this.props.currentPageNo - 1);
  }

  onNextPageClick() {
    this.props.onChangePageClick(this.props.currentPageNo + 1);
  }

  render(props, {}) {
    if (!Number(props.count)) props.count = 1;
    return (
      <span>
        <span>Showing {props.count > ((props.pageSize * (props.currentPageNo - 1)) + 1) ?
          (props.pageSize * (props.currentPageNo - 1)) + 1 : props.count} to {props.count > (props.pageSize * props.currentPageNo) ? props.pageSize *
          props.currentPageNo : props.count } of {props.currentPageNo} / {Math.ceil(this.props.count/10)} </span>
        <button class="btn--raised btn--primary m-10-r m-10-t" type="button"
          onClick={this.onPreviosPageClick.bind(this)} disabled={(props.currentPageNo === 1)}>{'<'}</button>
        <button class="btn--raised btn--primary m-10-r m-10-t" type="button"
          onClick={this.onNextPageClick.bind(this)} disabled={(props.currentPageNo === (Math.ceil(this.props.count/10)))}>{'>'}</button>
      </span>
    );
  }
}
