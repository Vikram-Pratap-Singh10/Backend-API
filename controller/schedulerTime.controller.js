import schedule from "node-schedule";
 
export const SchedulerTime = async (req, res) => {
    try {
        const {
            Start_Date,
            Start_Time,
            Minuts,
            Hourly,
            Daily,
            Weekly,
            Monthly,
            Yearly,
            Every_Minutes,
            Every_hours,
            End_After,
            End_by,
        } = req.body;
        let scheduledJob = null;
        // Check if only Start_Date and Start_Time are provided
        if (Start_Date && Start_Time) {
            // Parse Start_Date and Start_Time to create the initial scheduling date
            const [startDateDay, startDateMonth, startDateYear] = Start_Date.split('/').map(Number);
            const [startHour, startMinute] = Start_Time.split(':').map(Number);
            const initialDate = new Date(startDateYear, startDateMonth - 1, startDateDay, startHour, startMinute);

            // Schedule a job to perform some task in the future.
            const scheduledJob = schedule.scheduleJob(initialDate, async () => {
                console.log('Scheduled job completed successfully.');
            });

            res.status(200).json({ message: 'Task scheduled successfully.', status: true });
        } else if (Minuts || Hourly || Daily || Weekly || Monthly || Yearly || Every_Minutes || Every_hours || End_After || End_by) {
            // Rest of your scheduling logic
            // ...
            if (Minuts) {
                // Schedule a job to run every minute
                scheduledJob = schedule.scheduleJob('* * * * *', async () => {
                    try {
                        console.log('Scheduled job to run every minute completed successfully.');
                    } catch (err) {
                        console.error('Error in scheduled job:', err);
                    }
                });
                res.status(200).json({ message: 'Task scheduled successfully.', status: true });
            }
            else if (Hourly) {
                // Schedule a job to run every hour
                scheduledJob = schedule.scheduleJob('0 * * * *', async () => {
                    try {
                        console.log('Scheduled job to run every hour completed successfully.');
                    } catch (err) {
                        console.error('Error in scheduled job:', err);
                    }
                })
                // res.status(200).json({ message: 'Task scheduled successfully.', status: true });
            } else if (Daily) {
                // Schedule a job to run daily at a specific time
                scheduledJob = schedule.scheduleJob('0 0 * * *', async () => {
                    try {
                        console.log('Scheduled job to run daily completed successfully.');
                    } catch (err) {
                        console.error('Error in scheduled job:', err);
                    }
                })
                // res.status(200).json({ message: 'Task scheduled successfully.', status: true });
            } else if (Weekly) {
                // Schedule a job to run weekly on a specific day and time
                scheduledJob = schedule.scheduleJob('0 0 * * 0', async () => {
                    try {
                        console.log('Scheduled job to run weekly completed successfully.');
                    } catch (err) {
                        console.error('Error in scheduled job:', err);
                    }
                })
                // res.status(200).json({ message: 'Task scheduled successfully.', status: true });
            } else if (Monthly) {
                // Schedule a job to run monthly on a specific day and time
                scheduledJob = schedule.scheduleJob('0 0 1 * *', async () => {
                    try {
                        console.log('Scheduled job to run monthly completed successfully.');
                    } catch (err) {
                        console.error('Error in scheduled job:', err);
                    }
                })
                // res.status(200).json({ message: 'Task scheduled successfully.', status: true });
            } else if (Yearly) {
                // Schedule a job to run yearly on a specific date and time
                scheduledJob = schedule.scheduleJob('0 0 1 1 *', async () => {
                    try {
                        console.log('Scheduled job to run yearly completed successfully.');
                    } catch (err) {
                        console.error('Error in scheduled job:', err);
                    }
                })
                // res.status(200).json({ message: 'Task scheduled successfully.', status: true });
            } else if (Every_Minutes) {
                if (typeof Every_Minutes !== 'number' || Every_Minutes <= 0) {
                    res
                        .status(400)
                        .json({ error: 'Invalid request. Please provide a positive number of minutes.' });
                }

                // Calculate the scheduling date and time based on the provided minutes
                const currentDate = new Date();
                const schedulingDate = new Date(currentDate.getTime() + Every_Minutes * 60 * 1000);

                // Schedule a job to perform some task in the future
                scheduledJob = schedule.scheduleJob(schedulingDate, async () => {
                    try {
                        console.log(`Scheduled job completed after ${Every_Minutes} minutes.`);
                    } catch (err) {
                        console.error('Error in scheduled job:', err);
                    }
                })
                // res.status(200).json({ message: 'Task scheduled successfully.', status: true });
            } else if (Every_hours) {
                if (typeof Every_hours !== 'number' || Every_hours <= 0) {
                    return res
                        .status(400)
                        .json({ error: 'Invalid request. Please provide a positive number of hours.' });
                }

                // Calculate the scheduling date and time based on the provided hours
                const currentDate = new Date();
                const schedulingDate = new Date(currentDate.getTime() + Every_hours * 60 * 60 * 1000);

                // Schedule a job to perform some task in the future
                scheduledJob = schedule.scheduleJob(schedulingDate, async () => {
                    try {
                        console.log(`Scheduled job completed after ${Every_hours} hours.`);
                    } catch (err) {
                        console.error('Error in scheduled job:', err);
                    }
                })
                res.status(200).json({ message: 'Task scheduled successfully.', status: true });
            } else if (End_After) {
                if (typeof End_After !== 'number' || End_After <= 0) {
                    return res
                        .status(400)
                        .json({ error: 'Invalid request. Please provide a positive number of times to run.' });
                }

                // Initialize a counter to keep track of the number of times the job has run
                let runCount = 0;

                // Schedule a recurring job
                scheduledJob = schedule.scheduleJob('* * * * *', async () => {
                    try {
                        console.log(`Scheduled job completed. Run count: ${runCount + 1}`);
                        runCount++;

                        // If the job has run the specified number of times, cancel the job
                        if (runCount >= End_After) {
                            scheduledJob.cancel();
                            console.log('Scheduled job canceled after reaching the specified number of runs.');
                        }
                    } catch (err) {
                        console.error('Error in scheduled job:', err);
                    }
                })
                res.status(200).json({ message: 'Task scheduled successfully.', status: true });
            } else if (End_by) {
                const dateParts = End_by.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

                if (!dateParts) {
                    return res.status(400).json({
                        error: 'Invalid request. Please provide a valid End_by date in the format "mm/dd/yyyy".',
                    });
                }

                const [, month, day, year] = dateParts;

                // Schedule a job to perform some task until the specified End_by date
                const endByDate = new Date(year, month - 1, day); // Note: We subtract 1 from the month
                scheduledJob = schedule.scheduleJob('* * * * *', async () => {
                    try {
                        const currentDate = new Date();
                        if (currentDate > endByDate) {

                            scheduledJob.cancel();
                            console.log('Scheduled job canceled after reaching the specified End_by date.');
                        } else {
                            console.log('Scheduled job completed successfully.');
                        }
                    } catch (err) {
                        console.error('Error in scheduled job:', err);
                    }
                })
                // res.status(200).json({ message: 'Task scheduled successfully.', status: true });
            }

            if (scheduledJob) {
                res.status(200).json({ message: 'Task scheduled successfully.', status: true });
            }


        } else {
            res.status(400).json({ error: 'Invalid request. Please provide valid scheduling parameters.', status: false });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error', status: false });
    }
};


