import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy,
  where,
  getDoc
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
  // Optional extended fields
  address?: string;
  dob?: string; // ISO date string
  skill?: string;
  nationality?: string;
}

export const employeeService = {
  // Check if email already exists
  checkEmailExists: async (email: string, excludeId?: string): Promise<boolean> => {
    const q = query(collection(db, 'employees'), where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    // If we're updating an employee, exclude the current employee from the check
    if (excludeId) {
      return querySnapshot.docs.some(doc => doc.id !== excludeId);
    }
    
    return !querySnapshot.empty;
  },

  // Create a new employee
  createEmployee: async (employee: Omit<Employee, 'id'>): Promise<string> => {
    // Check if email already exists
    const emailExists = await employeeService.checkEmailExists(employee.email);
    if (emailExists) {
      throw new Error('An employee with this email already exists');
    }
    
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

  // Get employee by id
  getEmployeeById: async (id: string): Promise<Employee | null> => {
    const ref = doc(db, 'employees', id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return { id: snap.id, ...(snap.data() as Omit<Employee, 'id'>) };
  },

  // Update an employee
  updateEmployee: async (id: string, employee: Partial<Employee>): Promise<void> => {
    // Check if email already exists (excluding current employee)
    if (employee.email) {
      const emailExists = await employeeService.checkEmailExists(employee.email, id);
      if (emailExists) {
        throw new Error('An employee with this email already exists');
      }
    }
    
    const employeeRef = doc(db, 'employees', id);
    await updateDoc(employeeRef, employee);
  },

  // Delete an employee
  deleteEmployee: async (id: string): Promise<void> => {
    const employeeRef = doc(db, 'employees', id);
    await deleteDoc(employeeRef);
  }
};
