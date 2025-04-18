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
        // Check if the timer is an object
        if (!timer) {
            console.error('Invalid timer. Timer must be an object.');
            return this; // Return the instance for method chaining
        }

        // Check if the timer name is a non-empty string
        if (typeof timer.name !== 'string' || timer.name.trim() === '') {
            console.error('Invalid timer name. Name must be a non-empty string.');
            return this; // Return the instance for method chaining
        }

        // Check if the timer job is a function
        if (typeof timer.job !== 'function') {
            console.error('Invalid timer job. Job must be a function.');
            return this; // Return the instance for method chaining
        }

        // Check if the timer delay is a number between 0 and 5000
        if (typeof timer.delay !== 'number' || timer.delay < 0 || timer.delay > 5000) {
            console.error('Invalid timer delay. Delay must be a number between 0 and 5000 milliseconds.');
            return this; // Return the instance for method chaining
        }

        // Check if the timer interval is a boolean
        if (typeof timer.interval !== 'boolean') {
            console.error('Invalid timer interval. Interval must be a boolean.');
            return this; // Return the instance for method chaining
        }

        // Add the timer to the list
        this.timers.push({
            ...timer, // Spread the timer object
            args, // Add the arguments to the timer object
            index: null, // Initialize the index to null
        });
        console.log(`Timer ${timer.name} added to the manager.`);
        this.setGlobalTimeout(); // Set the global timeout

        return this; // Return the instance for method chaining
    }

    // Method to remove a timer
    remove(name) {
        // Check if the timer name is valid
        if (typeof name !== 'string' || name.trim() === '') {
            console.error('Invalid timer name. Name must be a non-empty string.');
            return;
        }

        const index = this.timers.findIndex(timer => timer.name === name); // Find the index of the timer with the given name

        if (index !== -1) {
            const timer = this.timers[index];
            console.log(`Timer ${timer.name} removed.`);
            this.timers.splice(index, 1); // Remove the timer from the list
        } else {
            console.error(`Timer ${name} not found.`);
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
        if (this.globalTimeout) { // Check if a global timeout exists
            clearTimeout(this.globalTimeout); // Stop the global timeout
            this.globalTimeout = null; // Reset the global timeout
        }
    }

    pause(name) {
        // Check if the timer name is valid
        if (typeof name === 'string' && name.trim() !== '') {
            console.error('Invalid timer name. Name must be a non-empty string.');
            return;
        }

        const index = this.timers.findIndex(timer => timer.name === name); // Find the index of the timer with the given name
        if (index !== -1) {
            const timer = this.timers[index];
            if (timer.interval) {
                clearInterval(timer.index);
            } else {
                clearTimeout(timer.index);
            }
            console.log(`Timer ${timer.name} paused.`);
        } else {
            console.error(`Timer ${name} not found.`);
        }
    }

    resume(name) {
        // Check if the timer name is valid
        if (typeof name !== 'string' || name.trim() === '') {
            console.error('Invalid timer name. Name must be a non-empty string.');
            return;
        }

        const index = this.timers.findIndex(timer => timer.name === name); // Find the index of the timer with the given name

        if (index !== -1) { // Check if the timer exists in the list
            const timer = this.timers[index]; // Get the timer object
            if (timer.interval) { // Check if the timer is an interval
                timer.index = setInterval(() => { // Start the timer
                    timer.job(...timer.args); // Execute the job with the arguments
                }, timer.delay); // Set the interval
            } else { // If the timer is a timeout
                timer.index = setTimeout(() => {
                    timer.job(...timer.args);
                }, timer.delay);
            }
            console.log(`Timer ${timer.name} resumed.`);
        } else {
            console.error(`Timer ${name} not found.`);
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

// manager.add(t1);
// manager.add(t2, 1, 2);
manager.add(t1).add(t2, 1, 2);
manager.start();
manager.pause('t1');
manager.resume('t1');
manager.stop();
manager.print();
