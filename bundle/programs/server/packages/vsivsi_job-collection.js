(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var later = Package['mrt:later'].later;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var check = Package.check.check;
var Match = Package.check.Match;

/* Package-scope variables */
var __coffeescriptShare, Job, JobCollection;

(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/vsivsi_job-collection/job/src/job_class.coffee.js                                                        //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var JobQueue, _clearInterval, _setImmediate, _setInterval, concatReduce, isBoolean, isInteger, methodCall, optionsHelp, reduceCallbacks, splitLongArray,     
  slice = [].slice,                                                                                                  //
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
                                                                                                                     //
methodCall = function(root, method, params, cb, after) {                                                             // 9
  var apply, name, ref, ref1, ref2, ref3;                                                                            // 10
  if (after == null) {                                                                                               //
    after = (function(ret) {                                                                                         //
      return ret;                                                                                                    //
    });                                                                                                              //
  }                                                                                                                  //
  apply = (ref = (ref1 = Job._ddp_apply) != null ? ref1[(ref2 = root.root) != null ? ref2 : root] : void 0) != null ? ref : Job._ddp_apply;
  if (typeof apply !== 'function') {                                                                                 // 11
    throw new Error("Job remote method call error, no valid invocation method found.");                              // 12
  }                                                                                                                  //
  name = ((ref3 = root.root) != null ? ref3 : root) + "_" + method;                                                  // 10
  if (cb && typeof cb === 'function') {                                                                              // 14
    return apply(name, params, (function(_this) {                                                                    //
      return function(err, res) {                                                                                    //
        if (err) {                                                                                                   // 16
          return cb(err);                                                                                            // 16
        }                                                                                                            //
        return cb(null, after(res));                                                                                 //
      };                                                                                                             //
    })(this));                                                                                                       //
  } else {                                                                                                           //
    return after(apply(name, params));                                                                               // 19
  }                                                                                                                  //
};                                                                                                                   // 9
                                                                                                                     //
optionsHelp = function(options, cb) {                                                                                // 9
  var ref;                                                                                                           // 23
  if ((cb != null) && typeof cb !== 'function') {                                                                    // 23
    options = cb;                                                                                                    // 24
    cb = void 0;                                                                                                     // 24
  } else {                                                                                                           //
    if (!(typeof options === 'object' && options instanceof Array && options.length < 2)) {                          // 27
      throw new Error('options... in optionsHelp must be an Array with zero or one elements');                       // 30
    }                                                                                                                //
    options = (ref = options != null ? options[0] : void 0) != null ? ref : {};                                      // 27
  }                                                                                                                  //
  if (typeof options !== 'object') {                                                                                 // 32
    throw new Error('in optionsHelp options not an object or bad callback');                                         // 33
  }                                                                                                                  //
  return [options, cb];                                                                                              // 34
};                                                                                                                   // 21
                                                                                                                     //
splitLongArray = function(arr, max) {                                                                                // 9
  var i, k, ref, results;                                                                                            // 37
  if (!(arr instanceof Array && max > 0)) {                                                                          // 37
    throw new Error('splitLongArray: bad params');                                                                   // 37
  }                                                                                                                  //
  results = [];                                                                                                      // 38
  for (i = k = 0, ref = Math.ceil(arr.length / max); 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {       //
    results.push(arr.slice(i * max, (i + 1) * max));                                                                 // 38
  }                                                                                                                  // 38
  return results;                                                                                                    //
};                                                                                                                   // 36
                                                                                                                     //
reduceCallbacks = function(cb, num, reduce, init) {                                                                  // 9
  var cbCount, cbErr, cbRetVal;                                                                                      // 43
  if (reduce == null) {                                                                                              //
    reduce = (function(a, b) {                                                                                       //
      return a || b;                                                                                                 //
    });                                                                                                              //
  }                                                                                                                  //
  if (init == null) {                                                                                                //
    init = false;                                                                                                    //
  }                                                                                                                  //
  if (cb == null) {                                                                                                  // 43
    return void 0;                                                                                                   // 43
  }                                                                                                                  //
  if (!(typeof cb === 'function' && num > 0 && typeof reduce === 'function')) {                                      // 44
    throw new Error('Bad params given to reduceCallbacks');                                                          // 45
  }                                                                                                                  //
  cbRetVal = init;                                                                                                   // 43
  cbCount = 0;                                                                                                       // 43
  cbErr = null;                                                                                                      // 43
  return function(err, res) {                                                                                        // 49
    if (!cbErr) {                                                                                                    // 50
      if (err) {                                                                                                     // 51
        cbErr = err;                                                                                                 // 52
        return cb(err);                                                                                              //
      } else {                                                                                                       //
        cbCount++;                                                                                                   // 55
        cbRetVal = reduce(cbRetVal, res);                                                                            // 55
        if (cbCount === num) {                                                                                       // 57
          return cb(null, cbRetVal);                                                                                 //
        } else if (cbCount > num) {                                                                                  //
          throw new Error("reduceCallbacks callback invoked more than requested " + num + " times");                 // 60
        }                                                                                                            //
      }                                                                                                              //
    }                                                                                                                //
  };                                                                                                                 //
};                                                                                                                   // 42
                                                                                                                     //
concatReduce = function(a, b) {                                                                                      // 9
  if (!(a instanceof Array)) {                                                                                       // 63
    a = [a];                                                                                                         // 63
  }                                                                                                                  //
  return a.concat(b);                                                                                                //
};                                                                                                                   // 62
                                                                                                                     //
isInteger = function(i) {                                                                                            // 9
  return typeof i === 'number' && Math.floor(i) === i;                                                               //
};                                                                                                                   // 66
                                                                                                                     //
isBoolean = function(b) {                                                                                            // 9
  return typeof b === 'boolean';                                                                                     //
};                                                                                                                   // 68
                                                                                                                     //
_setImmediate = function() {                                                                                         // 9
  var args, func;                                                                                                    // 72
  func = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];                                 // 72
  if ((typeof Meteor !== "undefined" && Meteor !== null ? Meteor.setTimeout : void 0) != null) {                     // 72
    return Meteor.setTimeout.apply(Meteor, [func, 0].concat(slice.call(args)));                                      // 73
  } else if (typeof setImmediate !== "undefined" && setImmediate !== null) {                                         //
    return setImmediate.apply(null, [func].concat(slice.call(args)));                                                // 75
  } else {                                                                                                           //
    return setTimeout.apply(null, [func, 0].concat(slice.call(args)));                                               // 78
  }                                                                                                                  //
};                                                                                                                   // 71
                                                                                                                     //
_setInterval = function() {                                                                                          // 9
  var args, func, timeOut;                                                                                           // 81
  func = arguments[0], timeOut = arguments[1], args = 3 <= arguments.length ? slice.call(arguments, 2) : [];         // 81
  if ((typeof Meteor !== "undefined" && Meteor !== null ? Meteor.setInterval : void 0) != null) {                    // 81
    return Meteor.setInterval.apply(Meteor, [func, timeOut].concat(slice.call(args)));                               // 82
  } else {                                                                                                           //
    return setInterval.apply(null, [func, timeOut].concat(slice.call(args)));                                        // 85
  }                                                                                                                  //
};                                                                                                                   // 80
                                                                                                                     //
_clearInterval = function(id) {                                                                                      // 9
  if ((typeof Meteor !== "undefined" && Meteor !== null ? Meteor.clearInterval : void 0) != null) {                  // 88
    return Meteor.clearInterval(id);                                                                                 // 89
  } else {                                                                                                           //
    return clearInterval(id);                                                                                        // 92
  }                                                                                                                  //
};                                                                                                                   // 87
                                                                                                                     //
JobQueue = (function() {                                                                                             // 9
  function JobQueue() {                                                                                              // 98
    var k, options, ref, ref1, ref2, ref3, root1, type1, worker;                                                     // 99
    root1 = arguments[0], type1 = arguments[1], options = 4 <= arguments.length ? slice.call(arguments, 2, k = arguments.length - 1) : (k = 2, []), worker = arguments[k++];
    this.root = root1;                                                                                               // 99
    this.type = type1;                                                                                               // 99
    this.worker = worker;                                                                                            // 99
    if (!(this instanceof JobQueue)) {                                                                               // 99
      return (function(func, args, ctor) {                                                                           // 100
        ctor.prototype = func.prototype;                                                                             //
        var child = new ctor, result = func.apply(child, args);                                                      //
        return Object(result) === result ? result : child;                                                           //
      })(JobQueue, [this.root, this.type].concat(slice.call(options), [this.worker]), function(){});                 //
    }                                                                                                                //
    ref = optionsHelp(options, this.worker), options = ref[0], this.worker = ref[1];                                 // 99
    this.pollInterval = (options.pollInterval != null) && !options.pollInterval ? Job.forever : !((options.pollInterval != null) && isInteger(options.pollInterval)) ? 5000 : options.pollInterval;
    if (!(isInteger(this.pollInterval) && this.pollInterval >= 0)) {                                                 // 110
      throw new Error("JobQueue: Invalid pollInterval, must be a positive integer");                                 // 111
    }                                                                                                                //
    this.concurrency = (ref1 = options.concurrency) != null ? ref1 : 1;                                              // 99
    if (!(isInteger(this.concurrency) && this.concurrency >= 0)) {                                                   // 114
      throw new Error("JobQueue: Invalid concurrency, must be a positive integer");                                  // 115
    }                                                                                                                //
    this.payload = (ref2 = options.payload) != null ? ref2 : 1;                                                      // 99
    if (!(isInteger(this.payload) && this.payload >= 0)) {                                                           // 118
      throw new Error("JobQueue: Invalid payload, must be a positive integer");                                      // 119
    }                                                                                                                //
    this.prefetch = (ref3 = options.prefetch) != null ? ref3 : 0;                                                    // 99
    if (!(isInteger(this.prefetch) && this.prefetch >= 0)) {                                                         // 122
      throw new Error("JobQueue: Invalid prefetch, must be a positive integer");                                     // 123
    }                                                                                                                //
    this.workTimeout = options.workTimeout;                                                                          // 99
    if ((this.workTimeout != null) && !(isInteger(this.workTimeout) && this.workTimeout >= 0)) {                     // 126
      throw new Error("JobQueue: Invalid workTimeout, must be a positive integer");                                  // 127
    }                                                                                                                //
    this.callbackStrict = options.callbackStrict;                                                                    // 99
    if ((this.callbackStrict != null) && !isBoolean(this.callbackStrict)) {                                          // 130
      throw new Error("JobQueue: Invalid callbackStrict, must be a boolean");                                        // 131
    }                                                                                                                //
    this._workers = {};                                                                                              // 99
    this._tasks = [];                                                                                                // 99
    this._taskNumber = 0;                                                                                            // 99
    this._stoppingGetWork = void 0;                                                                                  // 99
    this._stoppingTasks = void 0;                                                                                    // 99
    this._interval = null;                                                                                           // 99
    this._getWorkOutstanding = false;                                                                                // 99
    this.paused = true;                                                                                              // 99
    this.resume();                                                                                                   // 99
  }                                                                                                                  //
                                                                                                                     //
  JobQueue.prototype._getWork = function() {                                                                         // 98
    var numJobsToGet, options;                                                                                       // 145
    if (!(this._getWorkOutstanding || this.paused)) {                                                                // 145
      numJobsToGet = this.prefetch + this.payload * (this.concurrency - this.running()) - this.length();             // 146
      if (numJobsToGet > 0) {                                                                                        // 147
        this._getWorkOutstanding = true;                                                                             // 148
        options = {                                                                                                  // 148
          maxJobs: numJobsToGet                                                                                      // 149
        };                                                                                                           //
        if (this.workTimeout != null) {                                                                              // 150
          options.workTimeout = this.workTimeout;                                                                    // 150
        }                                                                                                            //
        return Job.getWork(this.root, this.type, options, (function(_this) {                                         //
          return function(err, jobs) {                                                                               //
            var j, k, len;                                                                                           // 152
            _this._getWorkOutstanding = false;                                                                       // 152
            if (err) {                                                                                               // 153
              return console.error("JobQueue: Received error from getWork(): ", err);                                //
            } else if ((jobs != null) && jobs instanceof Array) {                                                    //
              if (jobs.length > numJobsToGet) {                                                                      // 156
                console.error("JobQueue: getWork() returned jobs (" + jobs.length + ") in excess of maxJobs (" + numJobsToGet + ")");
              }                                                                                                      //
              for (k = 0, len = jobs.length; k < len; k++) {                                                         // 158
                j = jobs[k];                                                                                         //
                _this._tasks.push(j);                                                                                // 159
                if (_this._stoppingGetWork == null) {                                                                // 160
                  _setImmediate(_this._process.bind(_this));                                                         // 160
                }                                                                                                    //
              }                                                                                                      // 158
              if (_this._stoppingGetWork != null) {                                                                  // 161
                return _this._stoppingGetWork();                                                                     //
              }                                                                                                      //
            } else {                                                                                                 //
              return console.error("JobQueue: Nonarray response from server from getWork()");                        //
            }                                                                                                        //
          };                                                                                                         //
        })(this));                                                                                                   //
      }                                                                                                              //
    }                                                                                                                //
  };                                                                                                                 //
                                                                                                                     //
  JobQueue.prototype._only_once = function(fn) {                                                                     // 98
    var called;                                                                                                      // 166
    called = false;                                                                                                  // 166
    return (function(_this) {                                                                                        // 167
      return function() {                                                                                            //
        if (called) {                                                                                                // 168
          console.error("Worker callback called multiple times in JobQueue");                                        // 169
          if (_this.callbackStrict) {                                                                                // 170
            throw new Error("JobQueue worker callback was invoked multiple times");                                  // 171
          }                                                                                                          //
        }                                                                                                            //
        called = true;                                                                                               // 168
        return fn.apply(_this, arguments);                                                                           //
      };                                                                                                             //
    })(this);                                                                                                        //
  };                                                                                                                 //
                                                                                                                     //
  JobQueue.prototype._process = function() {                                                                         // 98
    var cb, job, next;                                                                                               // 176
    if (!this.paused && this.running() < this.concurrency && this.length()) {                                        // 176
      if (this.payload > 1) {                                                                                        // 177
        job = this._tasks.splice(0, this.payload);                                                                   // 178
      } else {                                                                                                       //
        job = this._tasks.shift();                                                                                   // 180
      }                                                                                                              //
      job._taskId = "Task_" + (this._taskNumber++);                                                                  // 177
      this._workers[job._taskId] = job;                                                                              // 177
      next = (function(_this) {                                                                                      // 177
        return function() {                                                                                          //
          delete _this._workers[job._taskId];                                                                        // 184
          if ((_this._stoppingTasks != null) && _this.running() === 0 && _this.length() === 0) {                     // 185
            return _this._stoppingTasks();                                                                           //
          } else {                                                                                                   //
            _setImmediate(_this._process.bind(_this));                                                               // 188
            return _setImmediate(_this._getWork.bind(_this));                                                        //
          }                                                                                                          //
        };                                                                                                           //
      })(this);                                                                                                      //
      cb = this._only_once(next);                                                                                    // 177
      return this.worker(job, cb);                                                                                   //
    }                                                                                                                //
  };                                                                                                                 //
                                                                                                                     //
  JobQueue.prototype._stopGetWork = function(callback) {                                                             // 98
    _clearInterval(this._interval);                                                                                  // 194
    this._interval = null;                                                                                           // 194
    if (this._getWorkOutstanding) {                                                                                  // 196
      return this._stoppingGetWork = callback;                                                                       //
    } else {                                                                                                         //
      return _setImmediate(callback);                                                                                //
    }                                                                                                                //
  };                                                                                                                 //
                                                                                                                     //
  JobQueue.prototype._waitForTasks = function(callback) {                                                            // 98
    if (this.running() !== 0) {                                                                                      // 202
      return this._stoppingTasks = callback;                                                                         //
    } else {                                                                                                         //
      return _setImmediate(callback);                                                                                //
    }                                                                                                                //
  };                                                                                                                 //
                                                                                                                     //
  JobQueue.prototype._failJobs = function(tasks, callback) {                                                         // 98
    var count, job, k, len, results;                                                                                 // 208
    if (tasks.length === 0) {                                                                                        // 208
      _setImmediate(callback);                                                                                       // 208
    }                                                                                                                //
    count = 0;                                                                                                       // 208
    results = [];                                                                                                    // 210
    for (k = 0, len = tasks.length; k < len; k++) {                                                                  //
      job = tasks[k];                                                                                                //
      results.push(job.fail("Worker shutdown", (function(_this) {                                                    // 211
        return function(err, res) {                                                                                  //
          count++;                                                                                                   // 212
          if (count === tasks.length) {                                                                              // 213
            return callback();                                                                                       //
          }                                                                                                          //
        };                                                                                                           //
      })(this)));                                                                                                    //
    }                                                                                                                // 210
    return results;                                                                                                  //
  };                                                                                                                 //
                                                                                                                     //
  JobQueue.prototype._hard = function(callback) {                                                                    // 98
    this.paused = true;                                                                                              // 217
    return this._stopGetWork((function(_this) {                                                                      //
      return function() {                                                                                            //
        var i, r, ref, tasks;                                                                                        // 219
        tasks = _this._tasks;                                                                                        // 219
        _this._tasks = [];                                                                                           // 219
        ref = _this._workers;                                                                                        // 221
        for (i in ref) {                                                                                             // 221
          r = ref[i];                                                                                                //
          tasks = tasks.concat(r);                                                                                   // 222
        }                                                                                                            // 221
        return _this._failJobs(tasks, callback);                                                                     //
      };                                                                                                             //
    })(this));                                                                                                       //
  };                                                                                                                 //
                                                                                                                     //
  JobQueue.prototype._stop = function(callback) {                                                                    // 98
    this.paused = true;                                                                                              // 226
    return this._stopGetWork((function(_this) {                                                                      //
      return function() {                                                                                            //
        var tasks;                                                                                                   // 228
        tasks = _this._tasks;                                                                                        // 228
        _this._tasks = [];                                                                                           // 228
        return _this._waitForTasks(function() {                                                                      //
          return _this._failJobs(tasks, callback);                                                                   //
        });                                                                                                          //
      };                                                                                                             //
    })(this));                                                                                                       //
  };                                                                                                                 //
                                                                                                                     //
  JobQueue.prototype._soft = function(callback) {                                                                    // 98
    return this._stopGetWork((function(_this) {                                                                      //
      return function() {                                                                                            //
        return _this._waitForTasks(callback);                                                                        //
      };                                                                                                             //
    })(this));                                                                                                       //
  };                                                                                                                 //
                                                                                                                     //
  JobQueue.prototype.length = function() {                                                                           // 98
    return this._tasks.length;                                                                                       //
  };                                                                                                                 //
                                                                                                                     //
  JobQueue.prototype.running = function() {                                                                          // 98
    return Object.keys(this._workers).length;                                                                        //
  };                                                                                                                 //
                                                                                                                     //
  JobQueue.prototype.idle = function() {                                                                             // 98
    return this.length() + this.running() === 0;                                                                     //
  };                                                                                                                 //
                                                                                                                     //
  JobQueue.prototype.full = function() {                                                                             // 98
    return this.running() === this.concurrency;                                                                      //
  };                                                                                                                 //
                                                                                                                     //
  JobQueue.prototype.pause = function() {                                                                            // 98
    if (this.paused) {                                                                                               // 246
      return;                                                                                                        // 246
    }                                                                                                                //
    if (!(this.pollInterval >= Job.forever)) {                                                                       // 247
      _clearInterval(this._interval);                                                                                // 248
      this._interval = null;                                                                                         // 248
    }                                                                                                                //
    this.paused = true;                                                                                              // 246
    return this;                                                                                                     //
  };                                                                                                                 //
                                                                                                                     //
  JobQueue.prototype.resume = function() {                                                                           // 98
    var k, ref, w;                                                                                                   // 254
    if (!this.paused) {                                                                                              // 254
      return;                                                                                                        // 254
    }                                                                                                                //
    this.paused = false;                                                                                             // 254
    _setImmediate(this._getWork.bind(this));                                                                         // 254
    if (!(this.pollInterval >= Job.forever)) {                                                                       // 257
      this._interval = _setInterval(this._getWork.bind(this), this.pollInterval);                                    // 258
    }                                                                                                                //
    for (w = k = 1, ref = this.concurrency; 1 <= ref ? k <= ref : k >= ref; w = 1 <= ref ? ++k : --k) {              // 259
      _setImmediate(this._process.bind(this));                                                                       // 260
    }                                                                                                                // 259
    return this;                                                                                                     //
  };                                                                                                                 //
                                                                                                                     //
  JobQueue.prototype.trigger = function() {                                                                          // 98
    if (this.paused) {                                                                                               // 264
      return;                                                                                                        // 264
    }                                                                                                                //
    _setImmediate(this._getWork.bind(this));                                                                         // 264
    return this;                                                                                                     //
  };                                                                                                                 //
                                                                                                                     //
  JobQueue.prototype.shutdown = function() {                                                                         // 98
    var cb, k, options, ref;                                                                                         // 269
    options = 2 <= arguments.length ? slice.call(arguments, 0, k = arguments.length - 1) : (k = 0, []), cb = arguments[k++];
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];                                                   // 269
    if (options.level == null) {                                                                                     //
      options.level = 'normal';                                                                                      //
    }                                                                                                                //
    if (options.quiet == null) {                                                                                     //
      options.quiet = false;                                                                                         //
    }                                                                                                                //
    if (cb == null) {                                                                                                // 272
      if (!options.quiet) {                                                                                          // 273
        console.warn("using default shutdown callback!");                                                            // 273
      }                                                                                                              //
      cb = (function(_this) {                                                                                        // 273
        return function() {                                                                                          //
          return console.warn("Shutdown complete");                                                                  //
        };                                                                                                           //
      })(this);                                                                                                      //
    }                                                                                                                //
    switch (options.level) {                                                                                         // 276
      case 'hard':                                                                                                   // 276
        if (!options.quiet) {                                                                                        // 278
          console.warn("Shutting down hard");                                                                        // 278
        }                                                                                                            //
        return this._hard(cb);                                                                                       //
      case 'soft':                                                                                                   // 276
        if (!options.quiet) {                                                                                        // 281
          console.warn("Shutting down soft");                                                                        // 281
        }                                                                                                            //
        return this._soft(cb);                                                                                       //
      default:                                                                                                       // 276
        if (!options.quiet) {                                                                                        // 284
          console.warn("Shutting down normally");                                                                    // 284
        }                                                                                                            //
        return this._stop(cb);                                                                                       //
    }                                                                                                                // 276
  };                                                                                                                 //
                                                                                                                     //
  return JobQueue;                                                                                                   //
                                                                                                                     //
})();                                                                                                                //
                                                                                                                     //
Job = (function() {                                                                                                  // 9
  Job.forever = 9007199254740992;                                                                                    // 292
                                                                                                                     //
  Job.foreverDate = new Date(8640000000000000);                                                                      // 292
                                                                                                                     //
  Job.jobPriorities = {                                                                                              // 292
    low: 10,                                                                                                         // 298
    normal: 0,                                                                                                       // 298
    medium: -5,                                                                                                      // 298
    high: -10,                                                                                                       // 298
    critical: -15                                                                                                    // 298
  };                                                                                                                 //
                                                                                                                     //
  Job.jobRetryBackoffMethods = ['constant', 'exponential'];                                                          // 292
                                                                                                                     //
  Job.jobStatuses = ['waiting', 'paused', 'ready', 'running', 'failed', 'cancelled', 'completed'];                   // 292
                                                                                                                     //
  Job.jobLogLevels = ['info', 'success', 'warning', 'danger'];                                                       // 292
                                                                                                                     //
  Job.jobStatusCancellable = ['running', 'ready', 'waiting', 'paused'];                                              // 292
                                                                                                                     //
  Job.jobStatusPausable = ['ready', 'waiting'];                                                                      // 292
                                                                                                                     //
  Job.jobStatusRemovable = ['cancelled', 'completed', 'failed'];                                                     // 292
                                                                                                                     //
  Job.jobStatusRestartable = ['cancelled', 'failed'];                                                                // 292
                                                                                                                     //
  Job.ddpMethods = ['startJobs', 'stopJobs', 'startJobServer', 'shutdownJobServer', 'jobRemove', 'jobPause', 'jobResume', 'jobReady', 'jobCancel', 'jobRestart', 'jobSave', 'jobRerun', 'getWork', 'getJob', 'jobLog', 'jobProgress', 'jobDone', 'jobFail'];
                                                                                                                     //
  Job.ddpPermissionLevels = ['admin', 'manager', 'creator', 'worker'];                                               // 292
                                                                                                                     //
  Job.ddpMethodPermissions = {                                                                                       // 292
    'startJobs': ['startJobs', 'admin'],                                                                             // 326
    'stopJobs': ['stopJobs', 'admin'],                                                                               // 326
    'startJobServer': ['startJobServer', 'admin'],                                                                   // 326
    'shutdownJobServer': ['shutdownJobServer', 'admin'],                                                             // 326
    'jobRemove': ['jobRemove', 'admin', 'manager'],                                                                  // 326
    'jobPause': ['jobPause', 'admin', 'manager'],                                                                    // 326
    'jobResume': ['jobResume', 'admin', 'manager'],                                                                  // 326
    'jobCancel': ['jobCancel', 'admin', 'manager'],                                                                  // 326
    'jobReady': ['jobReady', 'admin', 'manager'],                                                                    // 326
    'jobRestart': ['jobRestart', 'admin', 'manager'],                                                                // 326
    'jobSave': ['jobSave', 'admin', 'creator'],                                                                      // 326
    'jobRerun': ['jobRerun', 'admin', 'creator'],                                                                    // 326
    'getWork': ['getWork', 'admin', 'worker'],                                                                       // 326
    'getJob': ['getJob', 'admin', 'worker'],                                                                         // 326
    'jobLog': ['jobLog', 'admin', 'worker'],                                                                         // 326
    'jobProgress': ['jobProgress', 'admin', 'worker'],                                                               // 326
    'jobDone': ['jobDone', 'admin', 'worker'],                                                                       // 326
    'jobFail': ['jobFail', 'admin', 'worker']                                                                        // 326
  };                                                                                                                 //
                                                                                                                     //
  Job._ddp_apply = void 0;                                                                                           // 292
                                                                                                                     //
  Job._setDDPApply = function(apply, collectionName) {                                                               // 292
    if (typeof apply === 'function') {                                                                               // 351
      if (typeof collectionName === 'string') {                                                                      // 352
        if (this._ddp_apply == null) {                                                                               //
          this._ddp_apply = {};                                                                                      //
        }                                                                                                            //
        if (typeof this._ddp_apply === 'function') {                                                                 // 354
          throw new Error("Job.setDDP must specify a collection name each time if called more than once.");          // 355
        }                                                                                                            //
        return this._ddp_apply[collectionName] = apply;                                                              //
      } else if (!this._ddp_apply) {                                                                                 //
        return this._ddp_apply = apply;                                                                              //
      } else {                                                                                                       //
        throw new Error("Job.setDDP must specify a collection name each time if called more than once.");            // 360
      }                                                                                                              //
    } else {                                                                                                         //
      throw new Error("Bad function in Job.setDDPApply()");                                                          // 362
    }                                                                                                                //
  };                                                                                                                 //
                                                                                                                     //
  Job.setDDP = function(ddp, collectionNames, Fiber) {                                                               // 292
    var collName, k, len, results;                                                                                   // 366
    if (ddp == null) {                                                                                               //
      ddp = null;                                                                                                    //
    }                                                                                                                //
    if (collectionNames == null) {                                                                                   //
      collectionNames = null;                                                                                        //
    }                                                                                                                //
    if (Fiber == null) {                                                                                             //
      Fiber = null;                                                                                                  //
    }                                                                                                                //
    if (!((typeof collectionNames === 'string') || (collectionNames instanceof Array))) {                            // 366
      Fiber = collectionNames;                                                                                       // 368
      collectionNames = [void 0];                                                                                    // 368
    } else if (typeof collectionNames === 'string') {                                                                //
      collectionNames = [collectionNames];                                                                           // 372
    }                                                                                                                //
    results = [];                                                                                                    // 373
    for (k = 0, len = collectionNames.length; k < len; k++) {                                                        //
      collName = collectionNames[k];                                                                                 //
      if (!((ddp != null) && (ddp.close != null) && (ddp.subscribe != null))) {                                      // 374
        if (ddp === null && ((typeof Meteor !== "undefined" && Meteor !== null ? Meteor.apply : void 0) != null)) {  // 376
          results.push(this._setDDPApply(Meteor.apply, collName));                                                   //
        } else {                                                                                                     //
          throw new Error("Bad ddp object in Job.setDDP()");                                                         // 381
        }                                                                                                            //
      } else if (ddp.observe == null) {                                                                              //
        results.push(this._setDDPApply(ddp.apply.bind(ddp), collName));                                              //
      } else {                                                                                                       //
        if (Fiber == null) {                                                                                         // 385
          results.push(this._setDDPApply(ddp.call.bind(ddp), collName));                                             //
        } else {                                                                                                     //
          results.push(this._setDDPApply((function(name, params, cb) {                                               //
            var fib;                                                                                                 // 391
            fib = Fiber.current;                                                                                     // 391
            ddp.call(name, params, function(err, res) {                                                              // 391
              if ((cb != null) && typeof cb === 'function') {                                                        // 393
                return cb(err, res);                                                                                 //
              } else {                                                                                               //
                if (err) {                                                                                           // 396
                  return fib.throwInto(err);                                                                         //
                } else {                                                                                             //
                  return fib.run(res);                                                                               //
                }                                                                                                    //
              }                                                                                                      //
            });                                                                                                      //
            if ((cb != null) && typeof cb === 'function') {                                                          // 400
                                                                                                                     // 400
            } else {                                                                                                 //
              return Fiber["yield"]();                                                                               // 403
            }                                                                                                        //
          }), collName));                                                                                            //
        }                                                                                                            //
      }                                                                                                              //
    }                                                                                                                // 373
    return results;                                                                                                  //
  };                                                                                                                 //
                                                                                                                     //
  Job.getWork = function() {                                                                                         // 292
    var cb, k, options, ref, root, type;                                                                             // 410
    root = arguments[0], type = arguments[1], options = 4 <= arguments.length ? slice.call(arguments, 2, k = arguments.length - 1) : (k = 2, []), cb = arguments[k++];
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];                                                   // 410
    if (typeof type === 'string') {                                                                                  // 411
      type = [type];                                                                                                 // 411
    }                                                                                                                //
    if (options.workTimeout != null) {                                                                               // 412
      if (!(isInteger(options.workTimeout) && options.workTimeout > 0)) {                                            // 413
        throw new Error('getWork: workTimeout must be a positive integer');                                          // 414
      }                                                                                                              //
    }                                                                                                                //
    return methodCall(root, "getWork", [type, options], cb, (function(_this) {                                       //
      return function(res) {                                                                                         //
        var doc, jobs;                                                                                               // 416
        jobs = ((function() {                                                                                        // 416
          var l, len, results;                                                                                       //
          results = [];                                                                                              // 416
          for (l = 0, len = res.length; l < len; l++) {                                                              //
            doc = res[l];                                                                                            //
            results.push(new Job(root, doc));                                                                        // 416
          }                                                                                                          // 416
          return results;                                                                                            //
        })()) || [];                                                                                                 //
        if (options.maxJobs != null) {                                                                               // 417
          return jobs;                                                                                               // 418
        } else {                                                                                                     //
          return jobs[0];                                                                                            // 420
        }                                                                                                            //
      };                                                                                                             //
    })(this));                                                                                                       //
  };                                                                                                                 //
                                                                                                                     //
  Job.processJobs = JobQueue;                                                                                        // 292
                                                                                                                     //
  Job.makeJob = (function() {                                                                                        // 292
    var depFlag;                                                                                                     // 428
    depFlag = false;                                                                                                 // 428
    return function(root, doc) {                                                                                     //
      if (!depFlag) {                                                                                                // 430
        depFlag = true;                                                                                              // 431
        console.warn("Job.makeJob(root, jobDoc) has been deprecated and will be removed in a future release, use 'new Job(root, jobDoc)' instead.");
      }                                                                                                              //
      return new Job(root, doc);                                                                                     //
    };                                                                                                               //
  })();                                                                                                              //
                                                                                                                     //
  Job.getJob = function() {                                                                                          // 292
    var cb, id, k, options, ref, root;                                                                               // 438
    root = arguments[0], id = arguments[1], options = 4 <= arguments.length ? slice.call(arguments, 2, k = arguments.length - 1) : (k = 2, []), cb = arguments[k++];
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];                                                   // 438
    if (options.getLog == null) {                                                                                    //
      options.getLog = false;                                                                                        //
    }                                                                                                                //
    return methodCall(root, "getJob", [id, options], cb, (function(_this) {                                          //
      return function(doc) {                                                                                         //
        if (doc) {                                                                                                   // 441
          return new Job(root, doc);                                                                                 //
        } else {                                                                                                     //
          return void 0;                                                                                             //
        }                                                                                                            //
      };                                                                                                             //
    })(this));                                                                                                       //
  };                                                                                                                 //
                                                                                                                     //
  Job.getJobs = function() {                                                                                         // 292
    var cb, chunkOfIds, chunksOfIds, ids, k, l, len, myCb, options, ref, retVal, root;                               // 448
    root = arguments[0], ids = arguments[1], options = 4 <= arguments.length ? slice.call(arguments, 2, k = arguments.length - 1) : (k = 2, []), cb = arguments[k++];
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];                                                   // 448
    if (options.getLog == null) {                                                                                    //
      options.getLog = false;                                                                                        //
    }                                                                                                                //
    retVal = [];                                                                                                     // 448
    chunksOfIds = splitLongArray(ids, 32);                                                                           // 448
    myCb = reduceCallbacks(cb, chunksOfIds.length, concatReduce, []);                                                // 448
    for (l = 0, len = chunksOfIds.length; l < len; l++) {                                                            // 453
      chunkOfIds = chunksOfIds[l];                                                                                   //
      retVal = retVal.concat(methodCall(root, "getJob", [chunkOfIds, options], myCb, (function(_this) {              // 454
        return function(doc) {                                                                                       //
          var d, len1, m, results;                                                                                   // 455
          if (doc) {                                                                                                 // 455
            results = [];                                                                                            // 456
            for (m = 0, len1 = doc.length; m < len1; m++) {                                                          //
              d = doc[m];                                                                                            //
              results.push(new Job(root, d.type, d.data, d));                                                        // 456
            }                                                                                                        // 456
            return results;                                                                                          //
          } else {                                                                                                   //
            return null;                                                                                             //
          }                                                                                                          //
        };                                                                                                           //
      })(this)));                                                                                                    //
    }                                                                                                                // 453
    return retVal;                                                                                                   // 459
  };                                                                                                                 //
                                                                                                                     //
  Job.pauseJobs = function() {                                                                                       // 292
    var cb, chunkOfIds, chunksOfIds, ids, k, l, len, myCb, options, ref, retVal, root;                               // 464
    root = arguments[0], ids = arguments[1], options = 4 <= arguments.length ? slice.call(arguments, 2, k = arguments.length - 1) : (k = 2, []), cb = arguments[k++];
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];                                                   // 464
    retVal = false;                                                                                                  // 464
    chunksOfIds = splitLongArray(ids, 256);                                                                          // 464
    myCb = reduceCallbacks(cb, chunksOfIds.length);                                                                  // 464
    for (l = 0, len = chunksOfIds.length; l < len; l++) {                                                            // 468
      chunkOfIds = chunksOfIds[l];                                                                                   //
      retVal = methodCall(root, "jobPause", [chunkOfIds, options], myCb) || retVal;                                  // 469
    }                                                                                                                // 468
    return retVal;                                                                                                   // 470
  };                                                                                                                 //
                                                                                                                     //
  Job.resumeJobs = function() {                                                                                      // 292
    var cb, chunkOfIds, chunksOfIds, ids, k, l, len, myCb, options, ref, retVal, root;                               // 475
    root = arguments[0], ids = arguments[1], options = 4 <= arguments.length ? slice.call(arguments, 2, k = arguments.length - 1) : (k = 2, []), cb = arguments[k++];
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];                                                   // 475
    retVal = false;                                                                                                  // 475
    chunksOfIds = splitLongArray(ids, 256);                                                                          // 475
    myCb = reduceCallbacks(cb, chunksOfIds.length);                                                                  // 475
    for (l = 0, len = chunksOfIds.length; l < len; l++) {                                                            // 479
      chunkOfIds = chunksOfIds[l];                                                                                   //
      retVal = methodCall(root, "jobResume", [chunkOfIds, options], myCb) || retVal;                                 // 480
    }                                                                                                                // 479
    return retVal;                                                                                                   // 481
  };                                                                                                                 //
                                                                                                                     //
  Job.readyJobs = function() {                                                                                       // 292
    var cb, chunkOfIds, chunksOfIds, ids, k, l, len, myCb, options, ref, retVal, root;                               // 486
    root = arguments[0], ids = arguments[1], options = 4 <= arguments.length ? slice.call(arguments, 2, k = arguments.length - 1) : (k = 2, []), cb = arguments[k++];
    if (ids == null) {                                                                                               //
      ids = [];                                                                                                      //
    }                                                                                                                //
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];                                                   // 486
    if (options.force == null) {                                                                                     //
      options.force = false;                                                                                         //
    }                                                                                                                //
    retVal = false;                                                                                                  // 486
    chunksOfIds = splitLongArray(ids, 256);                                                                          // 486
    if (!(chunksOfIds.length > 0)) {                                                                                 // 490
      chunksOfIds = [[]];                                                                                            // 490
    }                                                                                                                //
    myCb = reduceCallbacks(cb, chunksOfIds.length);                                                                  // 486
    for (l = 0, len = chunksOfIds.length; l < len; l++) {                                                            // 492
      chunkOfIds = chunksOfIds[l];                                                                                   //
      retVal = methodCall(root, "jobReady", [chunkOfIds, options], myCb) || retVal;                                  // 493
    }                                                                                                                // 492
    return retVal;                                                                                                   // 494
  };                                                                                                                 //
                                                                                                                     //
  Job.cancelJobs = function() {                                                                                      // 292
    var cb, chunkOfIds, chunksOfIds, ids, k, l, len, myCb, options, ref, retVal, root;                               // 498
    root = arguments[0], ids = arguments[1], options = 4 <= arguments.length ? slice.call(arguments, 2, k = arguments.length - 1) : (k = 2, []), cb = arguments[k++];
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];                                                   // 498
    if (options.antecedents == null) {                                                                               //
      options.antecedents = true;                                                                                    //
    }                                                                                                                //
    retVal = false;                                                                                                  // 498
    chunksOfIds = splitLongArray(ids, 256);                                                                          // 498
    myCb = reduceCallbacks(cb, chunksOfIds.length);                                                                  // 498
    for (l = 0, len = chunksOfIds.length; l < len; l++) {                                                            // 503
      chunkOfIds = chunksOfIds[l];                                                                                   //
      retVal = methodCall(root, "jobCancel", [chunkOfIds, options], myCb) || retVal;                                 // 504
    }                                                                                                                // 503
    return retVal;                                                                                                   // 505
  };                                                                                                                 //
                                                                                                                     //
  Job.restartJobs = function() {                                                                                     // 292
    var cb, chunkOfIds, chunksOfIds, ids, k, l, len, myCb, options, ref, retVal, root;                               // 509
    root = arguments[0], ids = arguments[1], options = 4 <= arguments.length ? slice.call(arguments, 2, k = arguments.length - 1) : (k = 2, []), cb = arguments[k++];
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];                                                   // 509
    if (options.retries == null) {                                                                                   //
      options.retries = 1;                                                                                           //
    }                                                                                                                //
    if (options.dependents == null) {                                                                                //
      options.dependents = true;                                                                                     //
    }                                                                                                                //
    retVal = false;                                                                                                  // 509
    chunksOfIds = splitLongArray(ids, 256);                                                                          // 509
    myCb = reduceCallbacks(cb, chunksOfIds.length);                                                                  // 509
    for (l = 0, len = chunksOfIds.length; l < len; l++) {                                                            // 515
      chunkOfIds = chunksOfIds[l];                                                                                   //
      retVal = methodCall(root, "jobRestart", [chunkOfIds, options], myCb) || retVal;                                // 516
    }                                                                                                                // 515
    return retVal;                                                                                                   // 517
  };                                                                                                                 //
                                                                                                                     //
  Job.removeJobs = function() {                                                                                      // 292
    var cb, chunkOfIds, chunksOfIds, ids, k, l, len, myCb, options, ref, retVal, root;                               // 521
    root = arguments[0], ids = arguments[1], options = 4 <= arguments.length ? slice.call(arguments, 2, k = arguments.length - 1) : (k = 2, []), cb = arguments[k++];
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];                                                   // 521
    retVal = false;                                                                                                  // 521
    chunksOfIds = splitLongArray(ids, 256);                                                                          // 521
    myCb = reduceCallbacks(cb, chunksOfIds.length);                                                                  // 521
    for (l = 0, len = chunksOfIds.length; l < len; l++) {                                                            // 525
      chunkOfIds = chunksOfIds[l];                                                                                   //
      retVal = methodCall(root, "jobRemove", [chunkOfIds, options], myCb) || retVal;                                 // 526
    }                                                                                                                // 525
    return retVal;                                                                                                   // 527
  };                                                                                                                 //
                                                                                                                     //
  Job.startJobs = function() {                                                                                       // 292
    var cb, k, options, ref, root;                                                                                   // 532
    root = arguments[0], options = 3 <= arguments.length ? slice.call(arguments, 1, k = arguments.length - 1) : (k = 1, []), cb = arguments[k++];
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];                                                   // 532
    return methodCall(root, "startJobs", [options], cb);                                                             //
  };                                                                                                                 //
                                                                                                                     //
  Job.stopJobs = function() {                                                                                        // 292
    var cb, k, options, ref, root;                                                                                   // 538
    root = arguments[0], options = 3 <= arguments.length ? slice.call(arguments, 1, k = arguments.length - 1) : (k = 1, []), cb = arguments[k++];
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];                                                   // 538
    if (options.timeout == null) {                                                                                   //
      options.timeout = 60 * 1000;                                                                                   //
    }                                                                                                                //
    return methodCall(root, "stopJobs", [options], cb);                                                              //
  };                                                                                                                 //
                                                                                                                     //
  Job.startJobServer = function() {                                                                                  // 292
    var cb, k, options, ref, root;                                                                                   // 544
    root = arguments[0], options = 3 <= arguments.length ? slice.call(arguments, 1, k = arguments.length - 1) : (k = 1, []), cb = arguments[k++];
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];                                                   // 544
    return methodCall(root, "startJobServer", [options], cb);                                                        //
  };                                                                                                                 //
                                                                                                                     //
  Job.shutdownJobServer = function() {                                                                               // 292
    var cb, k, options, ref, root;                                                                                   // 549
    root = arguments[0], options = 3 <= arguments.length ? slice.call(arguments, 1, k = arguments.length - 1) : (k = 1, []), cb = arguments[k++];
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];                                                   // 549
    if (options.timeout == null) {                                                                                   //
      options.timeout = 60 * 1000;                                                                                   //
    }                                                                                                                //
    return methodCall(root, "shutdownJobServer", [options], cb);                                                     //
  };                                                                                                                 //
                                                                                                                     //
  function Job(root1, type, data) {                                                                                  // 554
    var doc, ref, time;                                                                                              // 555
    this.root = root1;                                                                                               // 555
    if (!(this instanceof Job)) {                                                                                    // 555
      return new Job(this.root, type, data);                                                                         // 556
    }                                                                                                                //
    this._root = this.root;                                                                                          // 555
    if ((((ref = this.root) != null ? ref.root : void 0) != null) && typeof this.root.root === 'string') {           // 562
      this.root = this._root.root;                                                                                   // 563
    }                                                                                                                //
    if ((data == null) && ((type != null ? type.data : void 0) != null) && ((type != null ? type.type : void 0) != null)) {
      if (type instanceof Job) {                                                                                     // 567
        return type;                                                                                                 // 568
      }                                                                                                              //
      doc = type;                                                                                                    // 567
      data = doc.data;                                                                                               // 567
      type = doc.type;                                                                                               // 567
    } else {                                                                                                         //
      doc = {};                                                                                                      // 574
    }                                                                                                                //
    if (!(typeof doc === 'object' && typeof data === 'object' && typeof type === 'string' && typeof this.root === 'string')) {
      throw new Error("new Job: bad parameter(s), " + this.root + " (" + (typeof this.root) + "), " + type + " (" + (typeof type) + "), " + data + " (" + (typeof data) + "), " + doc + " (" + (typeof doc) + ")");
    } else if ((doc.type != null) && (doc.data != null)) {                                                           //
      this._doc = doc;                                                                                               // 583
    } else {                                                                                                         //
      time = new Date();                                                                                             // 586
      this._doc = {                                                                                                  // 586
        runId: null,                                                                                                 // 588
        type: type,                                                                                                  // 588
        data: data,                                                                                                  // 588
        status: 'waiting',                                                                                           // 588
        updated: time,                                                                                               // 588
        created: time                                                                                                // 588
      };                                                                                                             //
      this.priority().retry().repeat().after().progress().depends().log("Constructed");                              // 586
    }                                                                                                                //
    return this;                                                                                                     // 596
  }                                                                                                                  //
                                                                                                                     //
  Job.prototype._echo = function(message, level) {                                                                   // 292
    if (level == null) {                                                                                             //
      level = null;                                                                                                  //
    }                                                                                                                //
    switch (level) {                                                                                                 // 600
      case 'danger':                                                                                                 // 600
        console.error(message);                                                                                      // 601
        break;                                                                                                       // 601
      case 'warning':                                                                                                // 600
        console.warn(message);                                                                                       // 602
        break;                                                                                                       // 602
      case 'success':                                                                                                // 600
        console.log(message);                                                                                        // 603
        break;                                                                                                       // 603
      default:                                                                                                       // 600
        console.info(message);                                                                                       // 604
    }                                                                                                                // 600
  };                                                                                                                 //
                                                                                                                     //
  Job.prototype.depends = function(jobs) {                                                                           // 292
    var depends, j, k, len;                                                                                          // 610
    if (jobs) {                                                                                                      // 610
      if (jobs instanceof Job) {                                                                                     // 611
        jobs = [jobs];                                                                                               // 612
      }                                                                                                              //
      if (jobs instanceof Array) {                                                                                   // 613
        depends = this._doc.depends;                                                                                 // 614
        for (k = 0, len = jobs.length; k < len; k++) {                                                               // 615
          j = jobs[k];                                                                                               //
          if (!(j instanceof Job && (j._doc._id != null))) {                                                         // 616
            throw new Error('Each provided object must be a saved Job instance (with an _id)');                      // 617
          }                                                                                                          //
          depends.push(j._doc._id);                                                                                  // 616
        }                                                                                                            // 615
      } else {                                                                                                       //
        throw new Error('Bad input parameter: depends() accepts a falsy value, or Job or array of Jobs');            // 620
      }                                                                                                              //
    } else {                                                                                                         //
      depends = [];                                                                                                  // 622
    }                                                                                                                //
    this._doc.depends = depends;                                                                                     // 610
    this._doc.resolved = [];                                                                                         // 610
    return this;                                                                                                     // 625
  };                                                                                                                 //
                                                                                                                     //
  Job.prototype.priority = function(level) {                                                                         // 292
    var priority;                                                                                                    // 629
    if (level == null) {                                                                                             //
      level = 0;                                                                                                     //
    }                                                                                                                //
    if (typeof level === 'string') {                                                                                 // 629
      priority = Job.jobPriorities[level];                                                                           // 630
      if (priority == null) {                                                                                        // 631
        throw new Error('Invalid string priority level provided');                                                   // 632
      }                                                                                                              //
    } else if (isInteger(level)) {                                                                                   //
      priority = level;                                                                                              // 634
    } else {                                                                                                         //
      throw new Error('priority must be an integer or valid priority level');                                        // 636
      priority = 0;                                                                                                  // 636
    }                                                                                                                //
    this._doc.priority = priority;                                                                                   // 629
    return this;                                                                                                     // 639
  };                                                                                                                 //
                                                                                                                     //
  Job.prototype.retry = function(options) {                                                                          // 292
    var base, ref;                                                                                                   // 645
    if (options == null) {                                                                                           //
      options = 0;                                                                                                   //
    }                                                                                                                //
    if (isInteger(options) && options >= 0) {                                                                        // 645
      options = {                                                                                                    // 646
        retries: options                                                                                             // 646
      };                                                                                                             //
    }                                                                                                                //
    if (typeof options !== 'object') {                                                                               // 647
      throw new Error('bad parameter: accepts either an integer >= 0 or an options object');                         // 648
    }                                                                                                                //
    if (options.retries != null) {                                                                                   // 649
      if (!(isInteger(options.retries) && options.retries >= 0)) {                                                   // 650
        throw new Error('bad option: retries must be an integer >= 0');                                              // 651
      }                                                                                                              //
      options.retries++;                                                                                             // 650
    } else {                                                                                                         //
      options.retries = Job.forever;                                                                                 // 654
    }                                                                                                                //
    if (options.until != null) {                                                                                     // 655
      if (!(options.until instanceof Date)) {                                                                        // 656
        throw new Error('bad option: until must be a Date object');                                                  // 657
      }                                                                                                              //
    } else {                                                                                                         //
      options.until = Job.foreverDate;                                                                               // 659
    }                                                                                                                //
    if (options.wait != null) {                                                                                      // 660
      if (!(isInteger(options.wait) && options.wait >= 0)) {                                                         // 661
        throw new Error('bad option: wait must be an integer >= 0');                                                 // 662
      }                                                                                                              //
    } else {                                                                                                         //
      options.wait = 5 * 60 * 1000;                                                                                  // 664
    }                                                                                                                //
    if (options.backoff != null) {                                                                                   // 665
      if (ref = options.backoff, indexOf.call(Job.jobRetryBackoffMethods, ref) < 0) {                                // 666
        throw new Error('bad option: invalid retry backoff method');                                                 // 667
      }                                                                                                              //
    } else {                                                                                                         //
      options.backoff = 'constant';                                                                                  // 669
    }                                                                                                                //
    this._doc.retries = options.retries;                                                                             // 645
    this._doc.repeatRetries = options.retries;                                                                       // 645
    this._doc.retryWait = options.wait;                                                                              // 645
    if ((base = this._doc).retried == null) {                                                                        //
      base.retried = 0;                                                                                              //
    }                                                                                                                //
    this._doc.retryBackoff = options.backoff;                                                                        // 645
    this._doc.retryUntil = options.until;                                                                            // 645
    return this;                                                                                                     // 677
  };                                                                                                                 //
                                                                                                                     //
  Job.prototype.repeat = function(options) {                                                                         // 292
    var base, ref;                                                                                                   // 683
    if (options == null) {                                                                                           //
      options = 0;                                                                                                   //
    }                                                                                                                //
    if (isInteger(options) && options >= 0) {                                                                        // 683
      options = {                                                                                                    // 684
        repeats: options                                                                                             // 684
      };                                                                                                             //
    }                                                                                                                //
    if (typeof options !== 'object') {                                                                               // 685
      throw new Error('bad parameter: accepts either an integer >= 0 or an options object');                         // 686
    }                                                                                                                //
    if ((options.wait != null) && (options.schedule != null)) {                                                      // 687
      throw new Error('bad options: wait and schedule options are mutually exclusive');                              // 688
    }                                                                                                                //
    if (options.repeats != null) {                                                                                   // 689
      if (!(isInteger(options.repeats) && options.repeats >= 0)) {                                                   // 690
        throw new Error('bad option: repeats must be an integer >= 0');                                              // 691
      }                                                                                                              //
    } else {                                                                                                         //
      options.repeats = Job.forever;                                                                                 // 693
    }                                                                                                                //
    if (options.until != null) {                                                                                     // 694
      if (!(options.until instanceof Date)) {                                                                        // 695
        throw new Error('bad option: until must be a Date object');                                                  // 696
      }                                                                                                              //
    } else {                                                                                                         //
      options.until = Job.foreverDate;                                                                               // 698
    }                                                                                                                //
    if (options.wait != null) {                                                                                      // 699
      if (!(isInteger(options.wait) && options.wait >= 0)) {                                                         // 700
        throw new Error('bad option: wait must be an integer >= 0');                                                 // 701
      }                                                                                                              //
    } else {                                                                                                         //
      options.wait = 5 * 60 * 1000;                                                                                  // 703
    }                                                                                                                //
    if (options.schedule != null) {                                                                                  // 704
      if (typeof options.schedule !== 'object') {                                                                    // 705
        throw new Error('bad option, schedule option must be an object');                                            // 706
      }                                                                                                              //
      if (!((((ref = options.schedule) != null ? ref.schedules : void 0) != null) && options.schedule.schedules instanceof Array)) {
        throw new Error('bad option, schedule object requires a schedules attribute of type Array.');                // 708
      }                                                                                                              //
      if ((options.schedule.exceptions != null) && !(options.schedule.exceptions instanceof Array)) {                // 709
        throw new Error('bad option, schedule object exceptions attribute must be an Array');                        // 710
      }                                                                                                              //
      options.wait = {                                                                                               // 705
        schedules: options.schedule.schedules,                                                                       // 712
        exceptions: options.schedule.exceptions                                                                      // 712
      };                                                                                                             //
    }                                                                                                                //
    this._doc.repeats = options.repeats;                                                                             // 683
    this._doc.repeatWait = options.wait;                                                                             // 683
    if ((base = this._doc).repeated == null) {                                                                       //
      base.repeated = 0;                                                                                             //
    }                                                                                                                //
    this._doc.repeatUntil = options.until;                                                                           // 683
    return this;                                                                                                     // 719
  };                                                                                                                 //
                                                                                                                     //
  Job.prototype.delay = function(wait) {                                                                             // 292
    if (wait == null) {                                                                                              //
      wait = 0;                                                                                                      //
    }                                                                                                                //
    if (!(isInteger(wait) && wait >= 0)) {                                                                           // 723
      throw new Error('Bad parameter, delay requires a non-negative integer.');                                      // 724
    }                                                                                                                //
    return this.after(new Date(new Date().valueOf() + wait));                                                        // 725
  };                                                                                                                 //
                                                                                                                     //
  Job.prototype.after = function(time) {                                                                             // 292
    var after;                                                                                                       // 729
    if (time == null) {                                                                                              //
      time = new Date(0);                                                                                            //
    }                                                                                                                //
    if (typeof time === 'object' && time instanceof Date) {                                                          // 729
      after = time;                                                                                                  // 730
    } else {                                                                                                         //
      throw new Error('Bad parameter, after requires a valid Date object');                                          // 732
    }                                                                                                                //
    this._doc.after = after;                                                                                         // 729
    return this;                                                                                                     // 734
  };                                                                                                                 //
                                                                                                                     //
  Job.prototype.log = function() {                                                                                   // 292
    var base, cb, k, message, options, ref, ref1;                                                                    // 738
    message = arguments[0], options = 3 <= arguments.length ? slice.call(arguments, 1, k = arguments.length - 1) : (k = 1, []), cb = arguments[k++];
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];                                                   // 738
    if (options.level == null) {                                                                                     //
      options.level = 'info';                                                                                        //
    }                                                                                                                //
    if (typeof message !== 'string') {                                                                               // 740
      throw new Error('Log message must be a string');                                                               // 741
    }                                                                                                                //
    if (!(typeof options.level === 'string' && (ref1 = options.level, indexOf.call(Job.jobLogLevels, ref1) >= 0))) {
      throw new Error('Log level options must be one of Job.jobLogLevels');                                          // 743
    }                                                                                                                //
    if (options.echo != null) {                                                                                      // 744
      if (options.echo && Job.jobLogLevels.indexOf(options.level) >= Job.jobLogLevels.indexOf(options.echo)) {       // 745
        this._echo("LOG: " + options.level + ", " + this._doc._id + " " + this._doc.runId + ": " + message, options.level);
      }                                                                                                              //
      delete options.echo;                                                                                           // 745
    }                                                                                                                //
    if (this._doc._id != null) {                                                                                     // 748
      return methodCall(this._root, "jobLog", [this._doc._id, this._doc.runId, message, options], cb);               // 749
    } else {                                                                                                         //
      if ((base = this._doc).log == null) {                                                                          //
        base.log = [];                                                                                               //
      }                                                                                                              //
      this._doc.log.push({                                                                                           // 751
        time: new Date(),                                                                                            // 752
        runId: null,                                                                                                 // 752
        level: options.level,                                                                                        // 752
        message: message                                                                                             // 752
      });                                                                                                            //
      if ((cb != null) && typeof cb === 'function') {                                                                // 753
        _setImmediate(cb, null, true);                                                                               // 754
      }                                                                                                              //
      return this;                                                                                                   // 755
    }                                                                                                                //
  };                                                                                                                 //
                                                                                                                     //
  Job.prototype.progress = function() {                                                                              // 292
    var cb, completed, k, options, progress, ref, total;                                                             // 760
    completed = arguments[0], total = arguments[1], options = 4 <= arguments.length ? slice.call(arguments, 2, k = arguments.length - 1) : (k = 2, []), cb = arguments[k++];
    if (completed == null) {                                                                                         //
      completed = 0;                                                                                                 //
    }                                                                                                                //
    if (total == null) {                                                                                             //
      total = 1;                                                                                                     //
    }                                                                                                                //
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];                                                   // 760
    if (typeof completed === 'number' && typeof total === 'number' && completed >= 0 && total > 0 && total >= completed) {
      progress = {                                                                                                   // 766
        completed: completed,                                                                                        // 767
        total: total,                                                                                                // 767
        percent: 100 * completed / total                                                                             // 767
      };                                                                                                             //
      if (options.echo) {                                                                                            // 770
        delete options.echo;                                                                                         // 771
        this._echo("PROGRESS: " + this._doc._id + " " + this._doc.runId + ": " + progress.completed + " out of " + progress.total + " (" + progress.percent + "%)");
      }                                                                                                              //
      if ((this._doc._id != null) && (this._doc.runId != null)) {                                                    // 773
        return methodCall(this._root, "jobProgress", [this._doc._id, this._doc.runId, completed, total, options], cb, (function(_this) {
          return function(res) {                                                                                     //
            if (res) {                                                                                               // 775
              _this._doc.progress = progress;                                                                        // 776
            }                                                                                                        //
            return res;                                                                                              //
          };                                                                                                         //
        })(this));                                                                                                   //
      } else if (this._doc._id == null) {                                                                            //
        this._doc.progress = progress;                                                                               // 779
        if ((cb != null) && typeof cb === 'function') {                                                              // 780
          _setImmediate(cb, null, true);                                                                             // 781
        }                                                                                                            //
        return this;                                                                                                 // 782
      }                                                                                                              //
    } else {                                                                                                         //
      throw new Error("job.progress: something is wrong with progress params: " + this.id + ", " + completed + " out of " + total);
    }                                                                                                                //
    return null;                                                                                                     // 785
  };                                                                                                                 //
                                                                                                                     //
  Job.prototype.save = function() {                                                                                  // 292
    var cb, k, options, ref;                                                                                         // 790
    options = 2 <= arguments.length ? slice.call(arguments, 0, k = arguments.length - 1) : (k = 0, []), cb = arguments[k++];
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];                                                   // 790
    return methodCall(this._root, "jobSave", [this._doc, options], cb, (function(_this) {                            // 791
      return function(id) {                                                                                          //
        if (id) {                                                                                                    // 792
          _this._doc._id = id;                                                                                       // 793
        }                                                                                                            //
        return id;                                                                                                   //
      };                                                                                                             //
    })(this));                                                                                                       //
  };                                                                                                                 //
                                                                                                                     //
  Job.prototype.refresh = function() {                                                                               // 292
    var cb, k, options, ref;                                                                                         // 798
    options = 2 <= arguments.length ? slice.call(arguments, 0, k = arguments.length - 1) : (k = 0, []), cb = arguments[k++];
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];                                                   // 798
    if (options.getLog == null) {                                                                                    //
      options.getLog = false;                                                                                        //
    }                                                                                                                //
    if (this._doc._id != null) {                                                                                     // 800
      return methodCall(this._root, "getJob", [this._doc._id, options], cb, (function(_this) {                       // 801
        return function(doc) {                                                                                       //
          if (doc != null) {                                                                                         // 802
            _this._doc = doc;                                                                                        // 803
            return _this;                                                                                            //
          } else {                                                                                                   //
            return false;                                                                                            //
          }                                                                                                          //
        };                                                                                                           //
      })(this));                                                                                                     //
    } else {                                                                                                         //
      throw new Error("Can't call .refresh() on an unsaved job");                                                    // 808
    }                                                                                                                //
  };                                                                                                                 //
                                                                                                                     //
  Job.prototype.done = function() {                                                                                  // 292
    var cb, k, options, ref, result;                                                                                 // 812
    result = arguments[0], options = 3 <= arguments.length ? slice.call(arguments, 1, k = arguments.length - 1) : (k = 1, []), cb = arguments[k++];
    if (result == null) {                                                                                            //
      result = {};                                                                                                   //
    }                                                                                                                //
    if (typeof result === 'function') {                                                                              // 812
      cb = result;                                                                                                   // 813
      result = {};                                                                                                   // 813
    }                                                                                                                //
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];                                                   // 812
    if (!((result != null) && typeof result === 'object')) {                                                         // 816
      result = {                                                                                                     // 817
        value: result                                                                                                // 817
      };                                                                                                             //
    }                                                                                                                //
    if ((this._doc._id != null) && (this._doc.runId != null)) {                                                      // 818
      return methodCall(this._root, "jobDone", [this._doc._id, this._doc.runId, result, options], cb);               // 819
    } else {                                                                                                         //
      throw new Error("Can't call .done() on an unsaved or non-running job");                                        // 821
    }                                                                                                                //
    return null;                                                                                                     // 822
  };                                                                                                                 //
                                                                                                                     //
  Job.prototype.fail = function() {                                                                                  // 292
    var cb, k, options, ref, result;                                                                                 // 826
    result = arguments[0], options = 3 <= arguments.length ? slice.call(arguments, 1, k = arguments.length - 1) : (k = 1, []), cb = arguments[k++];
    if (result == null) {                                                                                            //
      result = "No error information provided";                                                                      //
    }                                                                                                                //
    if (typeof result === 'function') {                                                                              // 826
      cb = result;                                                                                                   // 827
      result = "No error information provided";                                                                      // 827
    }                                                                                                                //
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];                                                   // 826
    if (!((result != null) && typeof result === 'object')) {                                                         // 830
      result = {                                                                                                     // 831
        value: result                                                                                                // 831
      };                                                                                                             //
    }                                                                                                                //
    if (options.fatal == null) {                                                                                     //
      options.fatal = false;                                                                                         //
    }                                                                                                                //
    if ((this._doc._id != null) && (this._doc.runId != null)) {                                                      // 833
      return methodCall(this._root, "jobFail", [this._doc._id, this._doc.runId, result, options], cb);               // 834
    } else {                                                                                                         //
      throw new Error("Can't call .fail() on an unsaved or non-running job");                                        // 836
    }                                                                                                                //
    return null;                                                                                                     // 837
  };                                                                                                                 //
                                                                                                                     //
  Job.prototype.pause = function() {                                                                                 // 292
    var cb, k, options, ref;                                                                                         // 841
    options = 2 <= arguments.length ? slice.call(arguments, 0, k = arguments.length - 1) : (k = 0, []), cb = arguments[k++];
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];                                                   // 841
    if (this._doc._id != null) {                                                                                     // 842
      return methodCall(this._root, "jobPause", [this._doc._id, options], cb);                                       // 843
    } else {                                                                                                         //
      this._doc.status = 'paused';                                                                                   // 845
      if ((cb != null) && typeof cb === 'function') {                                                                // 846
        _setImmediate(cb, null, true);                                                                               // 847
      }                                                                                                              //
      return this;                                                                                                   // 848
    }                                                                                                                //
    return null;                                                                                                     // 849
  };                                                                                                                 //
                                                                                                                     //
  Job.prototype.resume = function() {                                                                                // 292
    var cb, k, options, ref;                                                                                         // 854
    options = 2 <= arguments.length ? slice.call(arguments, 0, k = arguments.length - 1) : (k = 0, []), cb = arguments[k++];
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];                                                   // 854
    if (this._doc._id != null) {                                                                                     // 855
      return methodCall(this._root, "jobResume", [this._doc._id, options], cb);                                      // 856
    } else {                                                                                                         //
      this._doc.status = 'waiting';                                                                                  // 858
      if ((cb != null) && typeof cb === 'function') {                                                                // 859
        _setImmediate(cb, null, true);                                                                               // 860
      }                                                                                                              //
      return this;                                                                                                   // 861
    }                                                                                                                //
    return null;                                                                                                     // 862
  };                                                                                                                 //
                                                                                                                     //
  Job.prototype.ready = function() {                                                                                 // 292
    var cb, k, options, ref;                                                                                         // 866
    options = 2 <= arguments.length ? slice.call(arguments, 0, k = arguments.length - 1) : (k = 0, []), cb = arguments[k++];
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];                                                   // 866
    if (options.force == null) {                                                                                     //
      options.force = false;                                                                                         //
    }                                                                                                                //
    if (this._doc._id != null) {                                                                                     // 868
      return methodCall(this._root, "jobReady", [this._doc._id, options], cb);                                       // 869
    } else {                                                                                                         //
      throw new Error("Can't call .ready() on an unsaved job");                                                      // 871
    }                                                                                                                //
    return null;                                                                                                     // 872
  };                                                                                                                 //
                                                                                                                     //
  Job.prototype.cancel = function() {                                                                                // 292
    var cb, k, options, ref;                                                                                         // 876
    options = 2 <= arguments.length ? slice.call(arguments, 0, k = arguments.length - 1) : (k = 0, []), cb = arguments[k++];
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];                                                   // 876
    if (options.antecedents == null) {                                                                               //
      options.antecedents = true;                                                                                    //
    }                                                                                                                //
    if (this._doc._id != null) {                                                                                     // 878
      return methodCall(this._root, "jobCancel", [this._doc._id, options], cb);                                      // 879
    } else {                                                                                                         //
      throw new Error("Can't call .cancel() on an unsaved job");                                                     // 881
    }                                                                                                                //
    return null;                                                                                                     // 882
  };                                                                                                                 //
                                                                                                                     //
  Job.prototype.restart = function() {                                                                               // 292
    var cb, k, options, ref;                                                                                         // 886
    options = 2 <= arguments.length ? slice.call(arguments, 0, k = arguments.length - 1) : (k = 0, []), cb = arguments[k++];
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];                                                   // 886
    if (options.retries == null) {                                                                                   //
      options.retries = 1;                                                                                           //
    }                                                                                                                //
    if (options.dependents == null) {                                                                                //
      options.dependents = true;                                                                                     //
    }                                                                                                                //
    if (this._doc._id != null) {                                                                                     // 889
      return methodCall(this._root, "jobRestart", [this._doc._id, options], cb);                                     // 890
    } else {                                                                                                         //
      throw new Error("Can't call .restart() on an unsaved job");                                                    // 892
    }                                                                                                                //
    return null;                                                                                                     // 893
  };                                                                                                                 //
                                                                                                                     //
  Job.prototype.rerun = function() {                                                                                 // 292
    var cb, k, options, ref;                                                                                         // 897
    options = 2 <= arguments.length ? slice.call(arguments, 0, k = arguments.length - 1) : (k = 0, []), cb = arguments[k++];
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];                                                   // 897
    if (options.repeats == null) {                                                                                   //
      options.repeats = 0;                                                                                           //
    }                                                                                                                //
    if (options.wait == null) {                                                                                      //
      options.wait = this._doc.repeatWait;                                                                           //
    }                                                                                                                //
    if (this._doc._id != null) {                                                                                     // 900
      return methodCall(this._root, "jobRerun", [this._doc._id, options], cb);                                       // 901
    } else {                                                                                                         //
      throw new Error("Can't call .rerun() on an unsaved job");                                                      // 903
    }                                                                                                                //
    return null;                                                                                                     // 904
  };                                                                                                                 //
                                                                                                                     //
  Job.prototype.remove = function() {                                                                                // 292
    var cb, k, options, ref;                                                                                         // 908
    options = 2 <= arguments.length ? slice.call(arguments, 0, k = arguments.length - 1) : (k = 0, []), cb = arguments[k++];
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];                                                   // 908
    if (this._doc._id != null) {                                                                                     // 909
      return methodCall(this._root, "jobRemove", [this._doc._id, options], cb);                                      // 910
    } else {                                                                                                         //
      throw new Error("Can't call .remove() on an unsaved job");                                                     // 912
    }                                                                                                                //
    return null;                                                                                                     // 913
  };                                                                                                                 //
                                                                                                                     //
  Object.defineProperties(Job.prototype, {                                                                           // 292
    doc: {                                                                                                           // 917
      get: function() {                                                                                              // 918
        return this._doc;                                                                                            //
      },                                                                                                             //
      set: function() {                                                                                              // 918
        return console.warn("Job.doc cannot be directly assigned.");                                                 //
      }                                                                                                              //
    },                                                                                                               //
    type: {                                                                                                          // 917
      get: function() {                                                                                              // 921
        return this._doc.type;                                                                                       //
      },                                                                                                             //
      set: function() {                                                                                              // 921
        return console.warn("Job.type cannot be directly assigned.");                                                //
      }                                                                                                              //
    },                                                                                                               //
    data: {                                                                                                          // 917
      get: function() {                                                                                              // 924
        return this._doc.data;                                                                                       //
      },                                                                                                             //
      set: function() {                                                                                              // 924
        return console.warn("Job.data cannot be directly assigned.");                                                //
      }                                                                                                              //
    }                                                                                                                //
  });                                                                                                                //
                                                                                                                     //
  return Job;                                                                                                        //
                                                                                                                     //
})();                                                                                                                //
                                                                                                                     //
if ((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null) {                          // 928
  module.exports = Job;                                                                                              // 929
}                                                                                                                    //
                                                                                                                     //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/vsivsi_job-collection/src/shared.coffee.js                                                               //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var JobCollectionBase, _validId, _validIntGTEOne, _validIntGTEZero, _validJobDoc, _validLaterJSObj, _validLog, _validLogLevel, _validNumGTEOne, _validNumGTEZero, _validNumGTZero, _validProgress, _validRetryBackoff, _validStatus,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,                                                                                       //
  slice = [].slice;                                                                                                  //
                                                                                                                     //
_validNumGTEZero = function(v) {                                                                                     // 7
  return Match.test(v, Number) && v >= 0.0;                                                                          //
};                                                                                                                   // 7
                                                                                                                     //
_validNumGTZero = function(v) {                                                                                      // 7
  return Match.test(v, Number) && v > 0.0;                                                                           //
};                                                                                                                   // 10
                                                                                                                     //
_validNumGTEOne = function(v) {                                                                                      // 7
  return Match.test(v, Number) && v >= 1.0;                                                                          //
};                                                                                                                   // 13
                                                                                                                     //
_validIntGTEZero = function(v) {                                                                                     // 7
  return _validNumGTEZero(v) && Math.floor(v) === v;                                                                 //
};                                                                                                                   // 16
                                                                                                                     //
_validIntGTEOne = function(v) {                                                                                      // 7
  return _validNumGTEOne(v) && Math.floor(v) === v;                                                                  //
};                                                                                                                   // 19
                                                                                                                     //
_validStatus = function(v) {                                                                                         // 7
  return Match.test(v, String) && indexOf.call(Job.jobStatuses, v) >= 0;                                             //
};                                                                                                                   // 22
                                                                                                                     //
_validLogLevel = function(v) {                                                                                       // 7
  return Match.test(v, String) && indexOf.call(Job.jobLogLevels, v) >= 0;                                            //
};                                                                                                                   // 25
                                                                                                                     //
_validRetryBackoff = function(v) {                                                                                   // 7
  return Match.test(v, String) && indexOf.call(Job.jobRetryBackoffMethods, v) >= 0;                                  //
};                                                                                                                   // 28
                                                                                                                     //
_validId = function(v) {                                                                                             // 7
  return Match.test(v, Match.OneOf(String, Mongo.Collection.ObjectID));                                              //
};                                                                                                                   // 31
                                                                                                                     //
_validLog = function() {                                                                                             // 7
  return [                                                                                                           //
    {                                                                                                                //
      time: Date,                                                                                                    // 35
      runId: Match.OneOf(Match.Where(_validId), null),                                                               // 35
      level: Match.Where(_validLogLevel),                                                                            // 35
      message: String,                                                                                               // 35
      data: Match.Optional(Object)                                                                                   // 35
    }                                                                                                                //
  ];                                                                                                                 //
};                                                                                                                   // 34
                                                                                                                     //
_validProgress = function() {                                                                                        // 7
  return {                                                                                                           //
    completed: Match.Where(_validNumGTEZero),                                                                        // 44
    total: Match.Where(_validNumGTEZero),                                                                            // 44
    percent: Match.Where(_validNumGTEZero)                                                                           // 44
  };                                                                                                                 //
};                                                                                                                   // 43
                                                                                                                     //
_validLaterJSObj = function() {                                                                                      // 7
  return {                                                                                                           //
    schedules: [Object],                                                                                             // 49
    exceptions: Match.Optional([Object])                                                                             // 49
  };                                                                                                                 //
};                                                                                                                   // 48
                                                                                                                     //
_validJobDoc = function() {                                                                                          // 7
  return {                                                                                                           //
    _id: Match.Optional(Match.OneOf(Match.Where(_validId), null)),                                                   // 53
    runId: Match.OneOf(Match.Where(_validId), null),                                                                 // 53
    type: String,                                                                                                    // 53
    status: Match.Where(_validStatus),                                                                               // 53
    data: Object,                                                                                                    // 53
    result: Match.Optional(Object),                                                                                  // 53
    failures: Match.Optional([Object]),                                                                              // 53
    priority: Match.Integer,                                                                                         // 53
    depends: [Match.Where(_validId)],                                                                                // 53
    resolved: [Match.Where(_validId)],                                                                               // 53
    after: Date,                                                                                                     // 53
    updated: Date,                                                                                                   // 53
    workTimeout: Match.Optional(Match.Where(_validIntGTEOne)),                                                       // 53
    expiresAfter: Match.Optional(Date),                                                                              // 53
    log: Match.Optional(_validLog()),                                                                                // 53
    progress: _validProgress(),                                                                                      // 53
    retries: Match.Where(_validIntGTEZero),                                                                          // 53
    retried: Match.Where(_validIntGTEZero),                                                                          // 53
    repeatRetries: Match.Optional(Match.Where(_validIntGTEZero)),                                                    // 53
    retryUntil: Date,                                                                                                // 53
    retryWait: Match.Where(_validIntGTEZero),                                                                        // 53
    retryBackoff: Match.Where(_validRetryBackoff),                                                                   // 53
    repeats: Match.Where(_validIntGTEZero),                                                                          // 53
    repeated: Match.Where(_validIntGTEZero),                                                                         // 53
    repeatUntil: Date,                                                                                               // 53
    repeatWait: Match.OneOf(Match.Where(_validIntGTEZero), Match.Where(_validLaterJSObj)),                           // 53
    created: Date                                                                                                    // 53
  };                                                                                                                 //
};                                                                                                                   // 52
                                                                                                                     //
JobCollectionBase = (function(superClass) {                                                                          // 7
  extend(JobCollectionBase, superClass);                                                                             // 83
                                                                                                                     //
  function JobCollectionBase(root, options) {                                                                        // 83
    var collectionName;                                                                                              // 84
    this.root = root != null ? root : 'queue';                                                                       // 84
    if (options == null) {                                                                                           //
      options = {};                                                                                                  //
    }                                                                                                                //
    if (!(this instanceof JobCollectionBase)) {                                                                      // 84
      return new JobCollectionBase(this.root, options);                                                              // 85
    }                                                                                                                //
    if (!(this instanceof Mongo.Collection)) {                                                                       // 87
      throw new Error('The global definition of Mongo.Collection has changed since the job-collection package was loaded. Please ensure that any packages that redefine Mongo.Collection are loaded before job-collection.');
    }                                                                                                                //
    if (Mongo.Collection !== Mongo.Collection.prototype.constructor) {                                               // 90
      throw new Meteor.Error('The global definition of Mongo.Collection has been patched by another package, and the prototype constructor has been left in an inconsistent state. Please see this link for a workaround: https://github.com/vsivsi/meteor-file-sample-app/issues/2#issuecomment-120780592');
    }                                                                                                                //
    this.later = later;                                                                                              // 84
    if (options.noCollectionSuffix == null) {                                                                        //
      options.noCollectionSuffix = false;                                                                            //
    }                                                                                                                //
    collectionName = this.root;                                                                                      // 84
    if (!options.noCollectionSuffix) {                                                                               // 99
      collectionName += '.jobs';                                                                                     // 100
    }                                                                                                                //
    delete options.noCollectionSuffix;                                                                               // 84
    Job.setDDP(options.connection, this.root);                                                                       // 84
    this._createLogEntry = function(message, runId, level, time, data) {                                             // 84
      var l;                                                                                                         // 109
      if (message == null) {                                                                                         //
        message = '';                                                                                                //
      }                                                                                                              //
      if (runId == null) {                                                                                           //
        runId = null;                                                                                                //
      }                                                                                                              //
      if (level == null) {                                                                                           //
        level = 'info';                                                                                              //
      }                                                                                                              //
      if (time == null) {                                                                                            //
        time = new Date();                                                                                           //
      }                                                                                                              //
      if (data == null) {                                                                                            //
        data = null;                                                                                                 //
      }                                                                                                              //
      l = {                                                                                                          // 109
        time: time,                                                                                                  // 109
        runId: runId,                                                                                                // 109
        message: message,                                                                                            // 109
        level: level                                                                                                 // 109
      };                                                                                                             //
      return l;                                                                                                      // 110
    };                                                                                                               //
    this._logMessage = {                                                                                             // 84
      'readied': (function() {                                                                                       // 113
        return this._createLogEntry("Promoted to ready");                                                            //
      }).bind(this),                                                                                                 //
      'forced': (function(id) {                                                                                      // 113
        return this._createLogEntry("Dependencies force resolved", null, 'warning');                                 //
      }).bind(this),                                                                                                 //
      'rerun': (function(id, runId) {                                                                                // 113
        return this._createLogEntry("Rerunning job", null, 'info', new Date(), {                                     //
          previousJob: {                                                                                             // 115
            id: id,                                                                                                  // 115
            runId: runId                                                                                             // 115
          }                                                                                                          //
        });                                                                                                          //
      }).bind(this),                                                                                                 //
      'running': (function(runId) {                                                                                  // 113
        return this._createLogEntry("Job Running", runId);                                                           //
      }).bind(this),                                                                                                 //
      'paused': (function() {                                                                                        // 113
        return this._createLogEntry("Job Paused");                                                                   //
      }).bind(this),                                                                                                 //
      'resumed': (function() {                                                                                       // 113
        return this._createLogEntry("Job Resumed");                                                                  //
      }).bind(this),                                                                                                 //
      'cancelled': (function() {                                                                                     // 113
        return this._createLogEntry("Job Cancelled", null, 'warning');                                               //
      }).bind(this),                                                                                                 //
      'restarted': (function() {                                                                                     // 113
        return this._createLogEntry("Job Restarted");                                                                //
      }).bind(this),                                                                                                 //
      'resubmitted': (function() {                                                                                   // 113
        return this._createLogEntry("Job Resubmitted");                                                              //
      }).bind(this),                                                                                                 //
      'submitted': (function() {                                                                                     // 113
        return this._createLogEntry("Job Submitted");                                                                //
      }).bind(this),                                                                                                 //
      'completed': (function(runId) {                                                                                // 113
        return this._createLogEntry("Job Completed", runId, 'success');                                              //
      }).bind(this),                                                                                                 //
      'resolved': (function(id, runId) {                                                                             // 113
        return this._createLogEntry("Dependency resolved", null, 'info', new Date(), {                               //
          dependency: {                                                                                              // 124
            id: id,                                                                                                  // 124
            runId: runId                                                                                             // 124
          }                                                                                                          //
        });                                                                                                          //
      }).bind(this),                                                                                                 //
      'failed': (function(runId, fatal, err) {                                                                       // 113
        var level, msg, value;                                                                                       // 126
        value = err.value;                                                                                           // 126
        msg = "Job Failed with" + (fatal ? ' Fatal' : '') + " Error" + ((value != null) && typeof value === 'string' ? ': ' + value : '') + ".";
        level = fatal ? 'danger' : 'warning';                                                                        // 126
        return this._createLogEntry(msg, runId, level);                                                              //
      }).bind(this)                                                                                                  //
    };                                                                                                               //
    JobCollectionBase.__super__.constructor.call(this, collectionName, options);                                     // 84
  }                                                                                                                  //
                                                                                                                     //
  JobCollectionBase.prototype._validNumGTEZero = _validNumGTEZero;                                                   // 83
                                                                                                                     //
  JobCollectionBase.prototype._validNumGTZero = _validNumGTZero;                                                     // 83
                                                                                                                     //
  JobCollectionBase.prototype._validNumGTEOne = _validNumGTEOne;                                                     // 83
                                                                                                                     //
  JobCollectionBase.prototype._validIntGTEZero = _validIntGTEZero;                                                   // 83
                                                                                                                     //
  JobCollectionBase.prototype._validIntGTEOne = _validIntGTEOne;                                                     // 83
                                                                                                                     //
  JobCollectionBase.prototype._validStatus = _validStatus;                                                           // 83
                                                                                                                     //
  JobCollectionBase.prototype._validLogLevel = _validLogLevel;                                                       // 83
                                                                                                                     //
  JobCollectionBase.prototype._validRetryBackoff = _validRetryBackoff;                                               // 83
                                                                                                                     //
  JobCollectionBase.prototype._validId = _validId;                                                                   // 83
                                                                                                                     //
  JobCollectionBase.prototype._validLog = _validLog;                                                                 // 83
                                                                                                                     //
  JobCollectionBase.prototype._validProgress = _validProgress;                                                       // 83
                                                                                                                     //
  JobCollectionBase.prototype._validJobDoc = _validJobDoc;                                                           // 83
                                                                                                                     //
  JobCollectionBase.prototype.jobLogLevels = Job.jobLogLevels;                                                       // 83
                                                                                                                     //
  JobCollectionBase.prototype.jobPriorities = Job.jobPriorities;                                                     // 83
                                                                                                                     //
  JobCollectionBase.prototype.jobStatuses = Job.jobStatuses;                                                         // 83
                                                                                                                     //
  JobCollectionBase.prototype.jobStatusCancellable = Job.jobStatusCancellable;                                       // 83
                                                                                                                     //
  JobCollectionBase.prototype.jobStatusPausable = Job.jobStatusPausable;                                             // 83
                                                                                                                     //
  JobCollectionBase.prototype.jobStatusRemovable = Job.jobStatusRemovable;                                           // 83
                                                                                                                     //
  JobCollectionBase.prototype.jobStatusRestartable = Job.jobStatusRestartable;                                       // 83
                                                                                                                     //
  JobCollectionBase.prototype.forever = Job.forever;                                                                 // 83
                                                                                                                     //
  JobCollectionBase.prototype.foreverDate = Job.foreverDate;                                                         // 83
                                                                                                                     //
  JobCollectionBase.prototype.ddpMethods = Job.ddpMethods;                                                           // 83
                                                                                                                     //
  JobCollectionBase.prototype.ddpPermissionLevels = Job.ddpPermissionLevels;                                         // 83
                                                                                                                     //
  JobCollectionBase.prototype.ddpMethodPermissions = Job.ddpMethodPermissions;                                       // 83
                                                                                                                     //
  JobCollectionBase.prototype.processJobs = function() {                                                             // 83
    var params;                                                                                                      // 161
    params = 1 <= arguments.length ? slice.call(arguments, 0) : [];                                                  // 161
    return (function(func, args, ctor) {                                                                             //
      ctor.prototype = func.prototype;                                                                               //
      var child = new ctor, result = func.apply(child, args);                                                        //
      return Object(result) === result ? result : child;                                                             //
    })(Job.processJobs, [this.root].concat(slice.call(params)), function(){});                                       //
  };                                                                                                                 //
                                                                                                                     //
  JobCollectionBase.prototype.getJob = function() {                                                                  // 83
    var params;                                                                                                      // 162
    params = 1 <= arguments.length ? slice.call(arguments, 0) : [];                                                  // 162
    return Job.getJob.apply(Job, [this.root].concat(slice.call(params)));                                            //
  };                                                                                                                 //
                                                                                                                     //
  JobCollectionBase.prototype.getWork = function() {                                                                 // 83
    var params;                                                                                                      // 163
    params = 1 <= arguments.length ? slice.call(arguments, 0) : [];                                                  // 163
    return Job.getWork.apply(Job, [this.root].concat(slice.call(params)));                                           //
  };                                                                                                                 //
                                                                                                                     //
  JobCollectionBase.prototype.getJobs = function() {                                                                 // 83
    var params;                                                                                                      // 164
    params = 1 <= arguments.length ? slice.call(arguments, 0) : [];                                                  // 164
    return Job.getJobs.apply(Job, [this.root].concat(slice.call(params)));                                           //
  };                                                                                                                 //
                                                                                                                     //
  JobCollectionBase.prototype.readyJobs = function() {                                                               // 83
    var params;                                                                                                      // 165
    params = 1 <= arguments.length ? slice.call(arguments, 0) : [];                                                  // 165
    return Job.readyJobs.apply(Job, [this.root].concat(slice.call(params)));                                         //
  };                                                                                                                 //
                                                                                                                     //
  JobCollectionBase.prototype.cancelJobs = function() {                                                              // 83
    var params;                                                                                                      // 166
    params = 1 <= arguments.length ? slice.call(arguments, 0) : [];                                                  // 166
    return Job.cancelJobs.apply(Job, [this.root].concat(slice.call(params)));                                        //
  };                                                                                                                 //
                                                                                                                     //
  JobCollectionBase.prototype.pauseJobs = function() {                                                               // 83
    var params;                                                                                                      // 167
    params = 1 <= arguments.length ? slice.call(arguments, 0) : [];                                                  // 167
    return Job.pauseJobs.apply(Job, [this.root].concat(slice.call(params)));                                         //
  };                                                                                                                 //
                                                                                                                     //
  JobCollectionBase.prototype.resumeJobs = function() {                                                              // 83
    var params;                                                                                                      // 168
    params = 1 <= arguments.length ? slice.call(arguments, 0) : [];                                                  // 168
    return Job.resumeJobs.apply(Job, [this.root].concat(slice.call(params)));                                        //
  };                                                                                                                 //
                                                                                                                     //
  JobCollectionBase.prototype.restartJobs = function() {                                                             // 83
    var params;                                                                                                      // 169
    params = 1 <= arguments.length ? slice.call(arguments, 0) : [];                                                  // 169
    return Job.restartJobs.apply(Job, [this.root].concat(slice.call(params)));                                       //
  };                                                                                                                 //
                                                                                                                     //
  JobCollectionBase.prototype.removeJobs = function() {                                                              // 83
    var params;                                                                                                      // 170
    params = 1 <= arguments.length ? slice.call(arguments, 0) : [];                                                  // 170
    return Job.removeJobs.apply(Job, [this.root].concat(slice.call(params)));                                        //
  };                                                                                                                 //
                                                                                                                     //
  JobCollectionBase.prototype.setDDP = function() {                                                                  // 83
    var params;                                                                                                      // 172
    params = 1 <= arguments.length ? slice.call(arguments, 0) : [];                                                  // 172
    return Job.setDDP.apply(Job, params);                                                                            //
  };                                                                                                                 //
                                                                                                                     //
  JobCollectionBase.prototype.startJobServer = function() {                                                          // 83
    var params;                                                                                                      // 174
    params = 1 <= arguments.length ? slice.call(arguments, 0) : [];                                                  // 174
    return Job.startJobServer.apply(Job, [this.root].concat(slice.call(params)));                                    //
  };                                                                                                                 //
                                                                                                                     //
  JobCollectionBase.prototype.shutdownJobServer = function() {                                                       // 83
    var params;                                                                                                      // 175
    params = 1 <= arguments.length ? slice.call(arguments, 0) : [];                                                  // 175
    return Job.shutdownJobServer.apply(Job, [this.root].concat(slice.call(params)));                                 //
  };                                                                                                                 //
                                                                                                                     //
  JobCollectionBase.prototype.startJobs = function() {                                                               // 83
    var params;                                                                                                      // 178
    params = 1 <= arguments.length ? slice.call(arguments, 0) : [];                                                  // 178
    return Job.startJobs.apply(Job, [this.root].concat(slice.call(params)));                                         //
  };                                                                                                                 //
                                                                                                                     //
  JobCollectionBase.prototype.stopJobs = function() {                                                                // 83
    var params;                                                                                                      // 179
    params = 1 <= arguments.length ? slice.call(arguments, 0) : [];                                                  // 179
    return Job.stopJobs.apply(Job, [this.root].concat(slice.call(params)));                                          //
  };                                                                                                                 //
                                                                                                                     //
  JobCollectionBase.prototype.jobDocPattern = _validJobDoc();                                                        // 83
                                                                                                                     //
  JobCollectionBase.prototype.allow = function() {                                                                   // 83
    throw new Error("Server-only function jc.allow() invoked on client.");                                           // 184
  };                                                                                                                 //
                                                                                                                     //
  JobCollectionBase.prototype.deny = function() {                                                                    // 83
    throw new Error("Server-only function jc.deny() invoked on client.");                                            // 185
  };                                                                                                                 //
                                                                                                                     //
  JobCollectionBase.prototype.promote = function() {                                                                 // 83
    throw new Error("Server-only function jc.promote() invoked on client.");                                         // 186
  };                                                                                                                 //
                                                                                                                     //
  JobCollectionBase.prototype.setLogStream = function() {                                                            // 83
    throw new Error("Server-only function jc.setLogStream() invoked on client.");                                    // 187
  };                                                                                                                 //
                                                                                                                     //
  JobCollectionBase.prototype.logConsole = function() {                                                              // 83
    throw new Error("Client-only function jc.logConsole() invoked on server.");                                      // 190
  };                                                                                                                 //
                                                                                                                     //
  JobCollectionBase.prototype.makeJob = (function() {                                                                // 83
    var dep;                                                                                                         // 194
    dep = false;                                                                                                     // 194
    return function() {                                                                                              //
      var params;                                                                                                    // 196
      params = 1 <= arguments.length ? slice.call(arguments, 0) : [];                                                // 196
      if (!dep) {                                                                                                    // 196
        dep = true;                                                                                                  // 197
        console.warn("WARNING: jc.makeJob() has been deprecated. Use new Job(jc, doc) instead.");                    // 197
      }                                                                                                              //
      return (function(func, args, ctor) {                                                                           //
        ctor.prototype = func.prototype;                                                                             //
        var child = new ctor, result = func.apply(child, args);                                                      //
        return Object(result) === result ? result : child;                                                           //
      })(Job, [this.root].concat(slice.call(params)), function(){});                                                 //
    };                                                                                                               //
  })();                                                                                                              //
                                                                                                                     //
  JobCollectionBase.prototype.createJob = (function() {                                                              // 83
    var dep;                                                                                                         // 203
    dep = false;                                                                                                     // 203
    return function() {                                                                                              //
      var params;                                                                                                    // 205
      params = 1 <= arguments.length ? slice.call(arguments, 0) : [];                                                // 205
      if (!dep) {                                                                                                    // 205
        dep = true;                                                                                                  // 206
        console.warn("WARNING: jc.createJob() has been deprecated. Use new Job(jc, type, data) instead.");           // 206
      }                                                                                                              //
      return (function(func, args, ctor) {                                                                           //
        ctor.prototype = func.prototype;                                                                             //
        var child = new ctor, result = func.apply(child, args);                                                      //
        return Object(result) === result ? result : child;                                                           //
      })(Job, [this.root].concat(slice.call(params)), function(){});                                                 //
    };                                                                                                               //
  })();                                                                                                              //
                                                                                                                     //
  JobCollectionBase.prototype._methodWrapper = function(method, func) {                                              // 83
    var ref, toLog, unblockDDPMethods;                                                                               // 211
    toLog = this._toLog;                                                                                             // 211
    unblockDDPMethods = (ref = this._unblockDDPMethods) != null ? ref : false;                                       // 211
    return function() {                                                                                              // 214
      var params, ref1, retval, user;                                                                                // 215
      params = 1 <= arguments.length ? slice.call(arguments, 0) : [];                                                // 215
      user = (ref1 = this.userId) != null ? ref1 : "[UNAUTHENTICATED]";                                              // 215
      toLog(user, method, "params: " + JSON.stringify(params));                                                      // 215
      if (unblockDDPMethods) {                                                                                       // 217
        this.unblock();                                                                                              // 217
      }                                                                                                              //
      retval = func.apply(null, params);                                                                             // 215
      toLog(user, method, "returned: " + JSON.stringify(retval));                                                    // 215
      return retval;                                                                                                 // 220
    };                                                                                                               //
  };                                                                                                                 //
                                                                                                                     //
  JobCollectionBase.prototype._generateMethods = function() {                                                        // 83
    var baseMethodName, methodFunc, methodName, methodPrefix, methodsOut;                                            // 223
    methodsOut = {};                                                                                                 // 223
    methodPrefix = '_DDPMethod_';                                                                                    // 223
    for (methodName in this) {                                                                                       // 225
      methodFunc = this[methodName];                                                                                 //
      if (!(methodName.slice(0, methodPrefix.length) === methodPrefix)) {                                            //
        continue;                                                                                                    //
      }                                                                                                              //
      baseMethodName = methodName.slice(methodPrefix.length);                                                        // 226
      methodsOut[this.root + "_" + baseMethodName] = this._methodWrapper(baseMethodName, methodFunc.bind(this));     // 226
    }                                                                                                                // 225
    return methodsOut;                                                                                               // 228
  };                                                                                                                 //
                                                                                                                     //
  JobCollectionBase.prototype._idsOfDeps = function(ids, antecedents, dependents, jobStatuses) {                     // 83
    var antsArray, dependsIds, dependsQuery;                                                                         // 234
    dependsQuery = [];                                                                                               // 234
    if (dependents) {                                                                                                // 235
      dependsQuery.push({                                                                                            // 236
        depends: {                                                                                                   // 237
          $elemMatch: {                                                                                              // 238
            $in: ids                                                                                                 // 239
          }                                                                                                          //
        }                                                                                                            //
      });                                                                                                            //
    }                                                                                                                //
    if (antecedents) {                                                                                               // 240
      antsArray = [];                                                                                                // 241
      this.find({                                                                                                    // 241
        _id: {                                                                                                       // 243
          $in: ids                                                                                                   // 245
        }                                                                                                            //
      }, {                                                                                                           //
        fields: {                                                                                                    // 247
          depends: 1                                                                                                 // 249
        },                                                                                                           //
        transform: null                                                                                              // 247
      }).forEach(function(d) {                                                                                       //
        var i, j, len, ref, results;                                                                                 // 252
        if (indexOf.call(antsArray, i) < 0) {                                                                        // 252
          ref = d.depends;                                                                                           // 252
          results = [];                                                                                              // 252
          for (j = 0, len = ref.length; j < len; j++) {                                                              //
            i = ref[j];                                                                                              //
            results.push(antsArray.push(i));                                                                         // 252
          }                                                                                                          // 252
          return results;                                                                                            //
        }                                                                                                            //
      });                                                                                                            //
      if (antsArray.length > 0) {                                                                                    // 253
        dependsQuery.push({                                                                                          // 254
          _id: {                                                                                                     // 255
            $in: antsArray                                                                                           // 256
          }                                                                                                          //
        });                                                                                                          //
      }                                                                                                              //
    }                                                                                                                //
    if (dependsQuery) {                                                                                              // 257
      dependsIds = [];                                                                                               // 258
      this.find({                                                                                                    // 258
        status: {                                                                                                    // 260
          $in: jobStatuses                                                                                           // 262
        },                                                                                                           //
        $or: dependsQuery                                                                                            // 260
      }, {                                                                                                           //
        fields: {                                                                                                    // 265
          _id: 1                                                                                                     // 267
        },                                                                                                           //
        transform: null                                                                                              // 265
      }).forEach(function(d) {                                                                                       //
        var ref;                                                                                                     // 271
        if (ref = d._id, indexOf.call(dependsIds, ref) < 0) {                                                        // 271
          return dependsIds.push(d._id);                                                                             //
        }                                                                                                            //
      });                                                                                                            //
    }                                                                                                                //
    return dependsIds;                                                                                               // 272
  };                                                                                                                 //
                                                                                                                     //
  JobCollectionBase.prototype._rerun_job = function(doc, repeats, wait, repeatUntil) {                               // 83
    var id, jobId, logObj, runId, time;                                                                              // 276
    if (repeats == null) {                                                                                           //
      repeats = doc.repeats - 1;                                                                                     //
    }                                                                                                                //
    if (wait == null) {                                                                                              //
      wait = doc.repeatWait;                                                                                         //
    }                                                                                                                //
    if (repeatUntil == null) {                                                                                       //
      repeatUntil = doc.repeatUntil;                                                                                 //
    }                                                                                                                //
    id = doc._id;                                                                                                    // 276
    runId = doc.runId;                                                                                               // 276
    time = new Date();                                                                                               // 276
    delete doc._id;                                                                                                  // 276
    delete doc.result;                                                                                               // 276
    delete doc.failures;                                                                                             // 276
    delete doc.expiresAfter;                                                                                         // 276
    delete doc.workTimeout;                                                                                          // 276
    doc.runId = null;                                                                                                // 276
    doc.status = "waiting";                                                                                          // 276
    doc.repeatRetries = doc.repeatRetries != null ? doc.repeatRetries : doc.retries + doc.retried;                   // 276
    doc.retries = doc.repeatRetries;                                                                                 // 276
    if (doc.retries > this.forever) {                                                                                // 288
      doc.retries = this.forever;                                                                                    // 288
    }                                                                                                                //
    doc.retryUntil = repeatUntil;                                                                                    // 276
    doc.retried = 0;                                                                                                 // 276
    doc.repeats = repeats;                                                                                           // 276
    if (doc.repeats > this.forever) {                                                                                // 292
      doc.repeats = this.forever;                                                                                    // 292
    }                                                                                                                //
    doc.repeatUntil = repeatUntil;                                                                                   // 276
    doc.repeated = doc.repeated + 1;                                                                                 // 276
    doc.updated = time;                                                                                              // 276
    doc.created = time;                                                                                              // 276
    doc.progress = {                                                                                                 // 276
      completed: 0,                                                                                                  // 298
      total: 1,                                                                                                      // 298
      percent: 0                                                                                                     // 298
    };                                                                                                               //
    if (logObj = this._logMessage.rerun(id, runId)) {                                                                // 301
      doc.log = [logObj];                                                                                            // 302
    } else {                                                                                                         //
      doc.log = [];                                                                                                  // 304
    }                                                                                                                //
    doc.after = new Date(time.valueOf() + wait);                                                                     // 276
    if (jobId = this.insert(doc)) {                                                                                  // 307
      this._DDPMethod_jobReady(jobId);                                                                               // 308
      return jobId;                                                                                                  // 309
    } else {                                                                                                         //
      console.warn("Job rerun/repeat failed to reschedule!", id, runId);                                             // 311
    }                                                                                                                //
    return null;                                                                                                     // 312
  };                                                                                                                 //
                                                                                                                     //
  JobCollectionBase.prototype._DDPMethod_startJobServer = function(options) {                                        // 83
    check(options, Match.Optional({}));                                                                              // 315
    if (options == null) {                                                                                           //
      options = {};                                                                                                  //
    }                                                                                                                //
    if (!this.isSimulation) {                                                                                        // 318
      if (this.stopped && this.stopped !== true) {                                                                   // 319
        Meteor.clearTimeout(this.stopped);                                                                           // 319
      }                                                                                                              //
      this.stopped = false;                                                                                          // 319
    }                                                                                                                //
    return true;                                                                                                     // 321
  };                                                                                                                 //
                                                                                                                     //
  JobCollectionBase.prototype._DDPMethod_startJobs = (function() {                                                   // 83
    var depFlag;                                                                                                     // 324
    depFlag = false;                                                                                                 // 324
    return function(options) {                                                                                       //
      if (!depFlag) {                                                                                                // 326
        depFlag = true;                                                                                              // 327
        console.warn("Deprecation Warning: jc.startJobs() has been renamed to jc.startJobServer()");                 // 327
      }                                                                                                              //
      return this._DDPMethod_startJobServer(options);                                                                // 329
    };                                                                                                               //
  })();                                                                                                              //
                                                                                                                     //
  JobCollectionBase.prototype._DDPMethod_shutdownJobServer = function(options) {                                     // 83
    check(options, Match.Optional({                                                                                  // 332
      timeout: Match.Optional(Match.Where(_validIntGTEOne))                                                          // 333
    }));                                                                                                             //
    if (options == null) {                                                                                           //
      options = {};                                                                                                  //
    }                                                                                                                //
    if (options.timeout == null) {                                                                                   //
      options.timeout = 60 * 1000;                                                                                   //
    }                                                                                                                //
    if (!this.isSimulation) {                                                                                        // 338
      if (this.stopped && this.stopped !== true) {                                                                   // 339
        Meteor.clearTimeout(this.stopped);                                                                           // 339
      }                                                                                                              //
      this.stopped = Meteor.setTimeout((function(_this) {                                                            // 339
        return function() {                                                                                          //
          var cursor, failedJobs;                                                                                    // 342
          cursor = _this.find({                                                                                      // 342
            status: 'running'                                                                                        // 343
          }, {                                                                                                       //
            transform: null                                                                                          // 346
          });                                                                                                        //
          failedJobs = cursor.count();                                                                               // 342
          if (failedJobs !== 0) {                                                                                    // 351
            console.warn("Failing " + failedJobs + " jobs on queue stop.");                                          // 351
          }                                                                                                          //
          cursor.forEach(function(d) {                                                                               // 342
            return _this._DDPMethod_jobFail(d._id, d.runId, "Running at Job Server shutdown.");                      //
          });                                                                                                        //
          if (_this.logStream != null) {                                                                             // 353
            _this.logStream.end();                                                                                   // 354
            return _this.logStream = null;                                                                           //
          }                                                                                                          //
        };                                                                                                           //
      })(this), options.timeout);                                                                                    //
    }                                                                                                                //
    return true;                                                                                                     // 358
  };                                                                                                                 //
                                                                                                                     //
  JobCollectionBase.prototype._DDPMethod_stopJobs = (function() {                                                    // 83
    var depFlag;                                                                                                     // 361
    depFlag = false;                                                                                                 // 361
    return function(options) {                                                                                       //
      if (!depFlag) {                                                                                                // 363
        depFlag = true;                                                                                              // 364
        console.warn("Deprecation Warning: jc.stopJobs() has been renamed to jc.shutdownJobServer()");               // 364
      }                                                                                                              //
      return this._DDPMethod_shutdownJobServer(options);                                                             // 366
    };                                                                                                               //
  })();                                                                                                              //
                                                                                                                     //
  JobCollectionBase.prototype._DDPMethod_getJob = function(ids, options) {                                           // 83
    var d, docs, fields, single;                                                                                     // 369
    check(ids, Match.OneOf(Match.Where(_validId), [Match.Where(_validId)]));                                         // 369
    check(options, Match.Optional({                                                                                  // 369
      getLog: Match.Optional(Boolean),                                                                               // 371
      getFailures: Match.Optional(Boolean)                                                                           // 371
    }));                                                                                                             //
    if (options == null) {                                                                                           //
      options = {};                                                                                                  //
    }                                                                                                                //
    if (options.getLog == null) {                                                                                    //
      options.getLog = false;                                                                                        //
    }                                                                                                                //
    if (options.getFailures == null) {                                                                               //
      options.getFailures = false;                                                                                   //
    }                                                                                                                //
    single = false;                                                                                                  // 369
    if (_validId(ids)) {                                                                                             // 377
      ids = [ids];                                                                                                   // 378
      single = true;                                                                                                 // 378
    }                                                                                                                //
    if (ids.length === 0) {                                                                                          // 380
      return null;                                                                                                   // 380
    }                                                                                                                //
    fields = {                                                                                                       // 369
      _private: 0                                                                                                    // 381
    };                                                                                                               //
    if (!options.getLog) {                                                                                           // 382
      fields.log = 0;                                                                                                // 382
    }                                                                                                                //
    if (!options.getFailures) {                                                                                      // 383
      fields.failures = 0;                                                                                           // 383
    }                                                                                                                //
    docs = this.find({                                                                                               // 369
      _id: {                                                                                                         // 385
        $in: ids                                                                                                     // 387
      }                                                                                                              //
    }, {                                                                                                             //
      fields: fields,                                                                                                // 389
      transform: null                                                                                                // 389
    }).fetch();                                                                                                      //
    if (docs != null ? docs.length : void 0) {                                                                       // 394
      if (this.scrub != null) {                                                                                      // 395
        docs = (function() {                                                                                         // 396
          var j, len, results;                                                                                       //
          results = [];                                                                                              // 396
          for (j = 0, len = docs.length; j < len; j++) {                                                             //
            d = docs[j];                                                                                             //
            results.push(this.scrub(d));                                                                             // 396
          }                                                                                                          // 396
          return results;                                                                                            //
        }).call(this);                                                                                               //
      }                                                                                                              //
      check(docs, [_validJobDoc()]);                                                                                 // 395
      if (single) {                                                                                                  // 398
        return docs[0];                                                                                              // 399
      } else {                                                                                                       //
        return docs;                                                                                                 // 401
      }                                                                                                              //
    }                                                                                                                //
    return null;                                                                                                     // 402
  };                                                                                                                 //
                                                                                                                     //
  JobCollectionBase.prototype._DDPMethod_getWork = function(type, options) {                                         // 83
    var d, docs, foundDocs, ids, logObj, mods, num, runId, time;                                                     // 405
    check(type, Match.OneOf(String, [String]));                                                                      // 405
    check(options, Match.Optional({                                                                                  // 405
      maxJobs: Match.Optional(Match.Where(_validIntGTEOne)),                                                         // 407
      workTimeout: Match.Optional(Match.Where(_validIntGTEOne))                                                      // 407
    }));                                                                                                             //
    if (this.isSimulation) {                                                                                         // 411
      return;                                                                                                        // 412
    }                                                                                                                //
    if (options == null) {                                                                                           //
      options = {};                                                                                                  //
    }                                                                                                                //
    if (options.maxJobs == null) {                                                                                   //
      options.maxJobs = 1;                                                                                           //
    }                                                                                                                //
    if (this.stopped) {                                                                                              // 417
      return [];                                                                                                     // 418
    }                                                                                                                //
    if (typeof type === 'string') {                                                                                  // 421
      type = [type];                                                                                                 // 422
    }                                                                                                                //
    time = new Date();                                                                                               // 405
    docs = [];                                                                                                       // 405
    runId = this._makeNewID();                                                                                       // 405
    while (docs.length < options.maxJobs) {                                                                          // 427
      ids = this.find({                                                                                              // 429
        type: {                                                                                                      // 430
          $in: type                                                                                                  // 432
        },                                                                                                           //
        status: 'ready',                                                                                             // 430
        runId: null                                                                                                  // 430
      }, {                                                                                                           //
        sort: {                                                                                                      // 436
          priority: 1,                                                                                               // 438
          retryUntil: 1,                                                                                             // 438
          after: 1                                                                                                   // 438
        },                                                                                                           //
        limit: options.maxJobs - docs.length,                                                                        // 436
        fields: {                                                                                                    // 436
          _id: 1                                                                                                     // 443
        },                                                                                                           //
        transform: null                                                                                              // 436
      }).map(function(d) {                                                                                           //
        return d._id;                                                                                                //
      });                                                                                                            //
      if (!((ids != null ? ids.length : void 0) > 0)) {                                                              // 447
        break;                                                                                                       // 448
      }                                                                                                              //
      mods = {                                                                                                       // 429
        $set: {                                                                                                      // 451
          status: 'running',                                                                                         // 452
          runId: runId,                                                                                              // 452
          updated: time                                                                                              // 452
        },                                                                                                           //
        $inc: {                                                                                                      // 451
          retries: -1,                                                                                               // 456
          retried: 1                                                                                                 // 456
        }                                                                                                            //
      };                                                                                                             //
      if (logObj = this._logMessage.running(runId)) {                                                                // 459
        mods.$push = {                                                                                               // 460
          log: logObj                                                                                                // 461
        };                                                                                                           //
      }                                                                                                              //
      if (options.workTimeout != null) {                                                                             // 463
        mods.$set.workTimeout = options.workTimeout;                                                                 // 464
        mods.$set.expiresAfter = new Date(time.valueOf() + options.workTimeout);                                     // 464
      } else {                                                                                                       //
        if (mods.$unset == null) {                                                                                   //
          mods.$unset = {};                                                                                          //
        }                                                                                                            //
        mods.$unset.workTimeout = "";                                                                                // 467
        mods.$unset.expiresAfter = "";                                                                               // 467
      }                                                                                                              //
      num = this.update({                                                                                            // 429
        _id: {                                                                                                       // 472
          $in: ids                                                                                                   // 474
        },                                                                                                           //
        status: 'ready',                                                                                             // 472
        runId: null                                                                                                  // 472
      }, mods, {                                                                                                     //
        multi: true                                                                                                  // 479
      });                                                                                                            //
      if (num > 0) {                                                                                                 // 484
        foundDocs = this.find({                                                                                      // 485
          _id: {                                                                                                     // 486
            $in: ids                                                                                                 // 488
          },                                                                                                         //
          runId: runId                                                                                               // 486
        }, {                                                                                                         //
          fields: {                                                                                                  // 491
            log: 0,                                                                                                  // 493
            failures: 0,                                                                                             // 493
            _private: 0                                                                                              // 493
          },                                                                                                         //
          transform: null                                                                                            // 491
        }).fetch();                                                                                                  //
        if ((foundDocs != null ? foundDocs.length : void 0) > 0) {                                                   // 500
          if (this.scrub != null) {                                                                                  // 501
            foundDocs = (function() {                                                                                // 502
              var j, len, results;                                                                                   //
              results = [];                                                                                          // 502
              for (j = 0, len = foundDocs.length; j < len; j++) {                                                    //
                d = foundDocs[j];                                                                                    //
                results.push(this.scrub(d));                                                                         // 502
              }                                                                                                      // 502
              return results;                                                                                        //
            }).call(this);                                                                                           //
          }                                                                                                          //
          check(docs, [_validJobDoc()]);                                                                             // 501
          docs = docs.concat(foundDocs);                                                                             // 501
        }                                                                                                            //
      }                                                                                                              //
    }                                                                                                                //
    return docs;                                                                                                     // 507
  };                                                                                                                 //
                                                                                                                     //
  JobCollectionBase.prototype._DDPMethod_jobRemove = function(ids, options) {                                        // 83
    var num;                                                                                                         // 510
    check(ids, Match.OneOf(Match.Where(_validId), [Match.Where(_validId)]));                                         // 510
    check(options, Match.Optional({}));                                                                              // 510
    if (options == null) {                                                                                           //
      options = {};                                                                                                  //
    }                                                                                                                //
    if (_validId(ids)) {                                                                                             // 513
      ids = [ids];                                                                                                   // 514
    }                                                                                                                //
    if (ids.length === 0) {                                                                                          // 515
      return false;                                                                                                  // 515
    }                                                                                                                //
    num = this.remove({                                                                                              // 510
      _id: {                                                                                                         // 517
        $in: ids                                                                                                     // 519
      },                                                                                                             //
      status: {                                                                                                      // 517
        $in: this.jobStatusRemovable                                                                                 // 521
      }                                                                                                              //
    });                                                                                                              //
    if (num > 0) {                                                                                                   // 524
      return true;                                                                                                   // 525
    } else {                                                                                                         //
      console.warn("jobRemove failed");                                                                              // 527
    }                                                                                                                //
    return false;                                                                                                    // 528
  };                                                                                                                 //
                                                                                                                     //
  JobCollectionBase.prototype._DDPMethod_jobPause = function(ids, options) {                                         // 83
    var logObj, mods, num, time;                                                                                     // 531
    check(ids, Match.OneOf(Match.Where(_validId), [Match.Where(_validId)]));                                         // 531
    check(options, Match.Optional({}));                                                                              // 531
    if (options == null) {                                                                                           //
      options = {};                                                                                                  //
    }                                                                                                                //
    if (_validId(ids)) {                                                                                             // 534
      ids = [ids];                                                                                                   // 535
    }                                                                                                                //
    if (ids.length === 0) {                                                                                          // 536
      return false;                                                                                                  // 536
    }                                                                                                                //
    time = new Date();                                                                                               // 531
    mods = {                                                                                                         // 531
      $set: {                                                                                                        // 540
        status: "paused",                                                                                            // 541
        updated: time                                                                                                // 541
      }                                                                                                              //
    };                                                                                                               //
    if (logObj = this._logMessage.paused()) {                                                                        // 544
      mods.$push = {                                                                                                 // 545
        log: logObj                                                                                                  // 546
      };                                                                                                             //
    }                                                                                                                //
    num = this.update({                                                                                              // 531
      _id: {                                                                                                         // 549
        $in: ids                                                                                                     // 551
      },                                                                                                             //
      status: {                                                                                                      // 549
        $in: this.jobStatusPausable                                                                                  // 553
      }                                                                                                              //
    }, mods, {                                                                                                       //
      multi: true                                                                                                    // 556
    });                                                                                                              //
    if (num > 0) {                                                                                                   // 560
      return true;                                                                                                   // 561
    } else {                                                                                                         //
      console.warn("jobPause failed");                                                                               // 563
    }                                                                                                                //
    return false;                                                                                                    // 564
  };                                                                                                                 //
                                                                                                                     //
  JobCollectionBase.prototype._DDPMethod_jobResume = function(ids, options) {                                        // 83
    var logObj, mods, num, time;                                                                                     // 567
    check(ids, Match.OneOf(Match.Where(_validId), [Match.Where(_validId)]));                                         // 567
    check(options, Match.Optional({}));                                                                              // 567
    if (options == null) {                                                                                           //
      options = {};                                                                                                  //
    }                                                                                                                //
    if (_validId(ids)) {                                                                                             // 570
      ids = [ids];                                                                                                   // 571
    }                                                                                                                //
    if (ids.length === 0) {                                                                                          // 572
      return false;                                                                                                  // 572
    }                                                                                                                //
    time = new Date();                                                                                               // 567
    mods = {                                                                                                         // 567
      $set: {                                                                                                        // 575
        status: "waiting",                                                                                           // 576
        updated: time                                                                                                // 576
      }                                                                                                              //
    };                                                                                                               //
    if (logObj = this._logMessage.resumed()) {                                                                       // 579
      mods.$push = {                                                                                                 // 580
        log: logObj                                                                                                  // 581
      };                                                                                                             //
    }                                                                                                                //
    num = this.update({                                                                                              // 567
      _id: {                                                                                                         // 584
        $in: ids                                                                                                     // 586
      },                                                                                                             //
      status: "paused",                                                                                              // 584
      updated: {                                                                                                     // 584
        $ne: time                                                                                                    // 589
      }                                                                                                              //
    }, mods, {                                                                                                       //
      multi: true                                                                                                    // 592
    });                                                                                                              //
    if (num > 0) {                                                                                                   // 596
      this._DDPMethod_jobReady(ids);                                                                                 // 597
      return true;                                                                                                   // 598
    } else {                                                                                                         //
      console.warn("jobResume failed");                                                                              // 600
    }                                                                                                                //
    return false;                                                                                                    // 601
  };                                                                                                                 //
                                                                                                                     //
  JobCollectionBase.prototype._DDPMethod_jobReady = function(ids, options) {                                         // 83
    var l, logObj, mods, now, num, query;                                                                            // 604
    check(ids, Match.OneOf(Match.Where(_validId), [Match.Where(_validId)]));                                         // 604
    check(options, Match.Optional({                                                                                  // 604
      force: Match.Optional(Boolean),                                                                                // 606
      time: Match.Optional(Date)                                                                                     // 606
    }));                                                                                                             //
    if (this.isSimulation) {                                                                                         // 612
      return;                                                                                                        // 613
    }                                                                                                                //
    now = new Date();                                                                                                // 604
    if (options == null) {                                                                                           //
      options = {};                                                                                                  //
    }                                                                                                                //
    if (options.force == null) {                                                                                     //
      options.force = false;                                                                                         //
    }                                                                                                                //
    if (options.time == null) {                                                                                      //
      options.time = now;                                                                                            //
    }                                                                                                                //
    if (_validId(ids)) {                                                                                             // 621
      ids = [ids];                                                                                                   // 622
    }                                                                                                                //
    query = {                                                                                                        // 604
      status: "waiting",                                                                                             // 625
      after: {                                                                                                       // 625
        $lte: options.time                                                                                           // 627
      }                                                                                                              //
    };                                                                                                               //
    mods = {                                                                                                         // 604
      $set: {                                                                                                        // 630
        status: "ready",                                                                                             // 631
        updated: now                                                                                                 // 631
      }                                                                                                              //
    };                                                                                                               //
    if (ids.length > 0) {                                                                                            // 634
      query._id = {                                                                                                  // 635
        $in: ids                                                                                                     // 636
      };                                                                                                             //
      mods.$set.after = now;                                                                                         // 635
    }                                                                                                                //
    logObj = [];                                                                                                     // 604
    if (options.force) {                                                                                             // 641
      mods.$set.depends = [];                                                                                        // 642
      l = this._logMessage.forced();                                                                                 // 642
      if (l) {                                                                                                       // 644
        logObj.push(l);                                                                                              // 644
      }                                                                                                              //
    } else {                                                                                                         //
      query.depends = {                                                                                              // 646
        $size: 0                                                                                                     // 647
      };                                                                                                             //
    }                                                                                                                //
    l = this._logMessage.readied();                                                                                  // 604
    if (l) {                                                                                                         // 650
      logObj.push(l);                                                                                                // 650
    }                                                                                                                //
    if (logObj.length > 0) {                                                                                         // 652
      mods.$push = {                                                                                                 // 653
        log: {                                                                                                       // 654
          $each: logObj                                                                                              // 655
        }                                                                                                            //
      };                                                                                                             //
    }                                                                                                                //
    num = this.update(query, mods, {                                                                                 // 604
      multi: true                                                                                                    // 660
    });                                                                                                              //
    if (num > 0) {                                                                                                   // 665
      return true;                                                                                                   // 666
    } else {                                                                                                         //
      return false;                                                                                                  // 668
    }                                                                                                                //
  };                                                                                                                 //
                                                                                                                     //
  JobCollectionBase.prototype._DDPMethod_jobCancel = function(ids, options) {                                        // 83
    var cancelIds, depsCancelled, logObj, mods, num, time;                                                           // 671
    check(ids, Match.OneOf(Match.Where(_validId), [Match.Where(_validId)]));                                         // 671
    check(options, Match.Optional({                                                                                  // 671
      antecedents: Match.Optional(Boolean),                                                                          // 673
      dependents: Match.Optional(Boolean)                                                                            // 673
    }));                                                                                                             //
    if (options == null) {                                                                                           //
      options = {};                                                                                                  //
    }                                                                                                                //
    if (options.antecedents == null) {                                                                               //
      options.antecedents = false;                                                                                   //
    }                                                                                                                //
    if (options.dependents == null) {                                                                                //
      options.dependents = true;                                                                                     //
    }                                                                                                                //
    if (_validId(ids)) {                                                                                             // 678
      ids = [ids];                                                                                                   // 679
    }                                                                                                                //
    if (ids.length === 0) {                                                                                          // 680
      return false;                                                                                                  // 680
    }                                                                                                                //
    time = new Date();                                                                                               // 671
    mods = {                                                                                                         // 671
      $set: {                                                                                                        // 684
        status: "cancelled",                                                                                         // 685
        runId: null,                                                                                                 // 685
        progress: {                                                                                                  // 685
          completed: 0,                                                                                              // 688
          total: 1,                                                                                                  // 688
          percent: 0                                                                                                 // 688
        },                                                                                                           //
        updated: time                                                                                                // 685
      }                                                                                                              //
    };                                                                                                               //
    if (logObj = this._logMessage.cancelled()) {                                                                     // 693
      mods.$push = {                                                                                                 // 694
        log: logObj                                                                                                  // 695
      };                                                                                                             //
    }                                                                                                                //
    num = this.update({                                                                                              // 671
      _id: {                                                                                                         // 698
        $in: ids                                                                                                     // 700
      },                                                                                                             //
      status: {                                                                                                      // 698
        $in: this.jobStatusCancellable                                                                               // 702
      }                                                                                                              //
    }, mods, {                                                                                                       //
      multi: true                                                                                                    // 705
    });                                                                                                              //
    cancelIds = this._idsOfDeps(ids, options.antecedents, options.dependents, this.jobStatusCancellable);            // 671
    depsCancelled = false;                                                                                           // 671
    if (cancelIds.length > 0) {                                                                                      // 713
      depsCancelled = this._DDPMethod_jobCancel(cancelIds, options);                                                 // 714
    }                                                                                                                //
    if (num > 0 || depsCancelled) {                                                                                  // 716
      return true;                                                                                                   // 717
    } else {                                                                                                         //
      console.warn("jobCancel failed");                                                                              // 719
    }                                                                                                                //
    return false;                                                                                                    // 720
  };                                                                                                                 //
                                                                                                                     //
  JobCollectionBase.prototype._DDPMethod_jobRestart = function(ids, options) {                                       // 83
    var depsRestarted, logObj, mods, num, query, restartIds, time;                                                   // 723
    check(ids, Match.OneOf(Match.Where(_validId), [Match.Where(_validId)]));                                         // 723
    check(options, Match.Optional({                                                                                  // 723
      retries: Match.Optional(Match.Where(_validIntGTEZero)),                                                        // 725
      until: Match.Optional(Date),                                                                                   // 725
      antecedents: Match.Optional(Boolean),                                                                          // 725
      dependents: Match.Optional(Boolean)                                                                            // 725
    }));                                                                                                             //
    if (options == null) {                                                                                           //
      options = {};                                                                                                  //
    }                                                                                                                //
    if (options.retries == null) {                                                                                   //
      options.retries = 1;                                                                                           //
    }                                                                                                                //
    if (options.retries > this.forever) {                                                                            // 731
      options.retries = this.forever;                                                                                // 731
    }                                                                                                                //
    if (options.dependents == null) {                                                                                //
      options.dependents = false;                                                                                    //
    }                                                                                                                //
    if (options.antecedents == null) {                                                                               //
      options.antecedents = true;                                                                                    //
    }                                                                                                                //
    if (_validId(ids)) {                                                                                             // 734
      ids = [ids];                                                                                                   // 735
    }                                                                                                                //
    if (ids.length === 0) {                                                                                          // 736
      return false;                                                                                                  // 736
    }                                                                                                                //
    time = new Date();                                                                                               // 723
    query = {                                                                                                        // 723
      _id: {                                                                                                         // 740
        $in: ids                                                                                                     // 741
      },                                                                                                             //
      status: {                                                                                                      // 740
        $in: this.jobStatusRestartable                                                                               // 743
      }                                                                                                              //
    };                                                                                                               //
    mods = {                                                                                                         // 723
      $set: {                                                                                                        // 746
        status: "waiting",                                                                                           // 747
        progress: {                                                                                                  // 747
          completed: 0,                                                                                              // 749
          total: 1,                                                                                                  // 749
          percent: 0                                                                                                 // 749
        },                                                                                                           //
        updated: time                                                                                                // 747
      },                                                                                                             //
      $inc: {                                                                                                        // 746
        retries: options.retries                                                                                     // 754
      }                                                                                                              //
    };                                                                                                               //
    if (logObj = this._logMessage.restarted()) {                                                                     // 756
      mods.$push = {                                                                                                 // 757
        log: logObj                                                                                                  // 758
      };                                                                                                             //
    }                                                                                                                //
    if (options.until != null) {                                                                                     // 760
      mods.$set.retryUntil = options.until;                                                                          // 761
    }                                                                                                                //
    num = this.update(query, mods, {                                                                                 // 723
      multi: true                                                                                                    // 763
    });                                                                                                              //
    restartIds = this._idsOfDeps(ids, options.antecedents, options.dependents, this.jobStatusRestartable);           // 723
    depsRestarted = false;                                                                                           // 723
    if (restartIds.length > 0) {                                                                                     // 769
      depsRestarted = this._DDPMethod_jobRestart(restartIds, options);                                               // 770
    }                                                                                                                //
    if (num > 0 || depsRestarted) {                                                                                  // 772
      this._DDPMethod_jobReady(ids);                                                                                 // 773
      return true;                                                                                                   // 774
    } else {                                                                                                         //
      console.warn("jobRestart failed");                                                                             // 776
    }                                                                                                                //
    return false;                                                                                                    // 777
  };                                                                                                                 //
                                                                                                                     //
  JobCollectionBase.prototype._DDPMethod_jobSave = function(doc, options) {                                          // 83
    var logObj, mods, newId, next, nextDate, num, ref, time;                                                         // 782
    check(doc, _validJobDoc());                                                                                      // 782
    check(options, Match.Optional({                                                                                  // 782
      cancelRepeats: Match.Optional(Boolean)                                                                         // 784
    }));                                                                                                             //
    check(doc.status, Match.Where(function(v) {                                                                      // 782
      return Match.test(v, String) && (v === 'waiting' || v === 'paused');                                           //
    }));                                                                                                             //
    if (options == null) {                                                                                           //
      options = {};                                                                                                  //
    }                                                                                                                //
    if (options.cancelRepeats == null) {                                                                             //
      options.cancelRepeats = false;                                                                                 //
    }                                                                                                                //
    if (doc.repeats > this.forever) {                                                                                // 789
      doc.repeats = this.forever;                                                                                    // 789
    }                                                                                                                //
    if (doc.retries > this.forever) {                                                                                // 790
      doc.retries = this.forever;                                                                                    // 790
    }                                                                                                                //
    time = new Date();                                                                                               // 782
    if (doc.after < time) {                                                                                          // 796
      doc.after = time;                                                                                              // 796
    }                                                                                                                //
    if (doc.retryUntil < time) {                                                                                     // 797
      doc.retryUntil = time;                                                                                         // 797
    }                                                                                                                //
    if (doc.repeatUntil < time) {                                                                                    // 798
      doc.repeatUntil = time;                                                                                        // 798
    }                                                                                                                //
    if ((this.later != null) && typeof doc.repeatWait !== 'number') {                                                // 802
      if (!(next = (ref = this.later) != null ? ref.schedule(doc.repeatWait).next(1, doc.after) : void 0)) {         // 803
        console.warn("No valid available later.js times in schedule after " + doc.after);                            // 804
        return null;                                                                                                 // 805
      }                                                                                                              //
      nextDate = new Date(next);                                                                                     // 803
      if (!(nextDate <= doc.repeatUntil)) {                                                                          // 807
        console.warn("No valid available later.js times in schedule before " + doc.repeatUntil);                     // 808
        return null;                                                                                                 // 809
      }                                                                                                              //
      doc.after = nextDate;                                                                                          // 803
    } else if ((this.later == null) && doc.repeatWait !== 'number') {                                                //
      console.warn("Later.js not loaded...");                                                                        // 812
      return null;                                                                                                   // 813
    }                                                                                                                //
    if (doc._id) {                                                                                                   // 815
      mods = {                                                                                                       // 817
        $set: {                                                                                                      // 818
          status: 'waiting',                                                                                         // 819
          data: doc.data,                                                                                            // 819
          retries: doc.retries,                                                                                      // 819
          repeatRetries: doc.repeatRetries != null ? doc.repeatRetries : doc.retries + doc.retried,                  // 819
          retryUntil: doc.retryUntil,                                                                                // 819
          retryWait: doc.retryWait,                                                                                  // 819
          retryBackoff: doc.retryBackoff,                                                                            // 819
          repeats: doc.repeats,                                                                                      // 819
          repeatUntil: doc.repeatUntil,                                                                              // 819
          repeatWait: doc.repeatWait,                                                                                // 819
          depends: doc.depends,                                                                                      // 819
          priority: doc.priority,                                                                                    // 819
          after: doc.after,                                                                                          // 819
          updated: time                                                                                              // 819
        }                                                                                                            //
      };                                                                                                             //
      if (logObj = this._logMessage.resubmitted()) {                                                                 // 834
        mods.$push = {                                                                                               // 835
          log: logObj                                                                                                // 836
        };                                                                                                           //
      }                                                                                                              //
      num = this.update({                                                                                            // 817
        _id: doc._id,                                                                                                // 839
        status: 'paused',                                                                                            // 839
        runId: null                                                                                                  // 839
      }, mods);                                                                                                      //
      if (num) {                                                                                                     // 847
        this._DDPMethod_jobReady(doc._id);                                                                           // 848
        return doc._id;                                                                                              // 849
      } else {                                                                                                       //
        return null;                                                                                                 // 851
      }                                                                                                              //
    } else {                                                                                                         //
      if (doc.repeats === this.forever && options.cancelRepeats) {                                                   // 853
        this.find({                                                                                                  // 855
          type: doc.type,                                                                                            // 856
          status: {                                                                                                  // 856
            $in: this.jobStatusCancellable                                                                           // 859
          }                                                                                                          //
        }, {                                                                                                         //
          transform: null                                                                                            // 861
        }).forEach((function(_this) {                                                                                //
          return function(d) {                                                                                       //
            return _this._DDPMethod_jobCancel(d._id, {});                                                            //
          };                                                                                                         //
        })(this));                                                                                                   //
      }                                                                                                              //
      doc.created = time;                                                                                            // 853
      doc.log.push(this._logMessage.submitted());                                                                    // 853
      newId = this.insert(doc);                                                                                      // 853
      this._DDPMethod_jobReady(newId);                                                                               // 853
      return newId;                                                                                                  // 869
    }                                                                                                                //
  };                                                                                                                 //
                                                                                                                     //
  JobCollectionBase.prototype._DDPMethod_jobProgress = function(id, runId, completed, total, options) {              // 83
    var job, mods, num, progress, time;                                                                              // 874
    check(id, Match.Where(_validId));                                                                                // 874
    check(runId, Match.Where(_validId));                                                                             // 874
    check(completed, Match.Where(_validNumGTEZero));                                                                 // 874
    check(total, Match.Where(_validNumGTZero));                                                                      // 874
    check(options, Match.Optional({}));                                                                              // 874
    if (options == null) {                                                                                           //
      options = {};                                                                                                  //
    }                                                                                                                //
    if (this.stopped) {                                                                                              // 882
      return null;                                                                                                   // 883
    }                                                                                                                //
    progress = {                                                                                                     // 874
      completed: completed,                                                                                          // 886
      total: total,                                                                                                  // 886
      percent: 100 * completed / total                                                                               // 886
    };                                                                                                               //
    check(progress, Match.Where(function(v) {                                                                        // 874
      var ref;                                                                                                       // 891
      return v.total >= v.completed && (0 <= (ref = v.percent) && ref <= 100);                                       //
    }));                                                                                                             //
    time = new Date();                                                                                               // 874
    job = this.findOne({                                                                                             // 874
      _id: id                                                                                                        // 895
    }, {                                                                                                             //
      fields: {                                                                                                      // 895
        workTimeout: 1                                                                                               // 895
      }                                                                                                              //
    });                                                                                                              //
    mods = {                                                                                                         // 874
      $set: {                                                                                                        // 898
        progress: progress,                                                                                          // 899
        updated: time                                                                                                // 899
      }                                                                                                              //
    };                                                                                                               //
    if ((job != null ? job.workTimeout : void 0) != null) {                                                          // 902
      mods.$set.expiresAfter = new Date(time.valueOf() + job.workTimeout);                                           // 903
    }                                                                                                                //
    num = this.update({                                                                                              // 874
      _id: id,                                                                                                       // 906
      runId: runId,                                                                                                  // 906
      status: "running"                                                                                              // 906
    }, mods);                                                                                                        //
    if (num === 1) {                                                                                                 // 914
      return true;                                                                                                   // 915
    } else {                                                                                                         //
      console.warn("jobProgress failed");                                                                            // 917
    }                                                                                                                //
    return false;                                                                                                    // 918
  };                                                                                                                 //
                                                                                                                     //
  JobCollectionBase.prototype._DDPMethod_jobLog = function(id, runId, message, options) {                            // 83
    var job, logObj, mods, num, ref, time;                                                                           // 921
    check(id, Match.Where(_validId));                                                                                // 921
    check(runId, Match.OneOf(Match.Where(_validId), null));                                                          // 921
    check(message, String);                                                                                          // 921
    check(options, Match.Optional({                                                                                  // 921
      level: Match.Optional(Match.Where(_validLogLevel)),                                                            // 925
      data: Match.Optional(Object)                                                                                   // 925
    }));                                                                                                             //
    if (options == null) {                                                                                           //
      options = {};                                                                                                  //
    }                                                                                                                //
    time = new Date();                                                                                               // 921
    logObj = {                                                                                                       // 921
      time: time,                                                                                                    // 930
      runId: runId,                                                                                                  // 930
      level: (ref = options.level) != null ? ref : 'info',                                                           // 930
      message: message                                                                                               // 930
    };                                                                                                               //
    if (options.data != null) {                                                                                      // 934
      logObj.data = options.data;                                                                                    // 934
    }                                                                                                                //
    job = this.findOne({                                                                                             // 921
      _id: id                                                                                                        // 936
    }, {                                                                                                             //
      fields: {                                                                                                      // 936
        status: 1,                                                                                                   // 936
        workTimeout: 1                                                                                               // 936
      }                                                                                                              //
    });                                                                                                              //
    mods = {                                                                                                         // 921
      $push: {                                                                                                       // 939
        log: logObj                                                                                                  // 940
      },                                                                                                             //
      $set: {                                                                                                        // 939
        updated: time                                                                                                // 942
      }                                                                                                              //
    };                                                                                                               //
    if (((job != null ? job.workTimeout : void 0) != null) && job.status === 'running') {                            // 944
      mods.$set.expiresAfter = new Date(time.valueOf() + job.workTimeout);                                           // 945
    }                                                                                                                //
    num = this.update({                                                                                              // 921
      _id: id                                                                                                        // 948
    }, mods);                                                                                                        //
    if (num === 1) {                                                                                                 // 953
      return true;                                                                                                   // 954
    } else {                                                                                                         //
      console.warn("jobLog failed");                                                                                 // 956
    }                                                                                                                //
    return false;                                                                                                    // 957
  };                                                                                                                 //
                                                                                                                     //
  JobCollectionBase.prototype._DDPMethod_jobRerun = function(id, options) {                                          // 83
    var doc;                                                                                                         // 960
    check(id, Match.Where(_validId));                                                                                // 960
    check(options, Match.Optional({                                                                                  // 960
      repeats: Match.Optional(Match.Where(_validIntGTEZero)),                                                        // 962
      until: Match.Optional(Date),                                                                                   // 962
      wait: Match.OneOf(Match.Where(_validIntGTEZero), Match.Where(_validLaterJSObj))                                // 962
    }));                                                                                                             //
    doc = this.findOne({                                                                                             // 960
      _id: id,                                                                                                       // 967
      status: "completed"                                                                                            // 967
    }, {                                                                                                             //
      fields: {                                                                                                      // 971
        result: 0,                                                                                                   // 973
        failures: 0,                                                                                                 // 973
        log: 0,                                                                                                      // 973
        progress: 0,                                                                                                 // 973
        updated: 0,                                                                                                  // 973
        after: 0,                                                                                                    // 973
        status: 0                                                                                                    // 973
      },                                                                                                             //
      transform: null                                                                                                // 971
    });                                                                                                              //
    if (doc != null) {                                                                                               // 984
      if (options == null) {                                                                                         //
        options = {};                                                                                                //
      }                                                                                                              //
      if (options.repeats == null) {                                                                                 //
        options.repeats = 0;                                                                                         //
      }                                                                                                              //
      if (options.repeats > this.forever) {                                                                          // 987
        options.repeats = this.forever;                                                                              // 987
      }                                                                                                              //
      if (options.until == null) {                                                                                   //
        options.until = doc.repeatUntil;                                                                             //
      }                                                                                                              //
      if (options.wait == null) {                                                                                    //
        options.wait = 0;                                                                                            //
      }                                                                                                              //
      return this._rerun_job(doc, options.repeats, options.wait, options.until);                                     // 990
    }                                                                                                                //
    return false;                                                                                                    // 992
  };                                                                                                                 //
                                                                                                                     //
  JobCollectionBase.prototype._DDPMethod_jobDone = function(id, runId, result, options) {                            // 83
    var after, d, doc, ids, jobId, logObj, mods, n, next, num, ref, time, wait;                                      // 995
    check(id, Match.Where(_validId));                                                                                // 995
    check(runId, Match.Where(_validId));                                                                             // 995
    check(result, Object);                                                                                           // 995
    check(options, Match.Optional({                                                                                  // 995
      repeatId: Match.Optional(Boolean),                                                                             // 999
      delayDeps: Match.Optional(Match.Where(_validIntGTEZero))                                                       // 999
    }));                                                                                                             //
    if (options == null) {                                                                                           //
      options = {                                                                                                    //
        repeatId: false                                                                                              // 1002
      };                                                                                                             //
    }                                                                                                                //
    time = new Date();                                                                                               // 995
    doc = this.findOne({                                                                                             // 995
      _id: id,                                                                                                       // 1005
      runId: runId,                                                                                                  // 1005
      status: "running"                                                                                              // 1005
    }, {                                                                                                             //
      fields: {                                                                                                      // 1010
        log: 0,                                                                                                      // 1012
        failures: 0,                                                                                                 // 1012
        progress: 0,                                                                                                 // 1012
        updated: 0,                                                                                                  // 1012
        after: 0,                                                                                                    // 1012
        status: 0                                                                                                    // 1012
      },                                                                                                             //
      transform: null                                                                                                // 1010
    });                                                                                                              //
    if (doc == null) {                                                                                               // 1021
      if (!this.isSimulation) {                                                                                      // 1022
        console.warn("Running job not found", id, runId);                                                            // 1023
      }                                                                                                              //
      return false;                                                                                                  // 1024
    }                                                                                                                //
    mods = {                                                                                                         // 995
      $set: {                                                                                                        // 1027
        status: "completed",                                                                                         // 1028
        result: result,                                                                                              // 1028
        progress: {                                                                                                  // 1028
          completed: 1,                                                                                              // 1031
          total: 1,                                                                                                  // 1031
          percent: 100                                                                                               // 1031
        },                                                                                                           //
        updated: time                                                                                                // 1028
      }                                                                                                              //
    };                                                                                                               //
    if (logObj = this._logMessage.completed(runId)) {                                                                // 1036
      mods.$push = {                                                                                                 // 1037
        log: logObj                                                                                                  // 1038
      };                                                                                                             //
    }                                                                                                                //
    num = this.update({                                                                                              // 995
      _id: id,                                                                                                       // 1041
      runId: runId,                                                                                                  // 1041
      status: "running"                                                                                              // 1041
    }, mods);                                                                                                        //
    if (num === 1) {                                                                                                 // 1048
      if (doc.repeats > 0) {                                                                                         // 1049
        if (typeof doc.repeatWait === 'number') {                                                                    // 1050
          if (doc.repeatUntil - doc.repeatWait >= time) {                                                            // 1051
            jobId = this._rerun_job(doc);                                                                            // 1052
          }                                                                                                          //
        } else {                                                                                                     //
          next = (ref = this.later) != null ? ref.schedule(doc.repeatWait).next(2) : void 0;                         // 1056
          if (next && next.length > 0) {                                                                             // 1057
            d = new Date(next[0]);                                                                                   // 1058
            if ((d - time > 500) || (next.length > 1)) {                                                             // 1059
              if (d - time <= 500) {                                                                                 // 1060
                d = new Date(next[1]);                                                                               // 1061
              } else {                                                                                               //
                                                                                                                     // 1060
              }                                                                                                      //
              wait = d - time;                                                                                       // 1060
              if (doc.repeatUntil - wait >= time) {                                                                  // 1064
                jobId = this._rerun_job(doc, doc.repeats - 1, wait);                                                 // 1065
              }                                                                                                      //
            }                                                                                                        //
          }                                                                                                          //
        }                                                                                                            //
      }                                                                                                              //
      ids = this.find({                                                                                              // 1049
        depends: {                                                                                                   // 1069
          $all: [id]                                                                                                 // 1071
        }                                                                                                            //
      }, {                                                                                                           //
        transform: null,                                                                                             // 1073
        fields: {                                                                                                    // 1073
          _id: 1                                                                                                     // 1076
        }                                                                                                            //
      }).fetch().map((function(_this) {                                                                              //
        return function(d) {                                                                                         //
          return d._id;                                                                                              //
        };                                                                                                           //
      })(this));                                                                                                     //
      if (ids.length > 0) {                                                                                          // 1080
        mods = {                                                                                                     // 1082
          $pull: {                                                                                                   // 1083
            depends: id                                                                                              // 1084
          },                                                                                                         //
          $push: {                                                                                                   // 1083
            resolved: id                                                                                             // 1086
          }                                                                                                          //
        };                                                                                                           //
        if (options.delayDeps != null) {                                                                             // 1088
          after = new Date(time.valueOf() + options.delayDeps);                                                      // 1089
          mods.$max = {                                                                                              // 1089
            after: after                                                                                             // 1091
          };                                                                                                         //
        }                                                                                                            //
        if (logObj = this._logMessage.resolved(id, runId)) {                                                         // 1093
          mods.$push.log = logObj;                                                                                   // 1094
        }                                                                                                            //
        n = this.update({                                                                                            // 1082
          _id: {                                                                                                     // 1097
            $in: ids                                                                                                 // 1099
          }                                                                                                          //
        }, mods, {                                                                                                   //
          multi: true                                                                                                // 1102
        });                                                                                                          //
        if (n !== ids.length) {                                                                                      // 1106
          console.warn("Not all dependent jobs were resolved " + ids.length + " > " + n);                            // 1107
        }                                                                                                            //
        this._DDPMethod_jobReady(ids);                                                                               // 1082
      }                                                                                                              //
      if (options.repeatId && (jobId != null)) {                                                                     // 1110
        return jobId;                                                                                                // 1111
      } else {                                                                                                       //
        return true;                                                                                                 // 1113
      }                                                                                                              //
    } else {                                                                                                         //
      console.warn("jobDone failed");                                                                                // 1115
    }                                                                                                                //
    return false;                                                                                                    // 1116
  };                                                                                                                 //
                                                                                                                     //
  JobCollectionBase.prototype._DDPMethod_jobFail = function(id, runId, err, options) {                               // 83
    var after, doc, logObj, mods, newStatus, num, time;                                                              // 1119
    check(id, Match.Where(_validId));                                                                                // 1119
    check(runId, Match.Where(_validId));                                                                             // 1119
    check(err, Object);                                                                                              // 1119
    check(options, Match.Optional({                                                                                  // 1119
      fatal: Match.Optional(Boolean)                                                                                 // 1123
    }));                                                                                                             //
    if (options == null) {                                                                                           //
      options = {};                                                                                                  //
    }                                                                                                                //
    if (options.fatal == null) {                                                                                     //
      options.fatal = false;                                                                                         //
    }                                                                                                                //
    time = new Date();                                                                                               // 1119
    doc = this.findOne({                                                                                             // 1119
      _id: id,                                                                                                       // 1130
      runId: runId,                                                                                                  // 1130
      status: "running"                                                                                              // 1130
    }, {                                                                                                             //
      fields: {                                                                                                      // 1135
        log: 0,                                                                                                      // 1137
        failures: 0,                                                                                                 // 1137
        progress: 0,                                                                                                 // 1137
        updated: 0,                                                                                                  // 1137
        after: 0,                                                                                                    // 1137
        runId: 0,                                                                                                    // 1137
        status: 0                                                                                                    // 1137
      },                                                                                                             //
      transform: null                                                                                                // 1135
    });                                                                                                              //
    if (doc == null) {                                                                                               // 1147
      if (!this.isSimulation) {                                                                                      // 1148
        console.warn("Running job not found", id, runId);                                                            // 1149
      }                                                                                                              //
      return false;                                                                                                  // 1150
    }                                                                                                                //
    after = (function() {                                                                                            // 1119
      switch (doc.retryBackoff) {                                                                                    // 1152
        case 'exponential':                                                                                          // 1152
          return new Date(time.valueOf() + doc.retryWait * Math.pow(2, doc.retried - 1));                            //
        default:                                                                                                     // 1152
          return new Date(time.valueOf() + doc.retryWait);                                                           //
      }                                                                                                              // 1152
    })();                                                                                                            //
    newStatus = !options.fatal && doc.retries > 0 && doc.retryUntil >= after ? "waiting" : "failed";                 // 1119
    err.runId = runId;                                                                                               // 1119
    mods = {                                                                                                         // 1119
      $set: {                                                                                                        // 1165
        status: newStatus,                                                                                           // 1166
        runId: null,                                                                                                 // 1166
        after: after,                                                                                                // 1166
        progress: {                                                                                                  // 1166
          completed: 0,                                                                                              // 1170
          total: 1,                                                                                                  // 1170
          percent: 0                                                                                                 // 1170
        },                                                                                                           //
        updated: time                                                                                                // 1166
      },                                                                                                             //
      $push: {                                                                                                       // 1165
        failures: err                                                                                                // 1175
      }                                                                                                              //
    };                                                                                                               //
    if (logObj = this._logMessage.failed(runId, newStatus === 'failed', err)) {                                      // 1178
      mods.$push.log = logObj;                                                                                       // 1179
    }                                                                                                                //
    num = this.update({                                                                                              // 1119
      _id: id,                                                                                                       // 1182
      runId: runId,                                                                                                  // 1182
      status: "running"                                                                                              // 1182
    }, mods);                                                                                                        //
    if (newStatus === "failed" && num === 1) {                                                                       // 1189
      this.find({                                                                                                    // 1191
        depends: {                                                                                                   // 1192
          $all: [id]                                                                                                 // 1194
        }                                                                                                            //
      }, {                                                                                                           //
        transform: null                                                                                              // 1196
      }).forEach((function(_this) {                                                                                  //
        return function(d) {                                                                                         //
          return _this._DDPMethod_jobCancel(d._id);                                                                  //
        };                                                                                                           //
      })(this));                                                                                                     //
    }                                                                                                                //
    if (num === 1) {                                                                                                 // 1200
      return true;                                                                                                   // 1201
    } else {                                                                                                         //
      console.warn("jobFail failed");                                                                                // 1203
    }                                                                                                                //
    return false;                                                                                                    // 1204
  };                                                                                                                 //
                                                                                                                     //
  return JobCollectionBase;                                                                                          //
                                                                                                                     //
})(Mongo.Collection);                                                                                                //
                                                                                                                     //
share.JobCollectionBase = JobCollectionBase;                                                                         // 7
                                                                                                                     //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/vsivsi_job-collection/src/server.coffee.js                                                               //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var eventEmitter, userHelper,                                                                                        // 7
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },                                  //
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,                                                                                       //
  slice = [].slice,                                                                                                  //
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
                                                                                                                     //
