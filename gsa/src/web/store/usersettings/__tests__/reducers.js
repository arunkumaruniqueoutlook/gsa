/* Copyright (C) 2018 Greenbone Networks GmbH
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
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

import {
  reportComposerDefaultsLoadingActions,
  setLocale,
  setSessionTimeout,
  setTimezone,
  setUsername,
} from '../actions';
import {
  locale,
  reportComposerDefaults,
  sessionTimeout,
  timezone,
  username,
} from '../reducers';

describe('settings reducers tests', () => {

  describe('timezone reducer tests', () => {

    test('should create initial state', () => {
      expect(timezone(undefined, {})).toBeUndefined();
    });

    test('should reduce timezone action', () => {
      const action = setTimezone('cet');
      expect(timezone(undefined, action)).toEqual('cet');
    });

    test('should override timezone in state', () => {
      const action = setTimezone('cet');
      expect(timezone('foo', action)).toEqual('cet');
    });
  });

  describe('locale reducer tests', () => {

    test('should create initial state', () => {
      expect(locale(undefined, {})).toBeUndefined();
    });

    test('should reduce locale action', () => {
      const action = setLocale('de');
      expect(locale(undefined, action)).toEqual('de');
    });

    test('should override locale in state', () => {
      const action = setLocale('de');
      expect(locale('foo', action)).toEqual('de');
    });
  });

  describe('username reducer tests', () => {

    test('should create initial state', () => {
      expect(username(undefined, {})).toBeUndefined();
    });

    test('should reduce username action', () => {
      const action = setUsername('foo');
      expect(username(undefined, action)).toEqual('foo');
    });

    test('should override username in state', () => {
      const action = setUsername('foo');
      expect(username('bar', action)).toEqual('foo');
    });
  });

  describe('sessionTimeout reducer tests', () => {

    test('should create initial state', () => {
      expect(sessionTimeout(undefined, {})).toBeUndefined();
    });

    test('should reduce username action', () => {
      const action = setSessionTimeout('1234');
      expect(sessionTimeout(undefined, action)).toEqual('1234');
    });

    test('should override username in state', () => {
      const action = setSessionTimeout('1234');
      expect(sessionTimeout('54321', action)).toEqual('1234');
    });
  });

  describe('reportComposerDefaults reducer tests', () => {

    test('should create initial empty state', () => {
      expect(reportComposerDefaults(undefined, {})).toEqual({});
    });

    test('should reduce reportComposerDefaults request action', () => {
      const action = reportComposerDefaultsLoadingActions.request();
      const state = {foo: 'bar'};
      expect(reportComposerDefaults(state, action)).toEqual({foo: 'bar'});
    });

    test('should reduce reportComposerDefaults error action', () => {
      const action = reportComposerDefaultsLoadingActions.error('error');
      expect(reportComposerDefaults(undefined, action)).toEqual({});
    });

    test('should reduce reportComposerDefaults success action', () => {
      const action = reportComposerDefaultsLoadingActions.success({foo: 'bar'});
      expect(reportComposerDefaults(undefined, action)).toEqual({foo: 'bar'});
    });

    test('should override existing defaults', () => {
      const action = reportComposerDefaultsLoadingActions.success({foo: 'bar'});
      const state = {toBe: 'deleted'};
      expect(reportComposerDefaults(state, action)).toEqual({foo: 'bar'});
    });
  });
});
