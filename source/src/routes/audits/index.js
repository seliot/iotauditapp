import { h, Component } from 'preact';
import { Link } from 'preact-router';
import { formatDateTime } from '../../lib/utils';
import  Pagination  from '../../components/pagination';
import  axios  from 'axios';
import { Toast } from '../../lib/toastr';
import Breadcrumbs from '../../components/breadcrumbs';
import CONSTANTS from '../../lib/constants';

export default class Audits extends Component {

  async getAuditsList()  {
    try {
      let url = `${CONSTANTS.API_URL}/audit`;
      let params = {};
      if (this.state.branches){
        params.branches = this.state.branches;
      }
      if (this.state.type){
        params.type = this.state.type;
      }
      if (this.state.auditorFirmIds){
        params.auditorFirmIds = this.state.auditorFirmIds;
      }
      params.pageNo = this.state.currentPageNo;
      const response = await axios.get(url, {params});
      this.setState({auditsList: response.data});
      this.getAuditCount();
    }
    catch (error) {

    }
  }
  filterAudit(e) {
    e.preventDefault();
    this.setState({branches: e.target.branches.value, type: e.target.type.value,
      auditorFirmIds: e.target.auditorFirmIds.value, currentPageNo: 1 });
    this.getAuditCount();
    this.getAuditsList();
  }
  removeFilter() {
    this.setState({type: '', branches: '', auditorFirmIds: '', currentPageNo: 1});
    this.getAuditsList();
    this.getAuditCount();
  }
  async getAuditCount() {
    try {
      let params = {};
      if (this.state.branches){
        params.branches = this.state.branches;
      }
      if (this.state.type){
        params.type = this.state.type;
      }
      if (this.state.auditorFirmIds){
        params.auditorFirmIds = this.state.auditorFirmIds;
      }

      const result =  await axios.get(`${CONSTANTS.API_URL}/audit/count`,{params});
      this.state.auditCount = result.data;
      this.setState({auditCount: this.state.auditCount});
    } catch (err){
      new Toast('failed to count audit',Toast.TYPE_ERROR, Toast.TIME_NORMAL);
    }
  }
  onChangePageClick(pageNo) {
    this.setState({currentPageNo: pageNo});
    this.getAuditsList();
  }
  async getBranches() {
    try {
      const result =  await axios.get(`${CONSTANTS.API_URL}/branch`);
      this.state.branchList = result.data;
      this.setState({branchList: this.state.branchList});
    } catch (err){
    }
  }
  async getUsers() {
    try {

      const result =  await axios.get(`${CONSTANTS.API_URL}/user`);
      this.state.userList = result.data;
      this.setState({userList: this.state.userList});
    } catch (err){
    }
  }
  getBranchName(branchId) {
    let branch = this.state.branchList.filter((branch) => {
      if (branch.id === branchId){
        return branch;
      }
    })[0];
    return branch ? branch.name : '-';
  }
  getUserName(auditorFirmId,coordinatorId) {
    let user = this.state.userList.filter((user) => {
      if (user.id === auditorFirmId || user.id === coordinatorId){
        return user;
      }

    })[0];
    return user ? user.firstname +' '+ user.lastname : '-';
  }
  onCreateAuditClose() {
    document.getElementById('modal-2').checked = false;
    this.setState({ mindate: '', maxdate: '', targetDate: '' });
  }
  minStartDate (e) {
    this.setState({ mindate: e.target.value });
  }
  minEndDate (e) {
    this.setState({ mindate: e.target.value });
  }
  maxEndDate (e) {
    this.setState({ maxdate: e.target.value });
  }
  maxTargetDate (e) {
    this.setState({ targetDate: e.target.value });
  }

  onModalCheckboxValueChange(formId,e){
    if (!e.target.checked ){
      document.getElementById(formId).reset();
    }
  }

