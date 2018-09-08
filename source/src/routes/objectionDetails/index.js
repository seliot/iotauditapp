import { h, Component } from 'preact';
import { route } from 'preact-router';
import axios from 'axios';
import { Toast } from '../../lib/toastr';
import {formatDateTime} from '../../lib/utils';
import  PreviousPagination  from '../../components/logPreviousPagination';
import  NextPagination  from '../../components/logNextPagination';
import CONSTANTS from '../../lib/constants';
import Breadcrumbs from '../../components/breadcrumbs';

export default class ObjectionDetails extends Component {

  async getObjectionDetails() {
    try {
      const result =  await axios.get(`${CONSTANTS.API_URL}/objectionDetail/${this.props.matches.objectionID}`);
      let response = result.data;
      this.setState({objectionDetails: {
        title: response.title,
        type: response.type,
        message: response.message,
        status: response.status,
        severity: response.severity
      }});
      this.getObjectionAttachmentList();
    } catch (err){
      if (err.response.data.statusCode){
        route(`audit/${this.props.matches.auditID}`);
      }
    }
    this.getLogsList();
  }

  async createCorrespondence(event){
    event.preventDefault();
    const attachmentIds = [];
    const attachmentPromises = [];
    this.state.attachmentList.map( attachment => {
      let fd= new FormData();
      fd.append('file', attachment);
      fd.append('objType', 'Comment');
      attachmentPromises.push(axios.post(`${CONSTANTS.API_URL}/attachment`,fd));
    });
    Promise.all(attachmentPromises).then( response => {
      response.map( res => {
        attachmentIds.push(res.data.id);
      });
      const correspondence = {
        objectionId: this.props.matches.objectionID,
        message: event.target.message.value,
        attachments: attachmentIds
      };
      axios.post(`${CONSTANTS.API_URL}/comment`,correspondence).then( () => {
        this.getCommentList();
        document.getElementById("correspondenceForm").reset();
        let temp = [];
        this.setState({attachmentList: temp});
        this.setState({isCreateCorrespondenceOpen: !this.state.isCreateCorrespondenceOpen});
        new Toast('comment created successfully', Toast.TYPE_DONE, Toast.TIME_NORMAL);
      }).catch( () => {
        new Toast('comment creation unsuccessful', Toast.TYPE_ERROR, Toast.TIME_NORMAL);
      });
    }).catch( () => {
      new Toast('attachment upload unsuccessful', Toast.TYPE_ERROR, Toast.TIME_NORMAL);
    });
  }

  async downloadLink(attachmentId){
    try {
      const result = await axios.get(`${CONSTANTS.API_URL}/attachment/${attachmentId}/downloadable`);
      if (result.status === 200){
        let a = document.createElement("a");
        a.href = CONSTANTS.API_URL + result.data.link;
        document.body.appendChild(a);
        a.click();
        new Toast('file is downloading', Toast.TYPE_DONE, Toast.TIME_NORMAL);
      }

    }
    catch (err){
      new Toast('download unsuccessful', Toast.TYPE_ERROR, Toast.TIME_NORMAL);
    }
  }

  attachFile(){
    if(document.getElementById('file').files[0])
      this.state.attachmentList.push(document.getElementById('file').files[0]);
    this.setState({ attachmentList: this.state.attachmentList});
    document.getElementById('file').value = '';
  }

  cancelAttachment(index){
    this.state.attachmentList.splice(index,1);
    this.setState({ attachmentList: this.state.attachmentList});
  }

  toggleCreateCorrespondence() {
    let temp = [];
    this.setState({attachmentList: temp});
    this.setState({isCreateCorrespondenceOpen: !this.state.isCreateCorrespondenceOpen});
  }

  async getAuditDetails() {
    try {
      const result =  await axios.get(`${CONSTANTS.API_URL}/audit?ids=${this.props.matches.auditID}`);

      let response = result.data[0];
      this.setState({auditDetails: {
        auditPeriodStartDate: new Date(response.auditPeriodStartDate).toISOString().slice(0, 10),
        auditPeriodEndDate: new Date(response.auditPeriodEndDate).toISOString().slice(0, 10),
        auditReportTargetDate: new Date(response.auditReportTargetDate).toISOString().slice(0, 10),
        status: response.status,
        type: response.type
      }});
    } catch (err){
      new Toast('failed to load audit details ', Toast.TYPE_ERROR, Toast.TIME_NORMAL);
    }
  }

  changeStatus() {
    axios.put(`${CONSTANTS.API_URL}/objection/${encodeURIComponent(this.props.matches.objectionID)}/change-status`,
      {status: this.state.status, closeRemark: this.state.closeRemark} )
      .then(() => {
        if ( this.state.closeRemark === 'Resolved And Closed')
        {
          new Toast('Objection resolved and closed', Toast.TYPE_DONE, Toast.TIME_NORMAL);
        }
        if ( this.state.closeRemark === 'Not Resolved And Closed')
        {
          new Toast('Objection not resolved and closed', Toast.TYPE_DONE, Toast.TIME_NORMAL);
        }
        this.getObjectionDetails();
      } );
  }

  captureStatus(status, closeRemark) {
    this.setState({status});
    this.setState({closeRemark});
    this.changeStatus();
    this.getLogsList();
  }

  deleteObjection() {
    let confirm = window.confirm('if you delete this audit, all the related comments will be deleted. Do you still want to delete the audit?');
    if (confirm){
      axios.delete(`${CONSTANTS.API_URL}/objection/${this.props.matches.objectionID}`).then(() => {
        route(`/audit/${this.props.matches.auditID}`);
        new Toast('Objection deleted successfully', Toast.TYPE_DONE , Toast.TIME_NORMAL);
      });
    }
  }

  async getCommentList(){
    try {
      const filter = {
        objectionId: this.props.matches.objectionID
      };
      const result = await axios.get(`${CONSTANTS.API_URL}/comment`,{params: filter});
      if (result.status === 200){
        this.getCommentAttachmentList(result.data);
      }
    }
    catch (e){
      new Toast('failed to load comment list', Toast.TYPE_ERROR, Toast.TIME_NORMAL);
    }
  }

  async getCommentAttachmentList(commentList){
    try {
      for (let i=0; i<commentList.length; i++){
        const result = await axios.get(`${CONSTANTS.API_URL}/attachment?objId=${commentList[i].id}`);
        commentList[i].attachments = result.data;
      }
      this.setState({ commentList });
    }
    catch (e) {
      new Toast('failed to load attachment list', Toast.TYPE_ERROR, Toast.TIME_NORMAL);
    }
  }

  async getObjectionAttachmentList(){
    try {
      const result = await axios.get(`${CONSTANTS.API_URL}/attachment?objId=${this.props.matches.objectionID}`);
      this.setState({ objectionAttachmentList: result.data });
    }
    catch (e) {
      new Toast('failed to load attachment list', Toast.TYPE_ERROR, Toast.TIME_NORMAL);
    }
  }
  onChangePageClick(pageNo) {
    this.setState({currentPageNo: pageNo});
    this.getLogsList();
  }
  async getObjectionHistoryCount() {
    try {
      let params = {
        objectType: 'Objection'
      };
      const result =  await axios.get(`${CONSTANTS.API_URL}/history/${this.props.matches.objectionID}/count`,{params});
      this.state.objectionHistoryCount = result.data;
      this.setState({objectionHistoryCount: this.state.objectionHistoryCount});
    } catch (err){
    }
  }
  getCommentTime(createdAt){
    let hours = new Date(createdAt).getHours();
    let minutes = new Date(createdAt).getMinutes();
    let ampm = hours >= 12 ? 'pm, ' : 'am, ';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    let strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }

  async getLogsList() {
    try {
      let params = {
        objectType: 'Objection'
      };
      params.pageNo = this.state.currentPageNo;
      const result =  await axios.get(`${CONSTANTS.API_URL}/history/${this.props.matches.objectionID}`, {params});
      this.setState({logsList: result.data});
      this.getObjectionHistoryCount();
    } catch (err){

    }
  }

