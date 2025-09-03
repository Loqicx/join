import { inject, Injectable, OnDestroy } from '@angular/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDocs,
  getDoc,
  onSnapshot,
  Timestamp,
  updateDoc,
} from '@angular/fire/firestore';
import { Task } from '../../interfaces/task';
import { BehaviorSubject, Observable } from 'rxjs';

export enum TaskPriority {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
}

export enum TaskCategory {
  USER_STORY = 1,
  TECHNICAL_TASK = 2,
}

export enum TaskStatus {
  TODO = 1,
  DOING = 2,
  AWAIT_FEEDBACK = 3,
  DONE = 4,
}

@Injectable({
  providedIn: 'root',
})
export class TasksService implements OnDestroy {
  unsubTasks;
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$: Observable<Task[]> = this.tasksSubject.asObservable();

  firestore: Firestore = inject(Firestore);

  /**
   * Initializes the service and subscribes to the tasks collection.
   */
  constructor() {
    this.unsubTasks = this.subTasks();
  }

  /**
   * Cleans up the subscription when the service is destroyed.
   */
  ngOnDestroy(): void {
    this.unsubTasks();
  }

  /**
   * Subscribes to the tasks collection in Firestore and updates the local tasks array on changes.
   * @returns {Function} Unsubscribe function to stop listening for updates.
   */
  subTasks() {
    return onSnapshot(this.getTasksRef(), (snapshot) => {
      const tasks = snapshot.docs.map((doc) => {
        return this.setTaskObject(doc.data(), doc.id);
      });
      this.tasksSubject.next(tasks);
    });
  }

  /**
   * Returns a reference to the 'tasks' collection in Firestore.
   * @returns {CollectionReference} Reference to the tasks collection.
   */
  getTasksRef() {
    return collection(this.firestore, 'tasks');
  }

  /**
   * Converts Firestore document data to a Task object.
   * @param obj - The Firestore document data.
   * @param id - The document ID.
   * @returns {Task} The constructed Task object.
   */
  setTaskObject(obj: any, id: string): Task {
    return {
      priority: obj.priority || '',
      title: obj.title || '',
      category: obj.category || null,
      subtasks: obj.subtasks || [],
      dueDate: obj.dueDate || new Timestamp(0, 0),
      assignedTo: obj.assignedTo || [],
      description: obj.description || '',
      status: obj.status || null,
      id: id,
    };
  }

  /**
   * Updates a task in Firestore.
   * @param task - The task object with updated data.
   * @param id - The ID of the task to update.
   * @throws Will throw an error if no ID is provided.
   */
  async updateTask(task: {}, id: string) {
    if (!id) {
      throw new Error('Contact id is required');
    }
    const taskRef = doc(this.firestore, 'tasks', id);
    await updateDoc(taskRef, task);
  }

  /**
   * Adds a new task to the Firestore database.
   * @param task - The Task object to add (without an id).
   * @returns {Promise<void>} A promise that resolves when the task is added.
   */
  async addTaskToDatabase(task: Task) {
    const { id, ...newTask } = task;
    await addDoc(this.getTasksRef(), newTask);
  }

  /**
   * Deletes a task from the Firestore database.
   * @param taskId - The ID of the task to delete.
   * @returns {Promise<void>} A promise that resolves when the task is deleted.
   */
  async deleteTask(taskId: string) {
    await deleteDoc(doc(this.firestore, 'tasks', taskId));
  }

  /**
   * Retrieves all tasks from the Firestore database.
   * @returns Task
   */
  async getTaskById(taskId: string) {
  const taskDocRef = doc(this.getTasksRef(), taskId);
  const docSnap = await getDoc(taskDocRef);
  
  return this.setTaskObject(docSnap.data(), docSnap.id);
  
  }

  /**
   * Retrieves all tasks from the Firestore database.
   * @returns {Promise<Task[]>} A promise that resolves to an array of Task objects.
   */
  async getTasks() {
    let currentTasks: Task[] = [];
    const snapshot = await getDocs(this.getTasksRef());
    snapshot.forEach((doc) => {
      currentTasks.push(this.setTaskObject(doc.data(), doc.id));
    });

    return currentTasks;
  }
}
export type { Task };