if (Meteor.isServer) {                                                                                               // 7
  eventEmitter = Npm.require('events').EventEmitter;                                                                 // 9
  userHelper = function(user, connection) {                                                                          // 9
    var ret;                                                                                                         // 12
    ret = user != null ? user : "[UNAUTHENTICATED]";                                                                 // 12
    if (!connection) {                                                                                               // 13
      ret = "[SERVER]";                                                                                              // 14
    }                                                                                                                //
    return ret;                                                                                                      //
  };                                                                                                                 //
  JobCollection = (function(superClass) {                                                                            // 9
    extend(JobCollection, superClass);                                                                               // 22
                                                                                                                     //
    function JobCollection(root, options) {                                                                          // 22
      var foo, i, len, level, localMethods, methodFunction, methodName, ref;                                         // 23
      if (root == null) {                                                                                            //
        root = 'queue';                                                                                              //
      }                                                                                                              //
      if (options == null) {                                                                                         //
        options = {};                                                                                                //
      }                                                                                                              //
      this._emit = bind(this._emit, this);                                                                           // 23
      this._toLog = bind(this._toLog, this);                                                                         // 23
      this._onCall = bind(this._onCall, this);                                                                       // 23
      this._onError = bind(this._onError, this);                                                                     // 23
      if (!(this instanceof JobCollection)) {                                                                        // 23
        return new JobCollection(root, options);                                                                     // 24
      }                                                                                                              //
      JobCollection.__super__.constructor.call(this, root, options);                                                 // 23
      this.events = new eventEmitter();                                                                              // 23
      this._errorListener = this.events.on('error', this._onError);                                                  // 23
      this._methodErrorDispatch = this.events.on('error', (function(_this) {                                         // 23
        return function(msg) {                                                                                       //
          return _this.events.emit(msg.method, msg);                                                                 //
        };                                                                                                           //
      })(this));                                                                                                     //
      this._callListener = this.events.on('call', this._onCall);                                                     // 23
      this._methodEventDispatch = this.events.on('call', (function(_this) {                                          // 23
        return function(msg) {                                                                                       //
          return _this.events.emit(msg.method, msg);                                                                 //
        };                                                                                                           //
      })(this));                                                                                                     //
      this.stopped = true;                                                                                           // 23
      share.JobCollectionBase.__super__.deny.bind(this)({                                                            // 23
        update: (function(_this) {                                                                                   // 47
          return function() {                                                                                        //
            return true;                                                                                             //
          };                                                                                                         //
        })(this),                                                                                                    //
        insert: (function(_this) {                                                                                   // 47
          return function() {                                                                                        //
            return true;                                                                                             //
          };                                                                                                         //
        })(this),                                                                                                    //
        remove: (function(_this) {                                                                                   // 47
          return function() {                                                                                        //
            return true;                                                                                             //
          };                                                                                                         //
        })(this)                                                                                                     //
      });                                                                                                            //
      this.promote();                                                                                                // 23
      this.logStream = null;                                                                                         // 23
      this.allows = {};                                                                                              // 23
      this.denys = {};                                                                                               // 23
      ref = this.ddpPermissionLevels.concat(this.ddpMethods);                                                        // 59
      for (i = 0, len = ref.length; i < len; i++) {                                                                  // 59
        level = ref[i];                                                                                              //
        this.allows[level] = [];                                                                                     // 60
        this.denys[level] = [];                                                                                      // 60
      }                                                                                                              // 59
      if (options.connection == null) {                                                                              // 65
        this._ensureIndex({                                                                                          // 67
          type: 1,                                                                                                   // 67
          status: 1                                                                                                  // 67
        });                                                                                                          //
        this._ensureIndex({                                                                                          // 67
          priority: 1,                                                                                               // 68
          retryUntil: 1,                                                                                             // 68
          after: 1                                                                                                   // 68
        });                                                                                                          //
        this.isSimulation = false;                                                                                   // 67
        localMethods = this._generateMethods();                                                                      // 67
        if (this._localServerMethods == null) {                                                                      //
          this._localServerMethods = {};                                                                             //
        }                                                                                                            //
        for (methodName in localMethods) {                                                                           // 72
          methodFunction = localMethods[methodName];                                                                 //
          this._localServerMethods[methodName] = methodFunction;                                                     // 72
        }                                                                                                            // 72
        foo = this;                                                                                                  // 67
        this._ddp_apply = (function(_this) {                                                                         // 67
          return function(name, params, cb) {                                                                        //
            if (cb != null) {                                                                                        // 75
              return Meteor.setTimeout((function() {                                                                 //
                var e, err, res;                                                                                     // 77
                err = null;                                                                                          // 77
                res = null;                                                                                          // 77
                try {                                                                                                // 79
                  res = _this._localServerMethods[name].apply(_this, params);                                        // 80
                } catch (_error) {                                                                                   //
                  e = _error;                                                                                        // 82
                  err = e;                                                                                           // 82
                }                                                                                                    //
                return cb(err, res);                                                                                 //
              }), 0);                                                                                                //
            } else {                                                                                                 //
              return _this._localServerMethods[name].apply(_this, params);                                           //
            }                                                                                                        //
          };                                                                                                         //
        })(this);                                                                                                    //
        Job._setDDPApply(this._ddp_apply, root);                                                                     // 67
        Meteor.methods(localMethods);                                                                                // 67
      }                                                                                                              //
    }                                                                                                                //
                                                                                                                     //
    JobCollection.prototype._onError = function(msg) {                                                               // 22
      var user;                                                                                                      // 92
      user = userHelper(msg.userId, msg.connection);                                                                 // 92
      return this._toLog(user, msg.method, "" + msg.error);                                                          //
    };                                                                                                               //
                                                                                                                     //
    JobCollection.prototype._onCall = function(msg) {                                                                // 22
      var user;                                                                                                      // 96
      user = userHelper(msg.userId, msg.connection);                                                                 // 96
      this._toLog(user, msg.method, "params: " + JSON.stringify(msg.params));                                        // 96
      return this._toLog(user, msg.method, "returned: " + JSON.stringify(msg.returnVal));                            //
    };                                                                                                               //
                                                                                                                     //
    JobCollection.prototype._toLog = function(userId, method, message) {                                             // 22
      var ref;                                                                                                       // 101
      return (ref = this.logStream) != null ? ref.write((new Date()) + ", " + userId + ", " + method + ", " + message + "\n") : void 0;
    };                                                                                                               //
                                                                                                                     //
    JobCollection.prototype._emit = function() {                                                                     // 22
      var connection, err, method, params, ret, userId;                                                              // 105
      method = arguments[0], connection = arguments[1], userId = arguments[2], err = arguments[3], ret = arguments[4], params = 6 <= arguments.length ? slice.call(arguments, 5) : [];
      if (err) {                                                                                                     // 105
        return this.events.emit('error', {                                                                           //
          error: err,                                                                                                // 107
          method: method,                                                                                            // 107
          connection: connection,                                                                                    // 107
          userId: userId,                                                                                            // 107
          params: params,                                                                                            // 107
          returnVal: null                                                                                            // 107
        });                                                                                                          //
      } else {                                                                                                       //
        return this.events.emit('call', {                                                                            //
          error: null,                                                                                               // 115
          method: method,                                                                                            // 115
          connection: connection,                                                                                    // 115
          userId: userId,                                                                                            // 115
          params: params,                                                                                            // 115
          returnVal: ret                                                                                             // 115
        });                                                                                                          //
      }                                                                                                              //
    };                                                                                                               //
                                                                                                                     //
    JobCollection.prototype._methodWrapper = function(method, func) {                                                // 22
      var myTypeof, permitted, self;                                                                                 // 123
      self = this;                                                                                                   // 123
      myTypeof = function(val) {                                                                                     // 123
        var type;                                                                                                    // 125
        type = typeof val;                                                                                           // 125
        if (type === 'object' && type instanceof Array) {                                                            // 126
          type = 'array';                                                                                            // 126
        }                                                                                                            //
        return type;                                                                                                 // 127
      };                                                                                                             //
      permitted = (function(_this) {                                                                                 // 123
        return function(userId, params) {                                                                            //
          var performAllTests, performTest;                                                                          // 129
          performTest = function(tests) {                                                                            // 129
            var i, len, result, test;                                                                                // 130
            result = false;                                                                                          // 130
            for (i = 0, len = tests.length; i < len; i++) {                                                          // 131
              test = tests[i];                                                                                       //
              if (result === false) {                                                                                //
                result = result || (function() {                                                                     // 132
                  switch (myTypeof(test)) {                                                                          // 132
                    case 'array':                                                                                    // 132
                      return indexOf.call(test, userId) >= 0;                                                        //
                    case 'function':                                                                                 // 132
                      return test(userId, method, params);                                                           //
                    default:                                                                                         // 132
                      return false;                                                                                  //
                  }                                                                                                  // 132
                })();                                                                                                //
              }                                                                                                      //
            }                                                                                                        // 131
            return result;                                                                                           // 136
          };                                                                                                         //
          performAllTests = function(allTests) {                                                                     // 129
            var i, len, ref, result, t;                                                                              // 138
            result = false;                                                                                          // 138
            ref = _this.ddpMethodPermissions[method];                                                                // 139
            for (i = 0, len = ref.length; i < len; i++) {                                                            // 139
              t = ref[i];                                                                                            //
              if (result === false) {                                                                                //
                result = result || performTest(allTests[t]);                                                         // 140
              }                                                                                                      //
            }                                                                                                        // 139
            return result;                                                                                           // 141
          };                                                                                                         //
          return !performAllTests(_this.denys) && performAllTests(_this.allows);                                     // 142
        };                                                                                                           //
      })(this);                                                                                                      //
      return function() {                                                                                            // 144
        var err, params, retval;                                                                                     // 145
        params = 1 <= arguments.length ? slice.call(arguments, 0) : [];                                              // 145
        try {                                                                                                        // 145
          if (!(this.connection && !permitted(this.userId, params))) {                                               // 146
            retval = func.apply(null, params);                                                                       // 147
          } else {                                                                                                   //
            err = new Meteor.Error(403, "Method not authorized", "Authenticated user is not permitted to invoke this method.");
            throw err;                                                                                               // 150
          }                                                                                                          //
        } catch (_error) {                                                                                           //
          err = _error;                                                                                              // 152
          self._emit(method, this.connection, this.userId, err);                                                     // 152
          throw err;                                                                                                 // 153
        }                                                                                                            //
        self._emit.apply(self, [method, this.connection, this.userId, null, retval].concat(slice.call(params)));     // 145
        return retval;                                                                                               // 155
      };                                                                                                             //
    };                                                                                                               //
                                                                                                                     //
    JobCollection.prototype.setLogStream = function(writeStream) {                                                   // 22
      if (writeStream == null) {                                                                                     //
        writeStream = null;                                                                                          //
      }                                                                                                              //
      if (this.logStream) {                                                                                          // 158
        throw new Error("logStream may only be set once per job-collection startup/shutdown cycle");                 // 159
      }                                                                                                              //
      this.logStream = writeStream;                                                                                  // 158
      if (!((this.logStream == null) || (this.logStream.write != null) && typeof this.logStream.write === 'function' && (this.logStream.end != null) && typeof this.logStream.end === 'function')) {
        throw new Error("logStream must be a valid writable node.js Stream");                                        // 166
      }                                                                                                              //
    };                                                                                                               //
                                                                                                                     //
    JobCollection.prototype.allow = function(allowOptions) {                                                         // 22
      var func, results, type;                                                                                       // 170
      results = [];                                                                                                  // 170
      for (type in allowOptions) {                                                                                   //
        func = allowOptions[type];                                                                                   //
        if (type in this.allows) {                                                                                   //
          results.push(this.allows[type].push(func));                                                                // 170
        }                                                                                                            //
      }                                                                                                              // 170
      return results;                                                                                                //
    };                                                                                                               //
                                                                                                                     //
    JobCollection.prototype.deny = function(denyOptions) {                                                           // 22
      var func, results, type;                                                                                       // 174
      results = [];                                                                                                  // 174
      for (type in denyOptions) {                                                                                    //
        func = denyOptions[type];                                                                                    //
        if (type in this.denys) {                                                                                    //
          results.push(this.denys[type].push(func));                                                                 // 174
        }                                                                                                            //
      }                                                                                                              // 174
      return results;                                                                                                //
    };                                                                                                               //
                                                                                                                     //
    JobCollection.prototype.scrub = function(job) {                                                                  // 22
      return job;                                                                                                    //
    };                                                                                                               //
                                                                                                                     //
    JobCollection.prototype.promote = function(milliseconds) {                                                       // 22
      if (milliseconds == null) {                                                                                    //
        milliseconds = 15 * 1000;                                                                                    //
      }                                                                                                              //
      if (typeof milliseconds === 'number' && milliseconds > 0) {                                                    // 181
        if (this.interval) {                                                                                         // 182
          Meteor.clearInterval(this.interval);                                                                       // 183
        }                                                                                                            //
        this._promote_jobs();                                                                                        // 182
        return this.interval = Meteor.setInterval(this._promote_jobs.bind(this), milliseconds);                      //
      } else {                                                                                                       //
        return console.warn("jobCollection.promote: invalid timeout: " + this.root + ", " + milliseconds);           //
      }                                                                                                              //
    };                                                                                                               //
                                                                                                                     //
    JobCollection.prototype._promote_jobs = function(ids) {                                                          // 22
      if (ids == null) {                                                                                             //
        ids = [];                                                                                                    //
      }                                                                                                              //
      if (this.stopped) {                                                                                            // 190
        return;                                                                                                      // 191
      }                                                                                                              //
      this.find({                                                                                                    // 190
        status: 'running',                                                                                           // 193
        expiresAfter: {                                                                                              // 193
          $lt: new Date()                                                                                            // 193
        }                                                                                                            //
      }).forEach((function(_this) {                                                                                  //
        return function(job) {                                                                                       //
          return new Job(_this.root, job).fail("Failed for exceeding worker set workTimeout");                       //
        };                                                                                                           //
      })(this));                                                                                                     //
      return this.readyJobs();                                                                                       //
    };                                                                                                               //
                                                                                                                     //
    return JobCollection;                                                                                            //
                                                                                                                     //
  })(share.JobCollectionBase);                                                                                       //
}                                                                                                                    //
                                                                                                                     //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['vsivsi:job-collection'] = {}, {
  Job: Job,
  JobCollection: JobCollection
});

})();

//# sourceMappingURL=vsivsi_job-collection.js.map
