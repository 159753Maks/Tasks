# Tasks
 solution to the first task (timer manager)

 // Task 1
 requirements:
 Implement a timer manager
 1. The add method should add a timer to the execution queue. As the first
parameter, this method takes an object describing the timer, and all subsequent
parameters are passed as arguments to the timer callback function.
2. Calls to the add method can be chained manager.add(t1).add(t2, 1, 2);
3. The remove method should stop a specific timer and remove it from the queue.
4. The start method should start all timers for execution.
5. The stop method should stop all timers.
6. The pause method pauses the operation of a specific timer.
7. The resume method starts the operation of a specific timer
8. Timers can be either one-time (execute a task after a certain
period of time) or periodic (execute a task with a certaininterval). 
If interval = true, the timer is periodic.

Please note!
1. TimeManager should raise an error if the name field is of invalid type, is missing, or is an empty string.
2. TimeManager should raise an error if the delay field is of invalid type, or is missing.
3. TimeManager should raise an error if delay is less than 0 and greater than 5000.
4. TimeManager should raise an error if the interval field is of invalid type, or is missing.
5. TimeManager should raise an error if the job field is of invalid type, or is missing.
6. TimeManager should raise an error if the add method is run after startup.
7. TimeManager should raise an error if an attempt is made to add a timer with a name that has already been added.

// Task 2
Implement a logger for the timer manager:
1. It is necessary to add a _log method that will write the result of executing the timer callback function to the log array.
2. It is necessary to add a print method that will return an array of all logs

// Task 3
Improve the implementation of task 2.
1. It is necessary to implement the handling of errors occurring inside callback functions.
2. If an error occurs, it is necessary to add information about this error to the log.

Please note!
If an error occurs inside the callback function, the program execution should not
terminate with an error

// Task 4
1. Implement a common timeout for TimersManager. The timeout time will be equal to the
time of the longest timer + 10 seconds.
2. When the time limit expires, TimersManager should go through all
timers and kill all timers. 