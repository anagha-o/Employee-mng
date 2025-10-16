import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db } from '../firebase';

export interface Employee {
  id?: string;
  name: string;
  email: string;
  position: string;
  department: string;
  salary: number;
  hireDate: string;
}

export const employeeService = {
  // Create a new employee
  createEmployee: async (employee: Omit<Employee, 'id'>): Promise<string> => {
    const docRef = await addDoc(collection(db, 'employees'), employee);
    return docRef.id;
  },

  // Get all employees
  getEmployees: async (): Promise<Employee[]> => {
    const q = query(collection(db, 'employees'), orderBy('name', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Employee[];
  },

  // Update an employee
  updateEmployee: async (id: string, employee: Partial<Employee>): Promise<void> => {
    const employeeRef = doc(db, 'employees', id);
    await updateDoc(employeeRef, employee);
  },

  // Delete an employee
  deleteEmployee: async (id: string): Promise<void> => {
    const employeeRef = doc(db, 'employees', id);
    await deleteDoc(employeeRef);
  }
};
