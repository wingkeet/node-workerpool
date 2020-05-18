'use strict'

const WorkerPool = require('./workerpool')

function callback(result) {
    console.log('callback:', result)
}

function errcallback(result) {
    console.error('errcallback:', result)
}

async function main() {
    console.log('main pid:', process.pid)
    const pool = new WorkerPool()
    console.log('worker pids:', pool.pids())

    try {
        let results

        // First set of tasks
        const tasks1 = [8, 2, 3, 12, 6, 4]
        console.log('tasks1 =', tasks1)
        results = await pool.run(tasks1, {callback, errcallback})
        console.log('results:', results)

        // Second set of tasks
        const tasks2 = [6, 4, 2, 8]
        console.log('tasks2 =', tasks2)
        results = await pool.run(tasks2)
        console.log('results:', results)
    }
    catch (err) {
        console.error('Error:', err.message)
    }
    finally {
        // Terminate workers
        pool.close()
    }
}

main()
