class TimersManager {
    constructor() {
        this.timers = [];
    }

    // Method to add a timer
    add(timer, ...args) {
        // Check if the timer object is valid
        if (timer) {
            // Check if the timer object has a name property, name is correct type and is not empty
            if (typeof timer.name === 'string') {
                if (timer.name.trim() !== '') {
                    console.log(`Timer ${timer.name} added.`);
                } else {
                    console.error('Invalid timer name. Name cannot be empty.');
                    return;
                }
            } else {
                console.error('Invalid timer name. Name must be a string.');
                return;
            }

            // check if the timer has a job property
            if (typeof timer.job === 'function') {
                console.log(`Timer ${timer.name} job is ${timer.job}.`);
            } else {
                console.error('Invalid timer job. Job must be a function.');
                return;
            }

            // check if the timer has a correct delay property
            if (typeof timer.delay === 'number') {
                if (timer.delay < 0 || timer.delay > 5000) {
                    console.error('Invalid timer delay. Delay must be greater than 0 and less than 5000.');
                    return;
                } else {
                    console.log(`Timer ${timer.name} delay is ${timer.delay}.`);
                }
            } else {
                console.error('Invalid timer delay. Delay must be a number.');
                return;
            }

            // check is timer or is interval
            if (typeof timer.interval === 'boolean') {
                if (timer.interval) {
                    console.log(`Timer ${timer.name} is an interval.`);
                } else {
                    console.log(`Timer ${timer.name} is a timeout.`);
                }
            } else {
                console.error('Invalid timer interval. Interval must be a boolean.');
                return;
            }

            this.timers.push({
                ...timer,
                args: args, // Save arguments for later use in start
                index: null // Placeholder for timer index
            });
            console.log(`Timer ${timer.name} added to the manager.`);
        } else {
            console.error('Invalid timer. Timer must be an object.');
            return;
        }

    }
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
    start() {
        // Loop through the timers and start them
        this.timers.forEach(
            (timer) => {
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
                console.log(`Timer ${timer.name} started.`);
            }
        )
    }
    stop() { }
    pause() { }
    resume() { }
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
//manager.remove('t1');
manager.start();
//manager.start();
//console.log(1);
//manager.pause('t1');