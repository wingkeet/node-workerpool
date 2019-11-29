'use strict'

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function doWork(task) {
    const secs = task
    if (secs % 2) throw new Error('Odd number')
    const ms = secs * 1000
    let iterations = 0
    let sum = 0
    const t0 = new Date()
    while (new Date() - t0 < ms) {
        sum += Math.random()
        iterations++
        if (iterations % 500000 === 0) await sleep(30)
    }
    const avg = sum / iterations
    return avg
}

process.on('message', async (task) => {
    console.debug(`worker ${process.pid}: ${task}`)

    const t0 = new Date()
    const result = {}
    try {
        result.ok = 1
        result.result = await doWork(task)
    }
    catch (err) {
        result.ok = 0
        result.errmsg = err.message
    }
    result.tookms = new Date() - t0
    process.send(result)
})

process.on('disconnect', () => {
    process.exit(0)
})
