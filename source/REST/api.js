// Instruments
import { MAIN_URL, TOKEN } from "./config";

export const api = {
    async fetchTasks () {
        const response = await fetch(MAIN_URL, {
            method:  'GET',
            headers: {
                Authorization: TOKEN,
            },
        });

        if (response.status !== 200) {
            throw new Error('Tasks not fetch!');
        }
        const { data: tasks } = await response.json();

        return tasks;
    },
    async createTask (message) {
        const response = await fetch(MAIN_URL, {
            method:  'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization:  TOKEN,
            },
            body: JSON.stringify({ message }),
        });

        if (response.status !== 200) {
            throw new Error('Task not add');
        }

        const { data: task } = await response.json();


        return task;
    },
    async updateTask (task) {
        const response = await fetch(MAIN_URL, {
            method:  'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization:  TOKEN,
            },
            body: JSON.stringify([task]),
        });

        if (response.status !== 200) {
            throw new Error('Tasks not update');
        }
        const { data } = await response.json();

        return data[0];
    },
    async removeTask (id) {
        const response = await fetch(`${MAIN_URL}/${id}`, {
            method:  'DELETE',
            headers: {
                Authorization: TOKEN,
            },
        });

        if (response.status !== 204) {
            throw new Error('Tasks not delete');
        }
    },
    async completeAllTasks (tasks) {
        await Promise.all(tasks.map((task) => this.updateTask(task)));
    },
};
