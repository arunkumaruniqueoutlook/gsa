/* Copyright (C) 2017-2020 Greenbone Networks GmbH
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License
 * as published by the Free Software Foundation, either version 3
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import React from 'react';

import styled from 'styled-components';

import Layout from 'web/components/layout/layout';

import PropTypes from 'web/utils/proptypes';

const TableData = ({
  children,
  className,
  colSpan,
  rowSpan,
  'data-testid': dataTestId,
  ...other
}) => (
  <td
    className={className}
    colSpan={colSpan}
    rowSpan={rowSpan}
    data-testid={dataTestId}
  >
    <Layout flex="column" {...other}>
      {children}
    </Layout>
  </td>
);

TableData.propTypes = {
  className: PropTypes.string,
  colSpan: PropTypes.numberOrNumberString,
  'data-testid': PropTypes.string,
  rowSpan: PropTypes.numberOrNumberString,
};

export const TableDataAlignTop = styled(TableData)`
  vertical-align: top;
`;

export default TableData;

// vim: set ts=2 sw=2 tw=80:
