import { h, Component } from 'preact';
import { Link, route } from 'preact-router';
import axios from 'axios';
import { Toast } from '../../lib/toastr';
import {formatDateTime} from '../../lib/utils';
import  Pagination  from '../../components/pagination';
import CONSTANTS from '../../lib/constants';
import  PreviousPagination  from '../../components/logPreviousPagination';
import  NextPagination  from '../../components/logNextPagination';
import LinkState from 'linkstate';
import Breadcrumbs from '../../components/breadcrumbs';

export default class AuditDetails extends Component {

  async getAuditDetails() {
    try {
      const result = await axios.get(`${CONSTANTS.API_URL}/audit/${encodeURIComponent(this.props.matches.auditID)}`);

      const auditFirm = await axios.get(`${CONSTANTS.API_URL}/user?id=${result.data.auditorFirmId}`);

      const auditCoordinator = await axios.get(`${CONSTANTS.API_URL}/user?id=${result.data.coordinatorId}`);

      const branch = await axios.get(`${CONSTANTS.API_URL}/branch?id=${result.data.branchId}`);

      this.setState({
        previousStartDate: new Date(result.data.auditPeriodStartDate).toISOString().slice(0,10),
        previousEndDate: new Date(result.data.auditPeriodEndDate).toISOString().slice(0,10),
        previousTargetDate: new Date(result.data.auditReportTargetDate).toISOString().slice(0,10)
      });

      result.data.auditPeriodStartDate = formatDateTime(result.data.auditPeriodStartDate);
      result.data.auditPeriodEndDate = formatDateTime(result.data.auditPeriodEndDate);
      result.data.auditReportTargetDate = formatDateTime(result.data.auditReportTargetDate);
      result.data.assessmentPeriodStartDate = formatDateTime(result.data.assessmentPeriodStartDate);
      result.data.assessmentPeriodEndDate = formatDateTime(result.data.assessmentPeriodEndDate);

      this.setState({
        auditDetails: result.data,
        auditFirmDetails: auditFirm.data,
        auditCoordinatorDetails: auditCoordinator.data,
        branchDetails: branch.data
      });

      this.getObjectionsList();
      this.getLogsList();
      this.getAuditAttachmentList();
    }
    catch (e){
      new Toast('Audit not found', Toast.TYPE_ERROR, Toast.TIME_NORMAL);
      if (e.response.data.statusCode === 400){
        route('/audits');
      }
    }
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

  async getAuditAttachmentList(){
    try {
      const result = await axios.get(`${CONSTANTS.API_URL}/attachment?objId=${this.props.matches.auditID}`);
      this.setState({ auditAttachmentListView: result.data });
    }
    catch (e) {
      new Toast('failed to load attachment list', Toast.TYPE_ERROR, Toast.TIME_NORMAL);
    }
  }

  handleStartDate(event){
    this.setState({
      minEndDate: event.target.value,
      previousStartDate: event.target.value
    });
  }

  handleEndDate(event){
    this.setState({
      maxStartDate: event.target.value,
      minTargetDate: event.target.value,
      previousEndDate: event.target.value
    });
  }

  handleTargetDate(event){
    this.setState({
      maxEndDate: event.target.value,
      previousTargetDate: event.target.value
    });
  }

  closeViewDetailsModal(){
    document.getElementById('modal-3').checked = false;
  }

  async deleteAudit(){
    let deleteFlag = confirm('if you delete this audit, all the related objections will be deleted. Do you still want to delete the audit?');
    if (deleteFlag){
      try {
        const result = await axios.delete(`${CONSTANTS.API_URL}/audit/${encodeURIComponent(this.props.matches.auditID)}`);

        if (result.status === 200){
          new Toast('Audit deleted successfully', Toast.TYPE_DONE, Toast.TIME_NORMAL);
          route('/audits');
        }
      } catch (e) {
        new Toast('Audit deletion failed', Toast.TYPE_ERROR, Toast.TIME_NORMAL);
      }
    }
  }

  async getBranches() {
    try {
      const result =  await axios.get(`${CONSTANTS.API_URL}/branch`);
      this.setState({branchList: result.data});
    } catch (err){
    }
  }

  async getUsers() {
    try {
      const result =  await axios.get(`${CONSTANTS.API_URL}/user`);
      this.setState({userList: result.data});
    } catch (err){
    }
  }
  setStatus(currentStatus, formId, closeStatusPopup) {
    this.setState({ changedStatus: currentStatus, resetChangeStatusForm: formId, closeStatusModalPopup:closeStatusPopup });
    this.getLogsList();
  }

  updateStatusModalClose() {
    document.getElementById(this.state.closeStatusModalPopup).checked = false;
    this.setState({remark: ''});
  }

  onModalCheckboxValueChange(formId,e){
    if (!e.target.checked ){
      document.getElementById(formId).reset();
    }
    if (formId === 'submitAuditForm') {
      this.setState({auditAttachmentList: []});
    }
    if (formId === 'resetCreateObjForm') {
      this.setState({attachmentList: []});
    }
  }

  async updateAudit(event){
    try {
      event.preventDefault();
      const e = event.target;
      const audit = {};
      if (e.branchId.value){
        audit.branchId = e.branchId.value;
      }
      if (e.type.value){
        audit.type = e.type.value;
      }
      if (e.coordinatorId.value){
        audit.coordinatorId = e.coordinatorId.value;
      }
      if (e.auditorFirmId.value){
        audit.auditorFirmId = e.auditorFirmId.value;
      }
      if (e.auditPeriodStartDate.value){
        audit.auditPeriodStartDate = e.auditPeriodStartDate.value;
      }
      if (e.auditPeriodEndDate.value){
        audit.auditPeriodEndDate = e.auditPeriodEndDate.value;
      }
      if (e.auditReportTargetDate.value){
        audit.auditReportTargetDate = e.auditReportTargetDate.value;
      }

      const result = await axios.put(`${CONSTANTS.API_URL}/audit/${encodeURIComponent(this.props.matches.auditID)}`,audit);

      if (result.status === 200){
        new Toast('Audit updated successfully', Toast.TYPE_DONE, Toast.TIME_NORMAL);
        this.getAuditDetails();
        document.getElementById('modal-2').checked = false;
        this.setState({minEndDate: '', maxStartDate: '', minTargetDate: '', maxEndDate: ''});
        this.getAuditDetails();
      }
    } catch (e){
      new Toast('Audit updation failed', Toast.TYPE_ERROR, Toast.TIME_NORMAL);
    }
  }

  async updateAuditStatus(event) {
    event.preventDefault();
    try {
      const e = event.target;
      let audit = {};

      if (this.state.changedStatus === 'Submitted') {

        audit = this.getFormFieldsForSubmitAudit(e);

        const attachmentIds = [];
        const attachmentPromises = [];

        this.state.auditAttachmentList.map( attachment => {
          let fd= new FormData();
          fd.append('file', attachment);
          fd.append('objType', 'Audit');
          attachmentPromises.push(axios.post(`${CONSTANTS.API_URL}/attachment`,fd));
        });

        Promise.all(attachmentPromises).then( response => {
          response.map( res => {
            attachmentIds.push(res.data.id);
          });

          audit.attachments = attachmentIds;
          audit.status = this.state.changedStatus;

          const url = `${CONSTANTS.API_URL}/audit/${encodeURIComponent(this.props.matches.auditID)}/change-status`;

          return axios.put(url,audit).then( () => {
            this.getAuditDetails();
            document.getElementById(this.state.closeStatusModalPopup).checked = false;
            document.getElementById(this.state.resetChangeStatusForm).reset();

            let temp = [];

            this.setState({auditAttachmentList: temp});
            new Toast('Status changed successfully to '+ this.state.changedStatus, Toast.TYPE_DONE, Toast.TIME_NORMAL);
            this.getLogsList();
          });
        }).catch( () => {
          new Toast('Could not update status to '+ this.state.changedStatus, Toast.TYPE_ERROR, Toast.TIME_NORMAL);
        });
      } else {
        audit.status = this.state.changedStatus;
        const url = `${CONSTANTS.API_URL}/audit/${encodeURIComponent(this.props.matches.auditID)}/change-status`;
        const response = await axios.put(url, audit);
        if (!response){
          new Toast('Could not update status to '+ this.state.changedStatus, Toast.TYPE_ERROR, Toast.TIME_NORMAL);
        }
        new Toast('Status changed successfully to '+ this.state.changedStatus, Toast.TYPE_DONE, Toast.TIME_NORMAL);

        this.getAuditDetails();

        document.getElementById(this.state.closeStatusModalPopup).checked = false;
        document.getElementById(this.state.resetChangeStatusForm).reset();
      }

    }
    catch (e) {

      new Toast('Exception Occurred!', Toast.TYPE_ERROR, Toast.TIME_NORMAL);
    }
  }
  getAuditTime(createdAt){
    let hours = new Date(createdAt).getHours();
    let minutes = new Date(createdAt).getMinutes();
    let ampm = hours >= 12 ? 'pm, ' : 'am, ';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    let strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }
  getFormFieldsForSubmitAudit(e) {
    const bodyParams = {};

    if (e.assessmentPeriodStartDate.value){
      bodyParams.assessmentPeriodStartDate = e.assessmentPeriodStartDate.value;
    }
    if (e.assessmentPeriodEndDate.value){
      bodyParams.assessmentPeriodEndDate = e.assessmentPeriodEndDate.value;
    }
    if (e.auditPeriodBranchManagerId.value){
      bodyParams.auditPeriodBranchManager = e.auditPeriodBranchManagerId.value;
    }
    if (e.assesmentPeriodBranchManagerId.value){
      bodyParams.assessmentPeriodBranchManager = e.assesmentPeriodBranchManagerId.value;
    }
    if (e.remark.value){
      bodyParams.remark = e.remark.value;
    }
    return bodyParams;
  }

  getBranchManagerName(branchManagerId) {
    let user = this.state.userList.filter((user) => {
      if (user.id === branchManagerId){
        return user;
      }

    })[0];
    return user ? user.firstname +' '+ user.lastname : '-';
  }

  handleSubmitModalClose() {
    let temp = [];
    this.setState({ auditAttachmentList: temp, mindate: '', maxdate: '' });
    document.getElementById('modal-4').checked = false;
    document.getElementById('submitAuditForm').reset();
  }

  handleEditModalClose(){
    document.getElementById('modal-2').checked = false;
  }

  createObjection (e) {
    e.preventDefault();

    const attachmentIds = [];
    const attachmentPromises = [];
    this.state.attachmentList.map( attachment => {
      let fd= new FormData();
      fd.append('file', attachment);
      fd.append('objType', 'Objection');
      attachmentPromises.push(axios.post(`${CONSTANTS.API_URL}/attachment`,fd));
    });

    Promise.all(attachmentPromises).then( response => {
      response.map( res => {
        attachmentIds.push(res.data.id);
      });

      axios.post(`${CONSTANTS.API_URL}/objection`, {
        auditId: this.props.matches.auditID,
        type: e.target.objectionType.value,
        title: e.target.objectionTitle.value,
        message: e.target.objectionMsg.value,
        severity: e.target.objectionSeverity.value,
        attachments: attachmentIds
      })
        .then(() => {
          this.getObjectionsList();
          document.getElementById('resetCreateObjForm').reset();
          document.getElementById('modal-1').checked = false;
          let temp = [];
          this.setState({attachmentList: temp});
          new Toast('Objection created successfully', Toast.TYPE_DONE, Toast.TIME_NORMAL);
        })
        .catch(() => {
          new Toast('Exception Occured', Toast.TYPE_ERROR, Toast.TIME_NORMAL);
        });
    }).catch( () => {
      new Toast('Exception Occured', Toast.TYPE_ERROR, Toast.TIME_NORMAL);
    });
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

  attachFileAudit(){
    if(document.getElementById('fileAudit').files[0])
      this.state.auditAttachmentList.push(document.getElementById('fileAudit').files[0]);
    this.setState({ auditAttachmentList: this.state.auditAttachmentList});
    document.getElementById('fileAudit').value = '';
  }

  cancelAuditAttachment(index){
    this.state.auditAttachmentList.splice(index,1);
    this.setState({ auditAttachmentList: this.state.auditAttachmentList});
  }

  closeCreateObjectionPopup() {
    let temp = [];
    this.setState({attachmentList: temp});
    document.getElementById('modal-1').checked = false;
    document.getElementById('resetCreateObjForm').reset();
  }

  async getObjectionsList() {
    let url = `${CONSTANTS.API_URL}/objection`;
    let params = {
      auditIds: this.props.matches.auditID
    };
    if (this.state.types){
      params.types = this.state.types;
    }
    if (this.state.severity){
      params.severity = this.state.severity;
    }
    params.pageNo = this.state.currentPageNo;
    const response = await axios.get(url ,{params} );
    this.setState({ objectionsList: response.data });
    this.getObjectionCount();
  }

  filterObjection(e) {
    e.preventDefault();
    this.setState({types: e.target.filterType.value, severity: e.target.filterSeverity.value, currentPageNo: 1});
    this.getObjectionCount();
    this.getObjectionsList();
  }

  removeObjectionFilter() {
    this.setState({types: '', severity: '', currentPageNo: 1});
    this.getObjectionCount();
    this.getObjectionsList();
  }

  async getObjectionCount() {
    try {
      let params = {
        auditIds: this.props.matches.auditID
      };
      if (this.state.types){
        params.types = this.state.types;
      }
      if (this.state.severity){
        params.severity = this.state.severity;
      }
      const result =  await axios.get(`${CONSTANTS.API_URL}/objection/count`,{params});
      this.setState({objectionCount: result.data});
    } catch (err){
    }
  }

  onChangePageClick(pageNo) {
    this.setState({currentPageNo: pageNo});
    this.getObjectionsList();
    this.getLogsList();
  }

  async getAuditHistoryCount() {
    try {
      let params = {
        objectType: 'Audit'
      };
      const result =  await axios.get(`${CONSTANTS.API_URL}/history/${this.props.matches.auditID}/count`, {params});
      this.setState({auditHistoryCount: result.data});

    } catch (err){
    }
  }
  async getLogsList() {

    try {
      let params = {
        objectType: 'Audit'
      };
      params.pageNo = this.state.currentPageNo;
      const result =  await axios.get(`${CONSTANTS.API_URL}/history/${this.props.matches.auditID}`, {params});
      this.setState({logsList: result.data});
      this.getAuditHistoryCount();
    } catch (err){

    }
  }

  componentWillMount() {
    this.state = {
      auditDetails: {},
      objectionsList: [],
      logsList: [],
      branchDetails: {},
      auditFirmDetails: {},
      auditCoordinatorDetails: {},
      auditHistoryCount: '',
      tempObject: {
        auditId: '',
        type: '',
        title: '',
        message: '',
        severity: ''
      },
      objectionCount: '',
      types: '',
      severity: '',
      branchList: [],
      userList: [],
      minEndDate: '',
      maxStartDate: '',
      minTargetDate: '',
      status: 'Open',
      changedStatus: '',
      remark: '',
      mindate: '',
      maxdate: '',
      resetChangeStatusForm: '',
      closeStatusModalPopup: '',
      previousStartDate: null,
      previousEndDate: null,
      previousTargetDate: null,
      previousAssessmentPeriodStartDate: null,
      previousAssessmentPeriodEndDate: null,
      auditTypesList: ['Internal', 'C&C', 'Statutary', 'Nabard', 'Cooperative'],
      attachmentList: [],
      auditAttachmentList: [],
      auditAttachmentListView: [],
      currentPageNo: 1,
      pageSize: 10,
      objectionAreaList: [],
      objectionSeverityList: [],
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
          url:'',
          class: 'is-active'
        }
      ]
    };
  }

