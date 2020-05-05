/* Copyright (C) 2018-2020 Greenbone Networks GmbH
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
import React, {useEffect, useRef, useCallback} from 'react';

import {connect} from 'react-redux';

import Logger from 'gmp/log';

import moment from 'gmp/models/date';

import {isDefined, hasValue} from 'gmp/utils/identity';

import {getSessionTimeout} from 'web/store/usersettings/selectors';

import PropTypes from 'web/utils/proptypes';
import useGmp from 'web/utils/useGmp';
import {useLazyIsAuthenticated} from 'web/graphql/auth';

const log = Logger.getLogger('web.observer.sessionobserver');

const DELAY = 15 * 1000; // 15 seconds in milliseconds

const SessionTimeout = ({sessionTimeout}) => {
  const timerRef = useRef();
  const gmp = useGmp();

  const [getIsAuthenticated, {isAuthenticated}] = useLazyIsAuthenticated();

  const handleTimer = useCallback(() => {
    log.debug(
      'session timer',
      timerRef.current,
      'has fired. Checking authentication status.',
    );

    timerRef.current = undefined;

    getIsAuthenticated();
  }, [getIsAuthenticated]);

  const startTimer = useCallback(() => {
    const timeout = sessionTimeout.diff(moment()) + DELAY;

    if (timeout > 0) {
      timerRef.current = global.setTimeout(handleTimer, timeout);

      log.debug(
        'started session timer',
        timerRef.current,
        'timeout',
        timeout,
        'milliseconds',
      );
    }
  }, [sessionTimeout, handleTimer]);

  useEffect(() => {
    // will be called on mount and if sessionTimeout changes
    startTimer();
    return () => {
      // remove timer if the component is unmounted or sessionTimeout has changed
      if (hasValue(timerRef.current)) {
        log.debug('clearing session timer', timerRef.current);

        global.clearTimeout(timerRef.current);
      }
    };
  }, [sessionTimeout, startTimer]);

  useEffect(() => {
    if (hasValue(isAuthenticated) && !isAuthenticated) {
      log.debug('Session has ended.');

      gmp.logout();
    }
  }, [isAuthenticated, gmp]);

  return null;
};

const SessionObserver = ({sessionTimeout}) => {
  if (!isDefined(sessionTimeout)) {
    return null;
  }

  return <SessionTimeout sessionTimeout={sessionTimeout} />;
};

SessionObserver.propTypes = {
  sessionTimeout: PropTypes.date,
};

export default connect(rootState => ({
  sessionTimeout: getSessionTimeout(rootState),
}))(SessionObserver);

// vim: set ts=2 sw=2 tw=80:
