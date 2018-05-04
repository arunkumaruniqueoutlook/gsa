/* Greenbone Security Assistant
 *
 * Authors:
 * Steffen Waterkamp <steffen.waterkamp@greenbone.net>
 *
 * Copyright:
 * Copyright (C) 2018 Greenbone Networks GmbH
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 */
import React from 'react';

import _, {short_date} from 'gmp/locale';

import moment from 'moment';

import {parse_int} from 'gmp/parser';

import {is_defined} from 'gmp/utils/identity';

import Filter from 'gmp/models/filter';
import FilterTerm from 'gmp/models/filter/filterterm';

import PropTypes from 'web/utils/proptypes';
import Theme from 'web/utils/theme';

import LineChart, {lineDataPropType} from '../../../components/chart/line';

import DataDisplay from '../../../components/dashboard2/display/datadisplay';
import {totalCount} from '../../../components/dashboard2/display/utils';
import {HostsModifiedLoader} from './loaders';
import {registerDisplay} from '../../../components/dashboard2/registry';

const transformModified = (data = {}) => {
  let {groups = []} = data;
  groups = groups.filter(group => group.subgroup.value === 'High');
  console.log('groups', groups);
  const sum = totalCount(groups);
  const tdata = groups.map(group => {
    const {value, count, c_count} = group;
    const date = moment(value);
    return {
      x: date,
      label: short_date(date),
      y: parse_int(count),
      y2: parse_int(c_count),
    };
  });

  tdata.total = sum;
  return tdata;
};

class HostsModifiedHighDisplay extends React.Component {

  constructor(...args) {
    super(...args);

    this.handleRangeSelect = this.handleRangeSelect.bind(this);
  }

  handleRangeSelect(start, end) {
    const {filter, onFilterChanged} = this.props;

    if (!is_defined(onFilterChanged)) {
      return;
    }

    let {x: startDate} = start;
    let {x: endDate} = end;
    const dateFormat = 'YYYY-MM-DDTHH:mm';

    let newFilter = is_defined(filter) ? filter.copy() : new Filter();

    if (is_defined(startDate)) {

      if (startDate.isSame(endDate)) {
        startDate = startDate.clone().subtract(1, 'day');
        endDate = endDate.clone().add(1, 'day');
      }

      const startTerm = FilterTerm.fromString(
        `modified>${startDate.format(dateFormat)}`);

      if (!newFilter.hasTerm(startTerm)) {
        newFilter = newFilter.and(Filter.fromTerm(startTerm));
      }
    }

    if (is_defined(endDate)) {
      const endTerm = FilterTerm.fromString(
        `modified<${endDate.format(dateFormat)}`);

      if (!newFilter.hasTerm(endTerm)) {
        newFilter = newFilter.and(Filter.fromTerm(endTerm));
      }
    }

    onFilterChanged(newFilter);
  }

  render() {
    const {
      filter,
      ...props
    } = this.props;
    return (
      <HostsModifiedLoader
        filter={filter}
      >
        {loaderProps => (
          <DataDisplay
            {...props}
            {...loaderProps}
            dataTransform={transformModified}
            filter={filter}
            title={({data: tdata}) =>
              _('Hosts (High) by Modification Time (Total: {{count}})',
                {count: tdata.total})
            }
          >
            {({width, height, data: tdata, svgRef}) => (
              <LineChart
                timeline
                svgRef={svgRef}
                width={width}
                height={height}
                data={tdata}
                yAxisLabel={_('# of Modified Hosts (High)')}
                y2AxisLabel={_('Total Hosts (High)')}
                xAxisLabel={_('Time')}
                yLine={{
                  color: Theme.darkGreen,
                  label: _('Modified Hosts (High)'),
                }}
                y2Line={{
                  color: Theme.darkGreen,
                  dashArray: '3, 2',
                  label: _('Total Hosts (High)'),
                }}
                onRangeSelected={this.handleRangeSelect}
              />
            )}
          </DataDisplay>
        )}
      </HostsModifiedLoader>
    );
  }
}

HostsModifiedHighDisplay.propTypes = {
  filter: PropTypes.filter,
  xAxisLabel: PropTypes.string,
  y2AxisLabel: PropTypes.string,
  y2Line: lineDataPropType,
  yAxisLabel: PropTypes.string,
  yLine: lineDataPropType,
  onFilterChanged: PropTypes.func,
};

const DISPLAY_ID = 'host-by-high-modification-time';

HostsModifiedHighDisplay.displayId = DISPLAY_ID;

registerDisplay(DISPLAY_ID, HostsModifiedHighDisplay, {
  title: _('Chart: Hosts (High) by Modification Time'),
});

export default HostsModifiedHighDisplay;

// vim: set ts=2 sw=2 tw=80:
