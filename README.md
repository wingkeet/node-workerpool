# node-workerpool
Multiprocessing using a pool of workers in Node.js.

### Introduction
This project aims to offer a Node module that makes it easy to use a pool of workers for multiprocessing.

### Prerequisites
- The file workerpool.js requires Node.js >= 12.0.0 due to usage of private class fields from ES2019.
- No external npm modules are used.

### Deprecation
This project has been superseded by the [taskman](https://github.com/wingkeet/taskman) project.

### Authors
* **Steve Leong** - *Initial work*

### License
This project is licensed under the MIT License - see the LICENSE file for details.

### Acknowledgments
* The inspiration for this project came from the Python [multiprocessing.pool.Pool.apply_async()](https://docs.python.org/3.7/library/multiprocessing.html#multiprocessing.pool.Pool.apply_async) method.