  componentWillMount() {
    this.state = {
      objectionDetails: {},
      auditDetails: {},
      logsList: [],
      objectionHistoryCount: '',
      auditID: '',
      status: '',
      closeRemark:'',
      currentPageNo: 1,
      pageSize: 10,
      isCreateCorrespondenceOpen: false,
      commentList: [],
      attachmentList: [],
      commentAttachmentList: [],
      objectionAttachmentList: [],
      breadcrumbs: [
        {
          title: 'Home',
          url: '/',
          class: ''
        },
        {
          title: 'Audits',
          url:'/audits',
          class: ''
        },
        {
          title: 'Audit Details',
          url:`/audit/${this.props.matches.auditID}`,
          class: ''
        },
        {
          title: 'Objection Details',
          url:``,
          class: 'is-active'
        }
      ]
    };
  }

  componentDidMount() {
    this.setState({auditID: this.props.matches.auditID});
    this.getCommentList();
    this.getObjectionDetails();
    this.getAuditDetails();
    this.getLogsList();
    this.getObjectionHistoryCount();
  }

  render ({}, state) {
    return (
      <div>
      <Breadcrumbs breadcrumbs={state.breadcrumbs} />
        <section>
          <div class="row">
            <div class="col-lg-6">
              <h4 class="inline">Objection {state.objectionDetails.title}</h4>
              <span class="tag m-10-l">{state.objectionDetails.status}</span>
            </div>
            <div class="col-lg-6">
              <button onClick={this.deleteObjection.bind(this)} class="btn--float nudge--left nudge--right color--white btn--primary right">
                <em class="icon icon-trash-b" />
              </button>
              <button class="btn--raised btn--primary right m-10-t"
                onClick={this.captureStatus.bind(this,'Closed','Not Resolved And Closed')}>
              Dont Resolve & Close</button>
              <button class="btn--raised btn--primary right m-10-t"
                onClick={this.captureStatus.bind(this,'Closed','Resolved And Closed')}>
              Resolve & Close</button>
            </div>
          </div>

          <div class="row card no-margin-horizontal">
            <div class="col-lg-12 col-md-12 col-sm-12 objection-message">
              <div>
                <label>Brief Description</label>
                <h6>{state.objectionDetails.message}</h6>
              </div>
            </div>
            <div class="col-lg-3 col-md-6 col-sm-12">

              <div class="m-10-b">
                <label>Audit ID</label><br/>
                <label class="f-1-13"><strong>{this.props.matches.auditID}</strong></label>
              </div>

              <div class="m-10-b">
                <label>Audit Type</label><br/>
                <label class="f-1-13"><strong>{state.auditDetails.type}</strong></label>
              </div>
            </div>

            <div class="col-lg-3 col-md-6 col-sm-12">
              <div class="m-10-b">
                <label>Objection Title</label><br/>
                <label class="f-1-13"><strong>{state.objectionDetails.title}</strong></label>
              </div>
              <div class="m-10-b">
                <label>Objection Type</label><br/>
                <label class="f-1-13"><strong>{state.objectionDetails.type}</strong></label>
              </div>
            </div>

            <div class="col-lg-3 col-md-6 col-sm-12">
              <div class="m-10-b">
                <label>Status</label><br/>
                <label class="f-1-13"><strong>{state.objectionDetails.status}</strong></label>
              </div>
              <div class="m-10-b">
                <label>Severity</label><br/>
                <label class="f-1-13"><strong>{state.objectionDetails.severity}</strong></label>
              </div>
              {/*
              <div class="m-10-b">
                <label>Pending Since</label><br/>
                <label class="f-1-13"><strong>{state.objectionDetails.pendingSince}</strong></label>
              </div>
              */}
            </div>

            <div class="col-lg-3 col-md-6 col-sm-12">
              <div>
                <label>Attachments</label>
                <ul style="margin-top:16px;list-style-type:none">
                  {
                    state.objectionAttachmentList.map( attachment => (
                      <li>
                        <em class="icon icon-document"/>
                        <span>{attachment.name}</span>&nbsp;&nbsp;
                        <span><a onClick={this.downloadLink.bind(this, attachment.id)} class="icon icon-download pointer"/></span>
                      </li>
                    ))
                  }

                </ul>
              </div>
            </div>
          </div>

          <div class="row no-margin">
            <div class=" col-lg-12 tabs two-tabs tab-demo no-pad">
              <input type="radio" name="tabs" id="tab1" checked />
              <div class="tab-label-content two-tabs-label-content" id="tab1-content">
                <label class="tab-label" for="tab1">Correspondences</label>
                <div class="tab-content">
                  <div class="row">
                    <div class="col-lg-6">
                      <h5>Correspondences</h5>
                    </div>
                    <div class="col-lg-6">
                      <button id="createCommentButton" class="btn--float nudge--left nudge--right color--white btn--primary right"
                        onClick={this.toggleCreateCorrespondence.bind(this)}>
                        <em class="icon icon-plus" />
                      </button>
                      {/*
                        <input type="checkbox" id="modal-1" />
                        <label class="btn--float nudge--left nudge--right color--white btn--primary right" for="modal-1"
                          style="width:50px;height:50px;padding-left:0.6em;padding-top:0.6em">
                          <em class="icon icon-plus" />
                        </label>
                        <div class="modal-content col-lg-12">
                          <div class="row">
                            <div class="col-lg-12 has-text-left">
                              <h5>Create Correspondence</h5>
                            </div>
                          </div>
                          <div class="row">
                            <div class="col-lg-6 field">
                              <label class="label">Audit</label>
                              <h6>FY201617-Internal-Baner</h6>
                            </div>
                            <div class="col-lg-6 field">
                              <label class="label">Objection Title</label>
                              <h6>Regarding Internal Audit</h6>
                            </div>
                          </div>
                          <div class="row">
                            <div class="col-lg-12 field">
                              <label class="label">Message</label>
                              <p class="control">
                                <textarea class="input is-medium w-100" type="text" placeholder="Text input" />
                              </p>
                            </div>
                          </div>
                          <div class="row" style="margin-top:3em">
                            <div class="col-lg-6">
                              <h5 class="inline">Attachments</h5>
                            </div>
                            <div class="col-lg-12">
                              <input class="input is-medium" type="file" placeholder="Text input" />
                              <button class="btn--raised btn--primary m-10-t">Attach</button>
                            </div>
                          </div>
                          <div class="row">
                            <table class="col-lg-12 no-pad">
                              <tbody>
                                <tr class="table-header">
                                  <td><strong>File Name</strong></td>
                                  <td><strong>Size</strong></td>
                                  <td><strong>Actions</strong></td>
                                </tr>
                                <tr>
                                  <td>Reference Document.pdf</td>
                                  <td>2 MB</td>
                                  <td><em class="icon icon-trash-b m-10-l" /></td>
                                </tr>
                                <tr>
                                  <td>Reference Document.pdf</td>
                                  <td>2 MB</td>
                                  <td><em class="icon icon-trash-b m-10-l" /></td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div class="row">
                            <div class="col-lg-12">
                              <button class="btn--raised btn--primary right m-10-t">Close</button>
                              <button class="btn--raised btn--primary right m-10-t">Create Correspondence</button>
                            </div>
                          </div>
                        </div>
                      */}
                    </div>
                  </div>
                  {
                    state.isCreateCorrespondenceOpen &&
                    <div class="row card">
                      <div class="col-lg-12">
                        <form id="correspondenceForm" onSubmit={this.createCorrespondence.bind(this)}>
                          <div class="row">
                            <div class="col-lg-12 has-text-left">
                              <h5>Create Correspondence</h5>
                            </div>
                          </div>
                          <div class="row">
                            <div class="col-lg-12 field">
                              <label class="label">Message</label>
                              <p class="control">
                                <textarea name="message" class="input is-medium w-100" type="text" placeholder="Text input" />
                              </p>
                            </div>
                          </div>
                          <div class="row">
                            <div class="col-lg-12">
                              <label class="label">Attachments</label>
                            </div>
                            <div class="col-lg-6">
                              <input class="input is-medium w-auto" id="file" name="file" type="file" placeholder="Text input" />
                              <button type="button" onClick={this.attachFile.bind(this)} class="btn--raised btn--primary m-10-t">Attach</button>
                            </div>
                          </div>
                          <div class="row">
                            <table class="col-lg-12 no-pad">
                              <tbody>
                                <tr class="table-header">
                                  <td><strong>File Name</strong></td>
                                  <td><strong>Size</strong></td>
                                  <td><strong>Actions</strong></td>
                                </tr>
                                {
                                  state.attachmentList.map( (attachment, index) => (
                                    <tr>
                                      <td>{attachment.name}</td>
                                      <td>{(attachment.size)/1024}  KB</td>
                                      <td><em class="icon icon-trash-b m-10-l" onClick={this.cancelAttachment.bind(this, index)}/></td>
                                    </tr>
                                  ))
                                }
                              </tbody>
                            </table>
                          </div>
                          <div class="row">
                            <div class="col-lg-12">
                              <button type="reset" class="btn--raised btn--primary right m-10-t"
                                onClick={this.toggleCreateCorrespondence.bind(this)}>Close</button>
                              <button type="submit" class="btn--raised btn--primary right m-10-t">
                               Create Correspondence</button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  }
                  <div class="row">
                    {
                      state.commentList.map( (comment) => (
                        <div class="col-lg-10">
                          <div class="card">
                            <div class="row">
                              <div class="col-lg-6">
                                <h6 class="no-margin-vertical">created by name</h6>
                              </div>
                              <div class="col-lg-6 has-text-right">
                                <p class="no-margin-vertical">{
                                  this.getCommentTime(comment.createdAt) + formatDateTime(comment.createdAt)
                                }</p>
                              </div>
                            </div>
                            <div class="row">
                              <div class="col-lg-12">
                                <p>{comment.message}</p>
                              </div>
                            </div>
                            <div class="row">
                              <div class="col-lg-12">
                                <ul style="margin-top:16px">
                                  {
                                    comment.attachments.map( attachment => (
                                      <li>
                                        <em class="icon icon-document"/>
                                        <span>{attachment.name}</span>
                                        <span>{attachment.sizeKb} KB</span>
                                        <span><a onClick={this.downloadLink.bind(this, attachment.id)} class="icon icon-download pointer"/></span>
                                      </li>
                                    ))
                                  }
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    }
                    {
                      !state.commentList.length && (
                        <div class="col-lg-10">
                          <div class="card">
                            <div class="row">
                              <div class="col-lg-12 left">
                                <h6>Comment(s) Not Available</h6>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    }
                  </div>
                </div>
              </div>

              <input type="radio" name="tabs" id="tab2" />
              <div class="tab-label-content two-tabs-label-content" id="tab2-content">
                <label class="tab-label" for="tab2">Logs</label>
                <div class="tab-content">
                  <div class="row">
                    <div class="col-lg-6">
                      <h5>Logs</h5>
                    </div>
                  </div>
                  <div class="row m-10-b">
                    <div class="col-lg-12 has-text-center">
                      {
                        this.state.logsList.length !== 0 && (
                          <NextPagination currentPageNo={this.state.currentPageNo}
                            count={this.state.objectionHistoryCount} pageSize={this.state.pageSize}
                            onChangePageClick={this.onChangePageClick.bind(this)}/>
                        )
                      }
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-lg-12">
                      {
                        state.logsList.map(log => (
                          <div class="row log-style">
                            <div class="col-lg-8">
                              <span>
                                 Value of
                                <strong> {log.key}</strong> changed from
                                <strong> {log.oldValue}</strong> to
                                <strong> {log.newValue}</strong>
                              </span>
                            </div>
                            <div class="col-lg-4">
                              <span class="right">{this.getCommentTime(log.createdAt) + formatDateTime(log.createdAt)}</span>
                            </div>
                          </div>
                        ))
                      }
                      {
                        !state.logsList.length && (
                          <p>Log(s) Not Available</p>
                        )
                      }
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-lg-12 has-text-center">
                      {
                        this.state.logsList.length !== 0 && (
                          <PreviousPagination currentPageNo={this.state.currentPageNo} count={this.state.objectionHistoryCount} pageSize={this.state.pageSize}
                            onChangePageClick={this.onChangePageClick.bind(this)}/>
                        )
                      }
                    </div>
                  </div>
                </div>
              </div>

              <div class="slide slide-demo" />
            </div>
          </div>
        </section>
      </div>
    );
  }
}
