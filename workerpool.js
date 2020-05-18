'use strict'

const cp = require('child_process')
const os = require('os')
const path = require('path')

class WorkerPool {
    _workers = []
    constructor(poolSize = os.cpus().length) {
        this._poolSize = poolSize
        this._init()
    }

    _init() {
        for (let i = 0; i < this._poolSize; i++) {
            const worker = cp.fork(path.join(__dirname, 'worker.js'))
            this._workers.push(worker)

            worker.on('exit', (code, signal) => {
                console.debug(`worker ${worker.pid} exited; code=${code} signal=${signal}`)
            })
        }
    }

    close() {
        this._workers.forEach(worker => worker.disconnect())
    }

    pids() {
        return this._workers.map(worker => worker.pid)
    }

    run(tasks, {callback, errcallback} = {}) {
        return new Promise((resolve, reject) => {
            const numtasks = tasks.length
            if (numtasks === 0) { reject(new Error('Number of tasks must not be zero')); return; }
            const initialBatchSize = Math.min(numtasks, this._poolSize)
            let done = 0
            let sendIndex = 0
            const messageCallbacks = []
            const results = []

            // Each iteration through a loop has a separate Lexical Environment.
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures
            while (sendIndex < initialBatchSize) {
                let recvIndex = sendIndex
                const worker = this._workers[sendIndex]

                const messageCallback = (result) => {
                    // Received result from worker
                    result.index = recvIndex
                    result.task = tasks[recvIndex]
                    result.wpid = worker.pid
                    if (callback && result.ok) callback(result)
                    if (errcallback && !result.ok) errcallback(result)
                    results[recvIndex] = result
                    if (++done === numtasks) {
                        for (let i = 0; i < initialBatchSize; i++) {
                            this._workers[i].off('message', messageCallbacks[i])
                        }
                        resolve(results)
                    }
                    else if (sendIndex < numtasks) {
                        recvIndex = sendIndex
                        worker.send(tasks[sendIndex++])
                    }
                }
                worker.on('message', messageCallback)
                messageCallbacks.push(messageCallback)

                // Send one task to each worker
                worker.send(tasks[sendIndex++])
            }
        })
    }
}

module.exports = WorkerPool
