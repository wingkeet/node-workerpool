'use strict'

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function busy(secs) {
    const ms = secs * 1000
    let count = 0
    const t0 = Date.now()
    while (Date.now() - t0 < ms) {
        count++
        if (count % 500000 === 0) await sleep(30) // simulate some I/O
    }
}

async function doWork(task) {
    const secs = task
    if (secs % 2) throw new Error('Odd number')
    await busy(secs)
    return secs * 2
}

process.on('message', async (task) => {
    console.debug(`worker ${process.pid}: ${task}`)

    const t0 = Date.now()
    const result = {}
    try {
        result.ok = 1
        result.result = await doWork(task)
    }
    catch (err) {
        result.ok = 0
        result.errmsg = err.message
    }
    result.tookms = Date.now() - t0
    process.send(result)
})

process.on('disconnect', () => {
    process.exit(0)
})
