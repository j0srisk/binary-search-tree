const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node === null) {
    return;
  }
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  }
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
};

function randomArray(length, max) {
    return Array.from({length: length}, () => Math.floor(Math.random() * max));
}

class Node {
    constructor(data) {
        this.data = data;
        this.left = null;
        this.right = null;
    }
}

class Tree {
    constructor(arr) {
        this.root = buildTree(arr);
    }

    insert(value) {
        const newNode = new Node(value);
        let currentNode = this.root;

        while (currentNode) {
            if (value < currentNode.data) {
                if (!currentNode.left) {
                    currentNode.left = newNode;
                    break;
                }
                currentNode = currentNode.left;
            } else {
                if (!currentNode.right) {
                    currentNode.right = newNode;
                    break;
                }
                currentNode = currentNode.right;
            }
        }
    }

    remove(value) {
        let currentNode = this.root;
        let parentNode = null;

        while (currentNode) {
            if (value < currentNode.data) {
                parentNode = currentNode;
                currentNode = currentNode.left;
            } else if (value > currentNode.data) {
                parentNode = currentNode;
                currentNode = currentNode.right;
            } else {
                if (currentNode.left === null && currentNode.right === null) {
                    if (parentNode === null) {
                        this.root = null;
                    } else {
                        if (currentNode.data < parentNode.data) {
                            parentNode.left = null;
                        } else {
                            parentNode.right = null;
                        }
                    }
                } else if (currentNode.right === null) {
                    if (parentNode === null) {
                        this.root = currentNode.left;
                    } else {
                        if (currentNode.data < parentNode.data) {
                            parentNode.left = currentNode.left;
                        } else {
                            parentNode.right = currentNode.left;
                        }
                    }
                } else if (currentNode.left === null) {
                    if (parentNode === null) {
                        this.root = currentNode.right;
                    } else {
                        if (currentNode.data < parentNode.data) {
                            parentNode.left = currentNode.right;
                        } else {
                            parentNode.right = currentNode.right;
                        }
                    }
                } else {
                    let leftmost = currentNode.right.left;
                    let leftmostParent = currentNode.right;

                    while (leftmost.left !== null) {
                        leftmostParent = leftmost;
                        leftmost = leftmost.left;
                    }

                    leftmostParent.left = leftmost.right;

                    leftmost.left = currentNode.left;
                    leftmost.right = currentNode.right;

                    if (parentNode === null) {
                        this.root = leftmost;
                    } else {
                        if (currentNode.data < parentNode.data) {
                            parentNode.left = leftmost;
                        } else {
                            parentNode.right = leftmost;
                        }
                    }
                }
                return true;
            }
        }
        return false;
    }

    find(value) {
        let currentNode = this.root;

        while (currentNode) {
            if (value < currentNode.data) {
                currentNode = currentNode.left;
            } else if (value > currentNode.data) {
                currentNode = currentNode.right;
            } else {
                return currentNode;
            }
        }
        return null;
    }

    levelOrder(functionToCall) {
        let queue = [this.root];
        let values = [];

        while (queue.length) {
            let currentNode = queue.shift();

            if (functionToCall) {
                functionToCall(currentNode);
            } else {
                values.push(currentNode.data);
            }

            if (currentNode.left) {
                queue.push(currentNode.left);
            }

            if (currentNode.right) {
                queue.push(currentNode.right);
            }
        }

        if (!functionToCall) {
            return values;
        }
    }

    inOrder(functionToCall) {
        let values = [];
        function traverse(node) {
            if (node.left) {
                traverse(node.left);
            }
            if (functionToCall) {
                functionToCall(node);
            } else {
                values.push(node.data);
            }
            if (node.right) {
                traverse(node.right);
            }
        }

        traverse(this.root);

        if (!functionToCall) {
            return values;
        }
    }

    preOrder(functionToCall) {
        let values = [];
        function traverse(node) {
            if (functionToCall) {
                functionToCall(node);
            } else {
                values.push(node.data);
            }
            if (node.left) {
                traverse(node.left);
            }
            if (node.right) {
                traverse(node.right);
            }
        }

        traverse(this.root);

        if (!functionToCall) {
            return values;
        }
    }

    postOrder(functionToCall) {
        let values = [];
        function traverse(node) {
            if (node.left) {
                traverse(node.left);
            }
            if (node.right) {
                traverse(node.right);
            }
            if (functionToCall) {
                functionToCall(node);
            } else {
                values.push(node.data);
            }
        }

        traverse(this.root);

        if (!functionToCall) {
            return values;
        }
    }

    height(node) {
        if (node === null) {
            return null;
        }
        const left = this.height(node.left);
        const right = this.height(node.right);

        return Math.max(left, right) + 1;
    }

    depth(node) {
        if (node === null) {
            return null;
        }
        let currentNode = this.root;
        let depth = 0;

        while (currentNode) {
            if (node.data < currentNode.data) {
                currentNode = currentNode.left;
                depth++;
            } else if (node.data > currentNode.data) {
                currentNode = currentNode.right;
                depth++;
            } else {
                return depth;
            }
        }
    }

    isBalanced() {
        const left = this.height(this.root.left);
        const right = this.height(this.root.right);

        return Math.abs(left - right) <= 1;
    }

    rebalance() {
        const arr = this.inOrder();
        this.root = buildTree(arr);
    }

}

function buildTree(arr) {
    if (arr.length === 0) {
        return null;
      }
    
      const uniqueArr = Array.from(new Set(arr)); // Remove duplicates from the array
      const sortedArr = uniqueArr.sort((a, b) => a - b); // Sort the unique array in ascending order
    
      const mid = Math.floor((sortedArr.length - 1) / 2); // Adjust the middle index calculation
      const newNode = new Node(sortedArr[mid]);
    
      const left = sortedArr.slice(0, mid);
      newNode.left = buildTree(left);
    
      const right = sortedArr.slice(mid + 1);
      newNode.right = buildTree(right);
    
      return newNode;
}

function addRandomNumbers(tree, count, max) {
    const arr = randomArray(count, max);
    arr.forEach((num) => tree.insert(num));
}

// Tie it all together

//1. Create a binary search tree from an array of random numbers
const tree = new Tree(randomArray(10, 1000));
//2. Confirm that the tree is balanced by calling isBalanced
console.log(tree.isBalanced());
//3. Print out all elements in level, pre, post, and in order
console.log(tree.levelOrder());
console.log(tree.preOrder());
console.log(tree.postOrder());
console.log(tree.inOrder());
//4. Unbalance the tree by adding several numbers > 100
addRandomNumbers(tree, 100, 100);
//5. Confirm that the tree is unbalanced by calling isBalanced
console.log(tree.isBalanced());
//6. Balance the tree by calling rebalance
tree.rebalance();
//7. Confirm that the tree is balanced by calling isBalanced
console.log(tree.isBalanced());
//8. Print out all elements in level, pre, post, and in order
console.log(tree.levelOrder());
console.log(tree.preOrder());
console.log(tree.postOrder());
console.log(tree.inOrder());