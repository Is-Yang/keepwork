import _ from 'lodash'

export const EMPTY_GIT_FOLDER_KEEPER = '.gitignore.md'

let protocol = (location && location.protocol) ? location.protocol : 'http:'
export const webTemplateProject = {
  rawBaseUrl: `${protocol}//git.keepwork.com`,
  dataSourceUsername: 'gitlab_rls_official',
  projectName: 'keepworktemplate',
  configFullPath: 'official/template/webTemplateConfig.md'
}

/*doc
  # gitTree2NestedArray

  git tree results => nested array with children as key
*/

export const gitTree2NestedArray = (files, rootPath) => {
  let keysSeperator = '<~>'
  let temporaryChildrenKey = '<~children~>'
  let treeWithChildren = {}

  files.forEach(file => {
    let setKeys = file.path.substr(rootPath.length + 1).split('/').join(`${keysSeperator}${temporaryChildrenKey}${keysSeperator}`).split(keysSeperator)
    let temporaryObject = _.set({}, setKeys, {...file})
    _.merge(treeWithChildren, temporaryObject)
  })

  let convertChildren2ArrayInTree = tree => {
    if (_.has(tree, temporaryChildrenKey)) {
      tree.children = _.values(tree[temporaryChildrenKey])
      _.unset(tree, temporaryChildrenKey)
      tree.children.forEach(convertChildren2ArrayInTree)
    }

    return tree
  }

  let nestedArray = convertChildren2ArrayInTree({[temporaryChildrenKey]: treeWithChildren})['children']
  return nestedArray
}

/*doc
  suffixFileExtension
  add fileExtension to str if there's no fileExtension

  suffixFileExtension('filename.md', 'md') => 'filename.md'
  suffixFileExtension('filename', 'md') => 'filename.md'
*/

export const suffixFileExtension = (() => {
  let cache = {}
  return (str, fileExtension = 'md') => {
    let cacheKey = str + fileExtension
    if (!cache[cacheKey]) {
      let suffixStr = '.' + fileExtension
      let strArr = str.split(suffixStr)
      if (strArr[strArr.length - 1] !== '') strArr[strArr.length] = ''
      cache[cacheKey] = strArr.join(suffixStr)
    }
    return cache[cacheKey]
  }
})()

/*doc
  getFileFullPathByPath

  there's only username and sitename, add index.md
  elsewise fix .md suffix

  getFileFullPathByPath('username/sitename') => 'kaitlyn/kaitlyn/index.md'
  getFileFullPathByPath('/username/sitename') => 'kaitlyn/kaitlyn/index.md'
  getFileFullPathByPath('/username/sitename/pagename') => 'kaitlyn/kaitlyn/pagename.md'
  getFileFullPathByPath('/username/sitename/pagename.md') => 'kaitlyn/kaitlyn/pagename.md'
*/
export const getFileFullPathByPath = (() => {
  let cache = {}
  return path => {
    let cacheKey = path
    if (!cache[cacheKey]) {
      let [username, name, ...pagenames] = path.split('/').filter(x => x)
      let isSiteRootPath = !pagenames.length

      let fullPathNames = isSiteRootPath ? [username, name, 'index'] : [username, name, ...pagenames]
      let fullPath = fullPathNames.join('/')
      fullPath = suffixFileExtension(fullPath, 'md')
      cache[cacheKey] = fullPath
    }
    return cache[cacheKey]
  }
})()

export default {
  EMPTY_GIT_FOLDER_KEEPER,
  webTemplateProject,
  gitTree2NestedArray,
  suffixFileExtension,
  getFileFullPathByPath
}
