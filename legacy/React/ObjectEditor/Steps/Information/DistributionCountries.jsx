import React from 'react';
import createReactClass from 'create-react-class';
import _ from 'underscore';
import store from '../../../../Store/Store';
import { API_URL } from '../../../../Api/constants';

const DistributionCountries = createReactClass({
  getInitialState() {
    return {
      countriesSelected: this.props.countriesSelected,
      newCountriesSelected: null,
      manufacturerId: this.props.manufacturerId,
      lastManufacturerId: null,
      loaded: false,
    };
  },

  componentDidMount() {
    // this.initTableCountries();
  },

  /* shouldComponentUpdate(nextProps, nextState){
        if(this.props.manufacturerId != null & this.props.manufacturerId != nextProps.manufacturerId || this.state.manufacturerId != nextState.manufacturerId || !this.state.loaded){
            return true;
        }
        return false;
    }, */

  componentDidUpdate() {
    if (
      this.state.lastManufacturerId != this.props.manufacturerId &&
      this.props.countries != null &&
      this.props.countriesSelected != null
    ) {
      this.initTableCountries();
    }
  },

  initTableCountries() {
    const self = this;

    const source = {
      dataType: 'json',
      datafields: [
        { name: 'Id', type: 'int' },
        { name: 'Region', type: 'string' },
        { name: 'Name', type: 'string' },
        { name: 'Code', type: 'string' },
        { name: 'IsGroup', type: 'bool' },
        { name: 'Countries', type: 'array' },
      ],
      hierarchy: {
        root: 'Countries',
      },
      localData: this.props.countries,
      id: 'Id',
    };

    const dataAdapter = new $.jqx.dataAdapter(source, {
      loadComplete() {},
    });

    if ($('#jqx-grid-countries').length > 0) {
      $('#jqx-grid-countries').jqxTreeGrid('destroy');
    }
    $('#jqx-grid-countries-container').append('<div id="jqx-grid-countries"></div>');

    $('#jqx-grid-countries').jqxTreeGrid({
      source: dataAdapter,
      altRows: true,
      hierarchicalCheckboxes: true,
      width: '100%',
      height: 290,
      filterable: false,
      // filterMode: 'simple',
      checkboxes: true,
      theme: 'metro',
      // localization: getLocalization(),
      ready() {},
      columns: [
        {
          text: 'Pays',
          datafield: 'Name',
          renderer(text, align, heigth) {
            return `<div style='overflow: hidden; text-overflow: ellipsis; text-align: center; margin-left: 4px; margin-right: 4px; margin-bottom: 7px; margin-top: 7px;'>${text}</div>`;
          },
          cellsRenderer(rowKey, dataField, value, data) {
            if (!data.IsGroup) {
              const imgString = `<span><img width='16' height='16' style='float: left;' src='/Content/images/flags_iso/16/${data.Code?.toLowerCase()}.png'/>`;
              const countryName = `<span style='margin-left: 4px;'>${value}</span></span>`;

              return imgString + countryName;
            }
          },
        }
      ],
    });

    _.each(self.props.countriesSelected, (item) => {
      $('#jqx-grid-countries').jqxTreeGrid('checkRow', item.Id);
    });

    $('#jqx-grid-countries').on('rowCheck', (event) => {
      const { args } = event;
      const { row } = args;
      const newCountriesSelected = self.state.newCountriesSelected;

      if (_.find(newCountriesSelected, (country) => country.Code == row.Id) == null) {
        newCountriesSelected.push({ Id: row.Id, Iso: row.Code, Name: row.Name }); 
      }

      self.setState({ newCountriesSelected });
    });

    $('#jqx-grid-countries').on('rowUncheck', (event) => {
      const { args } = event;
      const { row } = args;
      const newCountriesSelected = self.state.newCountriesSelected.filter((country) => country.Id !== row.Id);
      self.setState({ newCountriesSelected });
    });

    this.setState({
      lastManufacturerId: this.state.manufacturerId,
      newCountriesSelected: this.props.countriesSelected,
    });
  },

  saveCountries() {
    store.dispatch({ type: 'LOADER', state: true });

    const countriesIds = [];
    _.map(this.state.newCountriesSelected, (country) => {
      countriesIds.push(country.Id);
    });

    fetch(
      `${API_URL}/api/ws/v1/bimobject/${this.props.bimObjectId}/countries/edit?token=${this.props.TemporaryToken}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(countriesIds),
      }
    ).then((response) => {
      store.dispatch({ type: 'LOADER', state: false });
    });
  },

  render() {
    let classString = 'panel edit-object';
    if (!this.props.isAuthorized) {
      classString += ' edit-disabled';
    }
    return (
      <div className={classString}>
        <div className="col-md-7">
          <h3>{this.props.resources.EditionPages.DistributionTitle}</h3>
          <p>{this.props.resources.EditionPages.DistributionText}</p>
        </div>
        <div className="col-md-15 col-md-offset-1">
          <div id="jqx-grid-countries-container">
            <div id="jqx-grid-countries" />
          </div>
          <br />
          <button className="btn-third btn-blue" onClick={this.saveCountries}>
            {this.props.resources.MetaResource.Save}
          </button>
        </div>
      </div>
    );
  },
});

export default DistributionCountries;