  onSubmitCreateAudit(e) {
    e.preventDefault();

    this.state.tempObject = {
      branches: e.target.branchId.value,
      type: e.target.type.value,
      coordinatorId: e.target.coordinatorId.value,
      auditorFirmId: e.target.auditorFirmId.value,
      auditPeriodStartDate: e.target.startDate.value,
      auditPeriodEndDate: e.target.endDate.value,
      auditReportTargetDate: e.target.targetDate.value
    };
    this.setState({ tempObject: this.state.tempObject });
    const object = Object.assign({}, this.state.tempObject);
    axios.post(`${CONSTANTS.API_URL}/audit`, object)
      .then(() => {
        new Toast('Audit created successfully', Toast.TYPE_DONE, Toast.TIME_NORMAL);
        this.getAuditsList();
        document.getElementById('createAuditForm').reset();
        document.getElementById('modal-2').checked = false;
        this.setState({ mindate: '', maxdate: '', targetDate: '' });
      })
      .catch (()=>{
        new Toast('Audit creation failed', Toast.TYPE_ERROR, Toast.TIME_NORMAL);
      });

  }
  componentWillMount() {
    this.state = {
      auditsList: [],
      branchList: [],
      userList: [],
      tempObject: {
        branchId: '',
        type: '',
        coordinatorId: '',
        auditorFirmId: '',
        auditPeriodStartDate: '',
        auditPeriodEndDate: '',
        auditReportTargetDate: ''
      },
      auditType:[],
      branches: '',
      type: '',
      auditorFirmIds:'',
      startDate: '',
      endDate: '',
      mindate: '',
      maxdate: '',
      targetDate: '',
      auditCount: '',
      currentPageNo: 1,
      pageSize: 10,
      breadcrumbs: [
        {
          title: 'Home',
          url: '/',
          class: ''
        },
        {
          title: 'Audits',
          url:'',
          class: 'is-active'
        }
      ]
    };
  }

  componentDidMount() {
    this.setState({auditType: ['Internal', 'C&C', 'Statutary', 'Nabard', 'Cooperative']});

    this.getAuditsList();
    this.getBranches();
    this.getUsers();
    this.getAuditCount();

  }

