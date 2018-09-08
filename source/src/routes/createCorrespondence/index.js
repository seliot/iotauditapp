import { h, Component } from 'preact';
//import { Link } from 'preact-router';

export default class CreateCorrespondence extends Component {

  render ({}, {}) {
    return (
      <div>
        <section>
          <div class="row">
            <div class="col-lg-6">
              <h4 class="inline">Create Correspondence</h4>
            </div>
          </div>
          <hr/>
          <div class="row m-10-t">
            <div class="col-lg-12">
              <form>
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
                      <textarea class="input is-medium" type="text" placeholder="Text input" />
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div class="row" style="margin-top:3em">
            <div class="col-lg-6">
              <h5 class="inline">Attachments</h5>
            </div>
            <div class="col-lg-6">
              <button class="btn--float nudge--left nudge--right color--white btn--primary right">
                <em class="icon icon-plus" />
              </button>
            </div>
          </div>
          <div class="row">
            <table class="col-lg-12 card no-pad">
              <tbody>
                <tr class="table-header">
                  <td><strong>File Name</strong></td>
                  <td><strong>Size</strong></td>
                  <td><strong>Actions</strong></td>
                </tr>
                <tr>
                  <td>Reference Document.pdf</td>
                  <td>2 MB</td>
                  <td><em class="icon icon-download" /> <em class="icon icon-download m-10-l" /></td>
                </tr>
                <tr>
                  <td>Reference Document.pdf</td>
                  <td>2 MB</td>
                  <td><em class="icon icon-download" /> <em class="icon icon-download m-10-l" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        <div class="row bg--clouds no-margin" style="position:fixed;width:100%;bottom:0">
          <div class="col-lg-12">
            <button class="btn--raised btn--primary m-10-t">Close</button>
            <button class="btn--raised btn--primary m-10-t">Save Draft</button>
            <button class="btn--raised btn--primary m-10-t">Create</button>
          </div>
        </div>
      </div>
    );
  }
}