  componentDidMount() {
    this.setState({
      objectionAreaList: ['IT', 'HR'],
      objectionSeverityList: ['Low', 'Medium', 'High']
    });

    this.getAuditDetails();
    this.getAuditHistoryCount();
    this.getBranches();
    this.getUsers();
    this.getObjectionCount();
    this.getLogsList();
  }

  render ({},  state) {
    return (
      <div>
      <Breadcrumbs breadcrumbs={state.breadcrumbs} />
        <section>
          <div class="row">
            <div class="col-lg-6">
              <h4 class="inline">Audit {state.auditDetails.customerAuditID}</h4>
              <span class="tag m-10-l">{state.auditDetails.status}</span>
              <span class="m-10-l">
                <input type="checkbox" id="modal-3" />
                <label class="btn--flat" for="modal-3">View Details</label>
                <div class="modal-content col-lg-12">
                  <div class="row">
                    <div class="col-lg-12 has-text-left">
                      <h5>Audit Details</h5>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-lg-3 col-md-6 col-sm-12 m-10-b">
                      <label>Branch Name</label><br/>
                      <label class="f-1-13"><strong>{state.branchDetails.name}</strong></label>
                    </div>
                    <div class="col-lg-3 col-md-6 col-sm-12 m-10-b">
                      <label>Audit Type</label><br/>
                      <label class="f-1-13"><strong>{state.auditDetails.type}</strong></label>
                    </div>
                    <div class="col-lg-3 col-md-6 col-sm-12 m-10-b">
                      <label>HO Coordinator</label><br/>
                      <label class="f-1-13"><strong>{state.auditCoordinatorDetails.firstname+' '+state.auditCoordinatorDetails.lastname}</strong></label>
                    </div>
                    <div class="col-lg-3 col-md-6 col-sm-12 m-10-b">
                      <label>Auditor Firm</label><br/>
                      <label class="f-1-13"><strong>{state.auditFirmDetails.firstname+' '+state.auditFirmDetails.lastname}</strong></label>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-lg-3 col-md-6 col-sm-12 m-10-b">
                      <label>Audit Period Start Date</label><br/>
                      <label class="f-1-13"><strong>{state.auditDetails.auditPeriodStartDate}</strong></label>
                    </div>
                    <div class="col-lg-3 col-md-6 col-sm-12 m-10-b">
                      <label>Audit Period End Date</label><br/>
                      <label class="f-1-13"><strong>{state.auditDetails.auditPeriodEndDate}</strong></label>
                    </div>
                    <div class="col-lg-3 col-md-6 col-sm-12 m-10-b">
                      <label>Audit Report Target Date</label><br/>
                      <label class="f-1-13"><strong>{state.auditDetails.auditReportTargetDate}</strong></label>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-lg-12">
                      <button class="btn--raised btn--primary right m-10-t" onClick={this.closeViewDetailsModal.bind(this)}>Close</button>
                    </div>
                  </div>
                </div>
              </span>
            </div>
            <div class="col-lg-6">
              <button onClick={this.deleteAudit.bind(this)} class="btn--float nudge--left nudge--right color--white btn--primary right">
                <em class="icon icon-trash-b pointer" />
              </button>
              <div>
                <input type="checkbox" id="modal-2"/>
                <label class="btn--float nudge--left nudge--right color--white btn--primary right" for="modal-2"
                  style="width:50px;height:50px;padding-left:0.6em;padding-top:0.6em">
                  <em class="icon icon-edit-modify-streamline" />
                </label>
                <div class="modal-content col-lg-12">
                  <form id="updateAuditForm" onSubmit={this.updateAudit.bind(this)}>
                    <div class="row">
                      <div class="col-lg-12 has-text-left">
                        <h5>Edit Audit</h5>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-lg-12 field">
                        <label class="label">Branch(s) to be Audited</label>
                        <p class="">
                          <span class="select is-medium w-100">
                            <select class="w-100" name="branchId" required>
                              {
                                (state.branchList).map((branch) =>
                                  (<option selected={branch.id === state.branchDetails.id} value={branch.id}>{branch.name}</option>)
                                )
                              }
                            </select>
                          </span>
                        </p>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-lg-4 field">
                        <label class="label">Audit Type</label>
                        <p class="">
                          <span class="select is-medium w-100">
                            <select class="w-100" name="type" required>
                              {
                                (state.auditTypesList).map((auditType) =>
                                  (<option selected={auditType === state.auditDetails.type} value={auditType}>{auditType}</option>)
                                )
                              }
                            </select>
                          </span>
                        </p>
                      </div>
                      <div class="col-lg-4 field">
                        <label class="label">HO Coordinator for Audit</label>
                        <p class="">
                          <span class="select is-medium w-100">
                            <select class="w-100" name="coordinatorId" required>
                              {
                                (this.state.userList).map((user) =>

                                  (<option selected={user.id === state.auditDetails.coordinatorId}
                                    value={user.id}>{user.firstname +' '+ user.lastname}</option>)
                                )
                              }
                            </select>
                          </span>
                        </p>
                      </div>
                      <div class="col-lg-4 field">
                        <label class="label">Auditor Firm</label>
                        <p class="">
                          <span class="select is-medium w-100">
                            <select class="w-100" name="auditorFirmId" required>
                              {
                                (this.state.userList).map((user) =>

                                  (<option selected={user.id === state.auditDetails.auditorFirmId}
                                    value={user.id}>{user.firstname +' '+ user.lastname}</option>)
                                )
                              }

                            </select>
                          </span>
                        </p>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-lg-4 field">
                        <label class="label">Audit Period Start Date</label>
                        <p class="control">
                          <input class="input is-medium w-100" name="auditPeriodStartDate" type="date"
                            value={state.previousStartDate}
                            onChange={this.handleStartDate.bind(this)}
                            max={state.maxStartDate} placeholder="Text input" />
                        </p>
                      </div>
                      <div class="col-lg-4 field">
                        <label class="label">Audit Period End Date</label>
                        <p class="control">
                          <input class="input is-medium w-100" name="auditPeriodEndDate"
                            value={state.previousEndDate}
                            onChange={this.handleEndDate.bind(this)}
                            min={state.minEndDate} max={state.maxEndDate} type="date" placeholder="Text input" />
                        </p>
                      </div>
                      <div class="col-lg-4 field">
                        <label class="label">Audit Report Target Date</label>
                        <p class="control">
                          <input class="input is-medium w-100" name="auditReportTargetDate"
                            value={this.state.previousTargetDate}
                            onChange={this.handleTargetDate.bind(this)}
                            min={state.minTargetDate} type="date" placeholder="Text input" />
                        </p>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-lg-12">
                        <button onClick={this.handleEditModalClose.bind(this)} type="button" class="btn--raised btn--primary right m-10-t">Close</button>
                        <button type="submit" class="btn--raised btn--primary right m-10-t">Update Audit</button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              <div>
                {
                  state.auditDetails.status === 'Closed' &&
                  (
                    <div>
                      <input type="checkbox" id="modal-4" onChange={this.onModalCheckboxValueChange.bind(this,'submitAuditForm')} />
                      <label for="modal-4" class="btn--raised btn--primary right m-10-t"
                        onClick={this.setStatus.bind(this, 'Submitted', 'submitAuditForm', 'modal-4')}>Proceed To Submit</label>
                      <div class="modal-content col-lg-12">
                        <form id="submitAuditForm" onSubmit={this.updateAuditStatus.bind(this)}>
                          <div class="row">
                            <div class="col-lg-12 has-text-left">
                              <h5>Submit Audit</h5>
                            </div>
                          </div>
                          <div class="modal-scrollable">
                            <div class="row">
                              <div class="col-lg-6 field">
                                <label class="label">Assessment Period Start Date</label>
                                <p class="control">
                                  <input class="input is-medium w-100" name="assessmentPeriodStartDate" max={state.maxdate} type="date"
                                    onInput={LinkState(this, 'mindate')} placeholder="Text input"/>
                                </p>
                              </div>
                              <div class="col-lg-6 field">
                                <label class="label">Assessment Period End Date</label>
                                <p class="control">
                                  <input class="input is-medium w-100" name="assessmentPeriodEndDate" type="date"
                                    onInput={LinkState(this, 'maxdate')} min={state.mindate}  placeholder="Text input"/>
                                </p>
                              </div>
                            </div>
                            <div class="row">
                              <div class="col-lg-6 field">
                                <label class="label">Branch Manager during Audit Period</label>
                                <p class="">
                                  <span class="select is-medium w-100">
                                    <select class="w-100" name="auditPeriodBranchManagerId">
                                      <option value='' selected>Select dropdown</option>
                                      {
                                        (this.state.userList).map((user) =>

                                          (<option value={user.id}>{user.firstname +' '+ user.lastname}</option>)
                                        )
                                      }
                                    </select>
                                  </span>
                                </p>
                              </div>
                              <div class="col-lg-6 field">
                                <label class="label">Branch Manager during Assessment Period</label>
                                <p class="">
                                  <span class="select is-medium w-100">
                                    <select class="w-100" name="assesmentPeriodBranchManagerId">
                                      <option value='' selected>Select dropdown</option>
                                      {
                                        (this.state.userList).map((user) =>
                                          (<option value={user.id}>{user.firstname +' '+ user.lastname}</option>)
                                        )
                                      }
                                    </select>
                                  </span>
                                </p>
                              </div>
                            </div>
                            <div class="row">
                              <div class="col-lg-12 field">
                                <label class="label">Remark</label>
                                <p class="control">
                                  <textarea name="remark" class="input is-medium w-100" type="text" placeholder="Text input" />
                                </p>
                              </div>
                            </div>
                            <div class="row" style="margin-top:3em">
                              <div class="col-lg-6">
                                <h5 class="inline">Attachments</h5>
                              </div>
                              <div class="col-lg-12">
                                <input class="input is-medium" id="fileAudit" name="fileAudit" type="file" placeholder="Text input" />
                                <button type="button" onClick={this.attachFileAudit.bind(this)} class="btn--raised btn--primary m-10-t">Attach</button>
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
                                    state.auditAttachmentList.map( (attachment, index) => (
                                      <tr>
                                        <td>{attachment.name}</td>
                                        <td>{(attachment.size)/1024}  KB</td>
                                        <td><em class="icon icon-trash-b m-10-l" onClick={this.cancelAuditAttachment.bind(this, index)}/></td>
                                      </tr>
                                    ))
                                  }
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <div class="row">
                            <div class="col-lg-12">
                              <button class="btn--raised btn--primary right m-10-t"
                                onClick={this.handleSubmitModalClose.bind(this)} type="button">Cancel</button>
                              <button class="btn--raised btn--primary right m-10-t" type="submit">Submit</button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  )
                }
              </div>

              <div>
                {
                  state.auditDetails.status === 'Open' && (
                    <div>
                      <input type="checkbox" id="modal-5" onChange={this.onModalCheckboxValueChange.bind(this,'rejectAuditForm')}/>
                      <label for="modal-5" class="btn--raised btn--primary right m-10-t"
                        onClick={this.setStatus.bind(this, 'Rejected', 'rejectAuditForm', 'modal-5')}>Reject Audit</label>
                      <div class="modal-content col-lg-12">
                        <form id="rejectAuditForm" onSubmit={this.updateAuditStatus.bind(this)}>
                          <div class="row">
                            <div class="col-lg-12 has-text-left">
                              <h5>Reject Audit</h5>
                            </div>
                          </div>
                          <div class="row">
                            <div class="col-lg-12 field">
                              <label class="label">Remark</label>
                              <p class="control">
                                <textarea name="text" class="input is-medium w-100" type="text" placeholder="Text input" />
                              </p>
                            </div>
                          </div>
                          <div class="row">
                            <div class="col-lg-12">
                              <button class="btn--raised btn--primary right m-10-t" type="reset"
                                onClick={this.updateStatusModalClose.bind(this)}>
                              Cancel</button>
                              <button class="btn--raised btn--primary right m-10-t">Submit</button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  )
                }
              </div>

              <div>
                {
                  (state.auditDetails.status === 'Open' || state.auditDetails.status === 'Rejected') && (
                    <div>
                      <input type="checkbox" id="modal-6" onChange={this.onModalCheckboxValueChange.bind(this,'acceptAuditForm')}/>
                      <label for="modal-6" class="btn--raised btn--primary right m-10-t"
                        onClick={this.setStatus.bind(this, 'Accepted', 'acceptAuditForm', 'modal-6')}>Accept Audit</label>
                      <div class="modal-content col-lg-12">
                        <form id="acceptAuditForm" onSubmit={this.updateAuditStatus.bind(this)}>
                          <div class="row">
                            <div class="col-lg-12 has-text-left">
                              <h5>Accept Audit</h5>
                            </div>
                          </div>
                          <div class="row">
                            <div class="col-lg-12 field">
                              <label class="label">Remark</label>
                              <p class="control">
                                <textarea name="text" class="input is-medium w-100" type="text" placeholder="Text input" />
                              </p>
                            </div>
                          </div>
                          <div class="row">
                            <div class="col-lg-12">
                              <button class="btn--raised btn--primary right m-10-t" type="reset"
                                onClick={this.updateStatusModalClose.bind(this)}>
                              Cancel</button>
                              <button class="btn--raised btn--primary right m-10-t">Submit</button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  )
                }
              </div>

              <div>
                {
                  (state.auditDetails.status === 'Accepted') && (
                    <div>
                      <input type="checkbox" id="modal-7" onChange={this.onModalCheckboxValueChange.bind(this,'closeAuditForm')}/>
                      <label for="modal-7" class="btn--raised btn--primary right m-10-t"
                        onClick={this.setStatus.bind(this, 'Closed', 'closeAuditForm', 'modal-7')}>Close Audit</label>
                      <div class="modal-content col-lg-12">
                        <form id="closeAuditForm" onSubmit={this.updateAuditStatus.bind(this)}>
                          <div class="row">
                            <div class="col-lg-12 has-text-left">
                              <h5>Close Audit</h5>
                            </div>
                          </div>
                          <div class="row">
                            <div class="col-lg-12 field">
                              <label class="label">Remark</label>
                              <p class="control">
                                <textarea name="text" class="input is-medium w-100" type="text" placeholder="Text input" />
                              </p>
                            </div>
                          </div>
                          <div class="row">
                            <div class="col-lg-12">
                              <button class="btn--raised btn--primary right m-10-t" type="reset"
                                onClick={this.updateStatusModalClose.bind(this)}>
                              Cancel</button>
                              <button class="btn--raised btn--primary right m-10-t">Submit</button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  )
                }
              </div>
            </div>
          </div>

          <div class="row no-margin">
            <div class=" col-lg-12 tabs three-tabs tab-demo no-pad">
              <input type="radio" name="tabs" id="tab1" checked />
              <div class="tab-label-content three-tabs-label-content" id="tab1-content">
                <label class="tab-label" for="tab1">Objections</label>
                <div class="tab-content">
                  <div class="row">
                    <div class="col-lg-6">
                      <h5 class="m-10-t">Objections</h5>
                    </div>
                    <div class="col-lg-6">
                      <input type="checkbox" id="modal-1" onChange={this.onModalCheckboxValueChange.bind(this,'resetCreateObjForm')} />
                      <label class="btn--float nudge--left nudge--right color--white btn--primary right" for="modal-1"
                        style="width:50px;height:50px;padding-left:0.6em;padding-top:0.6em">
                        <em class="icon icon-plus" />
                      </label>

                      <div class="modal-content col-lg-12">
                        <form onSubmit={this.createObjection.bind(this)} id="resetCreateObjForm">
                          <div class="row">
                            <div class="col-lg-12 has-text-left">
                              <h5>Create Objections</h5>
                            </div>
                          </div>
                          <div class="modal-scrollable">
                            <div class="row">
                              <div class="col-lg-6 field">
                                <label class="label">Audit</label>
                                <h6>FY201617-Internal-Baner</h6>
                              </div>
                              <div class="col-lg-6 field">
                                <label class="label">Type</label>
                                <p class="">
                                  <span class="select is-medium w-100">
                                    <select class="w-100" name="objectionType" required>
                                      <option value='' selected>Select Type</option>
                                      <option>IT</option>
                                      <option>HR</option>
                                    </select>
                                  </span>
                                </p>
                              </div>
                            </div>
                            <div class="row">
                              <div class="col-lg-6 field">
                                <label class="label">Title</label>
                                <p class="control">
                                  <input class="input is-medium w-100" minlength="3" name="objectionTitle" maxlength="150"
                                    type="text" placeholder="Text input" required />
                                </p>
                              </div>

                              <div class="col-lg-6 field">
                                <label class="label">Severity</label>
                                <p class="">
                                  <span class="select is-medium w-100">
                                    <select class="w-100" name="objectionSeverity" required>
                                      <option value='' selected>Select Severity</option>
                                      <option>High</option>
                                      <option>Medium</option>
                                      <option>Low</option>
                                    </select>
                                  </span>
                                </p>
                              </div>
                            </div>

                            <div class="row">
                              <div class="col-lg-12 field">
                                <label class="label">Message</label>
                                <p class="control">
                                  <textarea class="input is-medium w-100" name="objectionMsg" type="text" minlength="3" maxlength="1000"
                                    placeholder="Text input" required />
                                </p>
                              </div>
                            </div>
                            <div class="row" style="margin-top:3em">
                              <div class="col-lg-6">
                                <h5 class="inline">Attachments</h5>
                              </div>
                              <div class="col-lg-12">
                                <input class="input is-medium" id="file" name="file" type="file" placeholder="Text input" />
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
                          </div>
                          <div class="row">
                            <div class="col-lg-12">
                              <button class="btn--raised btn--primary right m-10-t" onClick={this.closeCreateObjectionPopup.bind(this)}
                                type="button">Close</button>
                              <button class="btn--raised btn--primary right m-10-t"
                                type="submit">Create Objection</button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-lg-12">
                      <form name="objectionsFilterForm" onSubmit={this.filterObjection.bind(this)}>
                        <div class="row card no-margin-horizontal">
                          <div class="col-lg-3 field m-5-b">
                            <label class="label">Objection Area</label>
                            <p class="">
                              <span class="select is-medium w-100">
                                <select class="w-100" name="filterType">
                                  <option value='' selected>Select Type</option>
                                  {
                                    (state.objectionAreaList).map((objectionArea) =>

                                      (<option value={objectionArea}>{objectionArea}</option>)
                                    )
                                  }
                                </select>
                              </span>
                            </p>
                          </div>
                          <div class="col-lg-3 field m-5-b">
                            <label class="label">Severity</label>
                            <p class="">
                              <span class="select is-medium w-100">
                                <select class="w-100" name="filterSeverity">
                                  <option value='' selected>Select dropdown</option>
                                  {
                                    (state.objectionSeverityList).map((objectionSeverity) =>

                                      (<option value={objectionSeverity}>{objectionSeverity}</option>)
                                    )
                                  }
                                </select>
                              </span>
                            </p>
                          </div>
                          <div class="col-lg-3 field m-5-b">
                            <label class="label">Has Keyword</label>
                            <p class="control">
                              <input class="input is-medium" type="text" placeholder="Text input" />
                            </p>
                          </div>
                          <div class="col-lg-3 field m-5-b">
                            <button class="btn--raised btn--primary m-10-t" type="submit">Apply</button>
                            <button type="reset" class="btn--raised btn--primary m-10-t" onClick={this.removeObjectionFilter.bind(this)}>Clear</button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>

                  <div class="row card no-margin">
                    <div class="col-lg-12">
                      <table>
                        <tbody>
                          <tr class="table-header">
                            <td>Serial Number</td>
                            <td>Title</td>
                            <td>Area</td>
                            <td>Severity</td>
                            <td>Status</td>
                            <td>Pending Since</td>
                          </tr>
                          {
                            state.objectionsList.map((objection, index) => (
                              <tr>
                                <td>{index + 1}</td>
                                <td>
                                  <Link href={`/audit/${state.auditDetails.id}/objection/${objection.id}`}>{objection.title}</Link>
                                </td>
                                <td>{objection.type}</td>
                                <td>{objection.severity}</td>
                                <td>{objection.status}</td>
                                <td>{objection.pendingSince}</td>
                              </tr>
                            ))
                          }
                          {
                            !state.objectionsList.length && (
                              <p>Objection(s) Not Available</p>
                            )
                          }
                        </tbody>
                      </table>
                    </div>
                    <div class="col-lg-12 has-text-right">
                      {
                        this.state.objectionsList.length !== 0 && (
                          <Pagination currentPageNo={this.state.currentPageNo} count={this.state.objectionCount} pageSize={this.state.pageSize}
                            onChangePageClick={this.onChangePageClick.bind(this)}/>
                        )
                      }
                    </div>
                  </div>
                </div>
              </div>

              <input type="radio" name="tabs" id="tab2" />
              <div class="tab-label-content three-tabs-label-content" id="tab2-content">
                <label class="tab-label" for="tab2">Change Logs</label>
                <div class="tab-content">
                  <div class="row">
                    <div class="col-lg-6">
                      <h5 class="m-10-t">Change Logs</h5>
                    </div>
                  </div>
                  <div class="row m-10-b">
                    <div class="col-lg-12 has-text-center">
                      {
                        state.logsList.length !== 0 && (
                          <NextPagination currentPageNo={this.state.currentPageNo} count={this.state.auditHistoryCount} pageSize={this.state.pageSize}
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
                              <span class="right">{this.getAuditTime(log.createdAt) + formatDateTime(log.createdAt) }</span>
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
                        state.logsList.length !== 0 && (
                          <PreviousPagination currentPageNo={this.state.currentPageNo} count={this.state.auditHistoryCount} pageSize={this.state.pageSize}
                            onChangePageClick={this.onChangePageClick.bind(this)}/>
                        )
                      }
                    </div>
                  </div>
                </div>
              </div>

              <input type="radio" name="tabs" id="tab3" />
              <div class="tab-label-content three-tabs-label-content" id="tab3-content">
                <label class="tab-label" for="tab3">Audit Report</label>
                <div class="tab-content">
                  <div class="row">
                    <div class="col-lg-6">
                      <h5 class="m-10-t">Audit Report</h5>
                    </div>
                  </div>
                  <div class="row card no-margin">
                    <div class="col-lg-12">
                      <div class="row objection-message p-10-b">
                        <div class="col-lg-3">
                          <label>Branch Manager during Audit Period</label><br/>
                          <p class="m-5-t"><strong>{this.getBranchManagerName(state.auditDetails.auditPeriodBranchManager)}</strong></p>
                        </div>
                        <div class="col-lg-3">
                          <label>Assessment Period Start Date</label><br/>
                          <p class="m-5-t"><strong>{state.auditDetails.assessmentPeriodStartDate || '-'}</strong></p>
                        </div>
                        <div class="col-lg-3">
                          <label>Assessment Period End Date</label><br/>
                          <p class="m-5-t"><strong>{state.auditDetails.assessmentPeriodEndDate || '-'}</strong></p>
                        </div>
                        <div class="col-lg-3">
                          <label>Branch Manager during Assessment Period</label><br/>
                          <p class="m-5-t"><strong>{this.getBranchManagerName(state.auditDetails.assessmentPeriodBranchManager)}</strong></p>
                        </div>
                      </div>
                    </div>
                    <div class="col-lg-9">
                      <label>Remark</label><br/>
                      <p class="m-5-t">
                        <strong>{state.auditDetails.remark || '-'}</strong>
                      </p>
                    </div>
                    <div class="col-lg-3">
                      <label>Download Report</label>
                      <p class="m-5-t">
                        <ul>
                          {
                            state.auditAttachmentListView.map( attachment => (
                              <li>
                                <em class="icon icon-document"/>
                                <span>{attachment.name}</span>&nbsp;&nbsp;
                                <span><a onClick={this.downloadLink.bind(this, attachment.id)} class="icon icon-download pointer"/></span>
                              </li>
                            ))
                          }
                        </ul>
                      </p>
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