  render ({}, state) {
    return (
      <div>
        <Breadcrumbs breadcrumbs={state.breadcrumbs} />
        <section>
          <div class="row">
            <div class="col-lg-6">
              <h4 class="m-10-t">Audits</h4>
            </div>
            <div class="col-lg-6">
              <div >
                <input type="checkbox" id="modal-2" onChange={this.onModalCheckboxValueChange.bind(this,'createAuditForm')}/>
                <label class="btn--float nudge--left nudge--right color--white btn--primary right" for="modal-2"
                  style="width:50px;height:50px;padding-left:0.6em;padding-top:0.6em">
                  <em class="icon icon-plus" />
                </label>
                <div class="modal-content col-lg-12">
                  <form id="createAuditForm" onSubmit={this.onSubmitCreateAudit.bind(this)}  >
                    <div class="row">
                      <div class="col-lg-12 has-text-left">
                        <h5>Create Audit</h5>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-lg-12 field">
                        <label class="label">Branch(s) to be Audited</label>
                        <p class="">
                          <span class="select is-medium w-100">
                            <select class="w-100" name="branchId" required>
                              <option value='' selected>Select dropdown</option>
                              {
                                (this.state.branchList).map((value) =>

                                  (<option value={value.id}>{value.name}</option>)
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
                              <option value='' selected>Select dropdown</option>
                              <option>Internal</option>
                              <option>C&C</option>
                              <option>Statutary</option>
                              <option>Nabard</option>
                              <option>Cooperative</option>
                            </select>
                          </span>
                        </p>
                      </div>
                      <div class="col-lg-4 field">
                        <label class="label">HO Coordinator for Audit</label>
                        <p class="">
                          <span class="select is-medium w-100">
                            <select class="w-100" name="coordinatorId" required>
                              <option value='' selected>Select dropdown</option>
                              {
                                (this.state.userList).map((value) =>

                                  (<option value={value.id}>{value.firstname +' '+ value.lastname}</option>)
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
                              <option value='' selected>Select dropdown</option>
                              {
                                (this.state.userList).map((value) =>

                                  (<option value={value.id}>{value.firstname +' '+ value.lastname}</option>)
                                )
                              }

                            </select>
                          </span>
                        </p>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-lg-4 field">
                        <label class="label">Period to be Audited Start Date</label>
                        <p class="control">
                          <input class="input is-medium w-100" name="startDate" max={state.maxdate} type="date"
                            onChange={this.minStartDate.bind(this)} placeholder="Text input" required/>
                        </p>
                      </div>
                      <div class="col-lg-4 field">
                        <label class="label">Period to be Audited End Date</label>
                        <p class="control">

                          <input class="input is-medium w-100" name="endDate" type="date"
                            onChange={this.maxEndDate.bind(this)} min={state.mindate} max={state.targetDate} placeholder="Text input" required/>
                        </p>
                      </div>
                      <div class="col-lg-4 field">
                        <label class="label">Audit Report Target Date</label>
                        <p class="control">
                          <input class="input is-medium w-100" name="targetDate" type="date"
                            onChange={this.maxTargetDate.bind(this)} min={state.maxdate} placeholder="Text input" required/>
                        </p>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-lg-12">
                        <button type="reset" class="btn--raised btn--primary right m-10-t" onClick={this.onCreateAuditClose.bind(this)}>Close</button>
                        <button class="btn--raised btn--primary right m-10-t">Create Audit</button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-lg-12">
              <form name="auditsFilterForm" onSubmit={this.filterAudit.bind(this)}>
                <div class="row card no-margin-horizontal">
                  <div class="col-lg-3 field m-5-b">
                    <label class="label">Branch</label>
                    <p class="">
                      <span class="select is-medium w-100">
                        <select class="w-100" name="branches">
                          <option value='' selected>Select dropdown</option>
                          {
                            (this.state.branchList).map((branch) =>

                              (<option value={branch.id}>{branch.name}</option>)
                            )
                          }
                        </select>
                      </span>
                    </p>
                  </div>
                  <div class="col-lg-3 field m-5-b">
                    <label class="label">Audit Type</label>
                    <p class="">
                      <span class="select is-medium w-100">
                        <select class="w-100" name="type">
                          <option value='' selected>Select dropdown</option>
                          {
                            (this.state.auditType).map((type) =>

                              (<option value={type}>{type}</option>)
                            )
                          }
                        </select>
                      </span>
                    </p>
                  </div>
                  <div class="col-lg-3 field m-5-b">
                    <label class="label">Auditor Firm</label>
                    <p class="">
                      <span class="select is-medium w-100">
                        <select class="w-100" name="auditorFirmIds">
                          <option value='' selected>Select dropdown</option>
                          {
                            (this.state.userList).map((user) =>

                              (<option value={user.id}>{user.firstname +' '+user.lastname}</option>)
                            )
                          }
                        </select>
                      </span>
                    </p>
                  </div>
                  <div class="col-lg-3 field m-5-b">
                    <button type="submit" class="btn--raised btn--primary m-10-t">Apply</button>
                    <button type="reset" onClick={this.removeFilter.bind(this)} class="btn--raised btn--primary m-10-t">Clear</button>
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
                    <td>Branch</td>
                    <td>Type</td>
                    {/*<td title="H/M/L (Total)">Objection Count</td>*/}
                    <td>Assessment Period</td>
                    <td>Auditor Firm</td>
                    <td>Co-ordinator</td>
                  </tr>
                  {
                    state.auditsList.map(audit => (
                      <tr>
                        <td>
                          <Link href={`/audit/${audit.id}`}>{this.getBranchName(audit.branchId)}</Link>
                        </td>
                        <td>{audit.type}</td>
                        <td>{formatDateTime(audit.auditPeriodStartDate)}-{formatDateTime(audit.auditPeriodEndDate)}</td>
                        <td>{this.getUserName(audit.auditorFirmId)}</td>
                        <td>{this.getUserName(audit.coordinatorId)}</td>
                      </tr>
                    ))
                  }
                  {
                    !state.auditsList.length && (
                      <p>Audit(s) Not Available</p>
                    )
                  }
                </tbody>
              </table>
            </div>
            <div class="col-lg-12 has-text-right">
              {
                this.state.auditsList.length !== 0 && (
                  <Pagination currentPageNo={this.state.currentPageNo} count={this.state.auditCount} pageSize={this.state.pageSize}
                    onChangePageClick={this.onChangePageClick.bind(this)}/>
                )
              }
            </div>
          </div>
        </section>
      </div>
    );
  }
}
