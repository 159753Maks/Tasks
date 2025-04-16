class TimersManager {
    constructor() {
        this.timers = [];
    }
    // Method to add a timeout
    setGlobalTimeout() {
        // find the maximum delay from all timers
        const maxDelay = this.timers.reduce((max, timer) => Math.max(max, timer.delay), 0);
        const timeoutDuration = maxDelay + 10000; // 10 seconds more than the maximum delay

        // Check if a global timeout already exists
        this.globalTimeout = setTimeout(() => {
            console.log('Global timeout reached. Stopping all timers.');
            this.stop(); // Stop all timers
        }, timeoutDuration);

        console.log(`Global timeout set for ${timeoutDuration / 1000} seconds.`);
    }

    // Method to add a timer
    add(timer, ...args) {
        if (timer) { // Check if the timer is an object
            if (typeof timer.name === 'string' && timer.name.trim() !== '') { // Check if the timer name is a non-empty string
                if (typeof timer.job === 'function') { // Check if the timer job is a function
                    if (typeof timer.delay === 'number' && timer.delay >= 0 && timer.delay <= 5000) { // Check if the timer delay is a number between 0 and 5000
                        if (typeof timer.interval === 'boolean') {  // Check if the timer interval is a boolean
                            this.timers.push({ // Add the timer to the list
                                ...timer,
                                args: args,
                                index: null,
                            });
                            console.log(`Timer ${timer.name} added to the manager.`);
                            this.setGlobalTimeout(); // Set the global timeout
                        } else {
                            console.error('Invalid timer interval. Interval must be a boolean.');
                        }
                    } else {
                        console.error('Invalid timer delay. Delay must be greater than 0 and less than 5000.');
                    }
                } else {
                    console.error('Invalid timer job. Job must be a function.');
                }
            } else {
                console.error('Invalid timer name. Name must be a non-empty string.');
            }
        } else {
            console.error('Invalid timer. Timer must be an object.');
        }
    }

    // Method to remove a timer
    remove(name) {
        // Check if the timer name is valid
        if (name && typeof name === 'string') {
            // Check if the timer name is not empty
            if (name.trim() !== '') {
                const index = this.timers.findIndex(timer => timer.name === name);
                // Check if the timer exists in the list
                // If it exists, remove it from the list
                if (index !== -1) {
                    const timer = this.timers[index];
                    console.log(`Timer ${timer.name} removed.`);
                    this.timers.splice(index, 1);
                } else {
                    console.error(`Timer ${name} not found.`);
                }
            } else {
                console.error('Invalid timer name. Name cannot be empty.');
            }
        } else {
            console.error('Invalid timer name. Name must be a string.');
        }
    }

    // Method to start all timers
    start() {
        this.timers.forEach((timer) => { // Loop through the timers
            if (timer.interval) { // Check if the timer is an interval
                timer.index = setInterval(() => { // Start the timer
                    try { // Try to execute the job
                        const result = timer.job(...timer.args); // Execute the job with the arguments
                        this.log(timer, result);
                    } catch (error) { // Catch any errors
                        this.log(timer, undefined, error);
                    }
                }, timer.delay); // Set the interval
            } else {  // If the timer is a timeout
                timer.index = setTimeout(() => { // Start the timer
                    try { // Try to execute the job
                        const result = timer.job(...timer.args); // Execute the job with the arguments
                        this.log(timer, result);
                    } catch (error) { // Catch any errors
                        this.log(timer, undefined, error);
                    }
                }, timer.delay); // Set the timeout
            }
            console.log(`Timer ${timer.name} started.`);
        });
    }

    // Method to stop all timers
    stop() {
        this.timers.forEach((timer) => { // Loop through the timers
            if (timer.interval) { // Check if the timer is an interval
                clearInterval(timer.index); // Stop the timer
            } else { // If the timer is a timeout
                clearTimeout(timer.index); // Stop the timer
            }
            console.log(`Timer ${timer.name} stopped.`);
        });

        // Clear the timers array
        if (this.globalTimeout) {
            clearTimeout(this.globalTimeout);
            this.globalTimeout = null;
        }
    }

    pause(name) {
        // Check if the timer name is valid
        if (name && typeof name === 'string') {
            // Check if the timer name is not empty
            if (name.trim() !== '') {
                const index = this.timers.findIndex(timer => timer.name === name);
                // Check if the timer exists in the list
                // If it exists, pause it
                if (index !== -1) {
                    const timer = this.timers[index];
                    // Check if the timer is a timeout or an interval
                    if (timer.interval) {
                        clearInterval(timer.index); // Pause the timer
                    } else {
                        clearTimeout(timer.index); // Pause the timer
                    }
                    console.log(`Timer ${timer.name} paused.`);
                }
                else {
                    console.error(`Timer ${name} not found.`);
                }
            } else {
                console.error('Invalid timer name. Name cannot be empty.');
            }
        } else {
            console.error('Invalid timer name. Name must be a string.');
        }
    }

    resume(name) {
        // Check if the timer name is valid
        if (name && typeof name === 'string') {
            // Check if the timer name is not empty
            if (name.trim() !== '') {
                const index = this.timers.findIndex(timer => timer.name === name);
                // Check if the timer exists in the list
                // If it exists, resume it
                if (index !== -1) {
                    const timer = this.timers[index];
                    // Check if the timer is a timeout or an interval
                    if (timer.interval) {
                        timer.index = setInterval(() => { // Start the timer
                            timer.job(...timer.args); // Execute the job with the arguments
                        }, timer.delay);
                    } else {
                        timer.index = setTimeout(() => { // Start the timer
                            timer.job(...timer.args); // Execute the job with the arguments
                        }, timer.delay);
                    }
                    console.log(`Timer ${timer.name} resumed.`);
                } else {
                    console.error(`Timer ${name} not found.`);
                }
            } else {
                console.error('Invalid timer name. Name cannot be empty.');
            }
        } else {
            console.error('Invalid timer name. Name must be a string.');
        }
    }

    log(timer, result, error = null) {
        // Check if the timer is valid
        if (timer) {
            // Check if the timer has a name property
            if (typeof timer.name === 'string' && timer.name.trim() !== '') {
                // Create a log entry object with the timer name, arguments, result, error, and created date
                const logEntry = {
                    name: timer.name,
                    in: timer.args || [],
                    out: result,
                    error: error
                        ? {
                            name: error.name,
                            message: error.message,
                            stack: error.stack,
                        }
                        : undefined,
                    created: new Date(),
                };
                // Initialize logs array if it doesn't exist
                if (!timer.logs) {
                    timer.logs = [];
                }
                // Add the log entry to the timer's logs
                timer.logs.push(logEntry);
                console.log(`Log added for timer ${timer.name}.`);
            } else {
                console.error('Invalid timer name in log. Name cannot be empty.');
            }
        } else {
            console.error('Invalid timer in log. Timer must be an object.');
        }
    }

    print() {
        // Create an array to store all logs
        const allLogs = [];
        // Loop through the timers and collect their logs
        this.timers.forEach((timer) => {
            // Check if the timer has logs
            if (timer.logs && Array.isArray(timer.logs)) {
                // Add all logs from the timer to the result array
                timer.logs.forEach((log) => {
                    allLogs.push(log);
                });
            } else {
                console.log(`Timer ${timer.name} has no logs.`);
            }
        });
        return allLogs;
    }
}
const manager = new TimersManager();

const t1 = {
    name: 't1',
    delay: 1000,
    interval: false,
    job: () => { console.log('t1'); }
};

const t2 = {
    name: 't2',
    delay: 1000,
    interval: false,
    job: (a, b) => a + b
};

manager.add(t1);
manager.add(t2, 1, 2);
manager.start();
manager.pause('t1');
manager.resume('t1');
manager.stop();
manager.print();
