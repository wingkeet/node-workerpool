'use strict'

const WorkerPool = require('./workerpool')

async function callback(result) {
    console.log('callback:', result)
}

async function errcallback(result) {
    console.error('errcallback:', result)
}

async function main() {
    console.log('main pid:', process.pid)
    const pool = new WorkerPool()
    console.log('worker pids =', pool.pids())

    try {
        // First set of tasks
        const tasks1 = [90, 101, 66, 80, 120, 105]
        console.log('tasks1 =', tasks1)
        const results = await pool.run(tasks1, {callback, errcallback})
        console.log('results:', results)

        // Second set of tasks
        const tasks2 = [6]
        console.log('tasks2 =', tasks2)
        await pool.run(tasks2)
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
