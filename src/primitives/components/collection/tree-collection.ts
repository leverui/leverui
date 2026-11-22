import {
  type FilePathTreeNode,
  TreeCollection,
  type TreeCollectionOptions,
  type TreeNode,
  filePathToTree,
} from '@zag-js/collection';

export type {
  TreeCollection,
  TreeNode,
  TreeCollectionOptions,
  FilePathTreeNode,
  FlatTreeNode,
} from '@zag-js/collection';

/** Create a tree collection. */
export const createTreeCollection = <T extends TreeNode>(
  options: TreeCollectionOptions<T>,
): TreeCollection<T> => new TreeCollection(options);

/** Create a file tree collection. */
export const createFileTreeCollection = (paths: string[]): TreeCollection<FilePathTreeNode> =>
  filePathToTree(paths);
