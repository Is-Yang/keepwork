import Vue from 'vue'
import _ from 'lodash'
import Parser from '@/lib/mod/parser'
import { initialState, UndoManager } from './state'

const RESET_STATE = 'RESET_STATE'
const SET_ACTIVE_PAGE = 'SET_ACTIVE_PAGE'

const UPDATE_CODE = 'UPDATE_CODE'
const REFRESH_CODE = 'REFRESH_CODE'

const ADD_MOD = 'ADD_MOD'
const DELETE_MOD = 'DELETE_MOD'

const SET_ACTIVE_MOD = 'SET_ACTIVE_MOD'
const SET_ACTIVE_PROPERTY = 'SET_ACTIVE_PROPERTY'
const REFRESH_MOD_ATTRIBUTES = 'REFRESH_MOD_ATTRIBUTES'
const SET_ACTIVE_PROPERTY_DATA = 'SET_ACTIVE_PROPERTY_DATA'

const UPDATE_ACTIVE_MOD_ATTRIBUTES = 'UPDATE_ACTIVE_MOD_ATTRIBUTES'
const UPDATE_MODS = 'UPDATE_MODS'
const UPDATE_THEME_NAME = 'UPDATE_THEME_NAME'
const UPDATE_THEME_COLOR = 'UPDATE_THEME_COLOR'
const UPDATE_THEME_BG_COLOR = 'UPDATE_THEME_BG_COLOR'
const UPDATE_THEME_FONT = 'UPDATE_THEME_FONT'

const UPDATE_WIN_TYPE = 'UPDATE_WIN_TYPE'
const RESET_SHOWING_COL = 'RESET_SHOWING_COL'

const UPDATE_FILEMANAGER_TREE_NODE_EXPANDED = 'UPDATE_FILEMANAGER_TREE_NODE_EXPANDED'

export const props = {
  RESET_STATE,
  SET_ACTIVE_PAGE,

  UPDATE_CODE,
  REFRESH_CODE,

  ADD_MOD,
  DELETE_MOD,

  SET_ACTIVE_MOD,
  SET_ACTIVE_PROPERTY,
  REFRESH_MOD_ATTRIBUTES,
  SET_ACTIVE_PROPERTY_DATA,

  UPDATE_ACTIVE_MOD_ATTRIBUTES,
  UPDATE_MODS,
  UPDATE_THEME_NAME,
  UPDATE_THEME_COLOR,
  UPDATE_THEME_BG_COLOR,
  UPDATE_THEME_FONT,

  UPDATE_WIN_TYPE,
  RESET_SHOWING_COL,

  UPDATE_FILEMANAGER_TREE_NODE_EXPANDED
}

const resetIgnoreKeys = ['filemanagerTreeNodeExpandMapByPath']

const mutations = {
  [RESET_STATE](state) {
    UndoManager.clear()
    const newState = initialState()
    for (let key in newState) {
      let resettable = !resetIgnoreKeys.includes(key)
      resettable && Vue.set(state, key, newState[key])
    }
  },
  [SET_ACTIVE_PAGE](state, path) {
    Vue.set(state, 'activePage', path)
  },
  [UPDATE_CODE](state, { code, historyDisabled }) {
    Vue.set(state, 'code', code)
    if (!historyDisabled) UndoManager.save(code)
  },
  [REFRESH_CODE](state) {
    const code = Parser.buildMarkdown(state.modList)
    Vue.set(state, 'code', code)
    UndoManager.save(code)
  },
  [ADD_MOD](state, { modProperties, key, cmd }) {
    return Parser.addBlockByKey(state.modList, key, modProperties, cmd)
  },
  [DELETE_MOD](state, key) {
    return Parser.deleteBlock(state.modList, key)
  },
  [SET_ACTIVE_MOD](state, key) {
    if (state.activeMod && state.activeMod.key === key) return
    const index = state.modList.map(el => el.key).indexOf(key)
    if (index !== -1) Vue.set(state, 'activeMod', state.modList[index])
  },
  [SET_ACTIVE_PROPERTY](state, property) {
    if (!state.activeMod) return
    Vue.set(state, 'activeProperty', property)
  },
  [REFRESH_MOD_ATTRIBUTES](state, key) {
    Parser.updateBlock(state.modList, key, state.code)
  },
  [SET_ACTIVE_PROPERTY_DATA](state, { activePropertyData, data }) {
    let newData = _.merge({}, activePropertyData, data)
    Parser.updateBlockAttribute(
      state.modList,
      state.activeMod.key,
      state.activeProperty,
      newData
    )
  },
  [UPDATE_ACTIVE_MOD_ATTRIBUTES](state, { key, value }) {
    Parser.updateBlockAttribute(state.modList, state.activeMod.key, key, value)
  },
  [UPDATE_MODS](state, code) {
    let blockList = Parser.buildBlockList(code)
    Parser.updateBlockList(state.modList, blockList)
  },
  [UPDATE_THEME_NAME](state, themeName) {
    Vue.set(state.theme, 'name', themeName)
  },
  [UPDATE_THEME_COLOR](state, colorID) {
    Vue.set(state.theme, 'colorID', colorID)
  },
  [UPDATE_THEME_BG_COLOR](state, bgColorID) {
    Vue.set(state.theme, 'bgColorID', bgColorID)
  },
  [UPDATE_THEME_FONT](state, fontID) {
    Vue.set(state.theme, 'fontID', fontID)
  },
  [UPDATE_WIN_TYPE](state, componentType) {
    Vue.set(state, 'activeWinType', componentType)
  },
  [RESET_SHOWING_COL](state, showingColObj) {
    Vue.set(
      state.showingCol,
      'isManagerShow',
      showingColObj.isManagerShow === undefined
        ? true
        : showingColObj.isManagerShow
    )
    Vue.set(
      state.showingCol,
      'isPreviewShow',
      showingColObj.isPreviewShow === undefined
        ? true
        : showingColObj.isPreviewShow
    )
    Vue.set(
      state.showingCol,
      'isCodeShow',
      showingColObj.isCodeShow === undefined ? true : showingColObj.isCodeShow
    )
  },
  [UPDATE_FILEMANAGER_TREE_NODE_EXPANDED](state, { path, expanded }) {
    Vue.set(state, 'filemanagerTreeNodeExpandMapByPath', {
      ...state.filemanagerTreeNodeExpandMapByPath,
      [path]: expanded
    })
  }
}

export default mutations