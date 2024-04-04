/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/no-redeclare */
/* eslint-disable vars-on-top */
/* eslint-disable react/no-array-index-key */
/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/button-has-type */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/no-unused-class-component-methods */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable block-scoped-var */
/* eslint-disable no-var */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/sort-comp */
/* eslint-disable react/no-deprecated */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/prefer-es6-class */
import React from 'react';
import createReactClass from 'create-react-class';
import _ from 'underscore';
import toastr from 'toastr';

// import material ui material
import Typography from '@material-ui/core/Typography';

// material ui icons
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';
import TranslateIcon from '@material-ui/icons/Translate';
import CheckIcon from '@material-ui/icons/Check';
import { API_URL } from '../../../../Api/constants';
import store from '../../../../Store/Store';
import { history } from '../../../../history';
import { withRouter } from '../../../../Utils/withRouter';
import { getDefaultLanguageOption, getAvaibleCulturesEdit } from './utils';

const NameAndDescription = createReactClass({
  getInitialState() {
    return {
      data: [],
      languageSelectDefault: '',
      descriptionIdToDelete: '',
      hasAutomaticTranslation: false,
      translationInProgress: false,
      bimobjname: '',
      currentEditCulture: null,
    };
  },

  componentDidMount() {
    if (this.props.bimObjectId != null) {
      if (this.props.location.state != null) {
        this.state.translationInProgress =
          this.props.location.state.translationInProgress != null
            ? this.props.location.state.translationInProgress
            : false;
      }

      this.loadBimObjectDescriptions(this.props.bimObjectId);
    } else {
      this.setState(this.getInitialState());
    }

    $('body').on('hide.bs.modal', '#edit-lang-modal', () => {
      setTimeout(() => this.setState({ currentEditCulture: null }), 150)
    });
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.bimObjectId != null) {
      if (this.props.location.state != null) {
        this.state.translationInProgress =
          this.props.location.state.translationInProgress != null
            ? this.props.location.state.translationInProgress
            : false;
        this.loadBimObjectDescriptions(nextProps.bimObjectId);
      }
    } else {
      this.setState(this.getInitialState());
    }
  },

  componentDidUpdate(_, prevState) {
    const { currentEditCulture } = this.state;

    const shouldOpenModal = currentEditCulture && prevState.currentEditCulture !== currentEditCulture && prevState.currentEditCulture?.language !== currentEditCulture.language

    if (shouldOpenModal) {
      $('#edit-lang-modal .bimobjectlang-edit-language-code').val(currentEditCulture.language);
      $('#edit-lang-modal .bimobjectlang-name').val(currentEditCulture.name);
      $('#edit-lang-modal .bimobjectlang-description').val(currentEditCulture.description);
      $('#edit-lang-modal .bimobjectlang-isdefault').prop('checked', currentEditCulture.isdefault == 'true');

      $('#edit-lang-modal').modal();
    }
  },

  loadBimObjectDescriptions(objectId) {
    fetch(`${API_URL}/api/ws/v1/bimobject/description/list?token=${this.props.TemporaryToken}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([{ ObjectId: objectId }]),
    })
      .then((response) => response.json())
      .then((json) => {
        let hasAutomaticTranslation = false;
        let { translationInProgress } = this.state;

        if (json != null) {
          hasAutomaticTranslation = _.findLastIndex(json, { IsAutomaticTranslate: true }) > -1;
        }

        if (hasAutomaticTranslation) {
          translationInProgress = false;
        }

        this.setState({ data: json, hasAutomaticTranslation, translationInProgress });
        this.props.refreshInformation();
      });
  },

  _handleCreateLang(event) {
    store.dispatch({ type: 'LOADER', state: true });

    let languageCode = $('#create-lang-modal .bimobjectlang-language-code').val();

    const name = $('#create-lang-modal .bimobjectlang-name').val();
    const description = $('#create-lang-modal .bimobjectlang-description').val();
    const isdefault = $('#create-lang-modal .bimobjectlang-isdefault').prop('checked');

    // objet existant
    if (this.props.bimObjectId != null) {
      fetch(
        `${API_URL}/api/ws/v1/bimobject/description/addorupdate?token=${this.props.TemporaryToken}`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify([
            {
              ObjectId: this.props.bimObjectId,
              LanguageCode: languageCode,
              Name: name,
              Description: description,
              IsDefault: isdefault,
              IsTemplate: this.props.isTemplate,
            },
          ]),
        }
      ).then((response) => {
        this.loadBimObjectDescriptions(this.props.bimObjectId);
        store.dispatch({ type: 'LOADER', state: false });
        $('#create-lang-modal .bimobjectlang-name').val('');
        $('#create-lang-modal .bimobjectlang-description').val('');
        $('#create-lang-modal .bimobjectlang-isdefault').prop('checked', false);
        $('#create-lang-modal').modal('hide');
        this.props.refreshInformation();
      });
      // creation de l'objet
    } else {
      $('#create-lang-modal').modal('hide');
      store.dispatch({ type: 'LOADER', state: true });

      const newTypeCapitalized =
        this.props.objectTypeCreate[0].toUpperCase() + this.props.objectTypeCreate.slice(1);
      let data = null;

      const manufacturerTagId =
        this.props.manufacturerTag != null ? this.props.manufacturerTag.Id : null;
      const manufacturerTagName =
        this.props.manufacturerTag != null ? this.props.manufacturerTag.Name : null;

      if (this.props.objectTypeCreate == 'official') {
        data = {
          ObjectType: newTypeCapitalized,
          ManufacturerId: this.props.manufacturerCreate,
          ManufacturerTagId: manufacturerTagId,
          ManufacturerTagName: manufacturerTagName,
          IsTemplate: this.props.isTemplate,
          Details: [
            {
              LanguageCode: languageCode,
              Name: name.trim(),
              Description: description.trim(),
              isDefault: true,
            },
          ],
        };
      } else if (this.props.objectTypeCreate == 'genericOfficial') {
        data = {
          ObjectType: newTypeCapitalized,
          CompanyId: this.props.companyCreate,
          Details: [
            {
              LanguageCode: languageCode,
              Name: name.trim(),
              Description: description.trim(),
              isDefault: true,
            },
          ],
        };
      } else {
        data = {
          ObjectType: newTypeCapitalized,
          IsTemplate: this.props.isTemplate,
          Details: [
            {
              LanguageCode: languageCode,
              Name: name.trim(),
              Description: description.trim(),
              isDefault: true,
            },
          ],
        };
      }

      fetch(
        `${API_URL}/api/ws/v2/contentmanagement/${this.props.managementCloudId}/bimobject/initialize?token=${this.props.TemporaryToken}`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      )
        .then((response) => response.json())
        .then((json) => {
          store.dispatch({ type: 'LOADER', state: false });
          if (Number.isInteger(json.BimObjectId)) {
            history.push({
              pathname: `/${this.props.language}/bimobject/${json.BimObjectId}/edit/informations`,
              state: { translationInProgress: true },
            });
            this.props.refreshInformation();
          } else {
            toastr.error('error');
          }
        });
    }
  },

  prepareEdit(event) {
    const data = event.currentTarget.dataset;

    this.setState({ currentEditCulture: { language: data.language, name: data.name, description: data.description, isdefault: data.isdefault } });
  },

  handleEditLang(event) {
    const languageCode = $('#edit-lang-modal .bimobjectlang-edit-language-code').val();
    const name = $('#edit-lang-modal .bimobjectlang-name').val();
    const description = $('#edit-lang-modal .bimobjectlang-description').val();
    const isdefault = $('#edit-lang-modal .bimobjectlang-isdefault').prop('checked');

    fetch(
      `${API_URL}/api/ws/v1/bimobject/description/addorupdate?token=${this.props.TemporaryToken}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          {
            ObjectId: this.props.bimObjectId,
            LanguageCode: languageCode,
            Name: name,
            Description: description,
            IsDefault: isdefault,
          },
        ]),
      }
    ).then((response) => {
      this.loadBimObjectDescriptions(this.props.bimObjectId);
      $('#edit-lang-modal').modal('hide');
      this.props.refreshInformation();
    });
  },

  handleDeleteLang(event) {
    const lid = this.state.descriptionIdToDelete;

    fetch(`${API_URL}/api/ws/v1/bimobject/description/remove?token=${this.props.TemporaryToken}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([{ ObjectId: this.props.bimObjectId, LanguageCode: lid }]),
    }).then((response) => {
      this.loadBimObjectDescriptions(this.props.bimObjectId);
      this.props.refreshInformation();
      $('#delete-lang-modal').modal('hide');
    });
  },

  _initModal(event) {
    if (this.state.languageSelectDefault != '') {
      $('#create-lang-modal .bimobjectlang-language-code').val(this.state.languageSelectDefault);
    } else {
      const firstValue = $('#create-lang-modal .bimobjectlang-language-code option:first').val();
      $('#create-lang-modal .bimobjectlang-language-code').val(firstValue);
    }

    $('#commonsLanguages').show();
  },

  _openDeleteModal(event) {
    if (this.state.data.length <= 1) {
      toastr.error(this.props.resources.EditionPage.OneLangLeft);
      return;
    }

    const { lid } = event.currentTarget.dataset;
    this.setState({ descriptionIdToDelete: lid });
    $('#delete-lang-modal').modal();
  },

  onChangeInputName(event) {
    this.setState({ bimobjname: event.target.value.trim() });
  },

  render() {
    const { state, props } = this;

    const availableCultures = [];
    const cultures = props.cultures.sort((a, b) => {
      if (a.Name > b.Name) {
        return 1;
      }
      if (a.Name < b.Name) {
        return -1;
      }
      return 0;
    });

    cultures.forEach((lang) => {
      const found = state.data.find((dataDesc) => dataDesc.LanguageCode === lang.Code);
      if (!found) {
        availableCultures.push(lang);
      }
    });

    const avaibleCulturesEdit = getAvaibleCulturesEdit({
      cultures,
      currentCulture: state.currentEditCulture,
      languageCode: props.language,
      languages: props.languages,
    });

    state.languageSelectDefault = getDefaultLanguageOption(availableCultures, props.language);

    let rows;

    if (state.data.length !== 0) {
      rows = state.data.map((lang, i) => (
        <tr key={lang.LanguageCode}>
          <td>{props.languages.find((dataDesc) => dataDesc.LanguageCode === lang.LanguageCode)?.Translations[props.language]}</td>
          <td data-cy="col-name">{lang.Name}</td>
          <td>{lang.Description}</td>
          <td>{lang.IsDefault ? '✓' : null}</td>
          <td className="text-right">
            <a className="edit-lang edit-btn">
              <EditIcon
                data-language={lang.LanguageCode}
                data-name={lang.Name}
                data-description={lang.Description}
                data-isdefault={lang.IsDefault}
                onClick={this.prepareEdit}
              />
            </a>
            <a className="delete-lang delete-btn">
              <DeleteIcon data-lid={lang.LanguageCode} onClick={this._openDeleteModal} />
            </a>
          </td>
        </tr>
      ));
    }

    let classString = 'panel panel-object-langs edit-object';
    if (!this.props.isAuthorized) {
      classString += ' edit-disabled';
    }

    let classNameAddLang = 'browse fileinput-button';

    if (!availableCultures.length) {
      classNameAddLang += ' hidden';
    }

    return (
      <div>
        <div className={classString}>
          <div className="col-md-7">
            <h3>{this.props.resources.EditionPages.NameAndDescriptionTitle}</h3>
            <p>{this.props.resources.EditionPages.NameAndDescriptionText}</p>
            {this.props.EnableAutomaticTranslation && this.state.hasAutomaticTranslation ? (
              <div className="automatic-translation-information align-bottom">
                <div className="icon-group">
                  <TranslateIcon className="translate-icon" />
                  <CheckIcon className="check-icon" />
                </div>
                <p
                  className="translation-provided-by"
                  dangerouslySetInnerHTML={{
                    __html: this.props.resources.AutomaticTranslation.ProvidedByWithLink,
                  }}
                />
              </div>
            ) : null}
          </div>
          <div className="col-md-15 col-md-offset-1">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>{this.props.resources.EditionPage.MetaBimObjectLanguage}</th>
                  <th>{this.props.resources.EditionPage.MetaBimObjectName}</th>
                  <th>{this.props.resources.EditionPage.MetaBimObjectDescription}</th>
                  <th>{this.props.resources.EditionPage.MetaBimObjectDefault}</th>
                  <th />
                </tr>
              </thead>
              <tbody>{rows}</tbody>
            </table>
            {this.props.EnableAutomaticTranslation && this.state.translationInProgress ? (
              <Typography variant="body2" className="text-green">
                {this.props.resources.AutomaticTranslation.TranslationInProgress}
              </Typography>
            ) : null}
            <span
              className={classNameAddLang}
              data-toggle="modal"
              data-target="#create-lang-modal"
              onClick={this._initModal}
            >
              <a className="btn-blue btn-third">
                {this.props.resources.EditionPage.AddNameAndDescription}
              </a>
            </span>
          </div>
        </div>

        <div
          className="modal fade"
          id="create-lang-modal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="myModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <CloseIcon aria-hidden="true" />
                </button>
                <h4 className="modal-title" id="myModalLabel">
                  {this.props.resources.EditionPage.CreateLanguageBimObjectTitle}
                </h4>
              </div>
              <div className="modal-body">
                <div className="form-group" id="commonsLanguages">
                  <label>{this.props.resources.EditionPage.LanguageNameLabel}</label>
                  <select className="bimobjectlang-language-code form-control" data-cy="langues">
                    {availableCultures.map((lang) =>
                      <option key={lang.Code} value={lang.Code}>
                        {lang.Name}
                      </option>
                    )}
                  </select>
                </div>
                <div className="form-group">
                  <label>{this.props.resources.EditionPage.BimObjectNameLabel}</label>
                  <input
                    className="bimobjectlang-name form-control"
                    data-cy="Nom de l'objet"
                    onChange={this.onChangeInputName}
                    type="text"
                  />
                </div>
                <div className="form-group">
                  <label>{this.props.resources.EditionPage.BimObjectDescriptionLabel}</label>
                  <textarea rows="10" className="bimobjectlang-description form-control" />
                </div>
                <div className="form-group">
                  <label className="pointer">
                    <input
                      type="checkbox"
                      id="default-lang"
                      className="bimobjectlang-isdefault pointer"
                    />
                    {this.props.resources.EditionPage.BimObjectDefaultLanguageLabel}
                  </label>
                  <p className="default-lang-text legende">
                    {this.props.resources.EditionPage.DefaultLangText}
                  </p>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-second btn-grey" data-dismiss="modal">
                  {this.props.resources.EditionPage.CloseBtnLabel}
                </button>
                {this.state.bimobjname != '' ? (
                  <button
                    type="button"
                    className="btn-second btn-blue create-lang"
                    onClick={this._handleCreateLang}
                  >
                    {this.props.resources.EditionPage.SaveBtnLabel}
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div
          className="modal fade"
          id="edit-lang-modal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="myModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <CloseIcon aria-hidden="true" />
                </button>
                <h4 className="modal-title" id="myModalLabel">
                  {this.props.resources.EditModalTitle}
                </h4>
              </div>
              <div className="modal-body">
                <div className="form-group" id="commonsLanguages">
                  <label>{this.props.resources.EditionPage.LanguageNameLabel}</label>
                  <select className="bimobjectlang-edit-language-code">{avaibleCulturesEdit.map((lang) => (
                    <option key={lang.Code} value={lang.Code}>
                      {lang.Name}
                    </option>
                  ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>{this.props.resources.EditionPage.BimObjectNameLabel}</label>
                  <input className="bimobjectlang-name form-control" type="text" />
                </div>
                <div className="form-group">
                  <label>{this.props.resources.EditionPage.BimObjectDescriptionLabel}</label>
                  <textarea rows="10" className="bimobjectlang-description form-control" />
                </div>
                <div className="form-group">
                  <label className="pointer">
                    <input type="checkbox" className="bimobjectlang-isdefault pointer" />
                    {this.props.resources.DefaultLangLabel}
                  </label>
                  <p className="default-lang-text legende">
                    {this.props.resources.EditionPage.DefaultLangText}
                  </p>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-second btn-grey" data-dismiss="modal">
                  {this.props.resources.EditionPage.CloseBtnLabel}
                </button>
                <button
                  type="button"
                  className="btn-second btn-blue save-lang"
                  onClick={this.handleEditLang}
                >
                  {this.props.resources.EditionPage.SaveBtnLabel}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          className="modal fade"
          id="delete-lang-modal"
          tabIndex="-1"
          role="dialog"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">
                  {this.props.resources.EditionPage.DeleteDescriptionTitle}
                </h4>
                <CloseIcon className="close" data-toggle="modal" data-dismiss="modal" />
              </div>
              <div className="modal-body">
                <div className="container-fluid">
                  <div className="row" />
                  <div className="row">
                    <div className="col-xs-11 text-center">
                      <a data-toggle="modal" onClick={this.handleDeleteLang}>
                        <img
                          src="../../../../../../Content/images/AccepterLaRequete.svg"
                          width="98"
                          height="98"
                          alt=""
                        />
                        <span>{this.props.resources.EditionPage.DeleteDescriptionButton}</span>
                      </a>
                    </div>
                    <div className="col-xs-11 col-xs-offset-1 text-center">
                      <a data-dismiss="modal" aria-label="Close">
                        <img
                          src="../../../../../../Content/images/RejeterLaRequete.svg"
                          width="98"
                          height="98"
                          alt=""
                        />
                        <span>
                          {this.props.resources.UsersManagement.PageMemberRevokeAccessCancel}
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> 
        </div>
      </div>
    );
  },
});

export default withRouter(NameAndDescription);



